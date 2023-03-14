const router = require("express").Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const Order = require("../models/Order.model");
const Product = require("../models/Order.model");

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

/* CREATE a cart with product in it */
router.post("/add", isAuthenticated, async (req, res) => {
  const { orderItem } = req.body; // {product: ObjectId, qty: number}
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

    //   Check if product is already present in order
    const foundIndex = isCart.orderItems.findIndex(
      (p) => p.product == orderItem.product
    );

    if (foundIndex > -1) {
      // update quantity of already present product
      let productItem = isCart.orderItems[foundIndex];
      productItem.qty += orderItem.qty;
      isCart.orderItems[foundIndex] = productItem;
    } else {
      // add product and quantity
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

// /* EDIT a cart */
// router.patch('/:id',  /* IS ADMIN, */ async (req, res, next) => {
//   try {
//     const { id } = req.params
//     const { name, image, brand, category, description, price, countInStock } = req.body
//     const updatedProduct = await Product.findByIdAndUpdate(
//       id,
//       { name, image, brand, category, description, price, countInStock },
//       { new: true })
//     res.status(202).json(updatedProduct)
//   } catch (error) {
//     next(error)
//   }
// });

// /* DELETE a cart */
// router.delete("/:id", /* IS ADMIN, */ async (req, res, next) => {
//     try {
//       await Product.findByIdAndDelete(req.params.id);
//       res.sendStatus(204);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

module.exports = router;
