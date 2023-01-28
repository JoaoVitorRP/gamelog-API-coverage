import { Request, Response } from "express";
import { PlatformPostRequest } from "../protocols";
import { platformsService } from "../services/platforms.service.js";

export async function postPlatform(req: Request, res: Response) {
  const platformData = req.body as PlatformPostRequest;

  try {
    await platformsService.postPlatform(platformData);

    return res.sendStatus(201);
  } catch (err) {
    if (err.name === "DuplicatedPlatformName") return res.status(400).send(err.message);
    return res.status(500).send(err.message);
  }
}

export async function getPlatforms(req: Request, res: Response) {
  try {
    const platforms = await platformsService.getPlatforms();

    return res.status(200).send(platforms);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}
