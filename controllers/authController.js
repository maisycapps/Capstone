const prisma = require("../prisma");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// <---------- FINISHED DONT TOUCH ---------->

//Logged in user function
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
      return res.status(400).json({ message: "All fields are required." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
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

    //find user by username
    const user = await prisma.users.findUnique({
      where: { userName },
    });

    //error handling
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Invalid username or password",
      });
    }

    //compare password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    //error handling
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid username or password",
      });
    }

    //create token payload
    const payload = {
      userId: user.id,
      userName: user.userName,
      role: user.role, //checks if user or admin
    };

    //sign token with secret
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1h", //token valid for 1 hour
    });

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
// <---------- ^ FINISHED DONT TOUCH ^ ---------->

//gets a list of destinations
const getDestinations = async (req, res, next) => {
  try {
    const destinations = await prisma.destinations.findMany({
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
  getDestinations,
};
