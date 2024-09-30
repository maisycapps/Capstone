const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma");

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to protect the route, ensuring only admins can delete users
const isAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const decoded = jwt.verify(token, JWT_SECRET);
  if (decoded.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }

  req.user = decoded; // Attach user info to req object
  next();
};

// <---------- v ADMIN USER ROUTES v ---------->

//get all users -- WORKS
router.get("/users", isAdmin, async (req, res, next) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        userName: true,
        firstName: true,
        lastName: true,
        email: true,
        profileImg: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// DELETE user by ID
router.delete("/users/:id", isAdmin, async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    // Check if user exists
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the user
    await prisma.users.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});
// <---------- ^ ADMIN USER ROUTES ^ ---------->

// <---------- v ADMIN POST ROUTES v ---------->

//get all posts
router.get("/posts", isAdmin, async (req, res, next) => {
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
      },
    });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts: ", error);
    next(error);
  }
});

//delete posts
router.delete("/posts/:id", isAdmin, async (req, res) => {
  const postId = parseInt(req.params.id);

  try {
    // Check if post exists
    const post = await prisma.posts.findUnique({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Delete post
    await prisma.posts.delete({ where: { id: postId } });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

//delete comment on a post
router.delete("/comments/:id", isAdmin, async (req, res) => {
  const commentId = parseInt(req.params.id);

  try {
    // Check if comment exists
    const comment = await prisma.comments.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Delete comment
    await prisma.comments.delete({ where: { id: commentId } });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});
// <---------- ^ ADMIN POST ROUTES ^ ---------->

// <---------- v ADMIN TRIPS ROUTES v ---------->

//get all users trips
router.get("/trips", async (req, res) => {
  try {
    const trips = await prisma.trips.findMany({
      include: {
        user: {
          select: {
            userName: true,
          },
        },
        destination: {
          select: {
            destinationName: true,
            destinationImg: true,
          },
        },
      },
    });

    res.status(200).json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
});

//delete trip by id
router.delete("/trips/:id", isAdmin, async (req, res) => {
  const tripId = parseInt(req.params.id);

  try {
    // Check if the trip exists
    const trip = await prisma.trips.findUnique({ where: { id: tripId } });

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    // Delete the trip
    await prisma.trips.delete({ where: { id: tripId } });

    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    res.status(500).json({ error: "Failed to delete trip" });
  }
});
// <---------- ^ ADMIN TRIP ROUTES ^ ---------->

// <---------- v ADMIN DESTINATION ROUTES v ---------->

//create destination
router.post("/destinations", isAdmin, async (req, res) => {
  const { destinationName, destinationImg } = req.body;

  try {
    const newDestination = await prisma.destinations.create({
      data: {
        destinationName,
        destinationImg,
      },
    });

    res.status(201).json(newDestination);
  } catch (error) {
    console.error("Error creating destination:", error);
    res.status(500).json({ error: "Failed to create destination" });
  }
});

//get all destinations
router.get("/destinations", isAdmin, async (req, res) => {
  try {
    const destinations = await prisma.destinations.findMany({
      orderBy: {
        createdAt: "desc", // Order by creation date
      },
    });

    res.status(200).json(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    res.status(500).json({ error: "Failed to fetch destinations" });
  }
});

//delete destination
router.delete("/destinations/:id", isAdmin, async (req, res) => {
  const destinationId = parseInt(req.params.id);

  try {
    const destination = await prisma.destinations.findUnique({
      where: { id: destinationId },
    });

    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }

    await prisma.destinations.delete({ where: { id: destinationId } });

    res.status(200).json({ message: "Destination deleted successfully" });
  } catch (error) {
    console.error("Error deleting destination:", error);
    res.status(500).json({ error: "Failed to delete destination" });
  }
});
// <---------- ^ ADMIN DESTINATION ROUTES ^ ---------->
