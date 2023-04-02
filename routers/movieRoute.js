import { Router } from "express";
import { createMovie, getMovies } from "../controllers/movieController.js";

const router = Router();

router.get("/movies", getMovies);
router.post('/', createMovie)

export default router;