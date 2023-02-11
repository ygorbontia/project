require("express-async-errors");
const AppError = require("./utils/AppError");

const migrationsRun = require("./database/sqlite/migrations");
migrationsRun();

const express = require("express");
const app = express();

const routes = require("./routes");

app.use(express.json());
app.use(routes);

app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message
    })
  }

  return res.status(500).json({
    status: "error",
    message: "Internal server error"
  })
})

const PORT = 3000;
app.listen(PORT, () => console.log(`Node running at PORT:${ PORT }`));