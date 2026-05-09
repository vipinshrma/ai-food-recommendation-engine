# CLAUDE.md: AI Food Recommendation Engine

## 🚀 Commands

### Backend (Root)
- **Install Backend:** `npm install`
- **Run Server:** `node server.js` (API lives at `localhost:3000`)
- **Import Data:** `node import_data.js` (Syncs `food_data.json` to ChromaDB)
- **Convert CSV:** `node convert_csv_to_json.js` (CSV -> JSON)
- **Run ChromaDB:** `docker compose up -d`

### Frontend (`/frontend`)
- **Install Frontend:** `cd frontend && npm install`
- **Dev Server:** `npm run dev` (UI lives at `localhost:5173`)
- **Build UI:** `npm run build`

## 🛠 Tech Stack
- **Core:** Node.js (ESM), React, Vite 6
- **Styling:** Tailwind CSS v4 (Glassmorphism theme)
- **Vector DB:** ChromaDB (Port 8000)
- **Embeddings:** OpenAI `text-embedding-3-small` (1536 dims, Cosine Similarity)
- **Animations:** Framer Motion
- **Icons:** Lucide React

## 📁 Project Structure
```text
.
├── server.js               # Express API entry point
├── index.js                # Core Search & Logic logic
├── import_data.js          # Batch import script for ChromaDB
├── convert_csv_to_json.js  # CSV data transformer
├── openai_embedder.js      # OpenAI embedding & guardrail wrapper
├── food_data.json          # Main dataset (9,318 items)
├── PROGRESS.md             # Development roadmap & history
└── frontend/
    ├── src/
    │   ├── App.jsx         # Main UI Logic & Detail Modals
    │   └── index.css       # Tailwind v4 configuration & tokens
    └── vite.config.js      # Vite 6 + Tailwind plugin config
```

## 📝 Design Standards
- **Aesthetics:** Culinary Glassmorphism (Vibrant orange accents, dark mode, blur effects).
- **Scoring:** Uses Cosine Similarity (Confidence = `1 - distance`).
- **Safety:** Intent-aware guardrails via OpenAI `gpt-4o-mini`.
- **UI:** Responsive grid, skeleton loaders, and pulsing micro-animations.
