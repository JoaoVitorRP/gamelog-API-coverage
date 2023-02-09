import { Request, Response } from "express";
import {
  GameIdParam,
  GamePlaytime,
  GamePostRequest,
  GameReturn,
  GenrePostRequest,
  PlatformPostRequest,
} from "../protocols";
import { gamesService } from "../services/games.service";

export async function postGame(req: Request, res: Response) {
  const gameData = req.body as GamePostRequest;

  try {
    await gamesService.createGame(gameData);
    return res.sendStatus(201);
  } catch (err) {
    if (err.name === "DuplicatedGameName") return res.status(409).send(err.message);
    if (err.name === "GenreNotFound") return res.status(404).send(err.message);
    if (err.name === "PlatformNotFound") return res.status(404).send(err.message);
  }
}

export async function getGames(req: Request, res: Response) {
  const { genre } = req.query as GenrePostRequest;
  const { platform } = req.query as PlatformPostRequest;

  try {
    let games: GameReturn[];

    if (genre) {
      games = await gamesService.getGamesByGenre(genre);
    } else if (platform) {
      games = await gamesService.getGamesByPlatform(platform);
    } else {
      games = await gamesService.getGames();
    }

    return res.status(200).send(games);
  } catch (err) {
    if (err.name === "InvalidQuery") return res.status(400).send(err.message);
    if (err.name === "GamesNotFound") return res.status(404).send(err.message);
  }
}

export async function patchGame(req: Request, res: Response) {
  const { id } = req.params as GameIdParam;
  const playtime = req.body as GamePlaytime;

  try {
    const updatedGame = await gamesService.updatePlaytime(playtime, Number(id));
    return res.status(201).send(updatedGame);
  } catch (err) {
    if (err.name === "GameNotFound") return res.status(404).send(err.message);
    if (err.name === "InvalidParam") return res.status(400).send(err.message);
  }
}

export async function deleteGame(req: Request, res: Response) {
  const { id } = req.params as GameIdParam;

  try {
    await gamesService.deleteGame(Number(id));
    return res.sendStatus(200);
  } catch (err) {
    if (err.name === "GameNotFound") return res.status(404).send(err.message);
    if (err.name === "InvalidParam") return res.status(400).send(err.message);
  }
}

export async function getPlaytimeAverage(req: Request, res: Response) {
  try {
    const average = await gamesService.getAveragePlaytime();

    return res.status(200).send(`Your average playtime is: ${average.toFixed(2)} minutes`);
  } catch (err) {
    return res.status(400).send(err.message);
  }
}
