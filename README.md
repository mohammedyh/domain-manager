# DomainHive - Domain Management Application

![Screenshot of DomainHive - Dark Mode](./domain-manager-dark-mode.png)
![Screenshot of DomainHive - Light Mode](./domain-manager-light-mode.png)

DomainHive effortlessly helps you manage your domains. You can view when your domains were registered, when they’ll expire, current DNS records, the domain registrar and more.

## Tech Stack

**Client:** React, React Router, SWR, Day.js

**Styling:** shadcn/ui, HeadlessUI, Tailwind

**Server:** Node, Express, Whoiser

**Database:** Postgres, Prisma

**Auth:** Clerk

**Tooling:** Vite, PostCSS, ESLint, Prettier, lint-staged

## Todo

Features:
- [ ] Store DNS records / SSL information in database
- [ ] Refetch data on a cron - every 6 or 24 hours.
- [ ] Show SSL certificate issuer

Code Structure:
- [ ] Look at ways to improve app structure, API design, client-side data fetching methods, caching etc.
- [ ] Implement React and Express "best practices"
