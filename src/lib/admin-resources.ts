export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'datetime'
  | 'checkbox'
  | 'select'
  | 'image'
  | 'list'
  | 'links'
  | 'users'
  | 'objectives'
  | 'pairs';

export type AdminField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  hint?: string;
};

export type AdminResource = {
  key: string;
  title: string;
  singular: string;
  api: string;
  titleField: string;
  subtitleField?: string;
  fields: AdminField[];
};

export const adminResources: Record<string, AdminResource> = {
  news: {
    key: 'news',
    title: 'News',
    singular: 'News item',
    api: '/api/news',
    titleField: 'title',
    subtitleField: 'slug',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true, hint: 'URL path, lowercase with hyphens' },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'author', label: 'Author', type: 'text' },
      { name: 'summary', label: 'Summary', type: 'textarea' },
      { name: 'cover_image', label: 'Cover image', type: 'image' },
      { name: 'body', label: 'Body', type: 'textarea' },
      { name: 'published_date', label: 'Published date', type: 'datetime' },
      { name: 'is_published', label: 'Published', type: 'checkbox' },
    ],
  },
  events: {
    key: 'events',
    title: 'Events',
    singular: 'Event',
    api: '/api/events',
    titleField: 'title',
    subtitleField: 'slug',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'summary', label: 'Summary', type: 'textarea' },
      { name: 'cover_image', label: 'Cover image', type: 'image' },
      { name: 'body', label: 'Body', type: 'textarea' },
      { name: 'start_date', label: 'Start date', type: 'datetime', required: true },
      { name: 'end_date', label: 'End date', type: 'datetime' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'is_online', label: 'Online event', type: 'checkbox' },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'upcoming', label: 'Upcoming' },
          { value: 'ongoing', label: 'Ongoing' },
          { value: 'past', label: 'Past' },
          { value: 'featured', label: 'Featured' },
        ],
      },
      { name: 'is_featured', label: 'Featured on homepage modal', type: 'checkbox' },
    ],
  },
  projects: {
    key: 'projects',
    title: 'Projects',
    singular: 'Project',
    api: '/api/projects',
    titleField: 'title',
    subtitleField: 'slug',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'short_title', label: 'Short title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'status', label: 'Status', type: 'text', hint: 'e.g. Ongoing, Active, Completed' },
      { name: 'sector', label: 'Sector', type: 'text' },
      { name: 'start_date', label: 'Start date', type: 'date' },
      { name: 'end_date', label: 'End date', type: 'date' },
      { name: 'cover_image', label: 'Cover image', type: 'image' },
      { name: 'focus', label: 'Focus areas', type: 'list', hint: 'One per line' },
      { name: 'outcome.aim', label: 'Outcome — Aim', type: 'textarea' },
      { name: 'outcome.context', label: 'Outcome — Context', type: 'textarea' },
      { name: 'outcome.tasks', label: 'Outcome — Tasks', type: 'textarea' },
      { name: 'outcome.success', label: 'Outcome — Success', type: 'textarea' },
      { name: 'lead_name', label: 'Project lead', type: 'text' },
      { name: 'member_names', label: 'Members', type: 'list', hint: 'One name per line' },
      { name: 'funder_names', label: 'Funders', type: 'list', hint: 'One name per line' },
      { name: 'links', label: 'Publications / social / website links', type: 'links' },
      { name: 'order', label: 'Display order', type: 'number' },
      { name: 'is_published', label: 'Show on public site', type: 'checkbox' },
    ],
  },
  research: {
    key: 'research',
    title: 'Research areas',
    singular: 'Research area',
    api: '/api/research',
    titleField: 'title',
    subtitleField: 'slug',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'summary', label: 'Summary', type: 'textarea', required: true },
      { name: 'full_description', label: 'Full description', type: 'textarea', required: true },
      { name: 'status', label: 'Status', type: 'text' },
      { name: 'cover_image', label: 'Cover image', type: 'image' },
      { name: 'order', label: 'Display order', type: 'number' },
    ],
  },
  collaborations: {
    key: 'collaborations',
    title: 'Collaborations',
    singular: 'Collaboration',
    api: '/api/collaborations',
    titleField: 'title',
    subtitleField: 'partner',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'partner', label: 'Partner', type: 'text' },
      { name: 'summary', label: 'Summary', type: 'textarea' },
      { name: 'body', label: 'Main description', type: 'textarea' },
      { name: 'cover_image', label: 'Cover image', type: 'image' },
      { name: 'objectives', label: 'Objectives', type: 'objectives' },
      { name: 'contribution_heading', label: 'MCAAI contribution heading', type: 'text' },
      { name: 'contribution_body', label: 'MCAAI contribution', type: 'textarea' },
      { name: 'stat_value', label: 'Highlight value', type: 'text' },
      { name: 'stat_label', label: 'Highlight label', type: 'text' },
      { name: 'stat_description', label: 'Highlight description', type: 'textarea' },
      { name: 'evidence_items', label: 'Evidence bullets', type: 'list' },
      { name: 'cta_heading', label: 'CTA heading', type: 'text' },
      { name: 'cta_body', label: 'CTA body', type: 'textarea' },
      { name: 'links', label: 'Links', type: 'links' },
      { name: 'related_project_slug', label: 'Related project slug', type: 'text' },
      { name: 'order', label: 'Display order', type: 'number' },
      { name: 'is_published', label: 'Show on public site', type: 'checkbox' },
    ],
  },
  innovations: {
    key: 'innovations',
    title: 'Innovations',
    singular: 'Innovation',
    api: '/api/innovations',
    titleField: 'name',
    subtitleField: 'slug',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'text' },
      { name: 'date', label: 'Date label', type: 'text' },
      { name: 'description', label: 'Short description', type: 'textarea' },
      { name: 'impact', label: 'Impact', type: 'textarea' },
      { name: 'summary', label: 'Summary', type: 'textarea' },
      { name: 'overview', label: 'How it works', type: 'textarea' },
      { name: 'access_url', label: 'Access URL', type: 'text' },
      { name: 'stack', label: 'Tags', type: 'list' },
      { name: 'features', label: 'Features', type: 'list' },
      { name: 'users', label: 'Users of the system', type: 'users' },
      { name: 'useCases', label: 'Use cases', type: 'list' },
      { name: 'frontend', label: 'Front-end design', type: 'list' },
      { name: 'backend', label: 'Back-end features', type: 'list' },
      { name: 'details', label: 'Sidebar details (label | value)', type: 'pairs' },
      { name: 'order', label: 'Display order', type: 'number' },
      { name: 'is_published', label: 'Show on public site', type: 'checkbox' },
    ],
  },
  careers: {
    key: 'careers',
    title: 'Career tracks',
    singular: 'Career track',
    api: '/api/careers',
    titleField: 'name',
    subtitleField: 'slug',
    fields: [
      { name: 'name', label: 'Track name', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'qualifications', label: 'Qualifications', type: 'list' },
      { name: 'selection_criteria', label: 'Selection criteria', type: 'list' },
      { name: 'window_open', label: 'Application window opens', type: 'datetime' },
      { name: 'window_close', label: 'Application window closes', type: 'datetime' },
      { name: 'is_accepting', label: 'Currently accepting applications', type: 'checkbox' },
      { name: 'order', label: 'Display order', type: 'number' },
    ],
  },
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
