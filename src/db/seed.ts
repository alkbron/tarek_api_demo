import { db } from "./index";
import { countries } from "./schema";

const countriesData = [
  { nom: "France", demonyme: "Français(e)", emoji: "🇫🇷" },
  { nom: "États-Unis", demonyme: "Américain(e)", emoji: "🇺🇸" },
  { nom: "Espagne", demonyme: "Espagnol(e)", emoji: "🇪🇸" },
  { nom: "Allemagne", demonyme: "Allemand(e)", emoji: "🇩🇪" },
  { nom: "Italie", demonyme: "Italien(ne)", emoji: "🇮🇹" },
  { nom: "Royaume-Uni", demonyme: "Britannique", emoji: "🇬🇧" },
  { nom: "Japon", demonyme: "Japonais(e)", emoji: "🇯🇵" },
  { nom: "Canada", demonyme: "Canadien(ne)", emoji: "🇨🇦" },
  { nom: "Brésil", demonyme: "Brésilien(ne)", emoji: "🇧🇷" },
  { nom: "Australie", demonyme: "Australien(ne)", emoji: "🇦🇺" },
  { nom: "Chine", demonyme: "Chinois(e)", emoji: "🇨🇳" },
  { nom: "Inde", demonyme: "Indien(ne)", emoji: "🇮🇳" },
  { nom: "Mexique", demonyme: "Mexicain(e)", emoji: "🇲🇽" },
  { nom: "Russie", demonyme: "Russe", emoji: "🇷🇺" },
  { nom: "Corée du Sud", demonyme: "Sud-Coréen(ne)", emoji: "🇰🇷" },
];

export async function seedCountries() {
  console.log("🌍 Début du seed des pays...");

  // Vérifier si la table est déjà remplie
  const existingCountries = await db.query.countries.findMany();

  if (existingCountries.length > 0) {
    console.log(
      `✓ ${existingCountries.length} pays déjà présents dans la base`
    );
    return;
  }

  // Insérer les pays
  await db.insert(countries).values(countriesData);

  console.log(`✓ ${countriesData.length} pays ajoutés avec succès !`);
}

// Exécuter le seed si le script est lancé directement
if (import.meta.main) {
  seedCountries()
    .then(() => {
      console.log("✓ Seed terminé avec succès !");
      process.exit(0);
    })
    .catch((error) => {
      console.error("✗ Erreur lors du seed :", error);
      process.exit(1);
    });
}
