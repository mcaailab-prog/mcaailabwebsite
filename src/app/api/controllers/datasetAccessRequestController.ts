import { Request, Response } from 'express';
import { DatasetAccessRequest } from '@/app/api/models/DatasetAccessRequest';
import type { IDataset } from '@/app/api/models/Dataset';
import nodemailer from 'nodemailer';

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT!),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Get all dataset access requests with population
export const getDatasetAccessRequests = async (req: Request, res: Response) => {
  try {
    const requests = await DatasetAccessRequest.find()
      .sort({ submittedAt: -1 })
      .populate('dataset');

    res.json(requests);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};

// Create a new dataset access request (public endpoint)
export const createDatasetAccessRequest = async (req: Request, res: Response) => {
  try {
    const request = new DatasetAccessRequest(req.body);
    await request.save();

    // Populate dataset for email
    await request.populate('dataset');
    const dataset = request.dataset as unknown as IDataset;

    // Send email notification
    try {
      await transporter.sendMail({
        from: `"MCAAI" <${process.env.EMAIL_FROM}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Dataset Access Request: ${dataset.name}`,
        html: `
          <h2>New Dataset Access Request</h2>
          <p><strong>Name:</strong> ${request.name}</p>
          <p><strong>Email:</strong> ${request.email}</p>
          <p><strong>Institution:</strong> ${request.institution || 'Not provided'}</p>
          <p><strong>Dataset:</strong> ${dataset.name}</p>
          <p><strong>Purpose:</strong> ${request.purpose}</p>
          <p><strong>Submitted:</strong> ${new Date(request.submittedAt).toLocaleString()}</p>
        `
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json(request);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};