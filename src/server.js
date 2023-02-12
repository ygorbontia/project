require("express-async-errors");
const AppError = require("./utils/AppError");

const migrationsRun = require("./database/sqlite/migrations");
migrationsRun();

const express = require("express");
const app = express();
app.use(express.json());

const routes = require("./routes");
app.use(routes);

const uploadConfig = require("./configs/upload");
app.use("/files", express.static(uploadConfig.UPLOAD_FOLDER));

const cors = require("cors");
app.use(cors());

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