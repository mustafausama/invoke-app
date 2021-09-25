const router = require("express").Router();
const { protect } = require("../../middlewares/auth");
const { validateInvoke } = require("../../middlewares/validate");
const {
  postInvoke,
  modifyInvoke,
  deleteInvoke,
  getInvokes,
  getInvoke,
  getNotifications
} = require("../../controllers/invoke");

router.route("/all/:vokeId").get(getInvokes);
router.route("/notifications").get(protect("author"), getNotifications);
router.route("/:invokeId").get(getInvoke);

router.route("/:vokeId").post(protect("author"), validateInvoke, postInvoke);
router
  .route("/:invokeId")
  .patch(protect("author"), validateInvoke, modifyInvoke)
  .delete(protect("author"), deleteInvoke);

module.exports = router;
