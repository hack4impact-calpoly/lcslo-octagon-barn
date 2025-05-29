"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RotatingLines } from "react-loader-spinner";
import Link from "next/link";

interface DocumentData {
  _id: string;
  clerkId: string;
  documentName: string;
  s3DocIdClient: string;
}

export default function DocumentView() {
  const params = useParams();
  const router = useRouter();
  // Ensure id is a string (if useParams returns an array, take the first element)
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { user } = useUser();

  const [document, setDocument] = useState<DocumentData | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchDocument = async () => {
      try {
        const res = await fetch(`/api/document/${id}`);
        if (res.ok) {
          const data = await res.json();
          setDocument(data);
          setDocumentName(data.documentName);
          setEventId(data.eventId);

          const url_string = `/api/download-url?s3Key=${encodeURIComponent(data.s3DocIdClient)}`;
          const downloadDocResponse = await fetch(url_string);
          if (downloadDocResponse.ok) {
            const { downloadUrl } = await downloadDocResponse.json();
            setDocumentUrl(downloadUrl);
          } else {
            setDocumentUrl(null);
          }
        } else {
          setDocument(null);
          setDocumentName(null);
          setDocumentUrl(null);
          setEventId(null);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        setDocument(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <RotatingLines strokeColor="black" strokeWidth="4" animationDuration="0.75" width="96" visible={true} />;
      </div>
    );
  }

  if (!document) {
    return <div className="flex items-center justify-center h-screen text-xl">No document found.</div>;
  }

  // Authorization: Only allow document owner or admin to view the document.
  const isOwner = user?.id === document.clerkId;
  const isAdmin = user?.publicMetadata?.isAdmin === true;
  if (!isOwner && !isAdmin) {
    return <div className="flex items-center justify-center h-screen text-xl">No document found.</div>;
  }

  return (
    <div className="flex flex-col items-center p-8 w-full min-h-[calc(100vh-105px-40px)] bg-white">
      {/* Header Row: Back button, Title, and a placeholder */}
      <div className="w-full max-w-[1237px] mb-4 flex items-center justify-between">
        <Link href={`/view/event/${eventId}`}>
          <Button variant="outline" className="bg-[#3A6F8F] text-white hover:bg-[#305a73]" size="lg">
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">View Document</h1>
        {/* Placeholder to balance layout */}
        <div className="w-20" />
      </div>
      {documentName ? <h1 className="text-xl mb-5">Document Name: {documentName}</h1> : <div></div>}

      {/* Document Container: responsive with an aspect ratio */}
      <div className="w-full max-w-[1237px] relative aspect-[1237/632]">
        <div className="absolute inset-0 border border-gray-300 rounded flex justify-center items-center bg-gray-50">
          {documentUrl ? (
            <iframe
              src={documentUrl}
              title="Document Preview"
              className="block mx-auto w-[100%] h-[100%] rounded border-0"
            />
          ) : (
            <p className="text-gray-500">Document Not Found</p>
          )}
        </div>
      </div>
    </div>
  );
}
