import { FastifyInstance } from "fastify";
import { WebSocket } from "ws";

const connectedSockets: Set<WebSocket> = new Set();

async function webSocket(fastify: FastifyInstance) {
  fastify.get("/*", { websocket: true }, (connection, request) => {
    const { socket } = connection;

    socket.on("close", () => {
      connectedSockets.delete(socket);
    });

    socket.on("message", async (message) => {
      console.log(message.toString());
      connectedSockets.add(socket);
    });
  });
}

export function broadcastData(type: "message" | "form", value: any) {
  connectedSockets.forEach((socket) => {
    socket.send(
      JSON.stringify({
        type: type,
        value: value,
      })
    );
  });
}

export default webSocket;
