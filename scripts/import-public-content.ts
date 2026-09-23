import * as dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../src/app/api/utils/connectDB';
import { Project } from '../src/app/api/models/Project';
import { Collaboration } from '../src/app/api/models/Collaboration';
import { Innovation } from '../src/app/api/models/Innovation';
import { Dataset } from '../src/app/api/models/Dataset';
import {
  PUBLIC_PROJECT_SLUGS,
  importCollaboration,
  importDatasetLinks,
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

  for (const dataset of importDatasetLinks) {
    const updated = await Dataset.findOneAndUpdate(
      { slug: dataset.slug },
      { $set: { download_url: dataset.download_url } },
      { new: true },
    );
    console.log(updated ? `Updated dataset ${dataset.slug}` : `Skipped missing dataset ${dataset.slug}`);
  }

  const orgMatchers = [
    { pattern: /kencorpus|kenyan language corpus/i, download_url: 'https://huggingface.co/Kencorpus' },
    { pattern: /afrivoices|african next voices|\banv\b/i, download_url: 'https://huggingface.co/Anv-ke' },
    { pattern: /mcaa1|mcaai/i, download_url: 'https://huggingface.co/MCAA1-MSU' },
  ];

  const existingDatasets = await Dataset.find().lean();
  for (const record of existingDatasets) {
    if (record.download_url) continue;
    const haystack = `${record.slug} ${record.name}`;
    const match = orgMatchers.find((item) => item.pattern.test(haystack));
    if (!match) continue;
    await Dataset.updateOne({ _id: record._id }, { $set: { download_url: match.download_url } });
    console.log(`Filled empty download_url for ${record.slug}`);
  }

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
