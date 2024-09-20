const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma");

//get all destinations --- WORKS
router.get("/", async (req, res, next) => {
  try {
    const destinations = await prisma.destinations.findMany({
      orderBy: {
        name: "asc",
      },
    });
    res.json(destinations);
  } catch (error) {
    next(error);
  }
});

//get a destination by id --- WORKS
router.get("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;

    const destination = await prisma.destinations.findUnique({ where: { id } });

    if (!destination) {
      return next({
        status: 404,
        message: `Could not find destination by ${id}`,
      });
    }

    res.json(destination);
  } catch (error) {
    next(error);
  }
});
