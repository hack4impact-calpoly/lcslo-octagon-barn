"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentData {
  _id: string;
  clerkid: string;
  title: string;
  description: string;
}

export default function DocumentView() {
  const params = useParams();
  const router = useRouter();
  // Ensure id is a string (if useParams returns an array, take the first element)
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { user } = useUser();

  const [document, setDocument] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchDocument = async () => {
      try {
        const res = await fetch(`/api/document/${id}`);
        if (res.ok) {
          const data = await res.json();
          setDocument(data.data);
        } else {
          setDocument(null);
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
    return <div className="p-8">Loading document...</div>;
  }

  if (!document) {
    return <div className="p-8">No document found.</div>;
  }

  // Authorization: Only allow document owner or admin to view the document.
  const isOwner = user?.id === document.clerkid;
  const isAdmin = user?.publicMetadata?.role === "admin";

  if (!isOwner && !isAdmin) {
    return <div className="p-8">You are not authorized to view this document.</div>;
  }

  const handleDownload = () => {
    alert("Download initiated (placeholder)");
  };

  return (
    <div className="flex flex-col items-center p-8 w-full min-h-[calc(100vh-105px-40px)] bg-white">
      {/* Header Row: Back button, Title, and a placeholder */}
      <div className="w-full max-w-[1237px] mb-4 flex items-center justify-between">
        <Button variant="outline" className="bg-[#3A6F8F] text-white hover:bg-[#305a73]" size="sm">
          Back
        </Button>
        <h1 className="text-xl font-semibold">View Document</h1>
        {/* Placeholder to balance layout */}
        <div className="w-20" />
      </div>

      {/* Document Container: responsive with an aspect ratio */}
      <div className="w-full max-w-[1237px] relative" style={{ aspectRatio: "1237 / 632" }}>
        <div className="absolute inset-0 border border-gray-300 rounded flex flex-col justify-center items-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">{document.title}</h1>
            <p className="text-gray-700">{document.description}</p>
          </div>
        </div>
      </div>

      {/* Download Button flush right with the document container */}
      <div className="w-full max-w-[1237px] mt-6 flex justify-end">
        <Button
          variant="outline"
          className="bg-[#3A6F8F] text-white hover:bg-[#305a73]"
          size="sm"
          onClick={handleDownload}
        >
          <Download className="mr-2" size={16} /> Download
        </Button>
      </div>
    </div>
  );
}
