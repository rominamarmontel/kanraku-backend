const router = require('express').Router()
const Product = require('./../models/Product.model')

/* All of the routes here are prefixed by /api/products */

/* GET all products */
router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    next(error)
  }
})

/* GET one Product */
router.get('/:id', async (req, res, next) => {
  try {
    const oneProduct = await Product.findById(req.params.id)
    res.json({ oneProduct, message: 'Here you go, have fun!' })
  } catch (error) {
    next(error)
  }
})

/* CREATE, EDIT AND DELETE PRODUCTS ARE ONLY AVAILABLE BY ADMIN */


module.exports = router