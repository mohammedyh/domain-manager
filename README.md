![Screenshot of DomainHive](https://raw.githubusercontent.com/mohammedyh/domain-manager/master/domainhive-new-design.png)

# DomainHive - Domain Management Application

DomainHive effortlessly helps you manage your domains. You can view when your domains were registered, when they’ll expire, current DNS records, the domain registrar and more.

## Old Design

![Screenshot of DomainHive Old Design](https://raw.githubusercontent.com/mohammedyh/domain-manager/master/domainhive-old-design.png)

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
- [ ] Have domain data refetched at an interval - every 6 or 24 hours. (Only makes sense to do when data is stored and retrieved from the database
- [x] Have a button in the domain modal to manually refetch DNS records / SSL information
- [x] Show confirmation modal when deleting domain
- [x] Indicate expiring domains and SSLs in table (maybe have an 'expiring' status)
- [x] Sort DNS records by their type
- [x] Add dark mode
- [x] Clean up dark mode styles
- [ ] Show SSL certificate issuer

Code Structure:
- [ ] Look at ways to improve app structure, API design, client-side data fetching methods, caching etc.
- [ ] Implement React and Express "best practices"

