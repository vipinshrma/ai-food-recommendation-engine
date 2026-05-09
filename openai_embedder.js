import OpenAI from "openai";
import dotenv from "dotenv";
import { OpenAIEmbeddingFunction } from '@chroma-core/openai'

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates a single embedding for a single string.
 */
export async function getOpenAIEmbedding(text) {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
        encoding_format: "float",
    });

    return response.data[0].embedding;
}

/**
 * Generates embeddings for an array of strings in a single batch.
 * @param {string[]} texts - Array of strings to embed.
 */
export async function getOpenAIBatchEmbeddings(texts) {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: texts,
        encoding_format: "float",
    });

    // Return the array of embeddings in the same order
    return response.data.map(item => item.embedding);
}

export const embedder = new OpenAIEmbeddingFunction({
    modelName: 'text-embedding-3-small',
    apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Guardrail: Checks if the query is actually about food
 * Uses gpt-4o-mini (cheap and fast)
 */
export async function validateFoodQuery(query) {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are a food assistant. Your only job is to determine if a user's query is related to food, recipes, ingredients, or cuisines. Respond with exactly 'YES' or 'NO'."
            },
            { role: "user", content: query }
        ],
        temperature: 0,
        max_tokens: 5
    });

    const answer = response.choices[0].message.content.trim().toUpperCase();
    return answer === 'YES';
}

/**
 * Parses a user query to extract specific food categories and dietary tags.
 */
export async function parseFoodQuery(queryText) {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are a food query parser. Extract dietary tags and categories from the user's input.
                Valid Tags: [Vegan, Vegetarian, Keto, Gluten-Free, Dairy-Free, Nut-Free, Low-Carb, Healthy, None]
                Valid Categories: [Main Course, Salad, Breakfast, Dessert, Appetizer, Snack, Soup, Beverage]
                Valid Cuisines: [American, Indian, Chinese, Mexican, Japanese, Italian, French, Greek]

                IMPORTANT: 
                - If the user says "non-veg", set dietary_tag to "None".
                - If the user says "veg", set dietary_tag to "Vegetarian".
                
                Return ONLY a JSON object:
                {
                    "dietary_tag": "tag or None",
                    "category": "category or null",
                    "cuisine": "cuisine or null",
                    "clean_query": "the remaining text for semantic search"
                }`
            },
            { role: "user", content: queryText }
        ],
        response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
}
