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
import { LoadingSpinner, UnauthorizedState } from "@/components/loadingStates";
import Link from "next/link";

async function uploadDocument(
  file: File,
  user: UserResource | null | undefined,
  eventId: string,
  documentType: string,
  documentName: string,
) {
  try {
    // 1. Get the upload URL for the file in S3
    const eventResponse = await fetch(`/api/event/${eventId}`);
    if (!eventResponse.ok) throw new Error("Failed to fetch event");
    const eventData = await eventResponse.json();

    const url_string = `/api/upload-url?eventName=${encodeURIComponent(eventData.eventName)}&documentName=${encodeURIComponent(documentName ?? file.name)}`;
    const uploadUrlResponse = await fetch(url_string);
    if (!uploadUrlResponse.ok) throw new Error("Failed to get upload URL");
    const { uploadUrl, s3Key } = await uploadUrlResponse.json();

    // 2. Upload document with uploadUrl in S3
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

    // 3. Create document object and fetch event in MongoDB
    const createDocResponse = await fetch(`/api/document`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clerkId: user?.id,
        eventId: eventId,
        documentName: documentName || file.name,
        documentType: documentType,
        s3DocIdClient: s3Key,
        uploadedAt: new Date(),
        status: "Pending",
      }),
    });
    if (!createDocResponse.ok) throw new Error("Failed to create document record");
    const createdDocument = await createDocResponse.json();
    const documentId = createdDocument._id;

    alert("Uploaded Successfully");
    return { documentId };
  } catch (err) {
    alert("Upload failed");
    console.error("Upload failed: ", err);
    throw err;
  }
}

const updateEventWithDoc = async (eventId: string, docId: string) => {
  try {
    const res = await fetch(`/api/event/${eventId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ docId }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to update event");
    }

    console.log("Event updated with new document!");
  } catch (error) {
    console.error("Error updating event with document:", error);
  }
};

const ClientUploadPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const eventId = params.event_id;

  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventClerkId, setEventClerkId] = useState<string | null>(null);
  const [eventStatus, setEventStatus] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<string>("");
  const [documentName, setDocumentName] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  const [file, setFile] = useState<File | null>(null);
  const insurance_list = [
    "Document Naming Convention: Guest/VendorName_EventDate_COI (no spaces)",
    "Additional Insured: The Land Conservancy of San Luis Obispo County, 1137 Pacific Street, San Luis Obispo, CA 93401.",
    "Coverage on the Event Day (and day prior if onsite for setup)",
    "$1 Million Each Occurrence Liability Limit",
    "$2 Million General Aggregate Liability Limit",
    "$5,000 Medical Expense",
    "$1,000 Deductible",
    "Host Liquor Liability (if alcohol is served)",
    "Waiver of Subrogation",
  ];
  const [checklist, setChecklist] = useState<boolean[]>(new Array(insurance_list.length).fill(false));

  const SpinnerWithText = () => {
    return (
      <div className="flex items-center gap-3">
        <Spinner>Uploading...</Spinner>
      </div>
    );
  };

  useEffect(() => {
    if (!isLoaded) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventRes] = await Promise.all([fetch(`/api/event/${eventId}`)]);

        if (eventRes.ok) {
          const event = await eventRes.json();
          setEventClerkId(event.clerkId);
          setEventStatus(event.status);
          setError(null);
        } else {
          setEventClerkId(null);
          setError("Page not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setEventClerkId(null);
        setError("Failed to load page");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, eventId]);

  useEffect(() => {
    if (loading || !isLoaded) return;

    if (!eventClerkId) {
      router.push("/not-found");
      return;
    }

    if (user?.id !== eventClerkId) {
      router.push("/not-found");
    } else {
      setAuthorized(true);
    }
  }, [loading, isLoaded, eventClerkId, user?.id, router]);

  if (!isLoaded || loading || !authorized) {
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

  if (error || !eventClerkId || user?.id !== eventClerkId) {
    router.push("/not-found");
    return <LoadingSpinner />;
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
      <div className="flex items-center justify-between w-full max-w-5xl mb-6">
        <Link href={`/view/event/${eventId}`}>
          <Button className="bg-basic-blue hover:bg-hover-blue text-base text-white" size="lg">
            Back
          </Button>
        </Link>
      </div>
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
            <h2 className="text-lg font-semibold mb-4">Required Checklist</h2>
            <ul className="list-none pl-5 space-y-2">
              {insurance_list.map((item, index) => (
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
                const { documentId } = await uploadDocument(file, user, eventId as string, documentType, documentName);
                await updateEventWithDoc(eventId as string, documentId);
                router.push(`/view/event/${eventId}`);
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
