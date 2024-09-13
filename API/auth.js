const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma");
const bcrypt = require("bcrypt");

//create new user --- WORKS
router.post("/register", async (req, res, next) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body;

    if (!firstName && !lastName && !userName && !email && !password) {
      const error = {
        status: 400,
        message: "Registration fields required",
      };

      return next(error);
    }

    const user = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        email: email,
        password: password,
      },
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

//get user by ID -- WORKS -- NEEDS EDIT for logged in user
router.get("/account/:id", async (req, res, next) => {
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
    next(error);
  }
});

// ----- cant test until schema is fixed -----
//get trips associated with a user -- NEEDS EDIT for logged in user
router.get("/account/:id/trips", async (req, res, next) => {
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
    next(error);
  }
});

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
