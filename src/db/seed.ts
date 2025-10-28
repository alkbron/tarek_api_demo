import { db } from "./index";
import { users, animals } from "./schema";

async function seed() {
  console.log("🌱 Démarrage du seeding...");

  // Nettoyer les tables existantes
  await db.delete(animals);
  await db.delete(users);
  console.log("✅ Tables nettoyées");

  // Créer Michael Jackson
  const [michaelJackson] = await db
    .insert(users)
    .values({
      nom: "Jackson",
      prenom: "Michael",
      mail: "michael.jackson@kingofpop.com",
      age: 50,
    })
    .returning();
  console.log("✅ Michael Jackson créé");

  // Créer les animaux de Michael Jackson
  await db.insert(animals).values([
    {
      nom: "Bubbles",
      type: "chimpanzé",
      age: 40,
      couleur: "brun",
      userId: michaelJackson.id,
    },
    {
      nom: "Louie",
      type: "chimpanzé",
      age: 35,
      couleur: "noir",
      userId: michaelJackson.id,
    },
    {
      nom: "Muscles",
      type: "tigre",
      age: 15,
      couleur: "orange rayé",
      userId: michaelJackson.id,
    },
    {
      nom: "Thriller",
      type: "chat",
      age: 8,
      couleur: "noir",
      userId: michaelJackson.id,
    },
  ]);
  console.log("✅ Animaux de Michael Jackson créés");

  // Créer Bayek DeSiwa
  const [bayekDeSiwa] = await db
    .insert(users)
    .values({
      nom: "DeSiwa",
      prenom: "Bayek",
      mail: "bayek.desiwa@medjay.eg",
      age: 36,
    })
    .returning();
  console.log("✅ Bayek DeSiwa créé");

  // Créer l'aigle de Bayek
  await db.insert(animals).values({
    nom: "Senu",
    type: "aigle",
    age: 5,
    couleur: "brun et blanc",
    userId: bayekDeSiwa.id,
  });
  console.log("✅ Senu créé");

  // Créer Phinéas Flynn
  const [phineasFlynn] = await db
    .insert(users)
    .values({
      nom: "Flynn",
      prenom: "Phinéas",
      mail: "phineas.flynn@danville.com",
      age: 10,
    })
    .returning();
  console.log("✅ Phinéas Flynn créé");

  // Créer Perry l'ornithorynque
  await db.insert(animals).values({
    nom: "Perry",
    type: "ornithorynque",
    age: 5,
    couleur: "bleu-vert",
    userId: phineasFlynn.id,
  });
  console.log("✅ Perry l'ornithorynque créé");

  console.log("🎉 Seeding terminé avec succès !");
  console.log(`
📊 Résumé:
  - 3 utilisateurs créés
  - 6 animaux créés
    * Michael Jackson: Bubbles (chimpanzé), Louie (chimpanzé), Muscles (tigre), Thriller (chat)
    * Bayek DeSiwa: Senu (aigle)
    * Phinéas Flynn: Perry (ornithorynque)
  `);

  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Erreur lors du seeding:", error);
  process.exit(1);
});
