import Movie from "../models/movie.model.js";
import { Op } from "sequelize";

export const getMovies = async (req, res) => {
    //variabel page ini akan berisi currend page nntinya
    //karna req.query.page bernilai string maka kita membutuhkan parseInt untuk mengkonversi nilainya menjadi int
    //query pagenya kita set secara default jadi 0
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10; //limit page yang akan tampil kita set jadi 10
    const search = req.query.search_query || ""; //search bernilai string jadi tidak butuh parseInt kita set juga jadi empty string dengan ""
    const offset = limit * page; //offsetnya diambil dari limit di kali dengan page
    //count adalah fungsi sequelize yang menghitung semua record bedasarkan kata kunci tertentu yaitu name dan genre
    //Op atau disebut operator dimana kita mengunakan operator or untuk mencari kata kunci name dan genre
    //Op.like gunanya tidak perlu mencari nama atau genre secara spesifik contohnya seperti mencari nama film spider man nnti yang akan muncul semua list film spider man
    //gunanya '%'+search+'%' tanda '%' gunanya untuk pencarian, + berati menambahkan varibel search, +'%' terakhir gunanya bisa mengabil dari depan atau belakang karakter dari nama film yang ingin kita cari
    const totalRows = await Movie.count({
        where: {
            [Op.or]: [{name: {
                [Op.like]: '%'+search+'%'
            }}, {genre: {
                [Op.like]: '%'+search+'%'
            }}]
        }
    });
    //Math.ceil gunanya untuk mengabil nilai value tertinggi dari hasil totalRows dibagi dgn limit misalnya jika hasil baginya bernilai 5.5 maka akan dibulatkan menjadi 6 
    const totalPage = Math.ceil(totalRows / limit);
    const movies = await Movie.findAll({
        where: {
            [Op.or]: [{name: {
                [Op.like]: '%'+search+'%'
            }}, {genre: {
                [Op.like]: '%'+search+'%'
            }}]
        },
        //menambahkan obsi lainnya dari variabel diatas
        offset: offset,
        limit: limit,
        //order gunanya untuk mengurutkan data bedasarkan data terbaru agar data terbaru ditampilkan di halaman depan
        //order bedasarkan id dan DESC
        order: [
            ['id', 'DESC']
        ]
    });
    //respon
    res.json({
        movies: movies,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage
    })
};

// export const tes = async (req, res, next) => {
//     try {
//         const page = parseInt(req.query.page) - 1 || 0;
//         const limit = parseInt(req.query.limit) || 5;
//         const search = req.query.search || "";
//         let sort = req.query.sort || "rating";
//         let genre = req.query.genre || "All";

//         const genreOptions = [
//             "Action",
//             "Romance",
//             "Fantasy",
//             "Drama",
//             "Crime",
//             "Adventure",
//             "Thriller",
//             "Sci-fi",
//             "Music",
//             "Family",
//         ];

//         genre === "All"
//             ? (genre = [...genreOptions])
//             : (genre = req.query.genre.split(","));
//         req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

//         let sortBy = {};
//         if (sort[1]) {
//             sortBy[sort[0]] = sort[1];
//         } else {
//             sortBy[sort[0]] = "asc";
//         }

//         const movies = await Movie.findAll({
//             where: {
//                 name: { [Op.iLike]: `%${search}%` },
//                 genre: { [Op.in]: [...genre] },
//             },
//             order: [[sortBy[0], sortBy[1]]],
//             offset: page * limit,
//             limit: limit
//         });

//         const total = await Movie.count({
//             where: {
//                 name: { [Op.iLike]: `%${search}%` },
//                 genre: { [Op.in]: [...genre] },
//             }
//         });

//         const response = {
//             error: false,
//             total,
//             page: page + 1,
//             limit,
//             genres: genreOptions,
//             movies,
//         };

//         res.status(200).json(response);
//     } catch (err) {
//         next(err);
//         res.status(500).json({ error: true, message: "Internal Server Error" });
//     }
// };


export const createMovie = async (req, res, next) => {
    try {
        const { name, img, year, genre, rating } = req.body;
        if (!name || !img || !year || !genre || !rating) return res.status(404).json({ meg: "Masukkan data!" });
        await Movie.create(req.body);
        res.status(201).json({ msg: "Created." })
    } catch (err) {
        console.log(err);
    }
};