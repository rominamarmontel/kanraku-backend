const router = require('express').Router()
const isAuthenticated = require('../middlewares/isAuthenticated')
const Order = require('../models/Order.model')

// Get a cart
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id
    let cartItems = await Order.find({
      user: userId,
      purchaseDate: { $exists: false },
    }).populate('orderItems.product')
    if (cartItems.length === 0) {
      res.json({ message: 'Your cart is empty' })
    } else {
      const cart = cartItems[0].orderItems.map((item) => {
        return {
          qty: item.qty,
          product: item.product,
        }
      })
      res.json(cart)
    }
  } catch (error) {
    console.log(error)
  }
})

// Create a cart with product in it
router.post('/add', isAuthenticated, async (req, res) => {
  try {
    const { product, qty } = req.body
    const orderItem = { product, qty }

    // Check if there is a current cart
    let isCart = await Order.findOne({
      user: req.user.id,
      purchaseDate: { $exists: false },
    })

    // Create new cart if it doesn't exist
    if (!isCart) {
      isCart = await Order.create({
        user: req.user.id,
      })
    }

    // Check if product is already present in order
    const foundIndex = isCart.orderItems.findIndex((p) =>
      p.product._id.equals(orderItem.product)
    )

    if (foundIndex > -1) {
      // Update quantity if already present product
      let productItem = isCart.orderItems[foundIndex]
      productItem.qty += orderItem.qty
    } else {
      // Add product and quantity
      console.log(isCart.orderItems)
      isCart.orderItems.push({
        product: orderItem.product,
        qty: orderItem.qty,
      })
    }
    isCart = await isCart.save()
    console.log(isCart.orderItems)
    return res.status(201).send(isCart)
  } catch (error) {
    console.log(error)
    res.status(500).send('something went wrong')
  }
})

// Remove a product from the cart
router.delete('/remove/:productId', isAuthenticated, async (req, res) => {
  try {
    const productId = req.params.productId
    const userId = req.user.id

    // Find the current cart
    const cart = await Order.findOne({
      user: userId,
      purchaseDate: { $exists: false },
    })

    // Check if product is present in order
    const foundIndex = cart.orderItems.findIndex(
      (p) => p.product._id.equals(productId)
    )

    if (foundIndex > -1) {
      // Remove the product from the cart
      cart.orderItems.splice(foundIndex, 1)
      await cart.save()
      res.status(200).json(cart.orderItems)
    } else {
      res.status(404).send({ message: 'Product not found in cart' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
})

// Remove all products from the cart
router.delete('/remove-all', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Order.findOneAndUpdate(
      {
        user: userId,
        purchaseDate: { $exists: false },
      },
      { orderItems: [] },
      { new: true }
    ).populate('orderItems.product')

    res.status(200).json(cart.orderItems)
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong')
  }
})

module.exports = router
