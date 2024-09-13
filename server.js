const express = require("express");
const app = express();
const PORT = 3000;

//middleware
app.use(express.json());
app.use(require("morgan")("dev"));

//API routes
app.use("/api", require("./api"));

//error handling
app.use((error, req, res, next) => {
  res.status(res.status || 500).send({ error: error });
});

//server status log
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
