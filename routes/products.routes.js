const router = require("express").Router();
const Product = require("./../models/Product.model");
const fileUpload = require("../config/cloudinary-config");

/* All of the routes here are prefixed by /api/products */

/* GET all products */
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find();
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

/* CREATE a Product */
router.post("/create",/* IS ADMIN, */fileUpload.single("image"), async (req, res, next) => {
    try {
      const productToCreate = {...req.body};
      if (req.file) {
        productToCreate.image = req.file.path
      }
      const createdProduct = await Product.create(productToCreate);
      res.status(201).json(createdProduct);
    } catch (error) {
      next(error);
    }
  }
);

/* EDIT a Product */
router.patch("/:id",/* IS ADMIN, */fileUpload.single("image"),  async (req, res, next) => {
    try {
      const { id } = req.params;
      const productToUpdate =
        {...req.body};

        if (req.file) {
          productToUpdate.image = req.file.path
        }
  
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        productToUpdate,
        { new: true }
      );
      res.status(202).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  }
);

/* DELETE a Product */
router.delete("/:id", /* IS ADMIN, */ async (req, res, next) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
