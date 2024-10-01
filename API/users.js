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

//get posts associated with a user ---
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

    const posts = await prisma.posts.findMany({ 
      where: { userId: id },
      include: {
        destination: true,
        comments: {
          include: {
            user: true,
          },
        },
        likes: {
          include: {
            user: true,
          },
        }
      },
    });

    res.json(posts);
  } catch (error) {
    next(error);
  }
});

//get user's followers ---
  //get followed users -- works
  router.get("/:id/following", async (req, res) => {
    try {
      const id = +req.params.id;
  
      const following = await prisma.follows.findMany({
        where: {
          followedById: id,
        },
        include: {
          following: true,
        },
      });
      res.status(200).json(following);
    } catch (error) {
      console.error("Error fetching followed users: ", error);
      res.status(500).json({ error: "Failed to fetch following users." });
    }
  });
  
  //get followers -- works
  router.get("/:id/followedBy", async (req, res) => {
    try {
      const id = +req.params.id;
  
      const followedBy = await prisma.follows.findMany({
        where: {
          followingId: id,
        },
        include: {
          followedBy: true,
        },
      });
      res.status(200).json(followedBy);
    } catch (error) {
      console.error("Error fetching followers: ", error);
      res.status(500).json({ error: "Failed to fetch followers." });
    }
  });
  