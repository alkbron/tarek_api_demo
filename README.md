# API CRUD Users & Animals

API REST simple construite avec Bun, Elysia et Drizzle ORM pour gérer des utilisateurs et leurs animaux de compagnie.

## Technologies

- **Runtime**: Bun
- **Framework**: Elysia
- **ORM**: Drizzle ORM
- **Base de données**: SQLite
- **Documentation**: Swagger/OpenAPI (auto-généré)

## Installation

```bash
# Installer les dépendances
bun install

# Créer et synchroniser la base de données
bun run db:push
```

## Lancement

```bash
# Mode développement (avec hot reload)
bun run dev

# Mode production
bun run start
```

Le serveur démarre sur `http://localhost:3000`

## Documentation API

Une fois le serveur lancé, accédez à la documentation Swagger interactive :

- **Interface Swagger UI**: http://localhost:3000/swagger
- **Spécification OpenAPI JSON**: http://localhost:3000/swagger/json

## Endpoints

### Users

- `GET /users` - Liste tous les utilisateurs (avec leurs animaux)
- `GET /users/:id` - Récupère un utilisateur par ID
- `POST /users` - Crée un nouvel utilisateur
- `PUT /users/:id` - Met à jour un utilisateur
- `DELETE /users/:id` - Supprime un utilisateur

### Animals

- `GET /animals` - Liste tous les animaux
- `GET /animals/:id` - Récupère un animal par ID
- `POST /animals` - Crée un nouvel animal
- `PUT /animals/:id` - Met à jour un animal
- `DELETE /animals/:id` - Supprime un animal

## Schéma de données

### User

```typescript
{
  id: number;
  nom: string;
  prenom: string;
  mail: string;
  age: number;
}
```

### Animal

```typescript
{
  id: number;
  nom: string;
  type: "chien" | "chat" | "tigre";
  age: number;
  couleur: string;
  userId: number;
}
```

## Commandes utiles

```bash
# Ouvrir Drizzle Studio (interface web pour la DB)
bun run db:studio

# Re-synchroniser le schéma de la DB
bun run db:push
```
