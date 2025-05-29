"use client";

import React, { useEffect, useState } from "react";
import DocumentUpload from "@/components/DocumentUpload";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { UserResource } from "@clerk/types";
import { useParams, useRouter } from "next/navigation";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { LoadingSpinner } from "@/components/loadingStates";

// Deprecated function to download document
// async function downloadDocument(s3DocIdClient: string) {
//   try {
//     // Get the download URL for the file using the s3DocIdClient or S3Key
//     const url_string = `/api/download-url?s3Key=${encodeURIComponent(s3DocIdClient)}`;
//     const downloadDocResponse = await fetch(url_string);
//     if (!downloadDocResponse) throw new Error("Failed to get download URL");
//     const { downloadUrl } = await downloadDocResponse.json();
//     window.open(downloadUrl, "_blank");
//   } catch (err) {
//     alert("Download failed");
//     console.error("Download failed: ", err);
//     throw err;
//   }
// }

async function uploadDocument(
  file: File,
  user: UserResource | null | undefined,
  eventId: string,
  documentId: string,
  documentType: string,
  documentName: string,
) {
  try {
    // 1. Get the s3docIdClient
    var docToDelete: boolean = false;
    var s3RetrievedDocIdClient: string = "";
    const getDocumentResponse = await fetch(`/api/document/${documentId}`);
    if (!getDocumentResponse.ok) throw new Error("Failed to get document record");
    const document = await getDocumentResponse.json();

    // Check if the document has an s3DocIdClient
    // If it does not, it means the admin requested a document and the client has not uploaded it yet
    if (!(typeof document.s3DocIdClient === "undefined" || document.s3DocIdClient === null)) {
      s3RetrievedDocIdClient = document.s3DocIdClient;
      docToDelete = true;
    }

    // 2. Get the upload URL for the file
    const url_string = `/api/upload-url?file=${encodeURIComponent(file.name)}&userId=${encodeURIComponent(user?.id || "")}&eventId=${encodeURIComponent(eventId)}&documentId=${encodeURIComponent(documentId)}`;
    const uploadUrlResponse = await fetch(url_string);
    if (!uploadUrlResponse.ok) throw new Error("Failed to get upload URL");
    const { uploadUrl, s3Key } = await uploadUrlResponse.json();

    // 3. Upload document with uploadUrl
    const uploadDocResponse = await fetch("/api/upload-document", {
      method: "PUT",
      body: (() => {
        const formData = new FormData();
        formData.append("upload-url", uploadUrl);
        formData.append("file", file);
        return formData;
      })(),
    });
    if (!uploadDocResponse.ok) throw new Error("Failed to upload document");

    // 4. Delete the old document in S3
    if (docToDelete) {
      const deleteS3DocumentResponse = await fetch("/api/delete-document", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          s3Key: s3RetrievedDocIdClient,
        }),
      });
      if (!deleteS3DocumentResponse.ok) throw new Error("Failed to delete document record in S3");
    }

    // 5. Update document object in MongoDB
    const updateDocResponse = await fetch(`/api/document/${documentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        s3DocIdClient: s3Key,
        uploadedAt: new Date(),
        documentName: documentName || file.name,
        documentType: documentType,
      }),
    });
    if (!updateDocResponse.ok) throw new Error("Failed to create document record");
    const updatedDocument = await updateDocResponse.json();
    alert("Uploaded Successfully");
    return updatedDocument.s3DocIdClient;
  } catch (err) {
    alert("Upload failed");
    console.error("Upload failed: ", err);
    throw err;
  }
}

// Deprecated function to delete document
// async function deleteDocument(documentId: string, s3DocIdClient: string, resetUploadState: () => void) {
//   try {
//     const deleteS3DocumentResponse = await fetch("/api/delete-document", {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         s3Key: s3DocIdClient,
//       }),
//     });
//     if (!deleteS3DocumentResponse.ok) throw new Error("Failed to delete document record in S3");

//     const updateMongoDocumentResponse = await fetch(`/api/document/${documentId}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         $unset: { s3DocIdClient: "" },
//       }),
//     });
//     if (!updateMongoDocumentResponse.ok)
//       throw new Error("Failed to delete S3DocIdClient attribute in the document in MongoDB");

//     resetUploadState();
//     alert("Deleted Successfully");
//   } catch (err) {
//     alert("Deletion Failed");
//     console.error("Deletion Failed: ", err);
//     throw err;
//   }
// }

const ClientUploadPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const eventId = params.event_id;
  const documentId = params.document_id;

  const { isLoaded: userIsLoaded, user } = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [eventClerkId, setEventClerkId] = useState<string | null>(null);
  const [eventStatus, setEventStatus] = useState<string | null>(null);
  const [documentClerkId, setDocumentClerkId] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<string>("");
  const [documentName, setDocumentName] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  const [file, setFile] = useState<File | null>(null);
  const [checklist, setChecklist] = useState<boolean[]>(new Array(8).fill(false));

  const SpinnerWithText = () => {
    return (
      <div className="flex items-center gap-3">
        <Spinner>Uploading...</Spinner>
      </div>
    );
  };

  useEffect(() => {
    if (!userIsLoaded) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventRes, documentRes] = await Promise.all([
          fetch(`/api/event/${eventId}`),
          fetch(`/api/document/${documentId}`),
        ]);

        if (eventRes.ok && documentRes.ok) {
          const event = await eventRes.json();
          setEventStatus(event.status);
          setEventClerkId(event.clerkId);
          const document = await documentRes.json();
          setDocumentClerkId(document.clerkId);
        } else {
          setEventClerkId(null);
          setDocumentClerkId(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setEventClerkId(null);
        setDocumentClerkId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userIsLoaded, eventId, documentId]);

  useEffect(() => {
    if (loading || !userIsLoaded) return;

    if (!eventClerkId || !documentClerkId) {
      router.push("/not-found");
      return;
    }

    if (user?.id !== eventClerkId || user?.id !== documentClerkId) {
      router.push("/not-found");
    } else {
      setAuthorized(true);
    }
  }, [loading, userIsLoaded, eventClerkId, documentClerkId, user?.id, router]);

  if (loading || !userIsLoaded || !authorized) {
    return <LoadingSpinner />;
  }
  // Lock the page if the event is completed or cancelled
  if (eventStatus === "Completed" || eventStatus === "Cancelled") {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">{`Event is labeled ${eventStatus.toLowerCase()}`}</h2>
        <p className="text-lg mb-6">You can no longer upload documents for this event</p>
        <Button className="bg-[#3A6F8F] text-white px-8 py-4 text-2xl rounded-lg" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const handleChange = (file: File) => {
    setFile(file);
  };

  const handleCheckboxChange = (index: number) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[index] = !updatedChecklist[index];
    setChecklist(updatedChecklist);
  };

  const allChecked = checklist.every(Boolean);

  return (
    <div className="flex flex-col items-center p-8 w-full min-h-[calc(100vh-105px-40px)] bg-white">
      {/* Main Layout */}

      {/* Document Name and Select box for type*/}
      <div className="flex w-full max-w-5xl gap-5 mb-6">
        <div className="w-2/3">
          <Input
            className="h-14 px-4 placeholder:text-lg md:text-lg"
            placeholder={file ? file.name : "Enter Document Name"}
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
          />
        </div>
        <div className="w-1/3">
          <Select value={documentType} onValueChange={setDocumentType}>
            <SelectTrigger className="h-14 text-lg px-4">
              <SelectValue placeholder="Select Document Type" />
            </SelectTrigger>
            <SelectContent className="text-base">
              <SelectItem className="text-base" value="Insurance/COI">
                Insurance/COI
              </SelectItem>
              <SelectItem className="text-base" value="Timeline">
                Timeline
              </SelectItem>
              <SelectItem className="text-base" value="Layout">
                Layout
              </SelectItem>
              <SelectItem className="text-base" value="Other">
                Other
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex w-full min-h-full max-w-5xl gap-5">
        {/* DocumentUpload component + preview (not yet implemented) */}
        <div
          className={`${documentType === "Insurance/COI" ? "w-2/3" : "w-full"} min-h-[calc(100vh-105px-40px-120px)] flex justify-center`}
        >
          <DocumentUpload file={file} setFile={handleChange} />
        </div>

        {/* Checklist */}
        {documentType === "Insurance/COI" && (
          <div className="w-1/3 border border-gray-300 rounded-lg p-6 bg-gray-50 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Checklist</h2>
            <ul className="list-none pl-5 space-y-2">
              {[
                "Additional Insured: The Land Conservancy of San Luis Obispo County, 1137 Pacific Street, San Luis Obispo, CA 93401.",
                "Coverage on the Event Day (and day prior if onsite for setup)",
                "$1 Million Each Occurrence Liability Limit",
                "$2 Million General Aggregate Liability Limit",
                "$5,000 Medical Expense",
                "$1,000 Deductible",
                "Host Liquor Liability (if alcohol is served)",
                "Waiver of Subrogation",
              ].map((item, index) => (
                <li key={index} className="text-gray-700 flex items-start gap-2">
                  <input
                    type="checkbox"
                    id={`checkbox-${index}`}
                    checked={checklist[index]}
                    onChange={() => handleCheckboxChange(index)}
                    className="w-5 h-5 accent-[#3A6F8F] border-gray-300 rounded"
                  />
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          className="h-14 bg-[ bg-basic-blue ] text-white hover:bg-[#305a73] px-10 text-lg"
          disabled={!documentType || (!allChecked && documentType == "Insurance/COI") || !file}
          size={"sm"}
          onClick={async () => {
            if (file) {
              try {
                setUploading(true);
                await uploadDocument(file, user, eventId as string, documentId as string, documentType, documentName);
                // TODO: Route to event page once completed
                router.push(`/`);
              } catch (err) {
                console.error("Upload failed:", err);
              } finally {
                setUploading(false);
              }
            }
          }}
        >
          {uploading ? (
            <>
              <SpinnerWithText />
            </>
          ) : (
            <>
              <Upload /> Upload
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ClientUploadPage;
