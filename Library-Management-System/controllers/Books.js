const { StatusCodes } = require('http-status-codes')
const pg = require('../db/config')
const { NotFoundError, UnauthenticatedError, BadRequestError } = require('../errors')

const getAllBooks = async(req,res)=>{
    const getAllBooksQuery = `
        select * from books join genre on books.genre_id = genre.genre_id
    `

    const data = await pg.query(getAllBooksQuery)

    res.status(StatusCodes.OK).json({
        books : data.rows,
        nbHits : data.rows.length
    })
}

const addBook = async(req,res)=>{
    const {isadmin} = req.user

    if(!isadmin)
        throw new UnauthenticatedError('Members cannot add or delete books')

    const {title, price, author, published_date, rating, genre} = req.body

    if(!title || !price || !author || !published_date || !rating || !genre)
        throw new BadRequestError('Please enter credentials')

    const genreData = await pg.query('select genre_id from genre where genre = $1', [genre])

    if(genreData.rows.length === 0)
        throw new NotFoundError('Genre does not exists')

    const {genre_id} = genreData.rows[0]

    const date = new Date(published_date)
    if(date == "Invalid Date")
        throw new BadRequestError('Please select valid date')

    const addBookQuery = `
        INSERT INTO books(title, price, author, published_date, rating, genre_id)
        VALUES($1,$2,$3,$4,$5,$6)
    `

    const data = await pg.query(addBookQuery,[title, price, author, published_date, rating, genre_id])

    res.status(StatusCodes.CREATED).json({
        book : {
            title : title,
            price : price,
            author : author,
            published_date : published_date,
            rating : rating,
            genre : genre
        },
        msg : "Book added successfully in library."
    })
}

const getABook = async(req,res)=>{
    const {book_id} = req.params
    const getABookQuery = `
        select * from books join genre on books.genre_id = genre.genre_id where book_id = $1
    `

    const data = await pg.query(getABookQuery,[book_id])

    if(data.rows.length === 0)
        throw new NotFoundError('Book not found in library')

    res.status(StatusCodes.OK).json({
        books : data.rows,
    })
}

const updateBook = async(req,res)=>{
    res.send('update book')
}

const deleteBook = async(req,res)=>{
    const {isadmin} = req.user

    if(!isadmin)
        throw new UnauthenticatedError('Members cannot add or delete books')

    const {book_id} = req.params
    const getABookQuery = `
        select * from books where book_id = $1
    `

    const data = await pg.query(getABookQuery,[book_id])

    if(data.rows.length === 0)
        throw new NotFoundError('Book not found in library')

    const deleteBookQuery = `
        delete from books where book_id = $1
    `

    await pg.query(deleteBookQuery,[book_id])

    res.status(StatusCodes.OK).json({msg : "Books successfully deleted from library"})
}

module.exports = {
    getAllBooks,
    addBook,
    getABook,
    updateBook,
    deleteBook
}