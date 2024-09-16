const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma");

//get all destinations --- WORKS
router.get("/", async (req, res, next) => {
  try {
    const destinations = await prisma.destinations.findMany();
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

//create destination --- WORKS
//ADMIN FUNCTION
router.post("/", async (req, res, next) => {
  try {
    const { destinationName } = req.body;

    if (!destinationName) {
      return next({
        status: 404,
        message: "Destination name required",
      });
    }

    const destination = await prisma.destinations.create({
      data: { destinationName: destinationName },
    });
    res.json(destination);
  } catch (error) {
    next(error);
  }
});

//delete destination by id --- WORKS
router.delete("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;

    const destinationExists = await prisma.destinations.findUnique({
      where: { id },
    });

    if (!destinationExists) {
      return next({
        status: 404,
        message: `Could not find destination by id: ${id}`,
      });
    }

    await prisma.destinations.delete({ where: { id } });

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});
