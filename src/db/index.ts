import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./schema";

// Créer la connexion SQLite avec le driver natif de Bun
const sqlite = new Database("sqlite.db");

// Initialiser Drizzle avec le schéma
export const db = drizzle(sqlite, { schema });
