import { Elysia, t } from "elysia";
import { db } from "../db";
import { users, animals } from "../db/schema";
import { eq } from "drizzle-orm";

export const usersRoutes = new Elysia({ prefix: "/users" })
  // GET /users - Liste tous les users avec leurs animaux
  .get(
    "/",
    async () => {
      const allUsers = await db.query.users.findMany({
        with: {
          animals: true,
        },
      });
      return allUsers;
    },
    {
      detail: {
        tags: ["Users"],
        summary: "Récupérer tous les utilisateurs",
        description:
          "Retourne la liste de tous les utilisateurs avec leurs animaux de compagnie",
      },
    }
  )

  // GET /users/:id - Récupère un user par ID
  .get(
    "/:id",
    async ({ params: { id }, error }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.id, id),
        with: {
          animals: true,
        },
      });

      if (!user) {
        return error(404, { message: "Utilisateur non trouvé" });
      }

      return user;
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      detail: {
        tags: ["Users"],
        summary: "Récupérer un utilisateur par ID",
        description:
          "Retourne un utilisateur spécifique avec ses animaux de compagnie",
      },
    }
  )

  // POST /users - Crée un nouveau user
  .post(
    "/",
    async ({ body }) => {
      const [newUser] = await db.insert(users).values(body).returning();
      return newUser;
    },
    {
      body: t.Object({
        nom: t.String({ minLength: 1 }),
        prenom: t.String({ minLength: 1 }),
        mail: t.String({ format: "email" }),
        age: t.Integer({ minimum: 0 }),
      }),
      detail: {
        tags: ["Users"],
        summary: "Créer un nouvel utilisateur",
        description: "Crée un nouvel utilisateur dans la base de données",
      },
    }
  )

  // PUT /users/:id - Met à jour un user
  .put(
    "/:id",
    async ({ params: { id }, body, error }) => {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, id),
      });

      if (!existingUser) {
        return error(404, { message: "Utilisateur non trouvé" });
      }

      const [updatedUser] = await db
        .update(users)
        .set(body)
        .where(eq(users.id, id))
        .returning();

      return updatedUser;
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Object({
        nom: t.Optional(t.String({ minLength: 1 })),
        prenom: t.Optional(t.String({ minLength: 1 })),
        mail: t.Optional(t.String({ format: "email" })),
        age: t.Optional(t.Integer({ minimum: 0 })),
      }),
      detail: {
        tags: ["Users"],
        summary: "Mettre à jour un utilisateur",
        description: "Met à jour les informations d'un utilisateur existant",
      },
    }
  )

  // DELETE /users/:id - Supprime un user
  .delete(
    "/:id",
    async ({ params: { id }, error }) => {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, id),
      });

      if (!existingUser) {
        return error(404, { message: "Utilisateur non trouvé" });
      }

      await db.delete(users).where(eq(users.id, id));

      return { message: "Utilisateur supprimé avec succès", id };
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      detail: {
        tags: ["Users"],
        summary: "Supprimer un utilisateur",
        description:
          "Supprime un utilisateur et tous ses animaux de compagnie (cascade)",
      },
    }
  );
