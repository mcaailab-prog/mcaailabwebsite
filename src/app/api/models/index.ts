// Central models registration file.
// Importing this file ensures all Mongoose schemas are registered on the
// shared mongoose instance so `populate` and `model('Name')` work reliably
// in serverless or bundled environments.

import './ResearchArea';
import './TeamMember';
import './Partner';
import './Project';
import './Publication';
import './Dataset';
import './News';
import './Event';
import './QuarterlyReport';
import './Award';
import './SiteStat';
import './ContactSubmission';
import './DatasetAccessRequest';
import './Collaboration';
import './Innovation';
import './CareerTrack';
import './CareerApplication';

export { ResearchArea } from './ResearchArea';
export { TeamMember } from './TeamMember';
export { Partner } from './Partner';
export { Project } from './Project';
export { Publication } from './Publication';
export { Dataset } from './Dataset';
export { News } from './News';
export { Event } from './Event';
export { QuarterlyReport } from './QuarterlyReport';
export { Award } from './Award';
export { SiteStat } from './SiteStat';
export { ContactSubmission } from './ContactSubmission';
export { DatasetAccessRequest } from './DatasetAccessRequest';
export { Collaboration } from './Collaboration';
export { Innovation } from './Innovation';
export { CareerTrack } from './CareerTrack';
export { CareerApplication } from './CareerApplication';
