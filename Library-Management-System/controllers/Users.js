const pool = require('../db/config')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const jwtGenerate = require('../middleware/jwtGenerator')

const signup = async(req,res)=>{
    const {name, email, password, isadmin} = req.body

    if(!name || !email || !password)
        throw new BadRequestError('Please enter all credentials')

    let addUser = '',
    data = '',
    msg = ''

    const user = await pool.query('select * from users where email = $1',[email])
    if(user.rows.length === 1)
        throw new BadRequestError('Email id already exists')

    if(isadmin){
        addUser = `
            INSERT INTO users(name,email,password,isadmin)
            VALUES($1,$2,$3,$4)
        `
        data = await pool.query(addUser,[name,email,password,isadmin])
        msg = 'Admin signed up successfully'
    }        
    else{
        addUser = `
            INSERT INTO users(name,email,password)
            VALUES($1,$2,$3)
        `
        data = await pool.query(addUser,[name,email,password]),
        msg = 'Member signed up successfully'
    }

    const token = jwtGenerate(req.body)

    res.status(StatusCodes.CREATED).json({
        user : {
            name : name,
            email : email
        },
        token : token,
        msg : msg
    })
}

const login = async(req,res)=>{
    const {email, password} = req.body
    
    const user = await pool.query('select * from users where email = $1',[email])
    if(user.rows.length === 0)
        throw new NotFoundError('User not found')

    if(password != user.rows[0].password)
        throw new BadRequestError('Password not matched.')

    const userName = user.rows[0].name
    const userEmail = user.rows[0].email

    const token = jwtGenerate(user.rows[0])

    res.status(StatusCodes.OK).json({
        user : {
            name : userName,
            email : userEmail
        },
        token : token,
        msg : "Logged in successfully"
    })
}

module.exports = {
    signup,
    login
}