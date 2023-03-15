const router = require("express").Router();
const Order = require("../models/Order.model");
const isAuthenticated = require("../middlewares/isAuthenticated");

// Get all the orders
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const allOrders = await Order.find({ user: req.user.id });
    res.json(allOrders);
  } catch (error) {
    next(error);
  }
});

// Get one order
router.get("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const oneOrder = await Order.findById(req.params.id);
    res.json({ oneOrder });
  } catch (error) {
    next(error);
  }
});

// Create an order
router.post("/", isAuthenticated, async (req, res, next) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  try {
    // Check if there is an open order
    const openOrder = await Order.findOne({
      user: req.user.id,
      purchaseDate: { $exists: false },
    });
    console.log(openOrder);
    // If there is an open order
    if (openOrder) {
      // Iterate over orderItems
      orderItems.forEach((itemToAdd) => {
        const existingItem = openOrder.orderItems.find(
          (item) => item.product.toString() === itemToAdd.product
        );

        // If we have the same id (received the order on the orderItems.product) and replace quantity
        if (existingItem) {
          existingItem.qty = itemToAdd.qty;
        } else {
          // Else, add product, quantity in the orderItems
          openOrder.orderItems.push(itemToAdd);
        }
      });

      // Save order
      const updatedOrder = await openOrder.save();
      return res.send(updatedOrder);
    } else {
      // Else create the order
      console.log(orderItems);
      const newOrder = await Order.create({
        user: req.user.id,
        orderItems,
        shippingAddress,
        paymentMethod,
      });
      return res.status(201).send(newOrder);
    }
  } catch (error) {
    next(error);
    res.status(500).send("something went wrong");
  }
});

//Update an order to withdraw some products from the array with patch
router.patch("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { productId } = req.body;

    const UpdatedOrder = await Order.findOneAndUpdate(
      { _id: id, user: req.user._id },
      {
        $pull: {
          orderItems: { product: productId },
        },
      },
      { new: true }
    );

    console.log({ updated: UpdatedOrder.orderItems, productId });
    res.status(202).json(UpdatedOrder);
  } catch (error) {
    next(error);
  }
});

// Delete order
router.delete("/:id", isAuthenticated, async (req, res, next) => {
  try {
    await Order.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
