require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 3000;
const apiRoutes = require("./API/index");
const cors = require("cors");

//middleware
app.use(express.json());
app.use(require("morgan")("dev"));

app.use(
  cors({
    origin: "http://localhost:5173", // Only allow your frontend origin
    credentials: true, // Allow credentials such as Authorization headers or cookies
  })
);

//API routes
app.use("/api", apiRoutes);

//error handling
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ message: "Internal server status" });
});

//server status log
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
