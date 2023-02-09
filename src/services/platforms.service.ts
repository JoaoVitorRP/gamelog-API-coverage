import { PlatformPostRequest } from "../protocols/index";
import { platformsRepository } from "../repositories/platforms.repository";

async function validatePlatformId(id: number) {
  const platforms = await platformsRepository.findPlatformById(id);

  if (!platforms) {
    throw {
      name: "PlatformNotFound",
      message: "Could not find a platform with this id!",
    };
  }

  return platforms;
}

async function postPlatform(platformData: PlatformPostRequest) {
  const duplicatedPlatform = await platformsRepository.findPlatformByName(platformData.platform);
  if (duplicatedPlatform) {
    throw {
      message: "This platform already exists!",
    };
  }

  return platformsRepository.createPlatform(platformData);
}

async function getPlatforms() {
  const platforms = await platformsRepository.findPlatforms();
  if (platforms.length === 0) {
    throw {
      message: "Platforms table is empty",
    };
  }
  return platforms;
}

export const platformsService = {
  validatePlatformId,
  postPlatform,
  getPlatforms,
};
