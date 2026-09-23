import * as dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../src/app/api/utils/connectDB';
import { TeamMember } from '../src/app/api/models/TeamMember';

async function run() {
  const ok = await connectDB();
  if (!ok) {
    throw new Error('Could not connect to MongoDB');
  }

  const result = await TeamMember.deleteMany({
    title: { $regex: /^\s*collaborator\s*$/i },
  });

  console.log(`Deleted ${result.deletedCount} publication Collaborator team records`);
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
