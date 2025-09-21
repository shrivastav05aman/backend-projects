const jwt = require('jsonwebtoken')
const { UnauthorisedError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const authMiddleware = async(req, res, next)=>{
    const authorization = req.headers.authorization
    if(!authorization || !authorization.startsWith('Bearer ')){
        throw new UnauthorisedError('Unauthenticated user')
    }

    const token = authorization.split(" ")[1]
    req.token = token

    
    try {                    
        req.user = jwt.verify(token, process.env.JWT_SECRET)        
        next()
    } catch (error) {
        throw new UnauthorisedError('Unauthenticated user')
    }

    
        
}

module.exports = authMiddleware