const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma");

//get all destinations --- WORKS
router.get("/", async (req, res, next) => {
  try {
    const destinations = await prisma.destinations.findMany({
      orderBy: {
        destinationName: "asc",
      },
      select: {
        id: true,
        destinationName: true,
        destinationImg: true,
      },
    });
    res.json(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error); // Log error
    res.status(500).json({ error: "Failed to fetch destinations" });
  }
});

//get a destination by id --- WORKS
router.get("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;

    const destination = await prisma.destinations.findUnique({
      where: { id },
      select: {
        id: true,
        destinationName: true,
        destinationImg: true,
      },
    });

    if (!destination) {
      return next({
        status: 404,
        message: `Could not find destination by ${id}`,
      });
    }

    res.json(destination);
  } catch (error) {
    console.error("Error fetching destinations:", error); // Log error
    res.status(500).json({ error: "Failed to fetch destinations" });
  }
});
