import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faDownload } from "@fortawesome/free-solid-svg-icons";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IDocument {
  name: string;
  url: string;
}

// this is completely temporary right now it will need to be overhauled when we connect documents to backend
interface DocumentListProps {
  documents: IDocument[];
  isEditing: boolean;
  isAdmin: boolean;
  onRemoveDocument: (index: number) => void;
}

export default function DocumentList({ documents, isEditing, isAdmin, onRemoveDocument }: DocumentListProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">Documents:</h4>
      {documents.map((doc, index) => (
        <div key={index} className="flex items-center">
          <FontAwesomeIcon icon={faFile} className="mr-3 text-gray-600" />
          <a href={doc.url} className="mr-3 text-blue-500 underline">
            {doc.name}
          </a>
          <a href={doc.url} download={doc.name} className="mr-4">
            <FontAwesomeIcon icon={faDownload} className="text-gray-600 cursor-pointer hover:text-gray-800" />
          </a>
          {isEditing && isAdmin && (
            <Button variant="ghost" size="sm" onClick={() => onRemoveDocument(index)} className="p-1 rounded ml-auto">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      {documents.length === 0 && <p className="text-sm text-gray-500">No documents uploaded.</p>}
    </div>
  );
}
