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

//update existing user -- WORKS
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

    const { firstName, lastName, userName, email, bio, profileImg} = req.body;
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
        profileImg: profileImg
      },
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

//delete logged in users account --WORKS
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
// <---------- ^ EDIT USER ACCOUNT ROUTES ^ ---------->

// <---------- v CREATE, FETCH, UPDATE, DELETE TRIPS v ---------->

//get trips associated with a user -- WORKS
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

//creating a trip from loggedin user -- WORKS
router.post("/account/trips", isLoggedIn, async (req, res) => {
  const { tripName, destinationId, startDate, endDate } = req.body;

  try {
    const userId = req.user.userId;
    console.log(userId);

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

//update existing trip with logged in user -- WORKS
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

//Delete a trip from existing user --WORKS
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
// <---------- ^ CREATE, FETCH, UPDATE, DELETE TRIPS ^ ---------->

// <---------- v CREATE, FETCH, UPDATE, DELETE POSTS v ---------->

//get posts associated with a user --WORKS
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

// create a new post -- WORKS
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

// update existing post with logged in user --WORKS
router.patch("/account/posts/:id", isLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  const { text, destinationId, postImg  } = req.body;

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
        postImg: postImg 
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

    //check if trip exists
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

// <---------- ^ CREATE, FETCH, UPDATE, DELETE POSTS ^ ---------->

// <---------- v CREATE, FETCH, UPDATE, DELETE COMMENTS v ---------->

// <---------- ^ CREATE, FETCH, UPDATE, DELETE COMMENTS ^ ---------->

// <---------- v CREATE, FETCH, UPDATE, DELETE LIKES v ---------->

// <---------- ^ CREATE, FETCH, UPDATE, DELETE LIKES ^ ---------->





// <---------- v ADMIN ONLY ROUTES v ---------->

//create destination --- 
router.post("/account/destinations", async (req, res, next) => {
  try {
    const { destinationName } = req.body;

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

//delete destination by id --- 
router.delete("/account/destinations/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;

    const destinationExists = await prisma.destinations.findUnique({
      where: { id },
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
});
// <---------- ^ ADMIN ONLY ROUTES ^ ---------->