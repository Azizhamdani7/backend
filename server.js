const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const errorHandler = require("./middlewares/errorMiddleware");
const contactRoute = require("./routes/contactRoute");


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(
//   cors({
//     origin: ["http://localhost:3000"],
//     credentials: true,
//   })
// );

//Routes Middleware
app.use("/api/", contactRoute);

//Homepage Router
app.get("/", (req, res) => {
    res.send("Home Page");
  });

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  })
  .catch((err) => console.log(err));