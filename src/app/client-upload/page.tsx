"use client";

import React from "react";
import DocumentUpload from "@/components/DocumentUpload";
import { Button } from "@/components/ui/button";
import { Trash, Download, Upload } from "lucide-react";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { UserResource } from "@clerk/types";

// Temp Event ID for demo purposes
const eventId = "67bd28d5e038c1eb96c03f53";

function downloadDocument(file: File) {
  return new Promise<string>((resolve, reject) => {
    fetch("/api/download-url?file=" + file.name)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to get download URL");
        }
        return response.json();
      })
      .then((data) => resolve(data.downloadUrl))
      .catch((error) => {
        console.error("Error getting download URL:", error);
        reject(error);
      });
  })
    .then((url) => {
      window.open(url, "_blank");
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}

function uploadDoc(file: File, user: UserResource | null | undefined) {
  return new Promise<string>((resolve, reject) => {
    // First, get the upload URL for the file
    fetch("/api/upload-url?file=" + file.name)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to get upload URL");
        }
        return response.json();
      })
      .then((data) => resolve(data.uploadUrl))
      .catch((error) => {
        console.error("Error getting upload URL:", error);
        reject(error);
      });
  })
    .then((dataURL: string) => {
      // Upload the file to the S3 bucket
      fetch("/api/upload-document", {
        method: "PUT",
        body: (() => {
          const formData = new FormData();
          formData.append("upload-url", dataURL);
          formData.append("file", file);
          return formData;
        })(),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to upload document");
          }
          response.text();
        })
        .then(() => {
          fetch("/api/document", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              clerkId: user?.id.split("_")[1],
              eventId,
              s3DocId: file.name,
              documentType: file.type,
              createdAt: new Date(),
              status: "Pending",
              checkList: [],
            }),
          }).then((response) => {
            if (!response.ok) {
              throw new Error("Failed to create document record");
            }
            response.json();
          });
        })
        .then(() => {
          alert("Document uploaded successfully from " + user?.id.split("_")[1]);
        });
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}

const ClientUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [hasUploaded, setHasUploaded] = useState(false);
  const { user } = useUser();

  const handleChange = (file: File) => {
    setHasUploaded(false);
    setFile(file);
  };

  return (
    <div className="flex flex-col items-center p-8 w-full min-h-[calc(100vh-105px-40px)] bg-white">
      {/* Main Layout */}
      <div className="flex w-full min-h-full max-w-5xl gap-5">
        {/* DocumentUpload component + preview (not yet implemented) */}
        <div className="w-2/3 min-h-[calc(100vh-105px-40px-120px)] flex justify-center">
          <DocumentUpload file={file} setFile={handleChange} />
        </div>

        {/* Checklist Placeholder */}
        {/* TODO: Note to review checklist requirements with the nonprofit */}
        <div className="w-1/3 border border-gray-300 rounded-lg p-6 bg-gray-50 shadow-md">
          <h2 className="text-lg font-semibold mb-4">Checklist</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li className="text-gray-700">Certificate of Insurance</li>
            <li className="text-gray-700">Waiver</li>
            <li className="text-gray-700">Timeline</li>
            <li className="text-gray-700">ID</li>
            <li className="text-gray-700">Property Contract</li>
            <li className="text-gray-700">Document</li>
          </ul>
        </div>
      </div>

      {/* Buttons */}
      {/* TODO: Note to add functionality for the buttons in a later issue */}
      <div className="flex justify-center gap-4 mt-6">
        <Button className="bg-[#3A6F8F] text-white hover:bg-[#305a73]" disabled size={"sm"}>
          <Trash /> Delete
        </Button>

        <Button
          className="bg-[#3A6F8F] text-white hover:bg-[#305a73]"
          disabled={file === null && !hasUploaded}
          size={"sm"}
          onClick={() => {
            if (file && !hasUploaded) {
              uploadDoc(file, user).then(() => setHasUploaded(true));
            } else {
              downloadDocument(file as File);
            }
          }}
        >
          {!file || hasUploaded ? (
            <>
              <Download /> Download
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
