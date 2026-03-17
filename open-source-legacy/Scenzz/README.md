# SCENZ — AI Micro‑Mentor for Career Growth (Gen Z Career RPG)

A gamified career micro-mentor platform that helps Gen Z users level up their careers with AI-powered goals, challenges, and personalized coaching.

## Live Demo

- Production: https://scenzz-eyrdr7oit-arqam-jays-projects.vercel.app

## Features

- 🎯 **AI Goals & Roadmaps** - Generate personalized career roadmaps using AI
- ⚡ **Weekly Challenges** - Complete challenges, earn XP, and build streaks
- 📈 **Progress Tracking** - Badges, levels, and weekly wrapped-style recaps
- 📝 **Smart Notes** - AI-enhanced note-taking with summaries, flashcards, and action items
- 🎮 **Gamification** - XP system, levels, streaks, and achievements
- 🤖 **Mood-Based Coaching** - AI adapts its tone based on your current mood

## Tech Stack

- **Frontend**: Next.js 14+ (App Router) + TypeScript + TailwindCSS
- **Backend**: Supabase (Auth, PostgreSQL Database)
- **AI**: Google AI Studio (Gemini API)
- **State Management**: TanStack React Query
- **Rich Text**: @uiw/react-md-editor

## Prerequisites

- Node.js 20+
- Supabase project created ([supabase.com](https://supabase.com))
- Google AI Studio API key ([aistudio.google.com](https://aistudio.google.com))

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create `.env.local` from the example:

```bash
cp .env.example .env.local
```

Fill in your Supabase configuration values:
1. Go to your Supabase project settings
2. Copy the Project URL and anon/public key
3. Get your Google AI Studio API key from [aistudio.google.com](https://aistudio.google.com)

Your `.env.local` should look like:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GOOGLE_AI_STUDIO_API_KEY=your-google-ai-key
```

### 3. Set Up Database Schema

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  last_active_date TIMESTAMPTZ,
  mood TEXT DEFAULT 'neutral'
);

-- Goals table
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  target_date TIMESTAMPTZ,
  roadmap JSONB
);

-- Challenges table
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  week_number INTEGER
);

-- Notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  tags TEXT[],
  ai_summary TEXT,
  flashcards JSONB,
  action_items TEXT[]
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own goals" ON goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own goals" ON goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON goals FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own challenges" ON challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own challenges" ON challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own challenges" ON challenges FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notes" ON notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own notes" ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON notes FOR DELETE USING (auth.uid() = user_id);
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
scenz/
├── src/
│   ├── app/
│   │   ├── api/               # Next.js API routes (AI functions)
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Main app pages
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   └── lib/                   # Utilities, Supabase config, types
├── .env.local                 # Environment variables (not in git)
├── .env.example               # Example environment file
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Security Notes

⚠️ **Important Security Practices:**

- ✅ Google AI Studio API key stored server-side only (in API routes)
- ✅ All AI calls go through Next.js API routes (never from frontend)
- ✅ No API keys in frontend code
- ✅ Supabase Row Level Security (RLS) enforces user-based access control
- ✅ Authentication required for all protected routes

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
   - `GOOGLE_AI_STUDIO_API_KEY`
4. Deploy

## Features Roadmap

- [x] User authentication (email/password)
- [x] AI-powered goal roadmap generation
- [x] Weekly challenges system
- [x] AI note enhancement (summaries, flashcards)
- [x] XP and leveling system
- [ ] Weekly digest generation
- [ ] Badge system implementation
- [ ] Mood-based coaching tone
- [ ] Social features (share progress)
- [ ] Mobile app (React Native)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for Gen Z career growth
