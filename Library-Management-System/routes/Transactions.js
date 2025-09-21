const express = require('express')
const router = express.Router()

const { 
    addTransaction, 
    updateTransaction,
    deleteTransaction,
    approveTransaction,
    getAllTransactions,
    getATransaction
} = require('../controllers/Transactions')

router.route('/').post(addTransaction).get(getAllTransactions)
router.route('/:transaction_id').patch(updateTransaction).delete(deleteTransaction).get(getATransaction)
router.route('/approve/:transaction_id').patch(approveTransaction)

module.exports = router