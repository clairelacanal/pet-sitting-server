const express = require("express");
const path = require("path");
const logger = require("morgan");

const { PORT } = require("./src/consts");

const usersRouter = require("./src/routes/users.router");
const petsRouter = require("./src/routes/pets.router");
const messagesRouter = require("./src/routes/messages.router");
const commentsRouter = require("./src/routes/comments.router");
const announcesRouter = require("./src/routes/announces.router");

const { catchAll, errorHandler } = require("./src/error-handling/index");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));

app.use("/users", usersRouter);
app.use("/pets", petsRouter);
app.use("/messages", messagesRouter);
app.use("/commentsRouter", commentsRouter);
app.use("/annouces", announcesRouter);

app.use(catchAll);
app.use(errorHandler);

require("./db")();

app.listen(PORT, () => {
  console.log("Server is listening...");
});
