const router = require("express").Router();

router.use("/users", require("./users/auth"));
router.use("/invokes", require("./invoke"));

module.exports = router;
