import { Request, Response } from 'express';
import { TeamMember } from '@/app/api/models/TeamMember';

// Get all team members
export const getTeamMembers = async (req: Request, res: Response) => {
  try {
    const teamMembers = await TeamMember.find()
      .sort({ order: 1, name: 1 });

    res.json(teamMembers);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};

// Create a new team member
export const createTeamMember = async (req: Request, res: Response) => {
  try {
    const teamMember = new TeamMember(req.body);
    await teamMember.save();
    res.status(201).json(teamMember);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};

// Get a single team member by ID
export const getTeamMemberById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const teamMember = await TeamMember.findById(id);
        if (!teamMember) {
            return res.status(404).json({ message: 'Team member not found' });
        }
        res.json(teamMember);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: message });
    }
}

// Update a team member
export const updateTeamMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const teamMember = await TeamMember.findByIdAndUpdate(id, req.body, { new: true });
        if (!teamMember) {
            return res.status(404).json({ message: 'Team member not found' });
        }
        res.json(teamMember);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(400).json({ error: message });
    }
}

// Delete a team member
export const deleteTeamMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const teamMember = await TeamMember.findByIdAndDelete(id);
        if (!teamMember) {
            return res.status(404).json({ message: 'Team member not found' });
        }
        res.json({ message: 'Team member deleted successfully' });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: message });
    }
}