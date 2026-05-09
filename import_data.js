import fs from 'fs/promises';
import { ChromaClient } from 'chromadb';
import { getOpenAIBatchEmbeddings } from './openai_embedder.js';

async function importData() {
    console.log("🚀 Starting Food Data Import...");

    // 1. Initialize Clients
    const client = new ChromaClient({ host: "localhost", port: 8000 });

    // Reset the collection to start fresh with ingredient-aware vectors
    console.log("Deleting old collection...");
    try { await client.deleteCollection({ name: "food_collection_openai" }); } catch (e) { }

    const collection = await client.getOrCreateCollection({
        name: "food_collection_openai",
        embeddingFunction: null,
        metadata: { "hnsw:space": "cosine" },
        ef_construction: 200
    });

    // 2. Read the JSON file
    console.log("Reading food_data.json...");
    const rawData = await fs.readFile('./food_data.json', 'utf8');
    const foodItems = JSON.parse(rawData);
    const totalItems = foodItems.length;

    console.log(`Loaded ${totalItems} items. Starting batch processing...`);

    // 3. Configuration for Batching
    const BATCH_SIZE = 100; // Process 100 items at a time

    for (let i = 0; i < totalItems; i += BATCH_SIZE) {
        const chunk = foodItems.slice(i, i + BATCH_SIZE);

        // Prepare arrays for Chroma
        const ids = chunk.map(item => item.id);
        const documents = chunk.map(item => `${item.name}: ${item.description}. Ingredients: ${item.ingredients}`);
        const metadatas = chunk.map(item => ({
            ingredients: item.ingredients || "",
            cuisine: item.cuisine || "Unknown",
            category: item.category || "Unknown",
            dietary_tag: item.tag || "None"
        }));

        try {
            // Get batch embeddings from OpenAI
            console.log(`[${i}/${totalItems}] Generating embeddings for batch...`);
            const embeddings = await getOpenAIBatchEmbeddings(documents);

            // Upsert to Chroma
            await collection.upsert({
                ids: ids,
                embeddings: embeddings,
                documents: documents,
                metadatas: metadatas
            });

            console.log(`✅ Batch processed successfully. (${i + chunk.length}/${totalItems})`);
        } catch (error) {
            console.error(`❌ Error processing batch at index ${i}:`, error.message);
            // In a real app, you might want to retry or log this to a file
        }
    }

    console.log("\n✨ IMPORT COMPLETE!");
    const count = await collection.count();
    console.log(`Total items now in collection: ${count}`);
}

importData().catch(console.error);
