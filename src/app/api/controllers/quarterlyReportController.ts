import { Request, Response } from 'express';
import { QuarterlyReport } from '@/app/api/models/QuarterlyReport';

export const getQuarterlyReports = async (req: Request, res: Response) => {
  try {
    const { year, quarter } = req.query;
    const filter: Record<string, unknown> = {};
    if (year) filter.year = Number(year);
    if (quarter) filter.quarter = Number(quarter);
    filter.is_published = true;
    const docs = await QuarterlyReport.find(filter).sort({ year: -1, quarter: -1 });
    res.json(docs);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};

export const createQuarterlyReport = async (req: Request, res: Response) => {
  try {
    const rpt = new QuarterlyReport(req.body);
    await rpt.save();
    res.status(201).json(rpt);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};
