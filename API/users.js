const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma");

//get all users -- WORKS
router.get("/", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

//get user by ID -- WORKS
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
    next(error);
  }
});

// ----- cant test until schema is fixed -----
//get posts associated with a user
router.get("/:id/posts", async (req, res, next) => {
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
