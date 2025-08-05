import TeamGrid from "../../components/TeamGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team | Eminent Interior Design",
  description: "Meet the talented team behind Eminent Interior Design. Our experienced designers bring creativity and expertise to every project in Minneapolis and beyond.",
};

export default function TeamPage() {
  return (
    <main>
      <section className="hero bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Meet Our Team</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the talented individuals who bring creativity, expertise, and passion 
            to every interior design project.
          </p>
        </div>
      </section>
      
      <TeamGrid />
    </main>
  );
}