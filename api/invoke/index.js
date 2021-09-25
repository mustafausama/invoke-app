const router = require("express").Router();

router.use("/invoke", require("./invoke"));
router.use("/voke", require("./voke"));

module.exports = router;
