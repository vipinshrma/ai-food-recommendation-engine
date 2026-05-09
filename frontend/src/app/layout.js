import "./globals.css";

export const metadata = {
  title: "FoodieAI | Intelligent Food Recommendations",
  description: "AI-powered semantic search across 9,000+ curated ingredients.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
