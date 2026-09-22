import { Request, Response } from 'express';
import { Publication } from '@/app/api/models/Publication';

// Get all publications with optional filtering and population
export const getPublications = async (req: Request, res: Response) => {
  try {
    const { year, search } = req.query;
    const filter: Record<string, unknown> = {};

    if (year) filter.year = parseInt(year as string);
    if (search) {
      filter.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { authors: { $regex: search as string, $options: 'i' } },
        { abstract: { $regex: search as string, $options: 'i' } },
        { venue: { $regex: search as string, $options: 'i' } }
      ];
    }

    const publications = await Publication.find(filter)
      .sort({ year: -1, createdAt: -1 })
      .populate('research_areas')
      .populate('projects');

    res.json(publications);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};

// Create a new publication
export const createPublication = async (req: Request, res: Response) => {
  try {
    const publication = new Publication(req.body);
    await publication.save();
    await publication.populate('research_areas');
    await publication.populate('projects');
    res.status(201).json(publication);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};

// Get a single publication by ID
export const getPublicationById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const publication = await Publication.findById(id)
            .populate('research_areas')
            .populate('projects');
        if (!publication) {
            return res.status(404).json({ message: 'Publication not found' });
        }
        res.json(publication);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: message });
    }
}

// Update a publication
export const updatePublication = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const publication = await Publication.findByIdAndUpdate(id, req.body, { new: true });
        if (!publication) {
            return res.status(404).json({ message: 'Publication not found' });
        }
        await publication.populate('research_areas');
        await publication.populate('projects');
        res.json(publication);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(400).json({ error: message });
    }
}

// Delete a publication
export const deletePublication = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const publication = await Publication.findByIdAndDelete(id);
        if (!publication) {
            return res.status(404).json({ message: 'Publication not found' });
        }
        res.json({ message: 'Publication deleted successfully' });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: message });
    }
}