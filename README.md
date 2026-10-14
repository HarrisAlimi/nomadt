# Nomad — Travel Deals

A clean, editorial-style travel deals site for flights, hotels and vacation rentals.

## Features

- ✈️ Flight, 🏨 hotel and 🏠 vacation-rental deal pages with featured picks
- 📧 Email signup for deal alerts (stored in Supabase)
- 🛠️ `/admin` dashboard to add, edit, toggle and auto-generate deals
- 🔌 Optional Amadeus API integration for live flight prices
- 📱 Fully responsive, built with Next.js and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your own Supabase (and optionally Amadeus) keys.

### ⚠️ Security Note

This is a hobby project and is not production-hardened:
- The `/admin` page has **no authentication**.
- `supabase-setup.sql` creates development policies that give the public anon key full read/write access to every table, including `subscribers`.

Before deploying publicly, add auth to `/admin` and tighten the Supabase RLS policies.

## Deployment (FREE!)

### Deploy to Vercel (Recommended - 100% Free)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Connect your GitHub repo
5. Click Deploy - done! ✨

Vercel will give you a free domain like `your-site.vercel.app` and handle all hosting, SSL, and CDN for free.

### Deploy to Netlify (Alternative - Also Free)

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect GitHub and select your repo
5. Deploy!

## Updating Deals

- **With Supabase:** run `supabase-setup.sql` in your Supabase SQL editor, then manage deals from `/admin`.
- **Without Supabase:** the site shows the example deals in `app/lib/sampleDeals.ts`. Edit that file to change them.

## Next Steps to Add Real Automation

### 1. Email Integration (Free Tier)

**Mailchimp** (free up to 500 subscribers):
- Sign up at mailchimp.com
- Get your API key
- Use their API to save email addresses

**Or Resend** (3,000 emails/month free):
- Better for developers
- Sign up at resend.com
- Install: `npm install resend`

### 2. Price Tracking

When you're ready to automate:
- Use Amadeus API (2,000 free calls/month)
- Add Supabase for database (free tier)
- Set up daily cron jobs to check prices
- Store historical data to detect deals

### 3. Add a CMS (Optional)

Instead of editing code, use a free CMS:
- **Sanity.io** - free tier, nice admin interface
- **Contentful** - free tier available
- Makes it easy to update deals without touching code

## Cost Breakdown

- **Hosting (Vercel/Netlify)**: $0/month
- **Domain (optional)**: $10-15/year
- **Email (Mailchimp)**: $0/month (up to 500 subscribers)
- **Everything else**: $0

**Total: $0/month** 🎉

## Customization

- **Colors and fonts:** design tokens (`ink`, `paper`, `sand`, `accent`, `pine`) live in `tailwind.config.js`; fonts are set in `app/layout.tsx`.
- **Shared UI:** header, footer, hero, signup form and deal cards are in `app/components/`.
- **Site name and metadata:** `app/layout.tsx` and the `Wordmark` in `app/components/Header.tsx`.

## Tips for Growing

1. **Start manual**: Post 3-5 deals per day you find manually
2. **Build audience**: Share on Reddit (r/travel, r/flights), Twitter, Facebook groups
3. **Validate demand**: Get to 100+ email subscribers before automating
4. **Then automate**: Once you know people want it, invest time in API integration

## Support

Questions? Issues? Open an issue on GitHub or reach out!

---

Built with ❤️ for budget travelers
