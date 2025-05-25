import { Tabs, TabsContent } from "@/components/ui/tabs";
import EventDisplay from "./eventDisplay";
import ContactSection from "./contactSection";
import DocumentList from "./documentList";

interface IDocument {
  name: string;
  url: string;
}

interface EventTabContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  eventDetails: string;
  vendorList: string;
  documents: IDocument[];
  adminName?: string;
  email: string;
  phone: string;
  isEditing: boolean;
  isAdmin: boolean;
  onUpdateField: (field: string, value: any) => void;
  onRemoveDocument: (index: number) => void;
}

export default function EventTabContent({
  activeTab,
  eventDetails,
  vendorList,
  documents,
  adminName,
  email,
  phone,
  isEditing,
  isAdmin,
  onUpdateField,
  onRemoveDocument,
}: EventTabContentProps) {
  return (
    <div className="w-3/4 mx-auto">
      <Tabs value={activeTab} className="w-full">
        {/* Event Details tab content */}
        <TabsContent value="details" className="mt-0 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column - Event Details */}
            <EventDisplay
              eventDetails={eventDetails}
              vendorList={vendorList}
              isEditing={isEditing}
              isAdmin={isAdmin}
              onUpdateField={onUpdateField}
            />

            {/* Right Column - Contact & Documents */}
            <div className="space-y-4 bg-gray-200 p-4 rounded-lg shadow-md border border-gray-300">
              <ContactSection
                adminName={adminName}
                email={email}
                phone={phone}
                isEditing={isEditing}
                isAdmin={isAdmin}
                onUpdate={(field, value) => onUpdateField(field, value)}
              />

              {/*
              <DocumentList
                documents={documents}
                isEditing={isEditing}
                isAdmin={isAdmin}
                onRemoveDocument={onRemoveDocument}
              />
            */}
            </div>
          </div>
        </TabsContent>

        {/* Documents tab content */}
        <TabsContent value="documents" className="mt-0 pt-4">
          <div className="p-4 bg-gray-200 rounded-lg shadow-md border border-gray-300">
            <p>Not implemented</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
