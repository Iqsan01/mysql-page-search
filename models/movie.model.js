import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Movie = db.define('movies', {
    name: {
        type: DataTypes.STRING
    },
    img: {
        type: DataTypes.STRING
    },
    year: {
        type: DataTypes.STRING
    },
    genre: {
        type: DataTypes.STRING
    },
    rating: {
        type: DataTypes.STRING
    }
},
    { freezeTableName: true }
);

export default Movie;

// (async () => {
//     db.sync({alter: true});
// })()