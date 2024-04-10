import { Note } from "../types/notes.js";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { v4 as uuidv4 } from "uuid";

const fileName = "notes.json";

export async function readAllFormNotes(formName: string): Promise<Note[]> {
  const db = new Low<Note[]>(new JSONFile(fileName), []);
  await db.read();
  console.log(db.data.filter((note) => note.formName == formName));
  return db.data.filter((note) => note.formName == formName);
}

export async function createNote(note: Note): Promise<Note> {
  note.id = uuidv4();
  const db = new Low<Note[]>(new JSONFile(fileName), []);
  await db.read();
  await db.update((notes) => notes.push(note));
  return note;
}

export async function updateNote(note: Note, noteId: string): Promise<Note> {
  const db = new Low<Note[]>(new JSONFile(fileName), []);
  await db.read();
  await db.update((notes) => {
    let index = notes.findIndex((note) => note.id == noteId);
    notes.splice(index, 1, note);
  });

  return note;
}

export async function removeNote(noteId: string) {
  const db = new Low<Note[]>(new JSONFile(fileName), []);
  await db.read();
  await db.update((notes) => {
    let index = notes.findIndex((note) => note.id == noteId);
    notes.splice(index, 1);
  });
}

export async function removeAllFormNotes(formName: string) {
  const db = new Low<Note[]>(new JSONFile(fileName), []);
  await db.read();
  await db.update((notes) => {
    for (let i = notes.length - 1; i >= 0; i--) {
      if (notes[i].formName == formName) notes.splice(i, 1);
    }
  });
}

export async function removeAllNotes() {
  const db = new Low<Note[]>(new JSONFile(fileName), []);
  await db.update((notes) => []);
}
