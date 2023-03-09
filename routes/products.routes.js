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

/* CREATE a Product */ /* IS ADMIN ONLY */
router.post('/', async (req, res, next) => {
  try {
    const { user, name, image, brand, category, description, price, countInStock } = req.body
    const createdProduct = await Product.create({ user, name, image, brand, category, description, price, countInStock })
    res.status(201).json(createdProduct)
  } catch (error) {
    next (error)
  }
})

/* EDIT a Product */ /* IS ADMIN ONLY */
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { user, name, image, brand, category, description, price, countInStock } = req.body
    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      { user, name, image, brand, category, description, price, countInStock }, 
      { new: true })
    res.status(202).json(updatedProduct)
  } catch (error) {
    next(error)
  }
})

/* DELETE a Product */ /* IS ADMIN ONLY */
router.delete('/:id', async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.sendStatus(204)
  } catch (error) {
    next (error)
  }
})

module.exports = router