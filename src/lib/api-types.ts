// =============================================================
//  Shared API types
//  All fields that may be null/missing from MongoDB are optional
// =============================================================

export type ResearchAreaType = {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  full_description: string;
  status: string;
  cover_image?: string | null;
  order: number;
  created_at?: string;
  updated_at?: string;
};

export type TeamMemberType = {
  id: string;
  name: string;
  slug: string;
  role?: string | null;
  title?: string | null;
  bio?: string | null;
  photo?: string | null;
  email?: string | null;
  linkedin?: string | null;
  google_scholar?: string | null;
  research_interests?: string | null;
  order?: number;
  created_at?: string;
  updated_at?: string;
};

export type PartnerType = {
  id: string;
  name: string;
  logo?: string | null;
  website?: string | null;
  description?: string | null;
  partner_type?: string | null;
  order?: number;
  created_at?: string;
  updated_at?: string;
};

export type ProjectType = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  sector?: string | null;
  status?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  cover_image?: string | null;
  research_areas?: ResearchAreaType[];
  team_members?: TeamMemberType[];
  partners?: PartnerType[];
  created_at?: string;
  updated_at?: string;
};

export type PublicationType = {
  id: string;
  title: string;
  authors?: string | null;
  year?: number | null;
  venue?: string | null;
  abstract?: string | null;
  pdf_file?: string | null;
  doi?: string | null;
  publication_type?: string | null;
  category?: string | null;
  is_open_access?: boolean;
  url?: string | null;
  research_areas?: ResearchAreaType[];
  projects?: ProjectType[];
  created_at?: string;
  updated_at?: string;
};

export type DatasetType = {
  id: string;
  name: string;
  slug: string;
  language?: string | null;
  size_description?: string | null;
  format?: string | null;
  license?: string | null;
  description?: string | null;
  download_url?: string | null;
  requires_request?: boolean;
  associated_project?: ProjectType | null;
  created_at?: string;
  updated_at?: string;
};

export type PostType = {
  id: string;
  title: string;
  slug: string;
  category: string;
  body?: string | null;
  excerpt?: string | null;
  cover_image?: string | null;
  author?: string | null;
  published_date?: string | null;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type SiteStatType = {
  id: string;
  label: string;
  value: string | number;
  order: number;
  created_at?: string;
  updated_at?: string;
};

export type EventType = {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  cover_image?: string | null;
  body?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  published_date?: string | null;
  location?: string | null;
  is_online?: boolean;
  status?: 'upcoming' | 'ongoing' | 'past';
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type QuarterlyReportType = {
  id: string;
  title: string;
  slug: string;
  year: number;
  quarter: 1 | 2 | 3 | 4;
  cover_image?: string | null;
  summary?: string | null;
  body?: string | null;
  pdf_url?: string | null;
  published_date?: string | null;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
};

// ── Form input types ──────────────────────────────────────────────────────

export type ContactSubmissionInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type DatasetAccessRequestInput = {
  dataset_id: string;
  name: string;
  email: string;
  institution: string;
  purpose: string;
};

// ── Convenience aliases (so old imports keep working) ─────────────────────

export type Post         = PostType;
export type Partner      = PartnerType;
export type TeamMember   = TeamMemberType;
export type ResearchArea = ResearchAreaType;
export type Project      = ProjectType;
export type Dataset      = DatasetType;
export type Publication  = PublicationType;