import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { usersRoutes } from "./routes/users";
import { animalsRoutes } from "./routes/animals";
import { countriesRoutes } from "./routes/countries";
import { seedCountries } from "./db/seed";

// Seed les pays au démarrage
await seedCountries();

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "API CRUD Users & Animals",
          version: "1.0.0",
          description:
            "API simple pour gérer des utilisateurs et leurs animaux de compagnie",
        },
        tags: [
          {
            name: "Users",
            description: "Opérations CRUD sur les utilisateurs",
          },
          {
            name: "Animals",
            description: "Opérations CRUD sur les animaux de compagnie",
          },
          {
            name: "Countries",
            description: "Opérations CRUD sur les pays",
          },
        ],
      },
    })
  )
  .get("/", () => ({
    message: "Bienvenue sur l'API CRUD Users & Animals",
    endpoints: {
      swagger: "/swagger",
      users: "/users",
      animals: "/animals",
      countries: "/countries",
    },
  }))
  .use(usersRoutes)
  .use(animalsRoutes)
  .use(countriesRoutes)
  .listen(3000);

console.log(
  `🦊 Serveur Elysia démarré sur ${app.server?.hostname}:${app.server?.port}`
);
console.log(
  `📚 Documentation Swagger disponible sur http://localhost:3000/swagger`
);
