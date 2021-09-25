const router = require("express").Router();
const { protect } = require("../../middlewares/auth");
const { validateVoke } = require("../../middlewares/validate");
const {
  postVoke,
  modifyVoke,
  deleteVoke,
  addAuthor,
  getVokes,
  getVoke
} = require("../../controllers/voke");

router.route("/all").get(getVokes);
router.route("/:vokeId").get(getVoke);

router.route("/").post(protect("author"), validateVoke, postVoke);
router
  .route("/:vokeId")
  .patch(protect("author"), validateVoke, modifyVoke)
  .delete(protect("author"), deleteVoke);

router.route("/:vokeId/*").post(protect("author"), addAuthor);

module.exports = router;
