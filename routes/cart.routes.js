const router = require("express").Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const Order = require("../models/Order.model");

// Get a cart
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    let cartItems = await Order.find({
      user: userId,
      purchaseDate: { $exists: false },
    });
    if (cartItems.length === 0) {
      res.json({ message: "Your cart is empty" });
    } else {
      const cart = cartItems[0].orderItems.map((item) => {
        return {
          quantity: item.qty,
          product: item.product,
        };
      });
      res.json(cart);
    }
  } catch (error) {
    console.log(error);
  }
});

// Create a cart with product in it
router.post("/add", isAuthenticated, async (req, res) => {
  const { orderItem } = req.body;
  try {
    // Check if there is a current cart
    let isCart = await Order.findOne({
      user: req.user.id,
      purchaseDate: { $exists: false },
    });
    // Create new cart if it doesn't exist
    if (!isCart) {
      isCart = await Order.create({
        user: req.user.id,
      });
    }

    // Check if product is already present in order
    const foundIndex = isCart.orderItems.findIndex(
      (p) => p.product == orderItem.product
    );

    if (foundIndex > -1) {
      // Update quantity if already present product
      let productItem = isCart.orderItems[foundIndex];
      productItem.qty += orderItem.qty;
      isCart.orderItems[foundIndex] = productItem;
    } else {
      // Add product and quantity
      isCart.orderItems.push({
        product: orderItem.product,
        qty: orderItem.qty,
      });
    }
    isCart = await isCart.save();
    return res.status(201).send(isCart);
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
});

// // Remove a product from the cart
// router.delete("/remove/:productId", isAuthenticated, async (req, res) => {
//   const productId = req.params.productId;
//   try {
//     // Find the current cart
//     let cart = await Order.findOne({
//       user: req.user.id,
//       purchaseDate: { $exists: false },
//     });

//     // Check if product is present in order
//     const foundIndex = cart.orderItems.findIndex((p) => p.product == productId);

//     if (foundIndex > -1) {
//       // Remove the product from the cart
//       cart.orderItems.splice(foundIndex, 1);
//       cart = await cart.save();
//       return res.status(200).send(cart);
//     } else {
//       return res.status(404).send({ message: "Product not found in cart" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("something went wrong");
//   }
// });

// // Delete the cart
// router.delete("/delete", isAuthenticated, async (req, res) => {
//   try {
//     let cart = await Order.findOne({
//       user: req.user.id,
//       purchaseDate: { $exists: false },
//     });
//     // Remove it
//     cart.orderItems = [];
//     cart = await cart.save();
//     return res.status(200).send(cart);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("something went wrong");
//   }
// });

module.exports = router;
