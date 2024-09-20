const express = require("express");
const app = express();
const PORT = 3000;
const apiRoutes = require("./API/index");
require("dotenv").config();

//middleware
app.use(express.json());
app.use(require("morgan")("dev"));

//API routes
app.use("/api", apiRoutes);

//error handling
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500; 
  res.status(statusCode).send({ error: error });
  // code below will not work. res.status is a function, will always result in undefined. 
  // res.status(res.status || 500).send({ error: error });
});

//server status log
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
