const express = require('express')
const router = express.Router()

const { 
    getAllGenres, 
    deleteGenre,
    addGenre
} = require('../controllers/Genre')

router.route('/').get(getAllGenres).post(addGenre)
router.route('/:genre').delete(deleteGenre)

module.exports = router