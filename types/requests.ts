import { FastifyRequest } from "fastify";

export type FormListRequest = FastifyRequest<{
  Querystring: { search: string | null };
}>;

export type FormRequest = FastifyRequest<{
  Querystring: { name: string };
}>;

export type ReusableElementRequest = FastifyRequest<{
  Querystring: { element: string };
}>;

export type LookupRequest = FastifyRequest<{
  Querystring: { lookup: string };
}>;
