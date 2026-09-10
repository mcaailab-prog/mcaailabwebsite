import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set in environment');

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const Event = require('../src/app/api/models/Event').Event;

  const slug = 'pan-african-sign-language-policy-advocacy-webinar-2026';
  const startDate = new Date('2026-09-03T11:00:00Z'); // 2:00 PM EAT == 11:00 UTC

  const body = `
<p>Policy and advocacy are essential to ensuring that <a href="https://www.linkedin.com/search/results/all/?keywords=%23african&origin=HASH_TAG_FROM_FEED">#African</a> <a href="https://www.linkedin.com/search/results/all/?keywords=%23sign&origin=HASH_TAG_FROM_FEED">#Sign</a> <a href="https://www.linkedin.com/search/results/all/?keywords=%23languages&origin=HASH_TAG_FROM_FEED">#Languages</a> are recognized, protected, and meaningfully included in education, digital technologies, and national development frameworks.</p>

<p>Join Session 3 of the <strong>#Pan-African Sign Language Convening Webinar</strong> as Deaf and hard-of-hearing communities, advocates, policymakers, researchers, educators, innovators, OPDs, funders, and development partners come together to discuss how stronger policies and coordinated advocacy can advance the inclusion of African Sign Languages across the continent.</p>

<h3>Session focus</h3>
<ul>
  <li>Recognition of African Sign Languages in national legislation and disability frameworks</li>
  <li>Inclusion in education and digital technologies</li>
  <li>Role of advocates and institutions, and policy/funding/implementation challenges</li>
</ul>

<p><strong>Date:</strong> Thursday, 3 September 2026<br/>
<strong>Time:</strong> 2:00 PM – 3:00 PM EAT | 1:00 PM – 2:00 PM CAT | 12:00 PM – 1:00 PM WAT | 11:00 AM – 12:00 PM GMT<br/>
<strong>Format:</strong> Virtual<br/>
<strong>Register by 2 September 2026:</strong> <a href="https://bit.ly/4yadUTA">https://bit.ly/4yadUTA</a></p>

<p>Participants requiring accessibility support are encouraged to indicate their needs during registration.</p>

<p><strong>Organisers / partners:</strong> Maseno Centre for Applied Artificial Intelligence (MCAAI), Assistive Technologies for Disability Trust, Next Step Foundation, Responsible AI Lab (RAIL), Lilian D. A. Wanzare, PhD; Dr. Emmy Chirchir (PhD) MBS; Artificial Intelligence for Development (AI4D).</p>

<p>Together, we can strengthen advocacy, influence policy, and help build a more inclusive future where African Sign Languages are recognized, represented, and supported across education, technology, and society.</p>
`;

  const doc = {
    title: 'Pan‑African Sign Language Policy & Advocacy — Session 3 (Webinar)',
    slug,
    category: 'webinar',
    summary: 'Policy and advocacy to advance recognition and inclusion of African Sign Languages.',
    cover_image: 'https://res.cloudinary.com/daecietav/image/upload/v1788766906/Gemini_Generated_Image_9w9a4q9w9a4q9w9a_ncqdpk.jpg',
    body,
    start_date: startDate,
    end_date: new Date(startDate.getTime() + 60 * 60 * 1000),
    location: 'Virtual',
    is_online: true,
    status: 'upcoming',
    is_featured: true,
  };

  const res = await Event.findOneAndUpdate({ slug }, doc, { upsert: true, new: true, setDefaultsOnInsert: true });
  console.log('Upserted event:', res.slug, res._id?.toString());

  await mongoose.disconnect();
  console.log('Disconnected. Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
