# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Generate data:** `node generate_data.js` (creates/regenerates `food_data.json` with 5,000 synthetic food items)
- **Run the app:** `node index.js` (entry point - currently empty)
- **Install deps:** `npm install`
- **Run ChromaDB:** `docker compose up -d`
- **Stop ChromaDB:** `docker compose down`
- **Test:** `npm test` (placeholder - configure a real test runner)

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Database:** ChromaDB (Running in Docker at `localhost:8000`)
- **Embeddings:** OpenAI `text-embedding-3-small` (1536 dimensions)
- **Data:** 5,000 synthetic food items in `food_data.json`
- **PDF parsing:** `pdf-parse` (future recipe PDF ingestion)

## Project Structure

```
index.js              # App entry point (Recommendation Engine)
openai_embedder.js    # OpenAI embedding module (Batch support)
generate_data.js      # Synthetic dataset generator
import_data.js        # Script to batch-import 5,000 items to ChromaDB
food_data.json        # Generated dataset (5,000 food items)
package.json          # Project config & dependencies
```

## Architecture

The project is in early development. The planned architecture based on dependencies:

1. **Data layer:** `food_data.json` provides seed data with 5,000 food items (id, name, description, ingredients, cuisine, category, dietary tags)
2. **Embeddings:** `@xenova/transformers` generates vector embeddings for food items (semantic search on descriptions/ingredients)
3. **Vector DB:** ChromaDB stores and queries embeddings via similarity search
4. **Recommendation logic:** To be implemented in `index.js` - query ChromaDB for similar items given user preferences
5. **File import:** `pdf-parse` for future recipe PDF ingestion

## Learning Path & Progress

Teaching pattern: **Concept → Tool → Code → Run → Reflect**

### Phase 1: Data Foundations (✅ Completed)
- Step 1 — Fix data quality (dietary tag contradictions) ✅
- Step 2 — Understand embeddings conceptually ✅

### Phase 2: Embeddings (✅ Completed)
- Step 3 — Generate real embeddings (Local/OpenAI) ✅
- Step 4 — Explore embedding vectors, similarity ✅

### Phase 3: Vector Database (✅ Completed)
- Step 5 — Set up ChromaDB, store embeddings ✅
- Step 6 — Query: find similar foods ✅
- Step 7 — Filter + semantic search combined ✅

### Phase 4: Recommendation Engine (🟡 In Progress)
- Step 8 — Build core logic in index.js
- Step 9 — Handle user preferences input

### Phase 5: Full Stack (⬜ Not Started)
- Step 10 — API layer (Express)
- Step 11 — Simple frontend (HTML/JS or React)
- Step 12 — Polish & deploy

### Phase 6: Stretch (⬜ Not Started)
- Step 13 — PDF recipe import

**Current step:** 8

## Important Notes

- Data generator enforces dietary tag integrity — ingredients match their tag (fixed in Step 1)
- Not a git repository (no `.git`); consider `git init` when starting version control
- No test framework, linter, or formatter configured
