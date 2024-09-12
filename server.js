const express = require("express");
const app = express();
const PORT = 3000;

const prisma = require("./prisma");

//middleware
app.use(express.json());
app.use(require("morgan")("dev"));

//error handling
app.use((error, req, res, next) => {
  res.status(res.status || 500).send({ error: error });
});

//server status log
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

//get all users
app.get("/api/users", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

//get all destinations
app.get("/api/destination", async (req, res, next) => {
  try {
    const destinations = await prisma.destination.findMany();
    res.json(destinations);
  } catch (error) {
    next();
  }
});
