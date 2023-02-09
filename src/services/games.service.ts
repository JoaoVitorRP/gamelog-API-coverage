import { GamePlaytime, GamePostRequest } from "../protocols/index";
import { gamesRepository } from "../repositories/games.repository";
import { genresService } from "./genres.service";
import { platformsService } from "./platforms.service";

async function validateUniqueGame(title: string) {
  const gameData = await gamesRepository.findGameByTitle(title);
  if (gameData) {
    throw {
      name: "DuplicatedGameName",
      message: "There is already a game with this name!",
    };
  }
}

async function validateGameId(id: number) {
  if (!id) {
    throw {
      name: "InvalidParam",
      message: "Id must be an integer",
    };
  }

  const gameData = await gamesRepository.findGameById(id);
  if (!gameData) {
    throw {
      name: "GameNotFound",
      message: "Could not find a game with this id!",
    };
  }
}

async function getGames() {
  const games = await gamesRepository.findGames();
  if (games.length === 0) {
    throw {
      name: "GamesNotFound",
      message: "Games table is empty",
    };
  }
  return games;
}

async function getGamesByGenre(genre: string) {
  if (Number(genre)) {
    throw {
      name: "InvalidQuery",
      message: "Genre must be a string",
    };
  }

  const games = await gamesRepository.findGamesByGenre(genre);

  if (games.length === 0) {
    throw {
      name: "GamesNotFound",
      message: "Could not find games with this genre",
    };
  }

  return games;
}

async function getGamesByPlatform(platform: string) {
  if (Number(platform)) {
    throw {
      name: "InvalidQuery",
      message: "Platform must be a string",
    };
  }

  const games = await gamesRepository.findGamesByPlatform(platform);

  if (games.length === 0) {
    throw {
      name: "GamesNotFound",
      message: "Could not find games from this platform",
    };
  }

  return games;
}

async function createGame(gameData: GamePostRequest) {
  await validateUniqueGame(gameData.title);

  await genresService.validateGenreId(gameData.genre_id);

  await platformsService.validatePlatformId(gameData.platform_id);

  return gamesRepository.createGame(gameData);
}

async function updatePlaytime(playtime: GamePlaytime, id: number) {
  await validateGameId(id);

  return gamesRepository.updatePlaytime(playtime, id);
}

async function deleteGame(id: number) {
  await validateGameId(id);

  return gamesRepository.deleteGame(id);
}

async function getAveragePlaytime() {
  const gameData = await gamesRepository.findGames();
  if (gameData.length <= 1) {
    throw {
      message: "Please, add two or more games before trying to calculate average playtime",
    };
  }

  const { _avg } = await gamesRepository.getPlaytimeAverage();

  return _avg.playtime;
}

export const gamesService = {
  getGames,
  getGamesByGenre,
  getGamesByPlatform,
  createGame,
  updatePlaytime,
  deleteGame,
  getAveragePlaytime,
};
