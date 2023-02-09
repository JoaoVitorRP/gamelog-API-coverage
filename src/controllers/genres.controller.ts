import { Request, Response } from "express";
import { GenrePostRequest } from "../protocols";
import { genresService } from "../services/genres.service";

export async function insertGenre(req: Request, res: Response) {
  const genre = req.body as GenrePostRequest;

  try {
    await genresService.createGenre(genre);
    return res.sendStatus(201);
  } catch (err) {
    return res.status(409).send(err.message);
  }
}

export async function getGenres(req: Request, res: Response) {
  try {
    const genres = await genresService.getGenres();
    return res.status(200).send(genres);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}
