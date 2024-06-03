import { FastifyInstance } from "fastify";

async function validators(fastify: FastifyInstance) {
  fastify.post("/validation", async (request, reply) => {
    reply.send("Validator endpoint");
  });
}

export default validators;
