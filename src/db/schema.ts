import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// Enum pour le type d'animal
export const animalTypeEnum = ["chien", "chat", "tigre"] as const;
export type AnimalType = (typeof animalTypeEnum)[number];

// Table Countries
export const countries = sqliteTable("countries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nom: text("nom").notNull(),
  demonyme: text("demonyme").notNull(),
  emoji: text("emoji").notNull(),
});

// Table Users
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nom: text("nom").notNull(),
  prenom: text("prenom").notNull(),
  mail: text("mail").notNull().unique(),
  age: integer("age").notNull(),
  countryId: integer("country_id")
    .notNull()
    .references(() => countries.id),
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
  countryId: integer("country_id").references(() => countries.id),
});

// Relations
export const countriesRelations = relations(countries, ({ many }) => ({
  users: many(users),
  animals: many(animals),
}));

export const usersRelations = relations(users, ({ many, one }) => ({
  animals: many(animals),
  country: one(countries, {
    fields: [users.countryId],
    references: [countries.id],
  }),
}));

export const animalsRelations = relations(animals, ({ one }) => ({
  user: one(users, {
    fields: [animals.userId],
    references: [users.id],
  }),
  country: one(countries, {
    fields: [animals.countryId],
    references: [countries.id],
  }),
}));

// Types TypeScript inférés
export type Country = typeof countries.$inferSelect;
export type NewCountry = typeof countries.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Animal = typeof animals.$inferSelect;
export type NewAnimal = typeof animals.$inferInsert;
