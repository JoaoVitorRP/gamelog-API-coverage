import { GenrePostRequest } from "../protocols/index";
import { genresRepository } from "../repositories/genres.repository";

async function validateGenreId(id: number) {
  const genreData = await genresRepository.findGenreById(id);
  if (!genreData) {
    throw {
      name: "GenreNotFound",
      message: "Could not find a genre with this id!",
    };
  }
}

async function createGenre(genreData: GenrePostRequest) {
  const duplicatedGenre = await genresRepository.findGenreByName(genreData.genre);
  if (duplicatedGenre) {
    throw {
      message: "This genre already exists!",
    };
  }

  return genresRepository.createGenre(genreData);
}

function getGenres() {
  return genresRepository.findGenres();
}

export const genresService = {
  validateGenreId,
  createGenre,
  getGenres,
};
