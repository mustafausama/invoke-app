const router = require("express").Router();

const {
  validateUsernamePassword,
  validateRegister
} = require("../../middlewares/validate");

const { register, login, deleteUser } = require("../../controllers/auth");

router
  .route("/register")
  .post(validateUsernamePassword, validateRegister, register);
router.route("/login").post(validateUsernamePassword, login);
router.route("/delete/:userId").delete(deleteUser);
module.exports = router;
