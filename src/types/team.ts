import { ImageField, RichTextField } from "@prismicio/client";

export interface TeamMemberDocument {
  id: string;
  uid: string;
  type: "team_member";
  href: string;
  tags: string[];
  first_publication_date: string;
  last_publication_date: string;
  slugs: string[];
  linked_documents: unknown[];
  lang: string;
  alternate_languages: unknown[];
  data: TeamMemberData;
}

export interface TeamMemberData {
  full_name: string;
  member_slug?: string;
  job_title: string;
  headshot: ImageField;
  role?: string;
  featured_member?: boolean;
  bio: RichTextField;
  specialties?: unknown[];
  education?: unknown[];
  meta_title?: string;
  meta_description?: string;
}

export interface TeamMemberProps {
  name: string;
  title: string;
  bio: RichTextField;
  headshot?: ImageField;
  featured?: boolean;
}