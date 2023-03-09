const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here")
})

router.use('/auth', require('./auth.routes'))
router.use('/user', require('./user.routes'))

router.use("/orders", require("./orders.routes"));

module.exports = router;
