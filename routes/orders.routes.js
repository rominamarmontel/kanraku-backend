const router = require("express").Router();
const Order = require("../models/Order.model");
const mongoose = require("mongoose");
const isAuthenticated = require("../middlewares/isAuthenticated");

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
// router.post("/", async (req, res, next) => {
//   try {
//     const {
//       // orderItems, Will come from the Cart/Form posting
//       shippingAddress,
//       paymentMethod,
//     } = req.body;

//     //Shipping address might come from the currently logged in user

//     const createdOrder = await Order.findByIdAndUpdate({
//       user: new ObjectId(),
//       orderItems: [
//         { qty: 2, product: new ObjectId() },
//         { qty: 3, product: new ObjectId() },
//       ],
//       shippingAddress,
//       paymentMethod,
//     });
//     res.status(201).json(createdOrder);
//   } catch (error) {
//     next(error);
//   }
// });

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
    console.log(error);
    res.status(500).send("something went wrong");
  }
});

// Delete orders to erase all the orders
router.delete("/:id", async (req, res, next) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

// Update an order to withdraw some products from the array with patch
// router.patch("/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const {
//       user,
//       orderItems,
//       shippingAddress,
//       paymentMethod,
//       purchaseDate,
//       taxPrice,
//       shippingPrice,
//       isDelivered,
//       deliveredAt,
//     } = req.body;

//     const UpdatedOrder = await Order.findByIdAndUpdate(
//       id,
//       {
//         user,
//         orderItems,
//         shippingAddress,
//         paymentMethod,
//         purchaseDate,
//         taxPrice,
//         shippingPrice,
//         isDelivered,
//         deliveredAt,
//       },
//       { new: true }
//     );
//     res.status(202).json(UpdatedOrder);
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
