const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/auth", require("./auth.routes"));

router.use("/user", require("./user.routes"));
router.use("/orders", require("./orders.routes"));
router.use("/products", require("./products.routes"));
router.use("/cart", require("./cart.routes"));

// error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = router;
