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

    const createdOrder = await Order.findByIdAndUpdate({
      user: new ObjectId(),
      orderItems: [
        { qty: 2, product: new ObjectId() },
        { qty: 3, product: new ObjectId() },
      ],
      shippingAddress,
      paymentMethod,
    });
    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
});
// Update an order
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      user,
      orderItems,
      shippingAddress,
      paymentMethod,
      purchaseDate,
      taxPrice,
      shippingPrice,
      isDelivered,
      deliveredAt,
    } = req.body;

    const UpdatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        user,
        orderItems,
        shippingAddress,
        paymentMethod,
        purchaseDate,
        taxPrice,
        shippingPrice,
        isDelivered,
        deliveredAt,
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
    await Order.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
