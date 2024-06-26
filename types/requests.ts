import { FastifyRequest } from "fastify";
import { Note } from "./notes";

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

export type FormNotesRequest = FastifyRequest<{
  Querystring: { formName: string };
}>;

export type FormNotesUpdateRequest = FastifyRequest<{
  Body: { id: string; note: Note };
}>;

export type DeleteNoteRequest = FastifyRequest<{
  Querystring: { noteId: string };
}>;
