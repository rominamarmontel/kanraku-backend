const router = require('express').Router()
const User = require('./../models/User.model')
const isAuthenticated = require('../middlewares/isAuthenticated.js')

/* All of the routes here are prefixed by /api/user */

// GET user profile
router.get('/profile', isAuthenticated, async (req, res, next) => {
  try {
    res.json({ userProfile: req.user })
  } catch (error) {
    next(error)
  }
})

// Edit profile
router.patch('/edit', isAuthenticated, async (req, res, next) => {
  try {
    const { username, email, password, shippingAddress } = req.body
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username, email, password, shippingAddress },
      { new: true }
    )
    res.status(200).json(updatedUser)
  } catch (error) {
    next(error)
  }
})

// DELETE user profile with confirmed password
router.delete('/delete', isAuthenticated, async (req, res, next) => {
  try {
    const { password } = req.headers
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' })
    }
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).send({ error: 'Incorrect password' })
    }
    await User.findByIdAndDelete(req.user.id)
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})


module.exports = router

