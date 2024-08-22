const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const dataRoutes = require("./src/Routes/Routes.js");
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use("/data", dataRoutes);

app.get("/", async (req, res) => {

  console.log("connected....")
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL, {
  dbName: 'RQ_Analytics' 
})
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });
})
.catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});
