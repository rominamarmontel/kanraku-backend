const router = require("express").Router();
const Order = require("../models/Order.model");
const isAuthenticated = require("../middlewares/isAuthenticated");

// Get all the orders
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const allOrders = await Order.find({ user: req.user.id })
    res.json(allOrders)
  } catch (error) {
    next(error)
  }
});

// Get one order
router.get("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const oneOrder = await Order.findById(req.params.id)
    res.json({ oneOrder })
  } catch (error) {
    next(error)
  }
})

// // Create new order
// router.post('/')


// Delete order
router.delete("/:id", isAuthenticated, async (req, res, next) => {
  try {
    await Order.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

module.exports = router
