import { createClient } from "../../lib/prismic";
import TeamMember from "./TeamMember";

export default async function TeamGrid() {
  const client = createClient();
  
  const teamMembers = await client.getAllByType("team_member", {
    orderings: [
      { field: "my.team_member.featured_member", direction: "desc" },
      { field: "document.first_publication_date", direction: "asc" }
    ]
  });


  return (
    <section className="team-grid py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <TeamMember
              key={member.id}
              name={member.data.name || ""}
              title={member.data.title || ""}
              bio={member.data.bio}
              headshot={member.data.headshot}
            />
          ))}
        </div>
      </div>
    </section>
  );
}