import { Elysia, t } from "elysia";
import { db } from "../db";
import { countries } from "../db/schema";
import { eq } from "drizzle-orm";

export const countriesRoutes = new Elysia({ prefix: "/countries" })
  // GET /countries - Liste tous les pays
  .get(
    "/",
    async () => {
      const allCountries = await db.query.countries.findMany();
      return allCountries;
    },
    {
      detail: {
        tags: ["Countries"],
        summary: "Récupérer tous les pays",
        description: "Retourne la liste de tous les pays disponibles",
      },
    }
  )

  // GET /countries/:id - Récupère un pays par ID
  .get(
    "/:id",
    async ({ params: { id }, error }) => {
      const country = await db.query.countries.findFirst({
        where: eq(countries.id, id),
        with: {
          users: true,
          animals: true,
        },
      });

      if (!country) {
        return error(404, { message: "Pays non trouvé" });
      }

      return country;
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      detail: {
        tags: ["Countries"],
        summary: "Récupérer un pays par ID",
        description:
          "Retourne un pays spécifique avec ses utilisateurs et animaux",
      },
    }
  )

  // POST /countries - Crée un nouveau pays
  .post(
    "/",
    async ({ body }) => {
      const [newCountry] = await db.insert(countries).values(body).returning();
      return newCountry;
    },
    {
      body: t.Object({
        nom: t.String({ minLength: 1 }),
        demonyme: t.String({ minLength: 1 }),
        emoji: t.String({ minLength: 1, maxLength: 4 }),
      }),
      detail: {
        tags: ["Countries"],
        summary: "Créer un nouveau pays",
        description: "Crée un nouveau pays dans la base de données",
      },
    }
  )

  // PUT /countries/:id - Met à jour un pays
  .put(
    "/:id",
    async ({ params: { id }, body, error }) => {
      const existingCountry = await db.query.countries.findFirst({
        where: eq(countries.id, id),
      });

      if (!existingCountry) {
        return error(404, { message: "Pays non trouvé" });
      }

      const [updatedCountry] = await db
        .update(countries)
        .set(body)
        .where(eq(countries.id, id))
        .returning();

      return updatedCountry;
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Object({
        nom: t.Optional(t.String({ minLength: 1 })),
        demonyme: t.Optional(t.String({ minLength: 1 })),
        emoji: t.Optional(t.String({ minLength: 1, maxLength: 4 })),
      }),
      detail: {
        tags: ["Countries"],
        summary: "Mettre à jour un pays",
        description: "Met à jour les informations d'un pays existant",
      },
    }
  )

  // DELETE /countries/:id - Supprime un pays
  .delete(
    "/:id",
    async ({ params: { id }, error }) => {
      const existingCountry = await db.query.countries.findFirst({
        where: eq(countries.id, id),
      });

      if (!existingCountry) {
        return error(404, { message: "Pays non trouvé" });
      }

      await db.delete(countries).where(eq(countries.id, id));

      return { message: "Pays supprimé avec succès", id };
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      detail: {
        tags: ["Countries"],
        summary: "Supprimer un pays",
        description: "Supprime un pays de la base de données",
      },
    }
  );
