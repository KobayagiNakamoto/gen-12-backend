const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./services/user");
const jwt = require("express-jwt");
const errorResponse = require("./lib/responses/errorResponse");
const PORT = process.env.PORT || 3001;

const app = express();

// Connect DB
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Json body parser middlware
app.use(express.json());

// Set JWT middlware
app.use(
  jwt({
    secret: process.env.AUTH_SECRET_KEY,
    algorithms: ["HS256"],
  }).unless({
    path: [
      {
        url: "/user/register",
        methods: ["POST"],
      },
      {
        url: "/user/login",
        methods: ["POST"],
      },
    ],
  })
);

// Set error middlware
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    errorResponse(res, 401, new Error("You are not logged in"));
  }
});

// Auth routes
app.use("/user", userRouter);

// Start listening
app.listen(PORT);
