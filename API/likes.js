const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma");

//get all likes
router.get("/api/likes", async (req, res, next) => {
  try {
    const likes = await prisma.likes.findMany();
    res.json(likes);
  } catch (error) {
    next(error);
  }
});
