const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const port = 4500;
const app = express();
app.use(express.json());
app.use(cors());
const sequelize = require("./utils/dbConfig");
const userRoute = require("./routes/userRoute");
const recipeRoute = require("./routes/recipeRoute");

app.get("/", (req, res) => {
  res.send("server is working");
});

app.use("/", userRoute);
app.use("/", recipeRoute);
sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log("server is connected");
    });
  })
  .catch((error) => {
    console.log(error);
  });
