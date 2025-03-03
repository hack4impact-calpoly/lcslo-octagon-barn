"use client";

import React from "react";
import DocumentUpload from "@/components/DocumentUpload";
import { Button } from "@/components/ui/button";
import { Trash, Download, Upload } from "lucide-react";
import { useState } from "react";

function uploadDoc(file: File) {
  // Simulate uploading the document by sleeeping for 2 seconds
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  }).then(() => {
    alert(`Document ${file.name} uploaded successfully!`);
  });
}

const ClientUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (file: File) => {
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
          disabled={file === null}
          size={"sm"}
          onClick={() => uploadDoc(file!)}
        >
          {file ? (
            <>
              <Upload /> Upload
            </>
          ) : (
            <>
              <Download /> Download
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ClientUploadPage;
