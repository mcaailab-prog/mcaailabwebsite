import { Request, Response } from 'express';
import { ResearchArea } from '@/app/api/models/ResearchArea';

// Get all research areas with optional filtering
export const getResearchAreas = async (req: Request, res: Response) => {
  try {
    const { category, status } = req.query;
    const filter: Record<string, unknown> = {};

    if (category) filter.category = category;
    if (status) filter.status = status;

    const researchAreas = await ResearchArea.find(filter)
      .sort({ order: 1, title: 1 });

    res.json(researchAreas);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};

// Create a new research area
export const createResearchArea = async (req: Request, res: Response) => {
  try {
    const researchArea = new ResearchArea(req.body);
    await researchArea.save();
    res.status(201).json(researchArea);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};