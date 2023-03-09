const router = require("express").Router();
const Order = require("../models/Order.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
/**
 * All of the routes here are prefixed by
 *    /api/orders
 */
// GET all the orders
router.get("/", async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user });
    res.json({ orders });
  } catch (error) {
    next(error);
  }
});

// GET one order
router.get("/:id", async (req, res, next) => {
  try {
    const oneOrder = await Order.findById(req.params.id);
    res.json({ oneOrder });
  } catch (error) {
    next(error);
  }
});

// Create an order
router.post("/", async (req, res, next) => {
  try {
    const {
      // orderItems, Will come from the Cart/Form posting
      shippingAddress,
      paymentMethod,
    } = req.body;

    //Shipping address might come from the currently logged in user
    const createdOrder = await Order.findByIdAndUpdate(
      // replace by productId
      "640a0988f691686df2564e23",
      {
        user: "640a04c0bd44c6fc1c1598f2", // real userId
        // orderItems: {$push},
        shippingAddress,
        paymentMethod,
        $push: { orderItems: { qty: 2, product: new ObjectId() } },
        // need to update with the correct id},
      },
      { new: true, upsert: true }
    );
    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
});
// Update an order
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    const UpdatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        orderItems,
        shippingAddress,
        paymentMethod,
      },
      { new: true }
    );
    res.status(202).json(UpdatedOrder);
  } catch (error) {
    next(error);
  }
});

// Delete one order
router.delete("/:id", async (req, res, next) => {
  try {
    await Order.findByIdAndDelete(
      // replace by productId
      "640a0d3b184cbd6d510513a3",
      {
        user: "640a04c0bd44c6fc1c1598f2", // real userId
        // orderItems: {$push},
        $pull: { orderItems: { qty: 2, product: "640a0d3b184cbd6d510513a2" } },
        // need to update with the correct id},
      }
    );
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
