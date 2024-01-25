import fastify from "fastify";
import ws from "@fastify/websocket";
import { WebSocket } from "ws";

const server = fastify();
const port = 3000;
const connectedSockets: Set<WebSocket> = new Set();

server.register(ws);
server.register(async function (fastify) {
  fastify.get("/*", { websocket: true }, (connection, request) => {
    const { socket } = connection;
    // const sessionPromise = request.getSession(); // example async session getter, called synchronously to return a promise

    socket.on("close", () => {
      connectedSockets.delete(socket);
    });

    socket.on("message", async (message) => {
      console.log(message.toString());
      connectedSockets.add(socket);
    });
  });
});

server.get("/ping", async (request, reply) => {
  broadcastData("message", "Broadcast");
  reply.send("pong");
});

server.post("/updateForm", {
  handler(req, reply) {
    // console.log(req.body);
    broadcastData("form", req.body);
    reply.send({ ok: 1 });
  },
});

server.listen({ port: port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

function broadcastData(type: "message" | "form", value: any) {
  connectedSockets.forEach((socket) => {
    socket.send(
      JSON.stringify({
        type: type,
        value: value,
      })
    );
  });
}
