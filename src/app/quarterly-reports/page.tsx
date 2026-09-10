import type { Metadata } from 'next';
import ReportsClient from '@/app/quarterly-reports/ReportsClient';
import { api } from '@/lib/api';
import { serialize } from '@/lib/serialize';
import type { QuarterlyReportType } from '@/lib/api-types';

export const metadata: Metadata = {
  title: 'Newsletter Punchlines — MCAAI',
  description: 'Quarterly newsletters and reports',
};

export default async function ReportsPage() {
  const reportsRaw = await api.getQuarterlyReports();
  const reports = serialize(reportsRaw) as QuarterlyReportType[];
  return <ReportsClient reports={reports} />;
}
