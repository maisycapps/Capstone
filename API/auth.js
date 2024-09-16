const router = require("express").Router();
module.exports = router;
const {
  createUser,
  authenticate,
  isLoggedIn,
  fetchTrips,
  getDestinations,
} = require("../controllers/authController");

const prisma = require("../prisma");
const bcrypt = require("bcrypt");

//testing route not final
router.get("/destinations", getDestinations);

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

// <---------- v EDIT USER ACCOUNT ROUTES v ---------->

// ----- cant test until schema is fixed -----
//get posts associated with a user -- needs testing
router.get("/account/posts", isLoggedIn, async (req, res, next) => {
  try {
    const id = +req.params.id;
    console.log(id);

    const user = await prisma.users.findUnique({ where: { id } });

    if (!user) {
      return next({
        status: 404,
        message: `Could not find user by ${id}`,
      });
    }

    const posts = await prisma.posts.findMany({ where: { userId: id } });

    res.json(posts);
  } catch (error) {
    next(error);
  }
});

//update existing user -- needs testing
router.put("/account", isLoggedIn, async (req, res, next) => {
  try {
    const id = +req.params.id;

    const userExists = await prisma.users.findUnique({ where: { id } });
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

    const user = await prisma.users.update({
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

//delete logged in users account -- needs testing
router.delete("/account", isLoggedIn, async (req, res, next) => {
  try {
    const id = +req.params.id;
    const userExists = await prisma.users.findUnique({
      where: { id },
    });

    if (!userExists) {
      return next({
        status: 400,
        message: `Cpuld not find user with id ${id}`,
      });
    }
    await prisma.users.delete({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});
// <---------- ^ EDIT USER ACCOUNT ROUTES ^ ---------->

// ----- cant test until schema is fixed -----
//get trips associated with a user -- NEEDS EDIT for logged in user
router.get("/account/trips", isLoggedIn, fetchTrips);

//creating a trip from loggedin user
router.post("/account/create", isLoggedIn, async (req, res) => {
  const { tripName, destinationId, startDate, endDate } = req.body;

  try {
    const userId = req.user.id;

    const destination = await prisma.destinations.findUnique({
      where: { id: destinationId },
    });

    //error handling
    if (!destination) {
      return res.status(400).json({ error: "Invalid destination" });
    }

    //create trip
    const newTrip = await prisma.trips.create({
      data: {
        tripName,
        destinationid,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId,
      },
    });

    res.status(201).json(newTrip);
  } catch (error) {
    res.status(500).json({ error: "Failed to create trip!" });
  }
});
