import fs from 'fs/promises';
import { ChromaClient } from 'chromadb';
import { getOpenAIBatchEmbeddings } from './openai_embedder.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Fetches the dataset from the remote source and imports it into ChromaDB.
 */
export async function updateDataset() {
    console.log("🚀 Starting Food Data Update Process...");

    const url = process.env.FOOD_DATASET_URL;
    if (!url) throw new Error("FOOD_DATASET_URL not found in .env file");

    try {
        // 1. Fetch Remote Dataset
        console.log(`Fetching latest data from: ${url}`);
        const response = await fetch(url);
        const text = await response.text();
        const arrayMatch = text.match(/const\s+foodItems\s*=\s*(\[[\s\S]*\]);?/);
        if (!arrayMatch) throw new Error("Could not find foodItems array in fetched script.");

        const foodItems = new Function(`return ${arrayMatch[1]}`)();
        console.log(`Successfully parsed ${foodItems.length} items.`);

        // 2. Cache locally to food_data.json
        await fs.writeFile('./food_data.json', JSON.stringify(foodItems, null, 2));
        console.log("✅ Local food_data.json updated.");

        // 3. Initialize Chroma Client
        const client = new ChromaClient({ host: "localhost", port: 8000 });

        console.log("Deleting old collection...");
        try { await client.deleteCollection({ name: "food_collection_openai" }); } catch (e) { }

        const collection = await client.getOrCreateCollection({
            name: "food_collection_openai",
            embeddingFunction: null,
            metadata: { "hnsw:space": "cosine" }
        });

        const totalItems = foodItems.length;
        const BATCH_SIZE = 100;

        for (let i = 0; i < totalItems; i += BATCH_SIZE) {
            const chunk = foodItems.slice(i, i + BATCH_SIZE);

            const ids = chunk.map((item, idx) => `${item.food_id}_${i + idx}`);
            const documents = chunk.map(item => {
                const nutrients = item.food_nutritional_factors || {};
                return `${item.food_name}: ${item.food_description}. Contains ${item.food_calories_per_serving || 0} kcal, ${nutrients.protein || "0g"} protein, and ${nutrients.fat || "0g"} fat. Ingredients: ${item.food_ingredients.join(", ")}`;
            });
            const metadatas = chunk.map(item => ({
                ingredients: item.food_ingredients.join(", "),
                cuisine: item.cuisine_type || "Unknown",
                calories: item.food_calories_per_serving || 0,
                cooking_method: item.cooking_method || "Unknown"
            }));

            console.log(`[${i}/${totalItems}] Generating embeddings...`);
            const embeddings = await getOpenAIBatchEmbeddings(documents);

            await collection.upsert({
                ids,
                embeddings,
                documents,
                metadatas
            });

            console.log(`✅ Batch processed (${i + chunk.length}/${totalItems})`);
        }

        console.log("\n✨ UPDATE COMPLETE!");
        const count = await collection.count();
        console.log(`Total items now in collection: ${count}`);
        return { success: true, count };

    } catch (error) {
        console.error("❌ Update Error:", error.message);
        throw error;
    }
}

// Allow running as a standalone script
if (process.argv[1] && process.argv[1].endsWith('dataset_handler.js')) {
    updateDataset().catch(err => {
        console.error(err);
        process.exit(1);
    });
}
