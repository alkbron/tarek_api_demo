import { Elysia, t } from "elysia";
import { db } from "../db";
import { animals, animalTypeEnum } from "../db/schema";
import { eq } from "drizzle-orm";

export const animalsRoutes = new Elysia({ prefix: "/animals" })
  // GET /animals - Liste tous les animaux
  .get(
    "/",
    async () => {
      const allAnimals = await db.query.animals.findMany({
        with: {
          user: true,
          country: true,
        },
      });
      return allAnimals;
    },
    {
      detail: {
        tags: ["Animals"],
        summary: "Récupérer tous les animaux",
        description:
          "Retourne la liste de tous les animaux avec leurs propriétaires",
      },
    }
  )

  // GET /animals/:id - Récupère un animal par ID
  .get(
    "/:id",
    async ({ params: { id }, error }) => {
      const animal = await db.query.animals.findFirst({
        where: eq(animals.id, id),
        with: {
          user: true,
          country: true,
        },
      });

      if (!animal) {
        return error(404, { message: "Animal non trouvé" });
      }

      return animal;
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      detail: {
        tags: ["Animals"],
        summary: "Récupérer un animal par ID",
        description: "Retourne un animal spécifique avec son propriétaire",
      },
    }
  )

  // POST /animals - Crée un nouvel animal
  .post(
    "/",
    async ({ body }) => {
      const [newAnimal] = await db.insert(animals).values(body).returning();
      return newAnimal;
    },
    {
      body: t.Object({
        nom: t.String({ minLength: 1 }),
        type: t.Union([
          t.Literal("chien"),
          t.Literal("chat"),
          t.Literal("tigre"),
        ]),
        age: t.Integer({ minimum: 0 }),
        couleur: t.String({ minLength: 1 }),
        userId: t.Integer({ minimum: 1 }),
        countryId: t.Optional(t.Integer({ minimum: 1 })),
      }),
      detail: {
        tags: ["Animals"],
        summary: "Créer un nouvel animal",
        description:
          "Crée un nouvel animal de compagnie associé à un utilisateur",
      },
    }
  )

  // PUT /animals/:id - Met à jour un animal
  .put(
    "/:id",
    async ({ params: { id }, body, error }) => {
      const existingAnimal = await db.query.animals.findFirst({
        where: eq(animals.id, id),
      });

      if (!existingAnimal) {
        return error(404, { message: "Animal non trouvé" });
      }

      const [updatedAnimal] = await db
        .update(animals)
        .set(body)
        .where(eq(animals.id, id))
        .returning();

      return updatedAnimal;
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Object({
        nom: t.Optional(t.String({ minLength: 1 })),
        type: t.Optional(
          t.Union([t.Literal("chien"), t.Literal("chat"), t.Literal("tigre")])
        ),
        age: t.Optional(t.Integer({ minimum: 0 })),
        couleur: t.Optional(t.String({ minLength: 1 })),
        userId: t.Optional(t.Integer({ minimum: 1 })),
        countryId: t.Optional(t.Integer({ minimum: 1 })),
      }),
      detail: {
        tags: ["Animals"],
        summary: "Mettre à jour un animal",
        description: "Met à jour les informations d'un animal existant",
      },
    }
  )

  // DELETE /animals/:id - Supprime un animal
  .delete(
    "/:id",
    async ({ params: { id }, error }) => {
      const existingAnimal = await db.query.animals.findFirst({
        where: eq(animals.id, id),
      });

      if (!existingAnimal) {
        return error(404, { message: "Animal non trouvé" });
      }

      await db.delete(animals).where(eq(animals.id, id));

      return { message: "Animal supprimé avec succès", id };
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      detail: {
        tags: ["Animals"],
        summary: "Supprimer un animal",
        description: "Supprime un animal de compagnie de la base de données",
      },
    }
  );
