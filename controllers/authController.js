const prisma = require("../prisma");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

//Logged in user function -- still working on
const isLoggedIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next({
        status: 401,
        message: "Unauthorized: No token provided",
      });
    }

    //extract token
    const token = authHeader.split(" ")[1];

    //verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

//create user function
const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body;

    if (!firstName || !lastName || !userName || !email || !password) {
      return next({
        status: 404,
        message: "All fields are required.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        email: email,
        password: hashedPassword,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

//authenticate user & token
const authenticate = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    //error handling
    if (!userName || !password) {
      return res.status(401).json({
        status: "error",
        message: "Username and password are required",
      });
    }

    console.log("Step 1: Finding user"); //debuggin
    //find user by username
    const user = await prisma.user.findUnique({
      where: { userName },
    });

    //error handling
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Invalid username or password",
      });
    }

    console.log("Step 2: User found", user); //debuggin

    //compare password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    //error handling
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid username or password",
      });
    }

    console.log("Step 3: Password is valid"); //debuggin

    //create token payload
    const payload = {
      userId: user.id,
      userName: user.userName,
    };

    console.log("Step 4: Payload created", payload); //debuggin

    //sign token with secret
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1h", //token valid for 1 hour
    });

    console.log("Step 5: Token generated", token); //debuggin

    //respond with token
    return res.status(200).json({
      status: "success",
      message: "Authenticated successfully",
      token,
    });
  } catch (error) {
    console.error("Authentication error:", error.message); //debuggin

    return res.status(500).json({
      status: "error",
      message: "An internal server error occurred",
    });
  }
};

//fetch users trips function
const fetchTrips = async (req, res, next) => {
  try {
    const userId = req.user.userId; //gets user id

    //gets trips associated with user
    const trips = await prisma.trips.findMany({
      where: {
        userId: userId,
      },
      include: {
        destinations: true,
      },
      orderBy: {
        startDate: "asc", //orders trip by start date
      },
    });

    res.status(200).json({
      status: "success",
      data: trips,
    });
  } catch (error) {
    next(error);
  }
};

//create users trips function
const createTrip = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { tripName, destinationIds, startDate, endDate } = req.body;

    //error handling
    if (!tripName || !destinationIds || !startDate || !endDate) {
      return res.status(400).json({
        status: "error",
        message:
          "tripName, destinationIds, startDate, and endDate are required.",
      });
    }

    //checks destinationId is in an array
    if (!Array.isArray(destinationIds) || destinationIds.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "destinationIds must be a non-empty array of city IDs.",
      });
    }

    //checks if all destinationIds are valid
    const destinations = await prisma.destination.findMany({
      where: { id: { in: destinationIds } },
    });

    if (destinations.length !== destinationIds.length) {
      return res.status(400).json({
        status: "error",
        message: "One or more destinationIds are invalid.",
      });
    }

    //creates new trip and connects destination
    const newTrip = await prisma.trips.create({
      data: {
        tripName: tripName,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId,
        destinations: {
          connect: destinationIds.map((id) => ({ id })),
        },
      },
      include: {
        destinations: true,
      },
    });

    res.status(201).json({
      status: "success",
      data: newTrip,
    });
  } catch (error) {
    next(error);
  }
};

//gets a list of destinations
const getDestinations = async (req, res, next) => {
  try {
    const destinations = await prisma.destination.findMany({
      orderBy: { destinationName: "asc" }, //alphabetical order
    });

    res.status(200).json({
      status: "success",
      data: destinations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  authenticate,
  isLoggedIn,
  fetchTrips,
  createTrip,
  getDestinations,
};
