import { Server } from "socket.io";
 const spaceToSocket = new Map<string, string>();

export const setupWebSocket = (io: Server) => {
  try {
    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);
      socket.on("create",(data)=>{
        console.log(data)
        socket.join(data)
        spaceToSocket.set(socket.id, data);
      })
      socket.on("c",(data)=>{
        console.log(spaceToSocket)
        const spaceId = spaceToSocket.get(socket.id)
        console.log(spaceId,data)
        if(!spaceId){
          console.log("not here")
          return
        }
        io.to(spaceId).emit("r", data);
      })

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        socket.disconnect();
      });
    });
  } catch (error) {
    console.log(error, "error");
    throw error;
  }
};
