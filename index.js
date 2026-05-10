import { ChromaClient } from 'chromadb';
import { getOpenAIEmbedding, validateFoodQuery } from './openai_embedder.js';
import { generateChefSummary } from './bart_summarizer.js';

const client = new ChromaClient({ host: "localhost", port: 8000 });

/**
 * Dynamic Search Function
 * This queries your collection of 5,000+ items.
 */
export async function searchFood(queryText) {
    console.log(`\n🔍 Searching the database for: "${queryText}"...`);

    try {
        // 0. LLM GUARDRAIL: Pre-validate the query
        const isValid = await validateFoodQuery(queryText);
        if (!isValid) {
            return {
                success: false,
                error: "Guardrail: That doesn't sound like a food-related request. Try again!"
            };
        }

        // 1. Access the collection
        const collection = await client.getCollection({
            name: "food_collection_openai"
        });

        // 2. Turn the user's text into a vector
        const queryEmbedding = await getOpenAIEmbedding(queryText);

        // 3. Find the top 3 matches
        const results = await collection.query({
            queryEmbeddings: [queryEmbedding],
            nResults: 20
        });

        // 4. Show the results
        // console.log("\n--- SEARCH RESULTS ---");

        if (results.documents[0].length === 0) {
            console.log("No matches found.");
            return;
        }

        const finalResults = [];

        results.documents[0].forEach((doc, i) => {
            const distance = results.distances[0][i];
            const metadata = results.metadatas[0][i];

            // With Cosine Distance: 0 = identical, 1 = orthogonal, 2 = opposite
            // Confidence = 1 - distance results in the actual Cosine Similarity
            const confidence = Math.max(0, 1 - distance).toFixed(4);

            finalResults.push({
                id: results.ids[0][i],
                text: doc,
                confidence: parseFloat(confidence),
                metadata: metadata
            });

            console.log(`${i + 1}. ${doc} (Score: ${confidence})`);
        });

        // 5. Generate a BART Summary (Chef's Recommendation)
        const chefSummary = await generateChefSummary(finalResults);
        console.log("Chef Summary: ", chefSummary)

        return {
            success: true,
            results: finalResults,
            chefRecommendation: chefSummary
        };

    } catch (error) {
        console.error("Search Error:", error.message);
        return { success: false, error: error.message };
    }
}