import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import genresRouter from "./routes/genres.route.js";
import gamesRouter from "./routes/games.route.js";
import platformsRouter from "./routes/platforms.route.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(genresRouter);
app.use(gamesRouter);
app.use(platformsRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running in port: ${port}`));
