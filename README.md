# Finance Tracker - Setup Instructions

## Prerequisites
- Node.js 18+ installed
- Supabase account

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Supabase

### Option A: Using Supabase Cloud
1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Once created, go to **Settings > API**
3. Copy your `Project URL` and `anon public` key

### Option B: Using Local Supabase (Optional)
```bash
npx supabase init
npx supabase start
```

## 3. Configure Environment Variables

1. Copy the example env file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/schema.sql`
4. Paste and run the SQL script

This will create:
- `income_sources` table
- `income_entries` table
- `payout_categories` table
- `payouts` table
- Necessary indexes and triggers
- Default payout categories (Savings, Parents, Pocket Money)

## 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 6. Verify Setup

You should see:
- ✅ Next.js app running
- ✅ No console errors
- ✅ Homepage displaying "Finance Tracker"

## Project Structure

```
finance-tracker/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Homepage
│   ├── lib/
│   │   ├── supabase/           # Supabase clients
│   │   │   ├── client.ts       # Browser client
│   │   │   └── server.ts       # Server client
│   │   └── utils.ts            # Utility functions
│   └── types/
│       └── supabase.ts         # Database types
├── supabase/
│   └── schema.sql              # Database schema
├── .env.local                  # Environment variables (create this)
├── .env.local.example          # Example env file
└── package.json
```

## Next Steps

Now you're ready to start building! Check the [PRD.md](PRD.md) for feature requirements and [CODING_RULES.md](CODING_RULES.md) for coding standards.

### Recommended Order:
1. Set up shadcn/ui components
2. Create income management pages
3. Create payout management pages
4. Build the dashboard
5. Add charts and analytics
