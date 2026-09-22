import { Request, Response } from 'express';
import { Project } from '@/app/api/models/Project';

// Get all projects with optional filtering and population
export const getProjects = async (req: Request, res: Response) => {
  try {
    const { sector, status } = req.query;
    const filter: Record<string, unknown> = {};

    if (sector) filter.sector = sector;
    if (status) filter.status = status;

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .populate('research_areas')
      .populate('team_members')
      .populate('partners');

    res.json(projects);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};

// Create a new project
export const createProject = async (req: Request, res: Response) => {
  try {
    const project = new Project(req.body);
    await project.save();
    await project.populate('research_areas');
    await project.populate('team_members');
    await project.populate('partners');
    res.status(201).json(project);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};

// Get a single project by ID
export const getProjectById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id)
            .populate('research_areas')
            .populate('team_members')
            .populate('partners');
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: message });
    }
}

// Update a project
export const updateProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        await project.populate('research_areas');
        await project.populate('team_members');
        await project.populate('partners');
        res.json(project);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(400).json({ error: message });
    }
}

// Delete a project
export const deleteProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const project = await Project.findByIdAndDelete(id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project deleted successfully' });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: message });
    }
}