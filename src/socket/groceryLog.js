import { logger } from "../utils/logger.js"

export const setUpGroceryLogSocket= (io) => {
    io.on("connection", (socket) => {
        logger.info("Client connected for grocery logs:", socket.id);

        socket.on('joinGroceryRoom', (groceryId) => {
            socket.join(groceryId);
            logger.info(`Socket ${socket.id} joined grocery room: ${groceryId}`);
        })

        socket.on('leaveGroceryRoom', (groceryId) => {
            socket.leave(groceryId);
            logger.info(`Socket ${socket.id} left grocery room: ${groceryId}`);

        })

        socket.on('disconnect', () => {
            logger.info("Client disconnected: ", socket.id);
        })
    })
}