const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");

const { PORT } = require("./src/consts");

const usersRouter = require("./src/routes/users.router");
const petsRouter = require("./src/routes/pets.router");
const messagesRouter = require("./src/routes/messages.router");
const commentsRouter = require("./src/routes/comments.router");
const annoncesRouter = require("./src/routes/annonces.router");

const { catchAll, errorHandler } = require("./src/error-handling/index");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running smoothly" });
});
app.use("/users", usersRouter);
app.use("/", petsRouter);
app.use("/messages", messagesRouter);
app.use("/", commentsRouter);
app.use("/", annoncesRouter);

app.use(catchAll);
app.use(errorHandler);

require("./src/db")();

app.listen(PORT, () => {
  console.log("Server is listening...");
});
