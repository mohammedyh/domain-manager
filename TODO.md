Client:
- Organise functions that query the api a separate file like api.js for example
- See if it's possible to use useSWR in DomainInfoModal: https://github.com/vercel/swr/issues/254

Server:
- Store DNS records / SSL information in database
- Have DNS records / SSL information re-fetched on a cron (every 6 or 24 hours)
- Have a button to manually re-fetch DNS records / SSL information
