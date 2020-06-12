const express = require('express')

const productsController = require('../controllers/product')

const router = express.Router()

router.get('/add-product', productsController.getAddProduct)

router.post('/add-product', productsController.pushProduct)

module.exports = router
