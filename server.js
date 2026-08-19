const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/ai-core', async (req, res) => {
    try {
        const { message, userName } = req.body;
        const activeApiKey = process.env.GEMINI_API_KEY;

        if (!activeApiKey) {
            return res.json({ reply: "Please configure your Google AI Studio API Key to enable the assistant." });
        }

        const systemInstruction = `You are RJ MPBS AI, an expert universal design studio and business assistant for ${userName || 'the user'}. The user wants help with: "${message}". Provide professional, high-converting, authentic concepts, layouts, text descriptions, or prompt ideas for logos, t-shirt mockups, social media ad banners, daily planners, stickers, business cards, or any graphic design. Keep the tone encouraging, helpful, and completely free of technical bugs or unwanted placeholders. Match the user's language style.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemInstruction }] }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const aiReply = data.candidates[0].content.parts[0].text;
            return res.json({ reply: aiReply });
        } else {
            return res.json({ reply: `Hello ${userName || 'there'}! Welcome to RJ MPBS AI Universal Studio. How can I help you design your next amazing project today?` });
        }
    } catch (error) {
        console.error(error);
        res.json({ reply: "A temporary connection error occurred. Please try again." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
