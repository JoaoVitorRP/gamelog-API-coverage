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

async function getGenres() {
  const genres = await genresRepository.findGenres();
  if (genres.length === 0) {
    throw {
      message: "Genres table is empty",
    };
  }
  return genres;
}

export const genresService = {
  validateGenreId,
  createGenre,
  getGenres,
};
