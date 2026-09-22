import { Request, Response } from 'express';
import { ContactSubmission } from '@/app/api/models/ContactSubmission';
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

// Get all contact submissions
export const getContactSubmissions = async (req: Request, res: Response) => {
  try {
    const submissions = await ContactSubmission.find()
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};

// Create a new contact submission (public endpoint)
export const createContactSubmission = async (req: Request, res: Response) => {
  try {
    const submission = new ContactSubmission(req.body);
    await submission.save();

    // Send email notification
    try {
      await transporter.sendMail({
        from: `"MCAAI Contact Form" <${process.env.EMAIL_FROM}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Contact Form Submission: ${submission.subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${submission.name}</p>
          <p><strong>Email:</strong> ${submission.email}</p>
          <p><strong>Subject:</strong> ${submission.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${submission.message}</p>
          <p><strong>Submitted:</strong> ${new Date(submission.submittedAt).toLocaleString()}</p>
        `
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the submission if email fails
    }

    res.status(201).json(submission);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};