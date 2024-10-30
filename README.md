#  Domain Management Application

![Screenshot of Domain Manager - Dark Mode](./domain-manager-dark-mode.png)
![Screenshot of Domain Manager - Light Mode](./domain-manager-light-mode.png)

Easily manage alk your domains, see when your domains were registered, when they’ll expire, their current DNS records, the domain registrar and more.

## Tech Stack

**Client:** React, React Router, SWR, Day.js

**Styling:** shadcn/ui, HeadlessUI, Tailwind

**Server:** Node, Express, Whoiser

**Database:** Postgres, Prisma

**Auth:** Clerk

**Tooling:** Vite, PostCSS, ESLint, Prettier

## Todo

Features:
- [ ] Store DNS records / SSL information in database
- [ ] Refetch data on a cron - every 6 or 24 hours.
- [ ] Show SSL certificate issuer

Code Structure:
- [ ] Look at ways to improve app structure, API design, client-side data fetching methods, caching etc.
- [ ] Implement React and Express "best practices"
