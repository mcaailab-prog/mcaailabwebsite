import { NextRequest, NextResponse } from 'next/server';
import { connectDB, checkDBConnection } from '@/app/api/utils/connectDB';
import { NewsletterSubscriber } from '@/app/api/models/NewsletterSubscriber';
import { isValidNewsletterEmail, normalizeNewsletterEmail } from '@/lib/newsletter';

export async function GET() {
  const isConnected = await checkDBConnection();
  if (!isConnected) {
    const connectSuccess = await connectDB();
    if (!connectSuccess) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
  }

  try {
    const subscribers = await NewsletterSubscriber.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(JSON.parse(JSON.stringify(subscribers)));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const isConnected = await checkDBConnection();
  if (!isConnected) {
    const connectSuccess = await connectDB();
    if (!connectSuccess) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
  }

  try {
    const body = await request.json().catch(() => ({}));
    const email = normalizeNewsletterEmail(String(body?.email ?? ''));

    if (!isValidNewsletterEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const existingSubscriber = (await NewsletterSubscriber.findOne({ email }).lean()) as 
      | { _id: unknown; status?: 'active' | 'unsubscribed'; source?: string }
      | null;

    if (existingSubscriber) {
      if (existingSubscriber.status === 'unsubscribed') {
        await NewsletterSubscriber.updateOne(
          { _id: existingSubscriber._id },
          { $set: { status: 'active', source: String(body?.source ?? 'site-footer') } }
        );
      }

      return NextResponse.json(
        { message: 'You are already subscribed to our newsletter.', subscribed: true },
        { status: 200 }
      );
    }

    const subscriber = new NewsletterSubscriber({
      email,
      source: String(body?.source ?? 'site-footer'),
      status: 'active',
    });

    await subscriber.save();

    return NextResponse.json(
      { message: 'Thanks for subscribing to our newsletter.', subscribed: true },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
}
