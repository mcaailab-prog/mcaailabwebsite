import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { ensureDb, asJson } from '@/app/api/_lib/db';
import { getAdminSession } from '@/lib/admin-request';
import { News } from '@/app/api/models/News';
import { Event } from '@/app/api/models/Event';
import { Project } from '@/app/api/models/Project';
import { ResearchArea } from '@/app/api/models/ResearchArea';
import { Collaboration } from '@/app/api/models/Collaboration';
import { Innovation } from '@/app/api/models/Innovation';
import { CareerTrack } from '@/app/api/models/CareerTrack';
import { CareerApplication } from '@/app/api/models/CareerApplication';
import { ContactSubmission } from '@/app/api/models/ContactSubmission';

export type ModelName =
  | 'News'
  | 'Event'
  | 'Project'
  | 'ResearchArea'
  | 'Collaboration'
  | 'Innovation'
  | 'CareerTrack'
  | 'CareerApplication'
  | 'ContactSubmission';

const models: Record<ModelName, mongoose.Model<mongoose.Document>> = {
  News: News as unknown as mongoose.Model<mongoose.Document>,
  Event: Event as unknown as mongoose.Model<mongoose.Document>,
  Project: Project as unknown as mongoose.Model<mongoose.Document>,
  ResearchArea: ResearchArea as unknown as mongoose.Model<mongoose.Document>,
  Collaboration: Collaboration as unknown as mongoose.Model<mongoose.Document>,
  Innovation: Innovation as unknown as mongoose.Model<mongoose.Document>,
  CareerTrack: CareerTrack as unknown as mongoose.Model<mongoose.Document>,
  CareerApplication: CareerApplication as unknown as mongoose.Model<mongoose.Document>,
  ContactSubmission: ContactSubmission as unknown as mongoose.Model<mongoose.Document>,
};

export async function listDocuments(
  request: NextRequest,
  modelName: ModelName,
  options?: {
    sort?: Record<string, 1 | -1>;
    publishedField?: string;
    populate?: string[];
  },
) {
  const dbError = await ensureDb();
  if (dbError) return dbError;

  try {
    const Model = models[modelName];
    const admin = await getAdminSession(request);
    const filter: Record<string, unknown> = {};
    if (options?.publishedField && !admin) {
      filter[options.publishedField] = true;
    }
    let query = Model.find(filter).sort(options?.sort || { createdAt: -1 });
    for (const path of options?.populate || []) {
      query = query.populate(path);
    }
    const docs = await query;
    return asJson(docs);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

export async function createDocument(request: NextRequest, modelName: ModelName) {
  const dbError = await ensureDb();
  if (dbError) return dbError;
  try {
    const Model = models[modelName];
    const body = await request.json();
    const doc = new Model(body);
    await doc.save();
    return asJson(doc, 201);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 },
    );
  }
}

export async function getDocument(id: string, modelName: ModelName, populate: string[] = []) {
  const dbError = await ensureDb();
  if (dbError) return dbError;
  try {
    const Model = models[modelName];
    let query = Model.findById(id);
    for (const path of populate) {
      query = query.populate(path);
    }
    const doc = await query;
    if (!doc) {
      return NextResponse.json({ error: `${modelName} not found` }, { status: 404 });
    }
    return asJson(doc);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

export async function updateDocument(request: NextRequest, id: string, modelName: ModelName) {
  const dbError = await ensureDb();
  if (dbError) return dbError;
  try {
    const Model = models[modelName];
    const body = await request.json();
    const doc = await Model.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!doc) {
      return NextResponse.json({ error: `${modelName} not found` }, { status: 404 });
    }
    return asJson(doc);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 },
    );
  }
}

export async function deleteDocument(id: string, modelName: ModelName) {
  const dbError = await ensureDb();
  if (dbError) return dbError;
  try {
    const Model = models[modelName];
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) {
      return NextResponse.json({ error: `${modelName} not found` }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
