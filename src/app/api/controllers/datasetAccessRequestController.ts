import { Request, Response } from 'express';
import { DatasetAccessRequest } from '@/app/api/models/DatasetAccessRequest';
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new dataset access request (public endpoint)
export const createDatasetAccessRequest = async (req: Request, res: Response) => {
  try {
    const request = new DatasetAccessRequest(req.body);
    await request.save();

    // Populate dataset for email
    await request.populate('dataset');

    // Send email notification
    try {
      await transporter.sendMail({
        from: `"MCAAI" <${process.env.EMAIL_FROM}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Dataset Access Request: ${(request.dataset as any).name}`,
        html: `
          <h2>New Dataset Access Request</h2>
          <p><strong>Name:</strong> ${request.name}</p>
          <p><strong>Email:</strong> ${request.email}</p>
          <p><strong>Institution:</strong> ${request.institution || 'Not provided'}</p>
          <p><strong>Dataset:</strong> ${(request.dataset as any).name}</p>
          <p><strong>Purpose:</strong> ${request.purpose}</p>
          <p><strong>Submitted:</strong> ${new Date(request.submittedAt).toLocaleString()}</p>
        `
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json(request);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};