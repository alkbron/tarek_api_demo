import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// Enum pour le type d'animal
export const animalTypeEnum = [
  "chien",
  "chat",
  "tigre",
  "chimpanzé",
  "aigle",
  "ornithorynque",
] as const;
export type AnimalType = (typeof animalTypeEnum)[number];

// Table Users
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nom: text("nom").notNull(),
  prenom: text("prenom").notNull(),
  mail: text("mail").notNull().unique(),
  age: integer("age").notNull(),
});

// Table Animals
export const animals = sqliteTable("animals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nom: text("nom").notNull(),
  type: text("type", { enum: animalTypeEnum }).notNull(),
  age: integer("age").notNull(),
  couleur: text("couleur").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  animals: many(animals),
}));

export const animalsRelations = relations(animals, ({ one }) => ({
  user: one(users, {
    fields: [animals.userId],
    references: [users.id],
  }),
}));

// Types TypeScript inférés
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Animal = typeof animals.$inferSelect;
export type NewAnimal = typeof animals.$inferInsert;
