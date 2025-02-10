const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const connection = require("./configs/db");
const routes = require("./routes/main");

const app = express();

const apiRequestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  statusCode: 429,
  headers: true,
});

(async function db() {
  await connection();
})();

app.use(apiRequestLimiter);

app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: "*",
  exposedHeaders: "Authorization"
}))

app.get("/", (req, res) => {
  res.status(200).json({
    message: "WELCOME TO SUIEARN API!!",
  });
});

app.use('/api/v1/', routes);

// Handle errors.
app.use(function (err, req, res, next) {
  res.status(err.satus || 500);
  res.json({ message: err.message || "An error occured" });
  next();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
