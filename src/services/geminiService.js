import axios from "axios";
import { ENV } from "../utils/envLoader.js";
import { logger } from "../utils/logger.js";

export const getAIReply = async (userMessage) => {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${ENV.GEMINI_API_KEY}`;

    try {
        const response = await axios.post(url, {
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `
You are FoodMate, a friendly meal planning and recipe assistant.
Only respond to questions related to food, cooking, diet, nutrition, or meal planning.
Avoid formatting like Markdown. Do not use *, **, bullet points, or headers. Respond with plain text only.
If the user asks something unrelated (e.g., about history, programming, movies, etc.), politely respond with: "I'm here to help with food and recipes. Try asking about meals, ingredients, or cooking tips!"
`,
                        },
                    ],
                },
                {
                    role: "user",
                    parts: [{ text: userMessage }],
                },
            ],
        });

        const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        logger.info("Gemini is replying...");
        return reply || "🤖 Gemini didn’t return a message.";
    } catch (err) {
        logger.error("Gemini REST error:", err.response?.data || err.message);
        return "⚠️ Gemini REST call failed.";
    }
};
