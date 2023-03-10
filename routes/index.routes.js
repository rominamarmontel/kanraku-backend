const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here")
})

router.use('/auth', require('./auth.routes'))

/* ADMIN ROUTES */
router.use('/dashboard', require('./dashboard.routes'))

router.use('/user', require('./user.routes'))
router.use("/orders", require("./orders.routes"))
router.use('/products', require('./products.routes'))

module.exports = router;
