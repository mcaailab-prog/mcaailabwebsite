import type { ProjectType } from '@/lib/api-types';

const API_BASE = '/api';

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Failed to fetch ${path}`);
  }
  return response.json();
}

export const clientApi = {
  async getProjects(filters?: { sector?: string; status?: string }): Promise<ProjectType[]> {
    const url = new URL(`${API_BASE}/projects`, window.location.origin);
    if (filters?.sector) url.searchParams.append('sector', filters.sector);
    if (filters?.status) url.searchParams.append('status', filters.status);
    return fetchJson<ProjectType[]>(url.toString());
  },
};
