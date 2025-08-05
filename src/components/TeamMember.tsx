import { PrismicRichText } from "@prismicio/react";
import Image from "next/image";
import { TeamMemberProps } from "../types/team";

export default function TeamMember({ 
  name, 
  title, 
  bio, 
  headshot
}: TeamMemberProps) {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "jobTitle": title,
    ...(headshot?.url && { "image": headshot.url }),
    "worksFor": {
      "@type": "Organization",
      "name": "Eminent Interior Design"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <div className={`team-member`}>
        <div className="team-member__image">
          {headshot?.url ? (
            <Image
              src={headshot.url}
              alt={headshot.alt || name}
              width={headshot.dimensions?.width || 400}
              height={256}
              className="w-full h-64 object-cover object-top rounded-lg"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No Photo Available</span>
            </div>
          )}
        </div>
        <div className="team-member__content">
          <h3 className="team-member__name text-xl font-semibold mt-4">
            {name}
          </h3>
          <p className="team-member__title text-gray-600 mb-2">
            {title}
          </p>
          <div className="team-member__bio text-sm text-gray-700">
            <PrismicRichText field={bio} />
          </div>
        </div>
      </div>
    </>
  );
}