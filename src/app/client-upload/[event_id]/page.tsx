// "use client";

// import React, { useEffect, useState } from "react";
// import DocumentUpload from "@/components/DocumentUpload";
// import { Button } from "@/components/ui/button";
// import { Trash, Download, Upload } from "lucide-react";
// import { useUser } from "@clerk/nextjs";
// import { UserResource } from "@clerk/types";
// import { useParams, useRouter } from "next/navigation";

// async function downloadDocument(file: File, user: UserResource | null | undefined, eventId: string) {
//   try {
//     const url_string = `/api/download-url?file=${encodeURIComponent(file.name)}&userId=${encodeURIComponent(user?.id || "")}
//                         &eventId=${encodeURIComponent(eventId)}`;
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

// async function uploadDocument(file: File, user: UserResource | null | undefined, eventId: string) {
//   try {
//     // 1. Get the upload URL for the file
//     const url_string = `/api/upload-url?file=${encodeURIComponent(file.name)}&userId=${encodeURIComponent(user?.id || "")}
//                         &eventId=${encodeURIComponent(eventId)}`;
//     const uploadUrlResponse = await fetch(url_string);
//     if (!uploadUrlResponse.ok) throw new Error("Failed to get upload URL");
//     const { uploadUrl } = await uploadUrlResponse.json();

//     // 2. Upload document with uploadUrl
//     const uploadDocResponse = await fetch("/api/upload-document", {
//       method: "PUT",
//       body: (() => {
//         const formData = new FormData();
//         formData.append("upload-url", uploadUrl);
//         formData.append("file", file);
//         return formData;
//       })(),
//     });
//     if (!uploadDocResponse.ok) throw new Error("Failed to upload document");

//     // 3. Create document object in MongoDB
//     const createDocResponse = await fetch("/api/document", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         clerkId: user?.id,
//         eventId,
//         s3DocId: uploadUrl,
//         documentName: file.name,
//         documentType: file.type,
//         createdAt: new Date(),
//         status: "Pending",
//         checkList: [],
//       }),
//     });
//     if (!createDocResponse.ok) throw new Error("Failed to create document record");
//     const document = await createDocResponse.json();
//     alert("Uploaded Successfully");
//     return {
//       docId: document._id,
//       s3DocId: document.s3DocId,
//     };
//   } catch (err) {
//     alert("Upload failed");
//     console.error("Upload failed: ", err);
//     throw err;
//   }
// }

// async function deleteDocument(
//   file: File,
//   user: UserResource | null | undefined,
//   eventId: string,
//   docId: string,
//   s3DocId: string,
//   resetState: () => void,
// ) {
//   try {
//     const deleteS3DocumentResponse = await fetch("/api/delete-document", {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         fileName: file.name,
//         userId: user?.id,
//         eventId,
//       }),
//     });
//     if (!deleteS3DocumentResponse.ok) throw new Error("Failed to delete document record in S3");

//     const deleteMongoDocumentResponse = await fetch(`/api/document/${docId}`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         clerkId: user?.id,
//         eventId,
//         s3DocId,
//       }),
//     });
//     if (!deleteMongoDocumentResponse.ok) throw new Error("Failed to delete document record in MongoDB");
//     resetState();
//     alert("Deleted Successfully");
//   } catch (err) {
//     alert("Deletion Failed");
//     console.error("Deletion Failed: ", err);
//     throw err;
//   }
// }

// const ClientUploadPage: React.FC = () => {
//   const params = useParams();
//   const router = useRouter();
//   const eventId = params.event_id;

//   const { isLoaded: userIsLoaded, user } = useUser();
//   const [loading, setLoading] = useState<boolean>(true);
//   const [file, setFile] = useState<File | null>(null);
//   const [isUploaded, setIsUploaded] = useState(false);
//   const [DocumentId, setDocumentId] = useState<string | null>(null);
//   const [s3DocumentId, setS3DocumentId] = useState<string | null>(null);
//   const [checklist, setChecklist] = useState<boolean[]>(new Array(8).fill(false));
//   const [eventClerkId, setEventClerkId] = useState<string | null>(null);

//   const resetState = () => {
//     setFile(null);
//     setIsUploaded(false);
//     setDocumentId(null);
//     setS3DocumentId(null);
//     setChecklist(new Array(8).fill(false));
//   };

//   useEffect(() => {
//     if (!userIsLoaded) return;
//     const fetchEvent = async () => {
//       const res = await fetch(`/api/event/${eventId}`);
//       try {
//         if (res.ok) {
//           const event = await res.json();
//           setEventClerkId(event.clerkId as string);
//         } else {
//           setEventClerkId(null);
//         }
//       } catch (error) {
//         console.error("Error fetching document:", error);
//         setEventClerkId(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvent();
//   }, [eventId, userIsLoaded]);

//   useEffect(() => {
//     if (loading || !userIsLoaded) return;

//     if (!eventClerkId) {
//       router.push("/not-found");
//       return;
//     }

//     if (user?.id !== eventClerkId) {
//       router.push("/not-found");
//     }
//   }, [loading, userIsLoaded, eventClerkId, user?.id, router]);

//   if (loading || !userIsLoaded) {
//     return <div>Loading...</div>;
//   }

//   const handleChange = (file: File) => {
//     setFile(file);
//     setIsUploaded(false);
//   };

//   const handleCheckboxChange = (index: number) => {
//     const updatedChecklist = [...checklist];
//     updatedChecklist[index] = !updatedChecklist[index];
//     setChecklist(updatedChecklist);
//   };

//   const allChecked = checklist.every(Boolean);
//   console.log(DocumentId);
//   console.log(s3DocumentId);

//   return (
//     <div className="flex flex-col items-center p-8 w-full min-h-[calc(100vh-105px-40px)] bg-white">
//       {/* Main Layout */}
//       <div className="flex w-full min-h-full max-w-5xl gap-5">
//         {/* DocumentUpload component + preview (not yet implemented) */}
//         <div className="w-2/3 min-h-[calc(100vh-105px-40px-120px)] flex justify-center">
//           <DocumentUpload file={file} setFile={handleChange} />
//         </div>

//         {/* Checklist Placeholder */}
//         <div className="w-1/3 border border-gray-300 rounded-lg p-6 bg-gray-50 shadow-md">
//           <h2 className="text-lg font-semibold mb-4">Checklist</h2>
//           <ul className="list-none pl-5 space-y-2">
//             {[
//               "Additional Insured: The Land Conservancy of San Luis Obispo County, 1137 Pacific Street, San Luis Obispo, CA 93401.",
//               "Coverage on the Event Day (and day prior if onsite for setup)",
//               "$1 Million Each Occurrence Liability Limit",
//               "$2 Million General Aggregate Liability Limit",
//               "$5,000 Medical Expense",
//               "$1,000 Deductible",
//               "Host Liquor Liability (if alcohol is served)",
//               "Waiver of Subrogation",
//             ].map((item, index) => (
//               <li key={index} className="text-gray-700 flex items-start gap-2">
//                 <input
//                   type="checkbox"
//                   id={`checkbox-${index}`}
//                   checked={checklist[index]}
//                   onChange={() => handleCheckboxChange(index)}
//                   className="w-5 h-5 accent-[#3A6F8F] border-gray-300 rounded"
//                 />
//                 <span className="flex-1">{item}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="flex justify-center gap-4 mt-6">
//         {isUploaded && DocumentId && s3DocumentId ? (
//           <>
//             <Button
//               variant="outline"
//               className="bg-[ bg-basic-blue ] text-white hover:bg-[#305a73] px-6 py-3 text-lg"
//               onClick={() =>
//                 deleteDocument(
//                   file as File,
//                   user,
//                   eventId as string,
//                   DocumentId as string,
//                   s3DocumentId as string,
//                   resetState,
//                 )
//               }
//               size={"sm"}
//             >
//               <Trash /> Delete
//             </Button>
//             <Button
//               className="bg-[ bg-basic-blue ] text-white hover:bg-[#305a73] px-6 py-3 text-lg"
//               size={"sm"}
//               onClick={() => downloadDocument(file as File, user, eventId as string)}
//             >
//               <Download /> Download
//             </Button>
//           </>
//         ) : (
//           <Button
//             className="bg-[ bg-basic-blue ] text-white hover:bg-[#305a73] px-6 py-3 text-lg"
//             disabled={!allChecked || !file}
//             size={"sm"}
//             onClick={async () => {
//               if (file) {
//                 try {
//                   const { docId, s3DocId } = await uploadDocument(file, user, eventId as string);
//                   setDocumentId(docId);
//                   setS3DocumentId(s3DocId);
//                   setIsUploaded(true);
//                 } catch (err) {
//                   console.error("Upload failed:", err);
//                 }
//               }
//             }}
//           >
//             <Upload /> Upload
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ClientUploadPage;
