import Movie from "../models/movie.model.js";
import { Op } from "sequelize";

export const getMovies = async (req, res) => {
    //variabel page ini akan berisi currend page nntinya
    //karna req.query.page bernilai string maka kita membutuhkan parseInt untuk mengkonversi nilainya menjadi int
    //query pagenya kita set secara default jadi 0
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10; //limit page yang akan tampil kita set jadi 10
    const search = req.query.search || ""; //search bernilai string jadi tidak butuh parseInt kita set juga jadi empty string dengan ""
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
        //order gunanya untuk mengurutkan data bedasarkan data terbaru agar data terbaru ditampilkan di halaman depan bedasarkan createdAt dan DESC 
        order: [
            ['createdAt', 'DESC']
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


export const createMovie = async (req, res, next) => {
    try {
        const { name, img, year, genre, rating } = req.body;
        if (!name || !img || !year || !genre || !rating) return res.status(404).json({ meg: "Masukkan data!" });
        await Movie.create(req.body);
        res.status(201).json({ msg: "Created." })
    } catch (err) {
        next(err);
    }
};