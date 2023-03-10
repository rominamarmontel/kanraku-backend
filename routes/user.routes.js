const router = require('express').Router()
const User = require('./../models/User.model')
const isAuthenticated = require('../middlewares/isAuthenticated.js')

/**
 * All of the routes here are prefixed by
 *    /api/user
 */


  // GET user profile
router.get('/profile', isAuthenticated, async (req, res, next) => {
  try {
    res.json({userProfile: req.user})
    // console.log(userProfile)
  } catch (error) {
    next (error)
  }
})

  // Edit profile
router.patch('/edit', isAuthenticated, /* IS ADMIN, */ async (req, res, next) => {
  try {
    const { username, email, password, shippingAddress } = req.body
    const UpdatedUser = await User.findByIdAndUpdate (
      req.user,
      { username, email, password, shippingAddress },
      { new : true }
    )
    res.status(202).json(UpdatedUser)
  } catch (error) {
    next (error)
  }
})

  // Delete profile
  router.delete('/delete', isAuthenticated, /* IS ADMIN, */ async (req, res, next) => {
    try {
      await User.findByIdAndDelete(req.user)
      res.sendStatus(204)
    } catch (error) {
      next (error)
    }
  })

module.exports = router