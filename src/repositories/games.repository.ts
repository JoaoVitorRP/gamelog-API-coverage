import prisma from "../database/db.js";

function createGame(title: string, playtime: number, genre_id: number) {
  return prisma.games.create({
    data: {
      title: title,
      playtime: playtime,
      genre_id: genre_id,
    },
  });
}

function findGames() {
  return prisma.games.findMany({
    select: {
      id: true,
      title: true,
      playtime: true,
      genres: {
        select: {
          genre: true,
        },
      },
    },
  });
}

function findGamesByGenre(genre: string) {
  return prisma.games.findMany({
    select: {
      id: true,
      title: true,
      playtime: true,
      genres: {
        select: {
          genre: true,
        },
      },
    },
    where: {
      genres: {
        genre: {
          startsWith: genre,
          mode: "insensitive",
        },
      },
    },
  });
}

function findGameByTitle(title: string) {
  return prisma.games.findUnique({
    where: {
      title: title,
    },
  });
}

function findGameById(id: number) {
  return prisma.games.findUnique({
    where: {
      id: id,
    },
  });
}

function updatePlaytime(playtime: number, id: number) {
  return prisma.games.update({
    where: {
      id: id,
    },
    data: {
      playtime: playtime,
    },
  });
}

function deleteGame(id: number) {
  return prisma.games.delete({
    where: {
      id: id,
    },
  });
}

function getPlaytimeAverage() {
  return prisma.games.aggregate({
    _avg: {
      playtime: true,
    },
  });
}

export const gamesRepository = {
  createGame,
  findGames,
  findGamesByGenre,
  findGameByTitle,
  findGameById,
  updatePlaytime,
  deleteGame,
  getPlaytimeAverage,
};
