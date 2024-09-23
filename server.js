require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const PORT = 3000;
const apiRoutes = require("./API/index");

app.use(
  cors({
    origin: "http://localhost:5173", // Only allow your frontend origin
    credentials: true, // Allow credentials such as Authorization headers or cookies
  })
);

//middleware
app.use(express.json());
app.use(require("morgan")("dev"));

//API routes
app.use("/api", apiRoutes);

//error handling
app.use((error, req, res, next) => {
  res.status(res.status || 500).send({ error: error });
});

//server status log
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
