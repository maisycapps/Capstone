const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma");

//get all destinations
router.get("/api/destinations", async (req, res, next) => {
  try {
    const destinations = await prisma.destination.findMany();
    res.json(destinations);
  } catch (error) {
    next(error);
  }
});

//get a destination by id
router.get("/api/destinations/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;

    const destination = await prisma.user.findUnique({ whhere: { id } });

    if (!destination) {
      return next({
        status: 404,
        message: `Could not find destination by ${id}`,
      });
    }

    res.json(destination);
  } catch (error) {
    next();
  }
});
