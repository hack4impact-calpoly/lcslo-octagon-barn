"use client";

import React, { useState } from "react";
import DocumentUpload from "@/components/DocumentUpload";
import { Button } from "@/components/ui/button";
import { Trash, Download } from "lucide-react";

const ClientUploadPage: React.FC = () => {
  const [checklist, setChecklist] = useState<boolean[]>(new Array(8).fill(false));

  const handleCheckboxChange = (index: number) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[index] = !updatedChecklist[index];
    setChecklist(updatedChecklist);
  };

  /* const allChecked = checklist.every(Boolean); */

  return (
    <div className="flex flex-col items-center p-8 w-full min-h-[calc(100vh-105px-40px)] bg-white">
      {/* Main Layout */}
      <div className="flex w-full min-h-full max-w-5xl gap-5">
        {/* DocumentUpload component + preview (not yet implemented) */}
        <div className="w-2/3 min-h-[calc(100vh-105px-40px-120px)] flex justify-center">
          <DocumentUpload />
        </div>

        {/* Checklist Placeholder */}
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
      </div>

      {/* Buttons */}
      {/* TODO: Note to add functionality for the buttons in a later issue */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          className="bg-[#3A6F8F] text-white hover:bg-[#305a73]"
          disabled
          /* disabled={!allChecked} */ size={"sm"}
        >
          <Trash /> Delete
        </Button>

        <Button
          variant="outline"
          className="bg-[#3A6F8F] text-white hover:bg-[#305a73]"
          disabled
          /* disabled={!allChecked} */ size={"sm"}
        >
          <Download /> Download
        </Button>
      </div>
    </div>
  );
};

export default ClientUploadPage;
