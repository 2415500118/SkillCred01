// Environment configuration
export const config = {
  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "https://yyausgkchdcuoaotwfdc.supabase.co",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5YXVzZ2tjaGRjdW9hb3R3ZmRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NTY3ODksImV4cCI6MjA3MTAzMjc4OX0.9yYXwWwPaUwj7buGUkq5O627616Jqb82lZBDmx7_y20"
  },
  
  // Site Configuration - Auto-detect environment
  site: {
    url: (() => {
      // Check if we're in production (Netlify)
      if (typeof window !== 'undefined') {
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
          return window.location.origin;
        }
      }
      // Use localhost for development
      return import.meta.env.VITE_SITE_URL || "http://localhost:8081";
    })(),
    productionUrl: import.meta.env.VITE_PRODUCTION_URL || "https://your-site-name.netlify.app"
  },
  
  // Makcorps API Configuration
  makcorps: {
    apiKey: import.meta.env.VITE_MAKCORPS_API_KEY || "68a35ceeee2f869ff1da0384",
    baseUrl: "https://api.makcorps.com"
  },
  
  // Google Gemini API Configuration
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyBWwYMi3yyZ4zOGW-uiMUkCM8mnQQVtSg8",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
  }
};

