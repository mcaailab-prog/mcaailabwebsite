import * as dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../src/app/api/utils/connectDB';
import { Project } from '../src/app/api/models/Project';
import { Collaboration } from '../src/app/api/models/Collaboration';
import { Innovation } from '../src/app/api/models/Innovation';
import {
  PUBLIC_PROJECT_SLUGS,
  importCollaboration,
  importInnovations,
  importProjects,
} from '../src/content/site-import';

async function run() {
  const ok = await connectDB();
  if (!ok) {
    throw new Error('Could not connect to MongoDB');
  }

  await Project.updateMany(
    { slug: { $nin: PUBLIC_PROJECT_SLUGS } },
    { $set: { is_published: false } },
  );

  for (const project of importProjects) {
    await Project.findOneAndUpdate(
      { slug: project.slug },
      {
        ...project,
        cover_image: '',
        is_published: true,
        start_date: project.start_date ? new Date(project.start_date) : undefined,
        end_date: project.end_date ? new Date(project.end_date) : undefined,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    console.log(`Upserted project ${project.slug}`);
  }

  await Collaboration.findOneAndUpdate(
    { slug: importCollaboration.slug },
    importCollaboration,
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  console.log('Upserted collaboration haidi');

  for (const product of importInnovations) {
    await Innovation.findOneAndUpdate(
      { slug: product.slug },
      product,
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    console.log(`Upserted innovation ${product.slug}`);
  }

  console.log('Import complete');
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
