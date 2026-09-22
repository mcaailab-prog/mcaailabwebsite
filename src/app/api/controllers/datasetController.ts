import { Request, Response } from 'express';
import { Dataset } from '@/app/api/models/Dataset';

// Get all datasets with optional filtering and population
export const getDatasets = async (req: Request, res: Response) => {
  try {
    const { language, requires_request } = req.query;
    const filter: Record<string, unknown> = {};

    if (language) filter.language = language;
    if (requires_request !== undefined) filter.requires_request = requires_request === 'true';

    const datasets = await Dataset.find(filter)
      .sort({ name: 1 })
      .populate('associated_project');

    res.json(datasets);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};

// Create a new dataset
export const createDataset = async (req: Request, res: Response) => {
  try {
    const dataset = new Dataset(req.body);
    await dataset.save();
    await dataset.populate('associated_project');
    res.status(201).json(dataset);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};

// Get a single dataset by ID
export const getDatasetById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const dataset = await Dataset.findById(id)
            .populate('associated_project');
        if (!dataset) {
            return res.status(404).json({ message: 'Dataset not found' });
        }
        res.json(dataset);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: message });
    }
}

// Update a dataset
export const updateDataset = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const dataset = await Dataset.findByIdAndUpdate(id, req.body, { new: true });
        if (!dataset) {
            return res.status(404).json({ message: 'Dataset not found' });
        }
        await dataset.populate('associated_project');
        res.json(dataset);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(400).json({ error: message });
    }
}

// Delete a dataset
export const deleteDataset = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const dataset = await Dataset.findByIdAndDelete(id);
        if (!dataset) {
            return res.status(404).json({ message: 'Dataset not found' });
        }
        res.json({ message: 'Dataset deleted successfully' });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: message });
    }
}