const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma");

//get all posts
router.get("/", async (req, res, next) => {
  try {
    const posts = await prisma.posts.findMany({
      include: {
        user: true, //includes user to display the author
        destination: true,
        comments: {
          include: {
            user: true,
          },
        },
        likes: true,
    }
  });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts: ", error);
    next(error);
  }
});

//get post by ID
router.get("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;

    const post = await prisma.posts.findUnique({ where: { id }});

    if (!post) {
      return next({
        status: 404,
        message: `Could not find post by id: ${id}`,
      });
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
});
