import prisma from "../../src/database/db";
import { GamePostRequest } from "../../src/protocols";
import { createGenre } from "./genres-factory";
import { createPlatform } from "./platforms-factory";

export async function createValidGame(gameTitle: string, playtime: number, genre: string, platform: string) {
  const genreData = await createGenre();
  const platformData = await createPlatform();
  const game = {
    title: gameTitle,
    playtime: playtime,
    genre_id: genreData.id,
    platform_id: platformData.id,
  };

  const gameData = await createGame(game);

  return { genreData, platformData, gameData };
}

export async function createGame(game: GamePostRequest) {
  return prisma.games.create({
    data: game,
  });
}

export async function countGames() {
  return prisma.games.count();
}
