import { Utensils } from 'lucide-react'
import SearchInterface from '@/components/SearchInterface'

// SEO Metadata for Server Rendering
export const metadata = {
  title: "FoodieAI | Intelligent Food Discovery & Recommendations",
  description: "Explore 9,000+ curated ingredients with AI-powered semantic search. Find high-protein, low-carb, and healthy food options instantly.",
  keywords: ["food recommendation", "AI nutrition", "healthy ingredients", "semantic food search", "high protein snacks"],
  openGraph: {
    title: "FoodieAI | Intelligent Food Discovery",
    description: "Discover your next favorite meal with AI-powered semantic search.",
    images: [{ url: '/hero.png' }],
  },
}



export default async function Home() {
  let initialResults = [];
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    const res = await fetch(`${backendUrl}/api/search?q=healthy%20high%20protein%20snacks`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    const data = await res.json();
    if (data.success) {
      initialResults = data.results.slice(0, 6);
    }
  } catch (error) {
    console.error("Home SSR fetch failed:", error.message);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Navbar - Rendered on Server */}
      <nav className="flex justify-between items-center mb-16">
        <div className="flex items-center gap-3 text-2xl font-bold tracking-tight">
          <Utensils className="text-food-accent" size={32} />
          <span>Foodie<span className="text-food-accent">AI</span></span>
        </div>
      </nav>

      <main className="flex flex-col items-center gap-8">
        {/* Hero Section - Rendered on Server */}
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Discover your next <span className="text-food-accent block">favorite meal</span>
          </h1>
          <p className="text-xl text-slate-400">Experience AI-powered semantic search across 9,000+ curated ingredients.</p>
        </div>

        {/* Interactive Search Interface - Client Component with Initial Data */}
        <SearchInterface initialResults={initialResults} />
        
        {/* Empty State / Footer rendered on server */}
        {initialResults.length === 0 && (
          <div className="mt-24 flex flex-col items-center gap-4 text-slate-500 opacity-20">
            <Utensils size={64} />
            <p className="text-lg font-medium">Ready to explore 9,000+ ingredients?</p>
          </div>
        )}
      </main>
      
      {/* Hidden SEO content for crawlers */}
      <section className="sr-only">
        <h2>AI Food Database</h2>
        <p>Our database contains thousands of ingredients including nutritional data like calories, protein, and fat.</p>
        <ul>
          {initialResults.map(item => (
            <li key={item.id}>{item.text}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
