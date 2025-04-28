import { Input } from "@/components/ui/input";

interface ContactSectionProps {
  adminName?: string;
  email: string;
  phone: string;
  isEditing: boolean;
  isAdmin: boolean;
  onUpdate: (field: string, value: string) => void;
}

export default function ContactSection({ adminName, email, phone, isEditing, isAdmin, onUpdate }: ContactSectionProps) {
  if (isEditing && isAdmin) {
    return (
      <ul className="space-y-4">
        <li>
          <label htmlFor="adminName" className="block text-sm font-medium mb-1">
            Admin Name
          </label>
          <Input id="adminName" value={adminName || ""} onChange={(e) => onUpdate("adminName", e.target.value)} />
        </li>
        <li>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <Input id="email" value={email || ""} onChange={(e) => onUpdate("email", e.target.value)} />
        </li>
        <li>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone Number
          </label>
          <Input id="phone" value={phone || ""} onChange={(e) => onUpdate("phone", e.target.value)} />
        </li>
      </ul>
    );
  }

  return (
    <ul className="space-y-4">
      <li>Admin: {adminName || "N/A"}</li>
      <li>Email: {email}</li>
      <li>Phone: {phone}</li>
    </ul>
  );
}
