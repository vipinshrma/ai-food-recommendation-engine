import { pipeline } from '@xenova/transformers';

let summarizer = null;

/**
 * Loads the BART summarization pipeline lazily
 */
async function getSummarizer() {
    if (!summarizer) {
        console.log("📥 Loading BART Summarization model (this may take a moment)...");
        summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
        console.log("✅ BART model ready!");
    }
    return summarizer;
}

/**
 * Generates a "Chef's Recommendation" from search results
 * @param {Array} results - Array of food items from the search
 */
export async function generateChefSummary(results) {
    if (!results || results.length === 0) return null;

    try {
        const pipeline = await getSummarizer();
        
        // Combine the top 3 result descriptions into one block of text
        const topResultsText = results.slice(0, 3).map(r => r.text).join(". ");
        
        const prompt = `Based on these ingredients: ${topResultsText}. Suggest a creative meal idea.`;

        // Run the summarizer
        const output = await pipeline(prompt, {
            max_new_tokens: 60,
            min_new_tokens: 20,
            do_sample: true,
            temperature: 0.7
        });

        return output[0].summary_text;
    } catch (error) {
        console.error("BART Summarization Error:", error.message);
        return null;
    }
}
