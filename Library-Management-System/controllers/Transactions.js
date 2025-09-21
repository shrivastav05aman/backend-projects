const { UnauthenticatedError, BadRequestError, NotFoundError } = require("../errors")
const pg = require('../db/config')
const { StatusCodes } = require("http-status-codes")

const addTransaction = async(req,res)=>{
    const {isadmin} = req.user
    if(isadmin)
        throw new UnauthenticatedError('Staff cannot add transactions')

    const {from_date, to_date, book} = req.body

    if(new Date(from_date) == 'Invalid Date' || new Date(to_date) == 'Invalid Date')
        throw new BadRequestError('Please enter valid date')

    const bookData = await pg.query('select * from books where title = $1',[book])
    if(bookData.rows.length === 0)
        throw new NotFoundError('Book is not availabe in library')

    const {book_id, title, status} = bookData.rows[0]
    const {user_id, name} = req.user

    if(status === 'check-out')
        throw new BadRequestError('Book is out of stock')

    const addTransactionQuery = `
        INSERT INTO transactions(from_date, to_date, user_id, book_id)
        VALUES($1,$2,$3,$4)
    `

    await pg.query(addTransactionQuery, [from_date, to_date, user_id, book_id])
    await pg.query('UPDATE books SET status = $1 where book_id = $2',['check-out',book_id])
    
    res.status(StatusCodes.CREATED).json({
        transaction : {
            user_id : user_id,
            book_id : book_id,
            name : name,
            from_date : from_date,
            title : title,
            to_date : from_date,
        },
        msg : 'Transaction added successfully'
    })
}

const getAllTransactions = async(req,res)=>{
    const {isadmin} = req.user
    if(!isadmin)
        throw new UnauthenticatedError('Members cannot view transactions')

    const getAllTransactionsQuery = `
        select transactions.transaction_id,
        transactions.from_date,
        transactions.to_date,
        transactions.return_date,
        transactions.status as transaction_status,
        users.user_id,
        users.name,
        users.email,
        books.book_id,
        books.title,
        books.price,
        books.author,
        books.published_date,
        books.rating,
        books.status as book_status
        from transactions join books on books.book_id = transactions.book_id
        join users on 
        users.user_id = transactions.user_id        
    `

    const data = await pg.query(getAllTransactionsQuery)
    if(data.rows.length === 0)
        throw new NotFoundError('There is not any transaction in library')

    res.status(StatusCodes.OK).json({
        transactions : data.rows,
        nbHits : data.rows.length
    })
}

const getATransaction = async(req,res)=>{
    const {isadmin} = req.user
    if(!isadmin)
        throw new UnauthenticatedError('Members cannot view transactions')

    const {transaction_id} = req.params

    const getAllTransactionsQuery = `
        select transactions.transaction_id,
        transactions.from_date,
        transactions.to_date,
        transactions.return_date,
        transactions.status as transaction_status,
        users.user_id,
        users.name,
        users.email,
        books.book_id,
        books.title,
        books.price,
        books.author,
        books.published_date,
        books.rating,
        books.status as book_status
        from transactions join books on books.book_id = transactions.book_id
        join users on 
        users.user_id = transactions.user_id
        where transaction_id = $1
    `

    const data = await pg.query(getAllTransactionsQuery,[transaction_id])

    if(data.rows.length === 0)
        throw new NotFoundError('There is not any transaction in library')
    
    res.status(StatusCodes.OK).json({
        transaction : data.rows
    })
}

const approveTransaction = async(req,res)=>{
    const {isadmin} = req.user
    if(isadmin)
        throw new UnauthenticatedError('Staff cannot add transactions')

    const {transaction_id} = req.params
    const approveTransactionQuery = `
        UPDATE transactions SET status = $1 where transaction_id = $2
    `

    const data = await pg.query(approveTransactionQuery,['approved',transaction_id])
    console.log(data.rows)
    res.status(StatusCodes.CREATED).json({msg : 'Transaction approved successfully'})
}

const updateTransaction = async(req,res)=>{
    const {isadmin} = req.user
    if(!isadmin)
        throw new UnauthenticatedError('Staff cannot add transactions')

    const {transaction_id} = req.params
    const {return_date} = req.body
    const transaction = await pg.query('select * from transactions where transaction_id = $1',[transaction_id])
    
    if(new Date(return_date) == 'Invalid Date')
        throw new BadRequestError('Please enter valid date')

    const {from_date, book_id} = transaction.rows[0]
    
    if((from_date < new Date(return_date)) === false)
        throw new BadRequestError('Return date should be in after from_date')

    const updateTransactionQuery = `
        update transactions set return_date = $1, status = $2 where transaction_id = $3
    `

    await pg.query(updateTransactionQuery,[return_date,'returned',transaction_id])
    await pg.query('update books set status = $1 where book_id = $2',['available',book_id])
    res.status(StatusCodes.CREATED).json({msg : 'Transaction updated successfully'})
}

const deleteTransaction = async(req,res)=>{
    const {isadmin} = req.user
    if(!isadmin)
        throw new UnauthenticatedError('Staff cannot add transactions')

    const {transaction_id} = req.params

    const transaction = await pg.query('select * from transactions where transaction_id = $1',[transaction_id])
    const {status} = transaction.rows[0]

    if(status != 'returned')
        throw new BadRequestError('Sorry! You cannot delete pending transaction.')

    const deleteTransactionQuery = `
        delete from transactions where transaction_id = $1
    `
    await pg.query(deleteTransactionQuery,[transaction_id])
    res.status(StatusCodes.OK).json({msg : 'Transaction deleted successfully.'})
}

module.exports = {
    addTransaction,
    approveTransaction,
    updateTransaction,
    deleteTransaction,
    getATransaction,
    getAllTransactions
}
