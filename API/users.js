const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma");
const bcrypt = require("bcrypt");

//get all users
router.get("/", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

//create new user
router.post("/", async (req, res, next) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body;

    if (!firstName || !lastName || !userName || !email || !password) {
      const error = {
        status: 400,
        messsage: "Registration fields required",
      };

      return next(error);
    }

    const user = await prisma.author.create({
      data: { firstName, lastName, userName, email, password },
    });
    res.json(user);
  } catch (error) {
    next();
  }
});

//get user by ID
router.get("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return next({
        status: 404,
        message: `Could not find user by ${id}`,
      });
    }

    res.json(user);
  } catch (error) {
    next();
  }
});

//get trips associated with a user
router.get("/api/users/:id/trips", async (req, res, next) => {
  try {
    const id = +req.params.id;
    console.log(id);

    const user = await prisma.user.findUnique({ whhere: { id } });

    if (!user) {
      return next({
        status: 404,
        message: `Could not find user by ${id}`,
      });
    }

    const trips = await prisma.trips.findMany({ where: { userId: id } });

    res.json(trips);
  } catch (error) {
    next();
  }
});
