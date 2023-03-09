const router = require('express').Router()
const User = require('./../models/User.model')

/**
 * All of the routes here are prefixed by
 *    /api/user
 */


  // GET user profile
router.get('/:id/profile', async (req, res, next) => {
  try {
    const { id } = req.params
    const userProfile = await User.findById(id)
    res.json(userProfile)
    // console.log(userProfile)
  } catch (error) {
    next (error)
  }
})

  // Edit profile
router.patch('/:id/edit', async (req, res, next) => {
  try {
    const { id } = req.params
    const { username, email, password, shippingAddress } = req.body
    const UpdatedUser = await User.findByIdAndUpdate (
      id,
      { username, email, password, shippingAddress },
      { new : true }
    )
    res.status(202).json(UpdatedUser)
  } catch (error) {
    next (error)
  }
})

  // Delete profile
  router.delete('/:id/delete', async (req, res, next) => {
    try {
      await User.findByIdAndDelete(req.params.id)
      res.sendStatus(204)
    } catch (error) {
      next (error)
    }
  })


module.exports = router