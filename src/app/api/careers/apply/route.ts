import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { CareerApplication } from '@/app/api/models/CareerApplication';
import { ensureDb, asJson } from '@/app/api/_lib/db';

export async function POST(request: NextRequest) {
  const dbError = await ensureDb();
  if (dbError) return dbError;

  try {
    const body = await request.json();
    const application = new CareerApplication(body);
    await application.save();

    try {
      if (process.env.EMAIL_HOST && process.env.ADMIN_EMAIL) {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT || '587', 10),
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: `"MCAAI Careers" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
          to: process.env.ADMIN_EMAIL,
          subject: `Career application: ${application.track_name || 'General'} — ${application.first_name} ${application.last_name}`,
          html: `
            <h2>New career application</h2>
            <p><strong>Track:</strong> ${application.track_name || application.track_slug || 'General'}</p>
            <p><strong>Name:</strong> ${application.first_name} ${application.last_name}</p>
            <p><strong>Email:</strong> ${application.email}</p>
            <p><strong>Phone:</strong> ${application.phone || '—'}</p>
            <p><strong>Affiliation:</strong> ${application.affiliation || '—'}</p>
            <p><strong>Qualifications:</strong></p>
            <p>${application.qualifications || '—'}</p>
            <p><strong>Motivation:</strong></p>
            <p>${application.motivation}</p>
          `,
        });
      }
    } catch (emailError) {
      console.error('Career application email failed:', emailError);
    }

    return asJson(application, 201);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 },
    );
  }
}
