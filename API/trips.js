const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma");

//get all trips
router.get("/api/trips", async (req, res, next) => {
  try {
    const trips = await prisma.trips.findMany();
    res.json(trips);
  } catch (error) {
    next(error);
  }
});
