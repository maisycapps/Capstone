const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma");

// ----- cant test until schema is fixed -----

//get all posts
router.get("/", async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

//get post by ID
router.get("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;

    const post = await prisma.post.findUnique({ where: { id } });

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
