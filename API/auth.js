const router = require("express").Router();
module.exports = router;
const {
  createUser,
  authenticate,
  isLoggedIn,
  fetchTrips,
  createTrip,
  getDestinations,
} = require("../controllers/authController");

const prisma = require("../prisma");
const bcrypt = require("bcrypt");

//testing route not final
router.get("/destinations", getDestinations);
router.post("/trips", createTrip);

//create new user route - see authControllers folder
router.post("/register", createUser);

//authentication function route - see authControllers folder
router.post("/login", authenticate);

//isLoggedIn function route - see authControllers folder
router.get("/account", isLoggedIn, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

// ----- cant test until schema is fixed -----
//get trips associated with a user -- NEEDS EDIT for logged in user
router.get("/account/trips", isLoggedIn, createTrip);

// ----- cant test until schema is fixed -----
//get posts associated with a user -- NEEDS EDIT for logged in user
router.get("/account/:id/posts", async (req, res, next) => {
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

    const posts = await prisma.post.findMany({ where: { userId: id } });

    res.json(posts);
  } catch (error) {
    next(error);
  }
});

//update existing user -- WORKS -- NEEDS EDIT for logged in user
router.put("/account/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;

    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists) {
      return next({
        status: 400,
        message: `Could not find user with is ${id}`,
      });
    }

    const { firstName, lastName, userName, email } = req.body;
    if (!firstName || !lastName || !userName || !email) {
      return next({
        status: 404,
        message: "Fields are required",
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        email: email,
      },
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

//delete logged in users account -- WORKS -- NEEDS EDIT for logged in user
router.delete("/account/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const userExists = await prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      return next({
        status: 400,
        message: `Cpuld not find user with id ${id}`,
      });
    }
    await prisma.user.delete({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});
