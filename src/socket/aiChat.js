import { getAIReply } from "../services/geminiService.js";
import { logger } from "../utils/logger.js";

export const setupAIChatSocket = (io) => {
    io.on("connection", (socket) => {
        logger.info(`AI Chat socket connected: ${socket.id}`);

        socket.on("ai-message", async (msg) => {
            logger.info(`ai-message event detected from ${socket.id}`);
            const reply = await getAIReply(msg);
            socket.emit("ai-reply", reply);
        });
    });
};
