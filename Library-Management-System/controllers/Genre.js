const pg = require('../db/config')
const { UnauthenticatedError, BadRequestError, NotFoundError } = require('../errors')
const {StatusCodes} = require('http-status-codes')

const addGenre = async(req,res)=>{
    const {isadmin} = req.user

    if(!isadmin)
        throw new UnauthenticatedError('Members cannot add or delete genres.')

    const {genre} = req.body

    if(!genre)
        throw new BadRequestError('Please add credentials')

    const isDuplicateQuery = await pg.query('select from genre where genre = $1',[genre])
    if(isDuplicateQuery.rows.length === 1)
        throw new BadRequestError('Genre already exists')

    const addQuery = `
        INSERT INTO genre(genre)
        VALUES($1)
    `
    const data = await pg.query(addQuery,[genre])

    res.status(StatusCodes.CREATED).json({
        data : genre,
        msg : 'Genre added successfully'
    })
}

const getAllGenres = async(req,res)=>{
    const getGenresQuery = `
        select * from genre
    `
    const data = await pg.query(getGenresQuery)
    res.status(StatusCodes.OK).json({
        genres : data.rows,
        nbHits : data.rows.length
    })
}

const deleteGenre = async(req,res)=>{
    const {isadmin} = req.user

    if(!isadmin)
        throw new UnauthenticatedError('Members cannot add or delete genres.')

    const {genre} = req.params

    const isGenreExists = await pg.query(`select from genre where genre = $1`,[genre])
    if(isGenreExists.rows.length === 0)
        throw new NotFoundError('Genre does not exists')
    
    const deleteQuery = `
        delete from genre where genre = $1
    `
    await pg.query(deleteQuery,[genre])

    res.status(StatusCodes.OK).json({msg : `${genre} deleted successfully`})
}

module.exports = {
    addGenre,
    getAllGenres,
    deleteGenre
}