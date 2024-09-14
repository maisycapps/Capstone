const router = require("express").Router();
module.exports = router;

router.use("/users", require("./users"));
router.use("/destinations", require("./destinations"));
router.use("/posts", require("./posts"));
router.use("/auth", require("./auth"));
