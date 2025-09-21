require('dotenv').config()
const express = require('express')
const app = express()

const errorHandlerMiddleware = require('./middleware/errorHandlerMiddleware')
const notFoundMiddleware = require('./middleware/not-found')
const userRouter = require('./routes/Users')
const bookRouter = require('./routes/Books')
const genreRouter = require('./routes/Genre')
const transactionRouter = require('./routes/Transactions')
const authMiddleware = require('./middleware/auth')

//middleware
app.use(express.json())
app.use('/api/v1',userRouter)
app.use('/api/v1/book',authMiddleware,bookRouter)
app.use('/api/v1/genre',authMiddleware,genreRouter)
app.use('/api/v1/transaction',authMiddleware,transactionRouter)

app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

const port = 3000

const start = async() => {
    app.listen(port, () => {
        console.log(`server is listening on port ${port}`)
    })
}

start()