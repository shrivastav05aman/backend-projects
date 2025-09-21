const jwt = require('jsonwebtoken')

const jwtGenerate = (data)=>{
    const token = jwt.sign(data, process.env.JWT_SECRET,{
        expiresIn : '30d'
    })

    return token
}

module.exports = jwtGenerate