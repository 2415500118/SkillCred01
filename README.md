# CityCraft Itinerary - AI-Powered Travel Planner

A modern, AI-powered travel planning application built with React, TypeScript, and Supabase. Create personalized travel itineraries with real-time accommodation, transportation, and restaurant recommendations.

## Features

- 🚀 **AI-Powered Itinerary Generation** - Create detailed travel plans using Google Gemini AI
- 🏨 **Real Hotel Data** - Integration with Makcorps API for live accommodation prices
- 🍽️ **Restaurant Recommendations** - Discover local dining options with ratings and prices
- 🚕 **Transportation Options** - Compare taxi, ride-share, and rental car services
- 🔐 **User Authentication** - Secure login with Supabase Auth
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- 🎨 **Modern UI Components** - Built with shadcn/ui and Tailwind CSS

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Edge Functions)
- **AI**: Google Gemini API
- **APIs**: Makcorps (Hotels), Custom API Service
- **State Management**: React Hooks, React Query
- **Routing**: React Router DOM

## Prerequisites

- Node.js 18+ or Bun
- Supabase account
- Google Gemini API key
- Makcorps API key (optional, for live hotel data)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd citycraft-itinerary-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Makcorps API (Optional - for live hotel data)
   VITE_MAKCORPS_API_KEY=your_makcorps_api_key

   # Google Gemini API
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the migrations in `supabase/migrations/`
   - Update the Supabase URL and keys in `src/config/env.ts`

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

## API Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the database migrations:
   ```sql
   -- Enable UUID extension
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   
   -- Create profiles table
   -- (See supabase/migrations/ for complete setup)
   ```
3. Update the client configuration in `src/integrations/supabase/client.ts`

### Makcorps API (Hotels)
- Sign up at [Makcorps](https://makcorps.com)
- Get your API key
- The application will automatically use fallback data if the API is unavailable

### Google Gemini API
- Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Used for generating personalized travel itineraries

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── AccommodationSection.tsx
│   ├── RestaurantSection.tsx
│   ├── TransportationSection.tsx
│   └── TravelPlanner.tsx
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/      # Supabase client and types
├── pages/              # Page components
├── services/           # API services
└── config/             # Configuration files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

## Troubleshooting

### Common Issues

1. **Supabase connection errors**
   - Verify your Supabase URL and API keys
   - Check if your Supabase project is active

2. **API key errors**
   - Ensure all required API keys are set in environment variables
   - Check API quotas and limits

3. **Build errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check TypeScript configuration

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Review [Google Gemini API docs](https://ai.google.dev/docs)
- Open an issue in this repository

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Supabase](https://supabase.com/) for backend services
- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) for styling
# SkillCred01
