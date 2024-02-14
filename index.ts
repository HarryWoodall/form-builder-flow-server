import fastify, { FastifyRequest } from "fastify";
import ws from "@fastify/websocket";
import webSocket, { broadcastData } from "./sockets";
import { configDotenv } from "dotenv";
import { ReusableElementRequest, LookupRequest, FormListRequest, FormRequest } from "./types/requests";
import fs from "fs";
import cors from "@fastify/cors";
import fuzzyMatch from "./helpers/search";

const server = fastify();
const port = 3100;
configDotenv();

server.register(ws);
server.register(webSocket);
server.register(cors);

server.get("/ping", async (request, reply) => {
  broadcastData("message", "Broadcast");
  reply.send("pong");
});

server.post("/updateForm", {
  handler(req, reply) {
    broadcastData("form", req.body);
    reply.status(200);
  },
});

server.get("/transformsAvailable", {
  handler(req, reply) {
    const formBuilderPath = process.env.FORM_BUILDER_JSON_PATH;
    reply.send(formBuilderPath != undefined && fs.existsSync(formBuilderPath));
  },
});

server.get("/formList", {
  handler(req: FormListRequest, reply) {
    const formBuilderPath = process.env.FORM_BUILDER_JSON_PATH;

    if (!formBuilderPath) {
      reply.status(405).send({ message: "Form builder path not found" });
      return;
    }

    const path = `${formBuilderPath}/DSL`;

    if (!fs.existsSync(path)) {
      reply.status(404).send({ message: `${path} not found` });
      return;
    }

    let files = fs.readdirSync(path, "utf-8").map((file) => {
      return file.split(".")[0];
    });

    if (req.query.search) {
      files = files.filter((file) => fuzzyMatch(req.query.search as string, file));
    }

    reply.send(files);
  },
});

server.get("/form", {
  handler(req: FormRequest, reply) {
    const formBuilderPath = process.env.FORM_BUILDER_JSON_PATH;

    if (!formBuilderPath) {
      reply.status(405).send({ message: "Form builder path not found" });
      return;
    }

    if (!req.query.name) {
      reply.status(400).send({ message: "No name given" });
      return;
    }

    const path = `${formBuilderPath}/DSL/${req.query.name}.json`;

    if (!fs.existsSync(path)) {
      reply.status(404).send({ message: `${path} not found` });
      return;
    }

    let file = fs.readFileSync(path, "utf-8");

    const UTF8_BOM = "\u{FEFF}";
    if (file.startsWith(UTF8_BOM)) {
      file = file.substring(UTF8_BOM.length);
    }

    const regex = new RegExp(/"AuthToken":.+"/, "g");
    file = file.replace(regex, `"AuthToken": "<AUTH_TOKEN>"`);

    reply.send(JSON.parse(file));
  },
});

server.get("/reusableElement", {
  handler(req: ReusableElementRequest, reply) {
    const formBuilderPath = process.env.FORM_BUILDER_JSON_PATH;

    if (!formBuilderPath) {
      reply.status(405).send({ message: "Form builder path not found" });
      return;
    }

    if (!req.query.element) {
      reply.status(400).send({ message: "parameter 'element' is undefined" });
      return;
    }

    const path = `${formBuilderPath}/Elements/${req.query.element}.json`;

    if (!fs.existsSync(path)) {
      reply.status(404).send({ message: `${path} not found` });
      return;
    }

    const file = fs.readFileSync(path).toString();
    reply.send(JSON.parse(file));
  },
});

server.get("/lookup", {
  handler(req: LookupRequest, reply) {
    const formBuilderPath = process.env.FORM_BUILDER_JSON_PATH;

    if (!formBuilderPath) {
      reply.status(405).send({ message: "Form builder path not found" });
      return;
    }

    if (!req.query.lookup) {
      reply.status(400).send({ message: "parameter 'element' is undefined" });
      return;
    }

    const path = `${formBuilderPath}/Lookups/${req.query.lookup}.json`;

    if (!fs.existsSync(path)) {
      reply.status(404).send({ message: `${path} not found` });
      return;
    }

    let file = fs.readFileSync(path, "utf-8");

    const UTF8_BOM = "\u{FEFF}";
    if (file.startsWith(UTF8_BOM)) {
      file = file.substring(UTF8_BOM.length);
    }

    reply.send(JSON.parse(file));
  },
});

server.listen({ port: port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
