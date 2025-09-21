const express = require('express')
const router = express.Router()

const { getAllBooks, 
    getABook, 
    addBook,
    updateBook,
    deleteBook
} = require('../controllers/Books')

router.route('/').get(getAllBooks).post(addBook)
router.route('/:book_id').get(getABook).patch(updateBook).delete(deleteBook)

module.exports = router