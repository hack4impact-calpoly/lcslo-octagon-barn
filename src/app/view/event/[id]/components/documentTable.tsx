import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { ErrorState, LoadingSpinner, UnauthorizedState } from "@/components/loadingStates";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface IDocumentEntry {
  _id: string;
  clerkId: string;
  eventId: string;
  documentName: string;
  documentType: "Insurance/COI" | "Timeline" | "Layout" | "Other";
  s3DocIdAdmin: string;
  s3DocIdClient: string;
  createdAt: Date;
  uploadedAt: Date;
  status: "Accepted" | "Rejected" | "Pending" | "Not Submitted";
  checkList: string[];
}

interface IDocumentTableProps {
  eventId: string;
  eventStatus: "Upcoming" | "Ongoing" | "Completed" | "Cancelled";
  isAdmin: boolean;
}

async function handleStatusChange(docId: string, newStatus: IDocumentEntry["status"]) {
  try {
    const updateDocumentResponse = await fetch(`/api/document/${docId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!updateDocumentResponse.ok) throw new Error("Failed to update document status");
  } catch (err) {
    alert("Failed to update document status");
    throw err;
  }
}

async function handleDeleteDocument(docId: string, eventId: string) {
  try {
    const deleteDocumentResponse = await fetch(`/api/document/${docId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!deleteDocumentResponse.ok) throw new Error("Failed to delete document record");
  } catch (err) {
    alert("Failed to delete document record");
    throw err;
  }

  try {
    const getEventResponse = await fetch(`/api/event/${eventId}`);
    if (!getEventResponse.ok) {
      throw new Error("Failed to fetch event data");
    }
    const eventData = await getEventResponse.json();

    const updatedEvent = {
      docsTotal: Math.max(0, eventData.docsTotal - 1),
    };

    const updateEventResponse = await fetch(`/api/event/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEvent),
    });
    if (!updateEventResponse.ok) {
      throw new Error("Failed to update event data");
    }

    if (!updateEventResponse.ok) throw new Error("Failed to update document total");
  } catch (err) {
    alert("Failed to update document total");
    throw err;
  }
}

export default function DocumentTable({ eventId, eventStatus, isAdmin }: IDocumentTableProps) {
  const { user, isLoaded } = useUser();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<IDocumentEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getStatusClass = (status: IDocumentEntry["status"]) =>
    cn("text-black text-sm rounded-full px-6 py-3 justify-center", {
      "bg-green-400": status === "Accepted",
      "bg-yellow-400": status === "Pending",
      "bg-red-400": status === "Rejected",
      "bg-gray-300": status === "Not Submitted",
    });

  // Auth check
  useEffect(() => {
    if (isLoaded && user) {
      setAuthorized(true);
    } else if (isLoaded && !user) {
      setAuthorized(false);
    }
  }, [user, isLoaded]);

  useEffect(() => {
    async function fetchDocuments() {
      if (eventId && eventId !== "default-id") {
        try {
          const documentsResponse = await fetch(`/api/document/event_id/${eventId}`);
          if (!documentsResponse.ok) throw new Error("Failed to fetch documents");
          const docs = await documentsResponse.json();
          setDocuments(docs);
          setError(null);
        } catch (err) {
          console.error("Error: ", err);
          setDocuments([]);
          setError("Failed to fetch documents");
          throw err;
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setDocuments([]);
        setError("Invalid event");
      }
    }
    fetchDocuments();
  }, [eventId]);

  if (!isLoaded || loading) {
    return <LoadingSpinner />;
  }

  if (!authorized) {
    return <UnauthorizedState />;
  }

  if (error) {
    return <ErrorState message={error ? error : "An unknown error occurred"} />;
  }

  if (isAdmin) {
    return (
      <div>
        {documents.length === 0 ? (
          <div className="flex items-center justify-center text-xl">No Documents</div>
        ) : (
          <div>
            <table className="min-w-full border-separate border-spacing-y-2 text-center">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Date Created</th>
                  <th className="px-4 py-2">View</th>
                  <th className="px-4 py-2">Delete</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, index) => (
                  <tr key={doc._id} className="bg-white shadow-sm rounded">
                    <td className="px-4 py-2 min-w-[150px] max-w-[250px] truncate"> {doc.documentName} </td>
                    <td className="px-4 py-2">{doc.documentType}</td>
                    <td className="px-4 py-2 max-w-[100px]">
                      <Select
                        value={doc.status}
                        onValueChange={(val) => {
                          const typedVal = val as IDocumentEntry["status"];
                          handleStatusChange(doc._id as string, typedVal);
                          setDocuments((prev) =>
                            prev?.map((d) => (d._id === doc._id ? { ...d, status: typedVal } : d)),
                          );
                        }}
                      >
                        <SelectTrigger className={getStatusClass(doc.status)}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Accepted", "Rejected", "Pending", "Not Submitted"].map((status) => (
                            <SelectItem key={status} value={status} className="text-sm">
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">{new Date(doc.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2">
                      <Link href={`/view/document/${doc._id}`}>
                        <Button className="bg-basic-blue text-white hover:bg-hover-blue px-4 py-1 rounded-lg w-[6rem]">
                          View
                        </Button>
                      </Link>
                    </td>
                    <td>
                      {eventStatus !== "Completed" && eventStatus !== "Cancelled" ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const confirmed = confirm("Confirm to Delete");
                            if (!confirmed) return;

                            handleDeleteDocument(doc._id as string, doc.eventId as string)
                              .then(() => {
                                setDocuments((prev) => prev.filter((e) => e._id !== doc._id));
                              })
                              .catch((err) => {
                                console.error("Delete failed", err);
                                alert("Failed to delete document");
                              });
                          }}
                        >
                          <i
                            className="icon-[ic--baseline-delete-forever] text-rose-500 h-8 w-8"
                            aria-hidden="true"
                          ></i>
                        </Button>
                      ) : (
                        <i className="icon-[ic--baseline-delete-forever] text-gray-500 h-8 w-8" aria-hidden="true"></i>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
  return (
    <div>
      {documents.length === 0 ? (
        <div className="flex items-center justify-center text-xl">No Documents</div>
      ) : (
        <div>
          <table className="min-w-full border-separate border-spacing-y-2 text-center">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Document Name</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date Created</th>
                <th className="px-4 py-2">View</th>
                <th className="px-4 py-2">Reupload</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, index) => (
                <tr key={index} className="bg-white shadow-sm rounded">
                  <td className="px-4 py-2 min-w-[150px] max-w-[250px] truncate"> {doc.documentName} </td>
                  <td className="px-4 py-2">{doc.documentType}</td>
                  <td className="px-4 py-2">
                    <span className={getStatusClass(doc.status)}>{doc.status}</span>
                  </td>
                  <td className="px-4 py-2">{new Date(doc.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <Link href={`/view/document/${doc._id}`}>
                      <Button className="bg-basic-blue text-white hover:bg-hover-blue px-4 py-1 rounded-lg w-[6rem]">
                        View
                      </Button>
                    </Link>
                  </td>
                  <td>
                    {eventStatus !== "Completed" && eventStatus !== "Cancelled" ? (
                      <Link href={`/upload/${eventId}/${doc._id}`} passHref>
                        <Button className="bg-basic-blue text-white hover:bg-hover-blue px-4 py-1 rounded-lg w-[6rem]">
                          Reupload
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        disabled
                        className="bg-gray-400 text-gray-700 px-4 py-1 rounded-lg w-[6rem] cursor-not-allowed"
                      >
                        Reupload
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  //   if (isAdmin) {
  //     return <AdminTable />;
  //   }
  //   return <ClientTable />;
}
