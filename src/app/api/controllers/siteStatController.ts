import { Request, Response } from 'express';
import { SiteStat } from '@/app/api/models/SiteStat';

// Get all site stats
export const getSiteStats = async (req: Request, res: Response) => {
  try {
    const siteStats = await SiteStat.find()
      .sort({ order: 1, label: 1 });

    res.json(siteStats);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};

// Create a new site stat
export const createSiteStat = async (req: Request, res: Response) => {
  try {
    const siteStat = new SiteStat(req.body);
    await siteStat.save();
    res.status(201).json(siteStat);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};