# CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

- **Dev**: `npm run dev` (or `next dev`) - Start development server
- **Build**: `npm run build` (or `next build`) - Build the application
- **Start**: `npm run start` (or `next start`) - Start production server
- **Lint**: `npm run lint` - Run ESLint code analysis
- **Seed**: `npm run seed` - Seed the database

## Testing

Check for test scripts in package.json. If none exist, implement basic tests using Jest or React Testing Library. Look for test configuration in `jest.config.js` or similar files.

## Project Architecture

This is a Next.js application (version 16.1.6) using a typical file structure:

- **`src/app/`** - Contains the app directory with pages, layouts, and components using App Router
- **`src/components/`** - Reusable UI components organized by feature or domain
- **`src/features/`** - Feature-specific modules with their own components, hooks, and logic
- **`src/lib/`** - Utility functions and shared libraries across the application
- **`src/app/api/`** - API routes and server-side logic
- **`public/`** - Static assets including images, stylesheets, and configuration files
- **`next.config.ts`** - Next.js configuration file for customizations
- **`tailwind.config.ts`** - Tailwind CSS configuration file

**Typical Data Flow:**
1. Client-side React components request data or trigger actions
2. API routes handle server-side logic and database interactions
3. Authentication flows with MongoDB/Mongoose and possibly NextAuth
4. Client receives responses and updates UI accordingly

## Next Steps

1. Verify test setup and add tests if needed
2. Review documentation in README.md for specific instructions
3. Examine source code in `src/` to understand current architecture
4. Start development with `npm run dev`
5. Build for production with `npm run build`
6. Run linting with `npm run lint`

## Important Notes

- Always start development server before making major changes (`npm run dev`)
- Check git status frequently to track changes
- Maintain clear component boundaries and responsibilities
- Follow TypeScript patterns and maintain type safety
- Ensure tests pass before committing changes
- Use version control for all modifications