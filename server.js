import express from 'express';
import cors from 'cors';
import { searchFood } from './index.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 🔍 Search Endpoint
// Usage: http://localhost:3000/api/search?q=vegan pizza
app.get('/api/search', async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ 
            success: false, 
            error: "Query parameter 'q' is required. Example: /api/search?q=pizza" 
        });
    }

    try {
        const result = await searchFood(q);
        
        if (result.success) {
            res.json(result);
        } else {
            // This handles the LLM Guardrail rejection
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`\n🚀 Food Recommendation API is Live!`);
    console.log(`📡 URL: http://localhost:${PORT}/api/search?q=...`);
    console.log(`✨ Try this in your browser: http://localhost:${PORT}/api/search?q=spicy%20chicken\n`);
});
