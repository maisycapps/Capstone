const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma");

//get all users -- WORKS
router.get("/", async (req, res, next) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        userName: true,
        firstName: true,
        lastName: true,
        profileImg: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

//get user by ID -- WORKS
router.get("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;

    const user = await prisma.users.findUnique({
      where: { id },
      include: {
        following: true,
        followedBy: true,
        posts: true,
        likes: true,
      },
    });

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

//get posts associated with a user
router.get("/:id/posts", async (req, res, next) => {
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
