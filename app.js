const express = require("express");
const path = require("path");
const logger = require("morgan");

const { PORT } = require("./consts");

const usersRouter = require("./src/routes/users.router");
const petsRouter = require("./src/routes/pets.router");

const { catchAll, errorHandler } = require("./error-handling");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/journals", journalsRouter);

app.use(catchAll);
app.use(errorHandler);

require("./db")();

app.listen(PORT, () => {
  console.log("Server is listening...");
});
