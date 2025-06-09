import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faDownload } from "@fortawesome/free-solid-svg-icons";

interface IGeneralResource {
  name: string;
  url: string;
}

interface ContactSectionProps {
  name?: string;
  email: string;
  phone: string;
  generalResources?: IGeneralResource[];
}

export default function ContactSection({ name, email, phone, generalResources = [] }: ContactSectionProps) {
  // Default general resources if none provided
  const defaultResources: IGeneralResource[] = [
    { name: "General Barn Policy", url: "/general-barn-policy.pdf" },
    { name: "Brochure", url: "/brochure.pdf" },
    { name: "Venue Map", url: "/venue-map.pdf" },
  ];

  const resourcesToShow = generalResources.length > 0 ? generalResources : defaultResources;

  const handleDownload = (resource: IGeneralResource) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = resource.url;
    link.download = resource.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div>
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
      </div>

      {/* General Resources Section */}
      <div>
        <h4 className="text-lg font-medium mb-3">General Resources:</h4>
        <div className="space-y-3">
          {resourcesToShow.map((resource, index) => (
            <div key={index} className="flex items-center">
              <FontAwesomeIcon icon={faFile} className="mr-3 text-gray-600" />
              <span
                className="mr-3 text-blue-500 cursor-pointer hover:underline"
                onClick={() => handleDownload(resource)}
              >
                {resource.name}
              </span>
              <button onClick={() => handleDownload(resource)} className="mr-4 hover:text-gray-800" title="Download">
                <FontAwesomeIcon icon={faDownload} className="text-gray-600 cursor-pointer" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
