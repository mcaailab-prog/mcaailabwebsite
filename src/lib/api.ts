import { connectDB } from '@/app/api/utils/connectDB';
import { ResearchArea } from '@/app/api/models/ResearchArea';
import { TeamMember } from '@/app/api/models/TeamMember';
import { Partner } from '@/app/api/models/Partner';
import { Project } from '@/app/api/models/Project';
import { Publication } from '@/app/api/models/Publication';
import { Dataset } from '@/app/api/models/Dataset';
import { News } from '@/app/api/models/News';
import { Event } from '@/app/api/models/Event';
import { Award } from '@/app/api/models/Award';
import { QuarterlyReport } from '@/app/api/models/QuarterlyReport';
import { SiteStat } from '@/app/api/models/SiteStat';
import { ContactSubmission } from '@/app/api/models/ContactSubmission';
import { DatasetAccessRequest } from '@/app/api/models/DatasetAccessRequest';
import { Collaboration } from '@/app/api/models/Collaboration';
import { Innovation } from '@/app/api/models/Innovation';
import { CareerTrack } from '@/app/api/models/CareerTrack';
import { isLabTeamMember } from '@/lib/team';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ResearchAreaType {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  full_description: string;
  status: string;
  cover_image: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMemberType {
  id: string;
  name: string;
  slug: string;
  title: string;
  bio: string;
  photo: string;
  email: string;
  linkedin: string;
  google_scholar: string;
  research_interests: string;
  degree?: 'None' | 'MSc' | 'PhD' | string;
  thesis_title?: string;
  thesis_summary?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface PartnerType {
  id: string;
  name: string;
  logo: string;
  website: string;
  description: string;
  partner_type: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectType {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  short_title?: string;
  description: string;
  sector: string;
  status: string;
  start_date: string;
  end_date: string;
  cover_image: string;
  focus?: string[];
  outcome?: {
    aim?: string;
    context?: string;
    tasks?: string;
    success?: string;
  };
  lead_name?: string;
  member_names?: string[];
  funder_names?: string[];
  links?: { label: string; href: string }[];
  is_published?: boolean;
  order?: number;
  research_areas: ResearchAreaType[];
  team_members: TeamMemberType[];
  partners: PartnerType[];
  created_at: string;
  updated_at: string;
}

export interface CollaborationType {
  id: string;
  title: string;
  slug: string;
  partner?: string;
  summary?: string;
  body?: string;
  contribution_heading?: string;
  contribution_body?: string;
  cover_image?: string;
  objectives?: { n: string; title: string; body: string; accent?: string }[];
  stat_value?: string;
  stat_label?: string;
  stat_description?: string;
  evidence_items?: string[];
  cta_heading?: string;
  cta_body?: string;
  links?: { label: string; href: string }[];
  related_project_slug?: string;
  is_published?: boolean;
  order?: number;
}

export interface InnovationType {
  id: string;
  name: string;
  slug: string;
  category?: string;
  subtitle?: string;
  date?: string;
  summary?: string;
  overview?: string;
  description?: string;
  impact?: string;
  stack?: string[];
  features?: string[];
  users?: { role: string; description: string }[];
  useCases?: string[];
  frontend?: string[];
  backend?: string[];
  details?: string[][];
  access_url?: string;
  is_published?: boolean;
  order?: number;
}

export interface CareerTrackType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  qualifications?: string[];
  selection_criteria?: string[];
  window_open?: string;
  window_close?: string;
  is_accepting?: boolean;
  order?: number;
}

export interface PublicationType {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  abstract: string;
  pdf_file: string;
  publication_type: string;
  category: string;
  is_open_access: boolean;
  url: string;
  doi: string;
  research_areas: ResearchAreaType[];
  projects: ProjectType[];
  created_at: string;
  updated_at: string;
}

export interface DatasetType {
  id: string;
  name: string;
  slug: string;
  language: string;
  size_description: string;
  format: string;
  license: string;
  description: string;
  download_url: string;
  requires_request: boolean;
  associated_project: ProjectType | null;
  created_at: string;
  updated_at: string;
}

export interface PostType {
  id: string;
  title: string;
  slug: string;
  category: string;
  cover_image: string;
  body: string;
  author: string;
  published_date: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventType {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  cover_image?: string;
  body?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  is_online?: boolean;
  status?: 'upcoming' | 'ongoing' | 'past';
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface QuarterlyReportType {
  id: string;
  title: string;
  slug: string;
  year: number;
  quarter: 1 | 2 | 3 | 4;
  cover_image?: string;
  summary?: string;
  body?: string;
  pdf_url?: string;
  published_date?: string;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SiteStatType {
  id: string;
  label: string;
  value: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmissionInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface DatasetAccessRequestInput {
  dataset_id: string;
  name: string;
  email: string;
  institution: string;
  purpose: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function db() {
  await connectDB();
}

function sanitizeImageValue(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value.replace(/[\u0000-\u001F\u007F]/g, '').trim();
}

// A lean mongoose document: a plain object with dynamic, model-specific
// fields plus the driver's `_id` (mongoose types this as `unknown`, since
// its exact shape depends on the schema). Shape varies per model, so
// fields are read defensively rather than through a fixed interface.
type LeanDoc = Record<string, unknown> & { _id?: unknown; id?: string };

function hasId(value: unknown): value is LeanDoc {
  return !!value && typeof value === 'object' && '_id' in value;
}

function idToString(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  return typeof value === 'string' ? value : String(value);
}

// Converts _id to id string on every document, recursively on nested arrays
function normalize<T>(docs: LeanDoc[]): T[] {
  return docs.map((doc) => {
    const obj: LeanDoc = { ...doc, id: idToString(doc._id) ?? doc.id };

    for (const key of ['cover_image', 'logo', 'photo']) {
      if (key in obj) {
        obj[key] = sanitizeImageValue(obj[key]);
      }
    }

    // Normalize any nested populated arrays
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      if (Array.isArray(value) && hasId(value[0])) {
        obj[key] = normalize(value as LeanDoc[]);
      } else if (hasId(value)) {
        obj[key] = { ...value, id: idToString(value._id) };
      }
    }
    return obj as T;
  });
}

// ── API ───────────────────────────────────────────────────────────────────────

export const api = {
  async getResearchAreas(filters?: { category?: string; status?: string }): Promise<ResearchAreaType[]> {
    await db();
    const query: Record<string, string> = {};
    if (filters?.category) query.category = filters.category;
    if (filters?.status) query.status = filters.status;
    const docs = await ResearchArea.find(query).sort({ order: 1 }).lean();
    return normalize<ResearchAreaType>(docs);
  },

  async getEvents(filters?: { when?: 'upcoming' | 'past' | 'all' }): Promise<EventType[]> {
    await db();
    const now = new Date();
    const query: Record<string, unknown> = {};
    if (filters?.when === 'upcoming') query.start_date = { $gte: now };
    if (filters?.when === 'past') query.end_date = { $lt: now };
    const docs = await Event.find(query).sort({ start_date: 1 }).lean();
    return normalize<EventType>(docs);
  },

  async getQuarterlyReports(filters?: { year?: number; quarter?: number }): Promise<QuarterlyReportType[]> {
    await db();
    const query: Record<string, unknown> = {};
    if (filters?.year) query.year = filters.year;
    if (filters?.quarter) query.quarter = filters.quarter;
    const docs = await QuarterlyReport.find(query).sort({ year: -1, quarter: -1 }).lean();
    return normalize<QuarterlyReportType>(docs);
  },

  async getTeamMembers(): Promise<TeamMemberType[]> {
    await db();
    const docs = await TeamMember.find().sort({ order: 1 }).lean();
    return normalize<TeamMemberType>(docs).filter(isLabTeamMember);
  },

  async getPartners(filters?: { partner_type?: string }): Promise<PartnerType[]> {
    await db();
    const query: Record<string, string> = {};
    if (filters?.partner_type) query.partner_type = filters.partner_type;
    const docs = await Partner.find(query).sort({ order: 1 }).lean();
    return normalize<PartnerType>(docs);
  },

  async getProjects(filters?: { sector?: string; status?: string; includeUnpublished?: boolean }): Promise<ProjectType[]> {
    await db();
    const query: Record<string, unknown> = {};
    if (filters?.sector) query.sector = filters.sector;
    if (filters?.status) query.status = filters.status;
    if (!filters?.includeUnpublished) query.is_published = true;
    const docs = await Project.find(query)
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return normalize<ProjectType>(docs);
  },

  async getProjectBySlug(slug: string): Promise<ProjectType | null> {
    await db();
    const doc = await Project.findOne({ slug, is_published: true }).lean();
    if (!doc) return null;
    return normalize<ProjectType>([doc as LeanDoc])[0];
  },

  async getCollaborations(): Promise<CollaborationType[]> {
    await db();
    const docs = await Collaboration.find({ is_published: true }).sort({ order: 1 }).lean();
    return normalize<CollaborationType>(docs);
  },

  async getCollaborationBySlug(slug: string): Promise<CollaborationType | null> {
    await db();
    const doc = await Collaboration.findOne({ slug, is_published: true }).lean();
    if (!doc) return null;
    return normalize<CollaborationType>([doc as LeanDoc])[0];
  },

  async getInnovations(): Promise<InnovationType[]> {
    await db();
    const docs = await Innovation.find({ is_published: true }).sort({ order: 1 }).lean();
    return normalize<InnovationType>(docs);
  },

  async getInnovationBySlug(slug: string): Promise<InnovationType | null> {
    await db();
    const doc = await Innovation.findOne({ slug, is_published: true }).lean();
    if (!doc) return null;
    return normalize<InnovationType>([doc as LeanDoc])[0];
  },

  async getCareerTracks(): Promise<CareerTrackType[]> {
    await db();
    const docs = await CareerTrack.find().sort({ order: 1 }).lean();
    return normalize<CareerTrackType>(docs);
  },

  async getCareerTrackBySlug(slug: string): Promise<CareerTrackType | null> {
    await db();
    const doc = await CareerTrack.findOne({ slug }).lean();
    if (!doc) return null;
    return normalize<CareerTrackType>([doc as LeanDoc])[0];
  },

  async getPublications(filters?: { year?: number; search?: string }): Promise<PublicationType[]> {
    await db();
    const query: Record<string, unknown> = {};
    if (filters?.year) query.year = filters.year;
    if (filters?.search) query.$text = { $search: filters.search };
    const docs = await Publication.find(query)
      .populate('research_areas')
      .populate('projects')
      .lean();
    return normalize<PublicationType>(docs);
  },

  async getDatasets(filters?: { language?: string; requires_request?: boolean }): Promise<DatasetType[]> {
    await db();
    const query: Record<string, unknown> = {};
    if (filters?.language) query.language = filters.language;
    if (filters?.requires_request !== undefined) query.requires_request = filters.requires_request;
    const docs = await Dataset.find(query).populate('associated_project').lean();
    return normalize<DatasetType>(docs);
  },

  async getPosts(filters?: { category?: string }): Promise<PostType[]> {
    await db();
    const results: PostType[] = [];

    // Fetch news
    if (!filters?.category || filters.category === 'news') {
      const newsQuery: Record<string, unknown> = { is_published: true };
      const newsDocs = await News.find(newsQuery).sort({ published_date: -1 }).lean();
      for (const n of newsDocs) {
        results.push({
          id: n._id?.toString() ?? n.id,
          title: n.title,
          slug: n.slug,
          category: 'news',
          cover_image: n.cover_image ?? '',
          body: n.body ?? n.summary ?? '',
          author: n.author ?? '',
          published_date: n.published_date ? n.published_date.toISOString() : '',
          is_published: !!n.is_published,
          created_at: n.createdAt?.toISOString?.() ?? '',
          updated_at: n.updatedAt?.toISOString?.() ?? '',
        });
      }
    }

    // Fetch events
    if (!filters?.category || filters.category === 'event') {
      const evQuery: Record<string, unknown> = {};
      const evDocs = await Event.find(evQuery).sort({ start_date: 1 }).lean();
      for (const e of evDocs) {
        results.push({
          id: e._id?.toString() ?? e.id,
          title: e.title,
          slug: e.slug,
          category: 'event',
          cover_image: e.cover_image ?? '',
          body: e.body ?? e.summary ?? '',
          author: '',
          published_date: e.start_date ? e.start_date.toISOString() : '',
          is_published: true,
          created_at: e.createdAt?.toISOString?.() ?? '',
          updated_at: e.updatedAt?.toISOString?.() ?? '',
        });
      }
    }

    // Fetch awards
    if (!filters?.category || filters.category === 'award') {
      const awardQuery: Record<string, unknown> = { is_published: true };
      const awardDocs = await Award.find(awardQuery).sort({ published_date: -1 }).lean();
      for (const a of awardDocs) {
        results.push({
          id: a._id?.toString() ?? a.id,
          title: a.title,
          slug: a.slug,
          category: 'award',
          cover_image: a.cover_image ?? '',
          body: a.body ?? a.summary ?? '',
          author: a.recipient ?? '',
          published_date: a.published_date ? a.published_date.toISOString() : '',
          is_published: !!a.is_published,
          created_at: a.createdAt?.toISOString?.() ?? '',
          updated_at: a.updatedAt?.toISOString?.() ?? '',
        });
      }
    }

    // Sort combined results by published_date (newest first)
    results.sort((a, b) => (b.published_date || '').localeCompare(a.published_date || ''));
    return results;
  },

  async getStats(): Promise<SiteStatType[]> {
    await db();
    const docs = await SiteStat.find().sort({ order: 1 }).lean();
    return normalize<SiteStatType>(docs);
  },

  async submitContact(data: ContactSubmissionInput): Promise<void> {
    await db();
    await ContactSubmission.create({
      ...data,
      submitted_at: new Date(),
    });
  },

  async submitDatasetRequest(data: DatasetAccessRequestInput): Promise<void> {
    await db();
    await DatasetAccessRequest.create({
      ...data,
      submitted_at: new Date(),
    });
  },
};