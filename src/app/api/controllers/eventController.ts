import { Request, Response } from 'express';
import { Event } from '@/app/api/models/Event';

export const getEvents = async (req: Request, res: Response) => {
  try {
    const { when } = req.query; // when = upcoming|past|all
    const filter: Record<string, unknown> = {};
    const now = new Date();
    if (when === 'upcoming') {
      filter.start_date = { $gte: now };
    } else if (when === 'past') {
      filter.end_date = { $lt: now };
    }
    const docs = await Event.find(filter).sort({ start_date: 1 });
    res.json(docs);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const ev = new Event(req.body);
    await ev.save();
    res.status(201).json(ev);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};
