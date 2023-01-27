import { Request, Response } from "express";
import { GameIdParam, GamePlaytime, GamePostRequest, GameReturn, Genre } from "../protocols";
import { gamesService } from "../services/games.service.js";

export async function insertGame(req: Request, res: Response) {
  const game = req.body as GamePostRequest;

  try {
    await gamesService.createGame(game);
    return res.sendStatus(201);
  } catch (err) {
    if (err.name === "DuplicatedGameName") return res.status(400).send(err.message);
    if (err.name === "GenreNotFound") return res.status(404).send(err.message);
    if (err.name === "PlatformNotFound") return res.status(404).send(err.message);
    return res.status(500).send(err.message);
  }
}

export async function getGames(req: Request, res: Response) {
  const { genre } = req.query as Genre;

  try {
    let games: GameReturn[];

    if (genre) {
      games = await gamesService.getGamesByGenre(genre);
    } else {
      games = await gamesService.getGames();
    }

    return res.status(200).send(games);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function patchGame(req: Request, res: Response) {
  const { id } = req.params as GameIdParam;
  const { playtime } = req.body as GamePlaytime;

  try {
    await gamesService.updatePlaytime(playtime, Number(id));
    return res.sendStatus(201);
  } catch (err) {
    if (err.name === "GameNotFound") return res.status(404).send(err.message);
    if (err.message === `invalid input syntax for type integer: "${id}"`)
      return res.status(400).send("Param id must be an integer number");
    return res.status(500).send(err.message);
  }
}

export async function deleteGame(req: Request, res: Response) {
  const { id } = req.params as GameIdParam;

  try {
    await gamesService.deleteGame(Number(id));
    return res.sendStatus(200);
  } catch (err) {
    if (err.name === "GameNotFound") return res.status(404).send(err.message);
    if (err.message === `invalid input syntax for type integer: "${Number(id)}"`)
      return res.status(400).send("Param id must be an integer number");
    return res.status(500).send(err.message);
  }
}

export async function getPlaytimeAverage(req: Request, res: Response) {
  try {
    const average = await gamesService.getAveragePlaytime();

    return res.status(200).send(`Your average playtime is: ${average.toFixed(2)} minutes`);
  } catch (err) {
    if (err.name === "MissingGames") return res.status(400).send(err.message);
    return res.status(500).send(err.message);
  }
}
