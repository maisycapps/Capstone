const router = require("express").Router();
module.exports = router;
const {
  createUser,
  authenticate,
  isLoggedIn,
  getDestinations,
} = require("../controllers/authController");

const prisma = require("../prisma");
const bcrypt = require("bcrypt");

//testing route not final
router.get("/destinations", getDestinations); // what was this route for? -MC

// <---------- v USER ACCOUNT v ---------->

//Create new user - see authControllers folder
router.post("/register", createUser);

//Check auth user - see authControllers folder
router.post("/login", authenticate);

//Get auth user account - see authControllers folder
router.get("/account", isLoggedIn, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

//Update auth user -- WORKS (doesn't need ID param)
router.patch("/account", isLoggedIn, async (req, res, next) => {
  try {
    const id = +req.user.userId;

    const userExists = await prisma.users.findUnique({ where: { id } });

    if (!userExists) {
      return next({
        status: 400,
        message: `Could not find user with is ${id}`,
      });
    }

    const { firstName, lastName, userName, email, bio, profileImg } = req.body;
    if (!firstName || !lastName || !userName || !email || !bio || !profileImg) {
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
        bio: bio,
        profileImg: profileImg,
      },
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

//Delete auth account --WORKS (doesn't need ID param)
router.delete("/account", isLoggedIn, async (req, res, next) => {
  try {
    const id = req.user.userId;

    const userExists = await prisma.users.findUnique({
      where: { id },
    });

    if (!userExists) {
      return next({
        status: 400,
        message: `Could not find user with id ${id}`,
      });
    }

    await prisma.users.delete({ where: { id: parseInt(id) } });
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting user: ", error);
    res.status(500).json({ error: "failed to delete user" });
    next(error);
  }
});
// <---------- ^ USER ACCOUNT ^ ---------->

// <---------- v ACCOUNT FOLLOWS v ---------->

//Create auth user follows --WORKS!!!!!!!!!!
router.post("/account/users/:id/follows", isLoggedIn, async (req, res) => {
  const { id } = req.params; //user to follow's id > followingId
  console.log("user to follow", parseInt(id));

  try {
    const userId = req.user.userId; // auth user > followedById
    console.log("auth user", req.user.userId);

    const userToFollow = await prisma.users.findUnique({
      where: { id: parseInt(id) },
    });

    //error handling
    if (!userToFollow) {
      return res.status(400).json({ error: "User not found" });
    }

    //create follow
    const newFollows = await prisma.follows.create({
      data: {
        followingId: parseInt(id),
        followedById: parseInt(userId),
      },
    });

    res.status(201).json(newFollows);
    console.log("USER FOLLOWED SUCCESS");
  } catch (error) {
    console.log("error following user: ", error);
    res.status(500).json({ error: "Failed to follow user!" });
  }
});

//Get auth user follows

//Update auth user follows(see readme route notes!)

//Delete auth user follows (see readme route notes!)

// <---------- ^ ACCOUNT FOLLOWS ^ ---------->

// <---------- v ACCOUNT TRIPS v ---------->

//get auth user trips -- WORKS
router.get("/account/trips", isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.userId;

    const userTrips = await prisma.trips.findMany({
      where: {
        userId: userId,
      },
      include: {
        destination: true,
      },
    });

    res.status(200).json(userTrips);
  } catch (error) {
    console.error("Error fetching trips: ", error);
    res.status(500).json({ error: "Failed to fetch trips!" });
  }
});

//create auth user trip -- WORKS
router.post("/account/trips", isLoggedIn, async (req, res) => {
  const { tripName, destinationId, startDate, endDate } = req.body;

  try {
    const userId = req.user.userId;

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
        destinationId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId,
      },
    });

    res.status(201).json(newTrip);
  } catch (error) {
    console.log("error creating trip: ", error);

    res.status(500).json({ error: "Failed to create trip!" });
  }
});

//Update auth user trip -- WORKS
router.put("/account/trips/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { tripName, destinationId, startDate, endDate } = req.body;

  try {
    const userId = req.user.userId;

    //check if trip exists
    const trip = await prisma.trips.findUnique({
      where: { id: parseInt(id) },
    });

    //error handling
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    //error handling
    if (trip.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this trip" });
    }

    //error handling
    if (destinationId) {
      const destination = await prisma.destinations.findUnique({
        where: { id: destinationId },
      });
      if (!destination) {
        return res.status(400).json({ error: "Invalid destination" });
      }
    }

    //Update Trip
    const updatedTrip = await prisma.trips.update({
      where: { id: parseInt(id) },
      data: {
        tripName: tripName || trip.tripName, //keep existing if not changed
        destinationId: destinationId || trip.destinationId, //keep existing if not changed
        startDate: startDate ? new Date(startDate) : trip.startDate, //keep existing if not changed
        endDate: endDate ? new Date(endDate) : trip.endDate, //keep existing if not changed
      },
    });

    res.status(200).json(updatedTrip);
  } catch (error) {
    console.error("Error updating trip: ", error);
    res.status(500).json({ error: "Failed to update trip" });
  }
});

//Delete auth user trip --WORKS
router.delete("/account/trips/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;

  try {
    const userId = req.user.userId;

    //check if trip exists
    const trip = await prisma.trips.findUnique({
      where: { id: parseInt(id) },
    });

    //error handling
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    if (trip.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized to delete trip" });
    }

    //delete trip
    await prisma.trips.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip: ", error);
    res.status(500).json({ error: "failed to delete trip" });
  }
});
// <---------- ^ ACCOUNT TRIPS ^ ---------->

// <---------- v ACCOUNT POSTS v ---------->

// create auth user post -- WORKS
router.post("/account/posts", isLoggedIn, async (req, res, next) => {
  const { text, destinationId, postImg } = req.body;

  try {
    const userId = req.user.userId;

    const destination = await prisma.destinations.findUnique({
      where: { id: destinationId },
    });

    //error handling
    if (!destination) {
      return res.status(400).json({ error: "Invalid destination" });
    }

    //create post
    const newPost = await prisma.posts.create({
      data: {
        text,
        destinationId,
        postImg,
        userId,
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.log("error creating post: ", error);
    res.status(500).json({ error: "Failed to create post!" });
  }
});

//get auth user's posts --WORKS
router.get("/account/posts", isLoggedIn, async (req, res, next) => {
  try {
    const id = req.user.userId;

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

//Update auth user's post --WORKS
router.patch("/account/posts/:id", isLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  const { text, destinationId, postImg } = req.body;

  try {
    const userId = req.user.userId;

    // check if post exists
    const post = await prisma.posts.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this post" });
    }

    if (!text && destinationId) {
      const destination = await prisma.destinations.findUnique({
        where: { id: destinationId },
      });
      if (!destination) {
        return res.status(400).json({ error: "Invalid destination" });
      }
    }

    if (!req.body) {
      return next({
        status: 404,
        message: "Fields are required",
      });
    }

    const updatedPost = await prisma.posts.update({
      where: { id: parseInt(id) },
      data: {
        text: text,
        destinationId: destinationId,
        postImg: postImg,
      },
    });
    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating this post: ", error);
    res.status(500).json({ error: "failed to update post" });
    next(error);
  }
});

// delete existing post with logged in user --WORKS
router.delete("/account/posts/:id", isLoggedIn, async (req, res, next) => {
  const { id } = req.params;

  try {
    const userId = req.user.userId;

    //check if post exists
    const post = await prisma.posts.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized to delete post" });
    }

    //delete post
    await prisma.posts.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post: ", error);
    res.status(500).json({ error: "failed to delete post" });
  }
});

// <---------- ^ ACCOUNT POSTS ^ ---------->

// <---------- v ACCOUNT COMMENTS v ---------->

// create auth user comment on a post --WORKS
router.post(
  "/account/posts/:id/comments",
  isLoggedIn,
  async (req, res, next) => {
    const { id } = req.params; //post id
    const { text } = req.body;

    try {
      const userId = req.user.userId;

      //check if post exists
      const post = await prisma.posts.findUnique({
        where: { id: parseInt(id) },
      });

      //error handling
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      if (!req.body) {
        return next({
          status: 404,
          message: "Fields are required",
        });
      }

      //create comment
      const newComment = await prisma.comments.create({
        data: {
          text,
          postId: parseInt(id),
          userId,
        },
      });

      res.status(201).json(newComment);
    } catch (error) {
      console.log("error creating comment: ", error);
      res.status(500).json({ error: "Failed to create comment!" });
    }
  }
);

//get auth user's comments
router.get("/account/comments", isLoggedIn, async (req, res, next) => {
  try {
    const id = req.user.userId;

    const user = await prisma.users.findUnique({ where: { id } });

    if (!user) {
      return next({
        status: 404,
        message: `Could not find user by ${id}`,
      });
    }

    const comments = await prisma.comments.findMany({ where: { userId: id } });

    res.json(comments);
  } catch (error) {
    next(error);
  }
});

//Update auth user's specific comment on a specific post --WORKS
router.patch(
  "/account/posts/:postId/comments/:id",
  isLoggedIn,
  async (req, res, next) => {
    const { postId, id } = req.params; //post id, comment id

    const { text } = req.body;
    console.log("req.body", req.body);

    try {
      const userId = req.user.userId;

      //check if post exists
      const post = await prisma.posts.findUnique({
        where: { id: parseInt(postId) },
      });

      //error handling
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      if (!req.body) {
        return next({
          status: 404,
          message: "Fields are required",
        });
      }

      const updatedComment = await prisma.comments.update({
        where: { id: parseInt(id) },
        data: {
          text: text,
        },
      });
      res.json(updatedComment);
    } catch (error) {
      console.error("Error updating this comment: ", error);
      res.status(500).json({ error: "failed to update comment" });
      next(error);
    }
  }
);

//delete auth user's specific comment on a specific post --WORKS
router.delete(
  "/account/posts/:postId/comments/:id",
  isLoggedIn,
  async (req, res, next) => {
    const { postId, id } = req.params; //post id, comment id

    try {
      const userId = req.user.userId;

      //check if post exists
      const post = await prisma.posts.findUnique({
        where: { id: parseInt(postId) },
      });

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      //check if comment exists
      const comment = await prisma.comments.findUnique({
        where: { id: parseInt(id) },
      });

      //error handling
      if (comment.userId !== userId) {
        return res
          .status(403)
          .json({ error: "Unauthorized to delete comment" });
      }

      //delete comment
      await prisma.comments.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment: ", error);
      res.status(500).json({ error: "failed to delete comment" });
    }
  }
);

// <---------- ^ ACCOUNT COMMENTS ^ ---------->

// <---------- v ACCOUNT LIKES v ---------->

// create a like on a post --WORKS
router.post("/account/posts/:id/likes", isLoggedIn, async (req, res, next) => {
  const { id } = req.params; //post id

  try {
    const userId = req.user.userId;

    //check if post exists
    const post = await prisma.posts.findUnique({
      where: { id: parseInt(id) },
    });

    //error handling
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    //create like
    const newLike = await prisma.likes.create({
      data: {
        postId: parseInt(id),
        userId: parseInt(userId),
      },
    });

    res.status(201).json(newLike);
  } catch (error) {
    console.log("error creating like: ", error);
    res.status(500).json({ error: "Failed to create like!" });
  }
});

//get auth user's likes --WORKS
router.get("/account/likes", isLoggedIn, async (req, res, next) => {
  try {
    const id = req.user.userId;

    const user = await prisma.users.findUnique({ where: { id } });

    if (!user) {
      return next({
        status: 404,
        message: `Could not find user by ${id}`,
      });
    }

    const likes = await prisma.likes.findMany({ where: { userId: id } });

    res.json(likes);
  } catch (error) {
    console.error("Error getting likes: ", error);
    res.status(500).json({ error: "failed to get likes" });
    next(error);
  }
});

//delete auth user's like on a specific post --WORKS
router.delete(
  "/account/posts/:postId/likes/:id",
  isLoggedIn,
  async (req, res, next) => {
    const { postId, id } = req.params; //post id, comment id

    try {
      const userId = req.user.userId;

      //check if post exists
      const post = await prisma.posts.findUnique({
        where: { id: parseInt(postId) },
      });

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      //check if like exists
      const like = await prisma.likes.findUnique({
        where: { id: parseInt(id) },
      });

      //error handling
      if (like.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized to delete like" });
      }

      //delete comment
      await prisma.likes.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({ message: "Like deleted successfully" });
    } catch (error) {
      console.error("Error deleting like: ", error);
      res.status(500).json({ error: "failed to delete like" });
    }
  }
);

// <---------- ^ ACCOUNT LIKES ^ ---------->

// <---------- v ADMIN ONLY ROUTES v ---------->

//create destination --- need to add more data fields
router.post("/account/destinations", isLoggedIn, async (req, res, next) => {
  const { destinationName } = req.body;

  try {
    const userId = req.user.userId;

    if (!destinationName) {
      return next({
        status: 404,
        message: "Destination name required",
      });
    }

    const destination = await prisma.destinations.create({
      data: { destinationName: destinationName },
    });
    res.json(destination);
  } catch (error) {
    next(error);
  }
});

//edit destination --- need to test & add more data fields
router.patch(
  "/account/destinations/:id",
  isLoggedIn,
  async (req, res, next) => {
    const { id } = req.params.id;
    const { destinationName } = req.body;

    try {
      const userId = req.user.userId;

      const destinationExists = await prisma.destinations.findUnique({
        where: { id: parseInt(id) },
      });

      if (!destinationExists) {
        return next({
          status: 404,
          message: `Could not find destination by id: ${id}`,
        });
      }

      if (!req.body) {
        return next({
          status: 404,
          message: "Fields are required",
        });
      }

      const updatedDestination = await prisma.destinations.update({
        where: { id: parseInt(id) },
        data: { destinationName: destinationName },
      });
      res.json(updatedDestination);
    } catch (error) {
      console.error("Error updating this destination: ", error);
      res.status(500).json({ error: "failed to update destination" });
      next(error);
    }
  }
);

//delete destination by id ---
router.delete(
  "/account/destinations/:id",
  isLoggedIn,
  async (req, res, next) => {
    const { id } = req.params.id;

    try {
      const userId = req.user.userId;

      const destinationExists = await prisma.destinations.findUnique({
        where: { id: parseInt(id) },
      });

      if (!destinationExists) {
        return next({
          status: 404,
          message: `Could not find destination by id: ${id}`,
        });
      }

      await prisma.destinations.delete({ where: { id } });

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

// <---------- ^ ADMIN ONLY ROUTES ^ ---------->
