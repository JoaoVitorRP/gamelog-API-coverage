import { faker } from "@faker-js/faker";
import supertest from "supertest";
import app from "../../src/app";
import prisma from "../../src/database/db";
import { createPlatform } from "../factories";
import { cleanDb, disconnectDb } from "../helpers";

const server = supertest(app);

afterAll(async () => {
  await disconnectDb();
});

beforeEach(async () => {
  await cleanDb();
});

describe("GET /platforms", () => {
  it("Should respond with status 404 when table is empty", async () => {
    const response = await server.get("/platforms");
    expect(response.status).toBe(404);
  });

  it("Should respond with status 200 and with platforms data", async () => {
    const platformData = await createPlatform();

    const response = await server.get("/platforms");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: platformData.id,
        platform: platformData.platform,
      },
    ]);
  });
});

describe("POST /platforms", () => {
  it("Should respond with status 422 when body is invalid", async () => {
    const response = await server.post("/platforms").send({
      name: "Steam",
    });

    expect(response.status).toBe(422);
  });

  it("Should respond with status 409 when platform already exists", async () => {
    const platformData = await createPlatform();

    const response = await server.post("/platforms").send({
      platform: platformData.platform,
    });

    expect(response.status).toBe(409);
  });

  it("Should respond with status 201 and insert a new platform in the database", async () => {
    const platformName = faker.internet.domainWord();
    const response = await server.post("/platforms").send({
      platform: platformName,
    });
    expect(response.status).toBe(201);

    const entityCreated = await prisma.platforms.findUnique({
      where: {
        platform: platformName,
      },
    });
    expect(entityCreated).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        platform: platformName,
      })
    );
  });
});
