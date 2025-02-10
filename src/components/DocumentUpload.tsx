import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { Upload } from "lucide-react";

const fileTypes = ["PDF", "JPEG", "PNG", "DOCX", "DOC", "WORD"];

const DocumentUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (file: File) => {
    setFile(file);
  };

  return (
    <FileUploader
      handleChange={handleChange}
      name="document"
      types={fileTypes}
      hoverTitle="Drop the file here"
      onTypeError={(err: string) => alert(err)}
      maxSize={1000} // Limit file size to 1000 MB (can be altered later)
      onSizeError={() => alert("File size exceeds the limit!")}
      onDraggingStateChange={(dragging: boolean) => setIsDragging(dragging)}
      dropMessageStyle={{
        fontSize: "1.5rem",
      }}
      classes={`relative flex flex-col items-center justify-center w-full h-full border rounded-lg transition-all 
        ${isDragging ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-gray-100 hover:bg-gray-200 shadow-md"}`}
    >
      <div className="flex flex-col items-center text-black pointer-events-none">
        <Upload size={48} className="mb-2 text-black" />
        <p className="font-medium text-lg">Drag and Drop or Click to Select</p>
        <p className="text-base">the desired document to be uploaded</p>
      </div>

      {file && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-700">Selected File: {file.name}</p>
        </div>
      )}
    </FileUploader>
  );
};

export default DocumentUpload;
