import { faker } from "@faker-js/faker";
import prisma from "../../src/database/db";
import { createGenre } from "./genres-factory";
import { createPlatform } from "./platforms-factory";

export async function createValidGame() {
  const genreData = await createGenre();
  const platformData = await createPlatform();
  const gameData = await prisma.games.create({
    data: {
      title: faker.commerce.productName(),
      playtime: faker.datatype.number(),
      genre_id: genreData.id,
      platform_id: platformData.id,
    },
  });

  return { genreData, platformData, gameData };
}
