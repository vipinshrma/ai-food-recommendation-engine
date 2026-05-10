# FoodieAI - Intelligent Food Recommendation Engine

FoodieAI is a high-performance, full-stack food discovery engine that uses **Semantic Search** and **Generative AI** to help users find the perfect ingredients and meals.

![FoodieAI Banner](https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&q=80&w=2000)

## 🚀 Key Features

- **Semantic Search**: Uses OpenAI's `text-embedding-3-small` to understand the *meaning* of your search, not just keywords.
- **Chef's Recommendation**: Integrated **BART (distilbart-cnn-6-6)** model that summarizes search results into a cohesive meal suggestion.
- **LLM Guardrails**: Smart query validation to ensure only food-related searches are processed.
- **Premium UI**: Built with Next.js 15+, Tailwind CSS v4, and Framer Motion for a stunning, glassmorphism-based user experience.
- **High Performance**: Optimized backend with Express and ChromaDB vector storage.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS v4 (Pure)
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Server**: Node.js & Express
- **Vector Database**: ChromaDB
- **Embedding Model**: OpenAI `text-embedding-3-small`
- **Generative Model**: BART (via @xenova/transformers)

---

## 🏁 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- ChromaDB running locally (`docker-compose up -d`)
- OpenAI API Key

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your_key_here
BACKEND_URL=http://localhost:3000
```

### 3. Backend Setup (Port 3000)
```bash
# From the root directory
npm install
npm run start
```

### 4. Frontend Setup (Port 3001)
```bash
# Navigate to the frontend directory
cd frontend
npm install
npm run dev
```

---

## 🧠 AI Architecture

### Search Flow
1. **Validation**: OpenAI GPT-4o-mini checks if the query is food-related.
2. **Embedding**: The query is converted into a vector.
3. **Retrieval**: ChromaDB finds the top 20 most similar ingredients from the 9,000+ database.
4. **Summarization**: The **BART** model analyzes the top 3 results and generates a "Chef's Recommendation".

---

## 📂 Project Structure

```text
├── frontend/             # Next.js Application (Port 3001)
│   ├── src/app/          # App Router & Layouts
│   └── src/components/   # React Components
├── server.js             # Express API Server (Port 3000)
├── index.js              # Core Search Logic
├── bart_summarizer.js    # Local BART AI Pipeline
├── openai_embedder.js    # OpenAI Integration
└── .env                  # Secrets & Config
```

## 📜 License
ISC License
