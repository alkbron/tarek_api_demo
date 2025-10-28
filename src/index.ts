import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { usersRoutes } from "./routes/users";
import { animalsRoutes } from "./routes/animals";

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
    },
  }))
  .use(usersRoutes)
  .use(animalsRoutes)
  .listen(3000);

console.log(
  `🦊 Serveur Elysia démarré sur ${app.server?.hostname}:${app.server?.port}`
);
console.log(
  `📚 Documentation Swagger disponible sur http://localhost:3000/swagger`
);
