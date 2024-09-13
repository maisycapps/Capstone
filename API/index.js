const router = require("express").Router();
module.exports = router;

router.use("/users", require("./users"));
router.use("/destinations", require("./destinations"));
router.use("/trips", require("./trips"));
router.use("/posts", require("./posts"));
router.use("/likes", require("./likes"));
router.use("/auth", require("./auth"));
