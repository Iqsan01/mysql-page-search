import "dotenv/config";
import express from "express";
import movies from "./routers/movieRoute.js";

const app = express();

const port = process.env.PORT || 3000

app.use(express.json())

app.use('/film', movies)

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
})