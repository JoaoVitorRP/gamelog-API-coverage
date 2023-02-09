import { faker } from "@faker-js/faker";
import supertest from "supertest";
import app from "../../src/app";
import prisma from "../../src/database/db";
import { createGenre, createPlatform, createValidGame } from "../factories";
import { cleanDb, disconnectDb } from "../helpers";

const server = supertest(app);

afterAll(async () => {
  await disconnectDb();
});

beforeEach(async () => {
  await cleanDb();
});

describe("GET /games", () => {
  it("Should respond with status 200 and with games data", async () => {
    const { genreData, platformData, gameData } = await createValidGame();

    const response = await server.get("/games");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: gameData.id,
        title: gameData.title,
        playtime: gameData.playtime,
        genres: {
          genre: genreData.genre,
        },
        platforms: {
          platform: platformData.platform,
        },
      },
    ]);
  });
});

describe("GET /games?genre=", () => {
  it("Should respond with status 404 if there are no games with given genre", async () => {
    const response = await server.get(`/games?genre=${faker.word.adjective()}`);
    expect(response.status).toBe(404);
  });

  it("Should respond with status 400 if given genre isn't a string", async () => {
    const response = await server.get(`/games?genre=${faker.datatype.number({ min: 1 })}`);
    expect(response.status).toBe(400);
  });

  it("Should respond with status 200 and with games data", async () => {
    const { genreData, platformData, gameData } = await createValidGame();

    const response = await server.get(`/games?genre=${genreData.genre}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: gameData.id,
        title: gameData.title,
        playtime: gameData.playtime,
        genres: {
          genre: genreData.genre,
        },
        platforms: {
          platform: platformData.platform,
        },
      },
    ]);
  });
});

describe("GET /games?platform=", () => {
  it("Should respond with status 404 if there are no games from given platform", async () => {
    const response = await server.get(`/games?platform=${faker.internet.domainWord()}`);
    expect(response.status).toBe(404);
  });

  it("Should respond with status 400 if given platform isn't a string", async () => {
    const response = await server.get(`/games?platform=${faker.datatype.number({ min: 1 })}`);
    expect(response.status).toBe(400);
  });

  it("Should respond with status 200 and with games data", async () => {
    const { genreData, platformData, gameData } = await createValidGame();

    const response = await server.get(`/games?platform=${platformData.platform}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: gameData.id,
        title: gameData.title,
        playtime: gameData.playtime,
        genres: {
          genre: genreData.genre,
        },
        platforms: {
          platform: platformData.platform,
        },
      },
    ]);
  });
});

describe("GET /games/playtime-avg", () => {
  it("Should respond with status 400 if there are less than 2 games in the database", async () => {
    const response = await server.get("/games/playtime-avg");
    expect(response.status).toBe(400);
  });

  it("Should respond with status 200 and with playtime average", async () => {
    const gameOne = await createValidGame();
    const playtimeOne = gameOne.gameData.playtime;
    const gameTwo = await createValidGame();
    const playtimeTwo = gameTwo.gameData.playtime;
    const averagePlaytime = (playtimeOne + playtimeTwo) / 2;

    const response = await server.get("/games/playtime-avg");
    expect(response.status).toBe(200);
    expect(response.text).toEqual(`Your average playtime is: ${averagePlaytime.toFixed(2)} minutes`);
  });
});

describe("POST /games", () => {
  it("Should respond with status 422 when body is invalid", async () => {
    const response = await server.post("/games").send({
      title: faker.commerce.productName(),
    });
    expect(response.status).toBe(422);
  });

  it("Should respond with status 409 when game already exists", async () => {
    const { genreData, platformData, gameData } = await createValidGame();

    const response = await server.post("/games").send({
      title: gameData.title,
      playtime: faker.datatype.number(),
      genre_id: genreData.id,
      platform_id: platformData.id,
    });
    expect(response.status).toBe(409);
  });

  it("Should respond with status 404 when given genre doesn't exist", async () => {
    const platformData = await createPlatform();

    const response = await server.post("/games").send({
      title: faker.commerce.productName(),
      playtime: faker.datatype.number(),
      genre_id: faker.datatype.number(),
      platform_id: platformData.id,
    });
    expect(response.status).toBe(404);
  });

  it("Should respond with status 404 when given platform doesn't exist", async () => {
    const genreData = await createGenre();

    const response = await server.post("/games").send({
      title: faker.commerce.productName(),
      playtime: faker.datatype.number(),
      genre_id: genreData.id,
      platform_id: faker.datatype.number(),
    });
    expect(response.status).toBe(404);
  });

  it("Should respond with status 201 and insert a new game in the database", async () => {
    const genreData = await createGenre();
    const platformData = await createPlatform();
    const gameTitle = faker.commerce.productName();
    const playtime = faker.datatype.number();

    const response = await server.post("/games").send({
      title: gameTitle,
      playtime: playtime,
      genre_id: genreData.id,
      platform_id: platformData.id,
    });
    expect(response.status).toBe(201);

    const entityCreated = await prisma.games.findUnique({
      where: {
        title: gameTitle,
      },
    });
    expect(entityCreated).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        title: gameTitle,
        playtime: playtime,
        genre_id: genreData.id,
        platform_id: platformData.id,
      })
    );
  });
});

describe("PATCH /games/:id", () => {
  it("Should respond with status 422 when body is invalid", async () => {
    const response = await server.patch(`/games/${faker.datatype.number({ min: 1 })}`).send({
      play: 9000,
    });
    expect(response.status).toBe(422);
  });

  it("Should respond with status 404 when given game doesn't exist", async () => {
    const response = await server.patch(`/games/${faker.datatype.number({ min: 1 })}`).send({
      playtime: 9000,
    });
    expect(response.status).toBe(404);
  });

  it("Should respond with status 400 if given id is not a number", async () => {
    const response = await server.patch(`/games/${faker.word.noun()}`).send({
      playtime: 9000,
    });
    expect(response.status).toBe(400);
  });

  it("Should respond with status 201 and send game data", async () => {
    const { gameData } = await createValidGame();
    const newPlaytime = faker.datatype.number();

    const response = await server.patch(`/games/${gameData.id}`).send({
      playtime: newPlaytime,
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: gameData.id,
      title: gameData.title,
      playtime: newPlaytime,
      genre_id: gameData.genre_id,
      created_at: gameData.created_at.toISOString(),
      platform_id: gameData.platform_id,
    });
  });
});

describe("DELETE /games/:id", () => {
  it("Should respond with status 404 when given game doesn't exist", async () => {
    const response = await server.delete(`/games/${faker.datatype.number({ min: 1 })}`);
    expect(response.status).toBe(404);
  });

  it("Should respond with status 400 if given id is not a number", async () => {
    const response = await server.delete(`/games/${faker.word.noun()}`);
    expect(response.status).toBe(400);
  });

  it("Should respond with status 200 and delete game from the database", async () => {
    const { gameData } = await createValidGame();

    const response = await server.delete(`/games/${gameData.id}`);
    expect(response.status).toBe(200);

    const gameCount = await prisma.games.count();
    expect(gameCount).toEqual(0);
  });
});
