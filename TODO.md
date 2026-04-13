# Build and Setup Checklist

- [ ] Resolve local dependency or config conflicts if present
- [ ] Regenerate `package-lock.json` when dependencies change (`npm install`)
- [ ] Verify `vercel.json` is compatible with the Next.js and Prisma setup
- [ ] Confirm the Prisma schema is configured for PostgreSQL
- [ ] Install required Prisma packages if missing (`npm install prisma @prisma/client --save-dev`)
- [ ] Run the build locally and confirm it succeeds

Example setup command:
`npm install prisma @prisma/client --save-dev`
