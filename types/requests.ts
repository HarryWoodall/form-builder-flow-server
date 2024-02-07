import { FastifyRequest } from "fastify";

export type ReusableElementRequest = FastifyRequest<{
  Querystring: { element: string };
}>;

export type LookupRequest = FastifyRequest<{
  Querystring: { lookup: string };
}>;
