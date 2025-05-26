interface ContactSectionProps {
  name?: string;
  email: string;
  phone: string;
}

export default function ContactSection({ name, email, phone }: ContactSectionProps) {
  return (
    <ul className="space-y-4 text-base">
      <li>
        <span className="text-lg font-medium">Name:</span> <span className="text-base">{name || "N/A"}</span>
      </li>
      <li>
        <span className="text-lg font-medium">Email:</span> <span className="text-base">{email}</span>
      </li>
      <li>
        <span className="text-lg font-medium">Phone Number:</span> <span className="text-base">{phone}</span>
      </li>
    </ul>
  );
}
