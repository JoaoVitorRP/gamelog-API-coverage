import prisma from "../../src/database/db";
import { faker } from "@faker-js/faker";

export async function createPlatform() {
  return prisma.platforms.create({
    data: {
      platform: faker.internet.domainWord(),
    },
  });
}
