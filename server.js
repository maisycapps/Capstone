const express = require("express");
const app = express();
const PORT = 3000;

//middleware
app.use(express.json());
app.use(require("morgan")("dev"));

const jwt = require("jsonwebtoken");
const JWT = process.env.JWT;

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
    const decoded = jwt.verify(token, JWT);

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
      return next({
        status: 401,
        message: "Username and password are required",
      });
    }

    //find user by username
    const user = await prisma.user.findUnique({
      where: { userName },
    });

    //error handling
    if (!user) {
      return next({
        status: 404,
        message: "Invalid username or password",
      });
    }

    //compare password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return next({
        status: 404,
        message: "Invalid Username or password",
      });
    }

    //create token payload
    const payload = {
      userId: user.id,
      userName: user.userName,
    };

    //sign token with secret
    const token = jwt.sign(payload, JWT, {
      expiresIn: "1h", //token valid for 1 hour
    });

    //respond with token
    return res.status(200).json({
      status: "success",
      message: "Authenticated successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
};

//API routes
app.use("/api", require("./API"));

//error handling
app.use((error, req, res, next) => {
  res.status(res.status || 500).send({ error: error });
});

//server status log
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
