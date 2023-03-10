const router = require("express").Router();
const User = require("../models/User.model");


/* All of the routes here are prefixed by /api/dashboard */

// USERS
// GET all users profile
router.get("/users", /* IS ADMIN, */ async (req, res, next) => {
    try {
      const usersList = await User.find();
      res.json(usersList);
      // console.log(userList)
    } catch (error) {
      next(error);
    }
  }
);

// GET one user profile
router.get( "/:id",/* IS ADMIN, */ async (req, res, next) => {
    try {
      const userProfile = await User.findById(req.params.id);
      res.json({ userProfile });
      // console.log(userProfile)
    } catch (error) {
      next(error);
    }
  }
);

// EDIT one user profile
router.patch(
  "/:id/edit",
  /* IS ADMIN, */ async (req, res, next) => {
    try {
      const { id } = req.params;
      const { username, email, password, shippingAddress } = req.body;
      const UpdatedUser = await User.findByIdAndUpdate(
        id,
        { username, email, password, shippingAddress },
        { new: true }
      );
      res.status(202).json(UpdatedUser);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE user profile
router.delete("/:id/delete",/* IS ADMIN, */ async (req, res, next) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
