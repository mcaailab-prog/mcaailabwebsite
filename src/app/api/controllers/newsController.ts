import { Request, Response } from 'express';
import { News } from '@/app/api/models/News';

export const getNews = async (req: Request, res: Response) => {
  try {
    const { tags } = req.query;
    const filter: any = {};
    if (tags) filter.tags = { $in: Array.isArray(tags) ? tags : [String(tags)] };
    filter.is_published = true;
    const docs = await News.find(filter).sort({ published_date: -1 });
    res.json(docs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createNews = async (req: Request, res: Response) => {
  try {
    const news = new News(req.body);
    await news.save();
    res.status(201).json(news);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single news article by ID
export const getNewsById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const news = await News.findById(id);
        if (!news) {
            return res.status(404).json({ message: 'News article not found' });
        }
        res.json(news);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// Update a news article
export const updateNews = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const news = await News.findByIdAndUpdate(id, req.body, { new: true });
        if (!news) {
            return res.status(404).json({ message: 'News article not found' });
        }
        res.json(news);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

// Delete a news article
export const deleteNews = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const news = await News.findByIdAndDelete(id);
        if (!news) {
            return res.status(404).json({ message: 'News article not found' });
        }
        res.json({ message: 'News article deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
