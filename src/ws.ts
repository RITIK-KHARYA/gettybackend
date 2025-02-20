import { Server } from "socket.io";
import { getServerSession } from "./lib/session";

export const setupWebSocket = (io: Server) => {
  const session = getServerSession;

  try {
    if (!session) return null;
    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("message", (data) => {
        console.log("Message received:", data);
        socket.emit("response", { message: "Message received!", data });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  } catch (error) {
    console.log(error, "error");
    throw error;
  }
};
