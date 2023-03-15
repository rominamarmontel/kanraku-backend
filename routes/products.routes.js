const router = require("express").Router();
const Product = require("./../models/Product.model");
const fileUpload = require("../config/cloudinary-config");

/* All of the routes here are prefixed by /api/products */

/* GET all products */
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find();
    console.log(products);
    res.json(products);
  } catch (error) {
    next(error);
  }
});

/* GET one Product */
router.get("/:id", async (req, res, next) => {
  try {
    const oneProduct = await Product.findById(req.params.id);
    res.json({ oneProduct, message: "product found" });
  } catch (error) {
    next(error);
  }
});

router.post("/images", fileUpload.single("image"), (req, res, next) => {
  // console.log(req.file.path);
  res.json({ image: req.file.path });
});

/* CREATE a Product */
router.post(
  "/create",
  /* IS ADMIN, */ async (req, res, next) => {
    try {
      console.log(req.body);
      const { name, image, brand, category, description, price, countInStock } =
        req.body;
      const createdProduct = await Product.create({
        name,
        image,
        brand,
        category,
        description,
        price,
        countInStock,
      });
      res.status(201).json(createdProduct);
    } catch (error) {
      next(error);
    }
  }
);

/* EDIT a Product */
router.patch(
  "/:id",
  /* IS ADMIN, */ async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, image, brand, category, description, price, countInStock } =
        req.body;
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, image, brand, category, description, price, countInStock },
        { new: true }
      );
      res.status(202).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  }
);

/* DELETE a Product */
router.delete(
  "/:id",
  /* IS ADMIN, */ async (req, res, next) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
