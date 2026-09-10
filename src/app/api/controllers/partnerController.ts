import { Request, Response } from 'express';
import { Partner } from '@/app/api/models/Partner';

// Get all partners with optional filtering
export const getPartners = async (req: Request, res: Response) => {
  try {
    const { partner_type } = req.query;
    const filter: any = {};

    if (partner_type) filter.partner_type = partner_type;

    const partners = await Partner.find(filter)
      .sort({ order: 1, name: 1 });

    res.json(partners);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new partner
export const createPartner = async (req: Request, res: Response) => {
  try {
    const partner = new Partner(req.body);
    await partner.save();
    res.status(201).json(partner);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};