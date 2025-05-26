let io = null;

export const setSocketIO = (ioInstance) => {
  io = ioInstance;
};

export const getSocketIO = () => {
  if (!io) throw new Error("Socket.IO instance not set yet.");
  return io;
};