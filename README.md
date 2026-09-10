# MCAAI Web

MCAAI Web is the public-facing website for the Maseno Centre for Applied Artificial Intelligence (MCAAI). It is built with Next.js and provides content-driven pages for research, projects, publications, datasets, events, partnerships, team profiles, and contact workflows.

This repository is intended for developers who need to run the app locally, understand the architecture, and contribute new features or content.

## Overview

- Frontend framework: Next.js 16
- UI: React 19 + TypeScript + Tailwind CSS
- Data layer: MongoDB + Mongoose
- Media storage: Cloudinary
- Email delivery: Nodemailer
- App routing: Next.js App Router

## Project Structure

```text
mcaai-web/
├── src/
│   ├── app/
│   │   ├── api/              # API routes and server-side logic
│   │   ├── about/            # About page
│   │   ├── contact/          # Contact page
│   │   ├── datasets/         # Dataset listings and request flows
│   │   ├── events/           # Events pages
│   │   ├── innovations/      # Innovation pages
│   │   ├── news/             # News pages
│   │   ├── partners/         # Partner pages
│   │   ├── projects/         # Project pages
│   │   ├── publications/     # Publication pages
│   │   ├── quarterly-reports/
│   │   ├── research/         # Research pages
│   │   ├── search/           # Search view
│   │   ├── team/             # Team profile pages
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/          # Reusable UI blocks and forms
│   ├── lib/                 # Shared utilities, API types, helpers
│   └── data/
├── scripts/
│   └── seed.ts              # Sample data seeding script
├── public/                  # Static files
├── .env                     # Local environment config (if present)
├── package.json             # Scripts and dependencies
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── README.md
└── CLAUDE.md               # Additional contributor guidance
```

## Prerequisites

Before running the project, ensure you have:

- Node.js 20 or newer
- npm
- A MongoDB connection string
- Cloudinary credentials for image uploads
- SMTP email credentials if you want contact and request forms to send mail

## Local Setup

1.Open a terminal in the project root:

```bash
cd /path/to/mcaai-web
```

2.Install dependencies:

```bash
npm install
```

3.Create a local environment file named `.env.local` or `.env` in the project root.

Example:

```env

```

> The app reads environment variables from `process.env` in the server-side code. If you are missing some values, some features may fail or log warnings until they are configured.

## Run the Application

Development mode:

```bash
npm run dev
```

Then visit:

```text
http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

Lint checks:

```bash
npm run lint
```

## Useful Scripts

```bash
npm run dev      # Start the local development server
npm run build    # Create a production build
npm run start    # Serve the production build locally
npm run lint     # Run ESLint validation
npm run seed     # Run database seeding script
```

## Database and Data Model Notes

The app uses MongoDB via Mongoose and loads models from `src/app/api/models`. The database connection helper is in `src/app/api/utils/connectDB.ts`.

Key responsibilities:

- Connect to MongoDB with retry handling
- Register all schemas before usage
- Provide server-side APIs for content and form submissions

If you add a new model or API route, keep the pattern consistent with the existing files under `src/app/api/models` and `src/app/api/controllers`.

## API and Content Workflow

Most site content is served through Next.js App Router pages and API routes.

Common patterns:

- Page components live under `src/app/.../page.tsx`
- Reusable UI sits in `src/components/`
- Shared types and helpers live in `src/lib/`
- Server-side logic and Mongo access live in `src/app/api/`

This structure keeps content pages, reusable UI, and backend logic separated while allowing a single Next.js app to power the full site.

## Contribution Guidelines

### 1. Create a feature branch

```bash
git checkout -b feature/your-change
```

### 2. Keep changes focused

Make small, clear commits for a single concern such as:

- a new page
- API route changes
- form validation
- data model updates
- styling adjustments

### 3. Follow project conventions

- Prefer TypeScript and existing patterns used in the project
- Keep component naming consistent with the folder structure
- Reuse shared components where appropriate
- Avoid duplicating logic across pages
- Keep API responses and database models predictable

### 4. Run checks before submitting

```bash
npm run lint
npm run build
```

### 5. Validate environment-dependent features

If your work touches:

- MongoDB-backed pages
- email forms
- Cloudinary uploads
- page data fetching

then test those features with the required environment variables loaded.

## Recommended Development Flow

1.Start the server:

```bash
npm run dev
```

2.Open the local site in the browser.

3.Update the relevant page/component in `src/app` or `src/components`.

4.If needed, extend or query the connected Mongo models.

5.Validate with lint/build checks before opening a PR.

## Deployment Notes

This project is a standard Next.js web app and can be deployed to any platform that supports Node.js applications, such as Vercel, Railway, Render, or a custom Node server.

Before deployment, make sure the following are configured in the deployment environment:

- `MONGODB_URI`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_FROM`
- `ADMIN_EMAIL`

## Troubleshooting

### App fails to connect to MongoDB

Check that:

- `MONGODB_URI` is present in your environment
- the connection string is valid
- your MongoDB cluster allows connections from your host

### Image upload fails

Check Cloudinary credentials and ensure the environment variables are populated correctly.

### Contact or access-request emails are not sending

Confirm SMTP credentials and verify that `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, and `EMAIL_PASS` are correct.

## Helpful References

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)

## License

This project does not currently declare a license in the repository. If you are contributing to a production or institutional deployment, confirm the licensing requirements with the project owner before shipping or redistributing the code.
