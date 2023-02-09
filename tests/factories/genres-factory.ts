import { faker } from "@faker-js/faker";
import prisma from "../../src/database/db";

export async function createGenre() {
  return prisma.genres.create({
    data: {
      genre: faker.word.adjective(),
    },
  });
}
