const express = require("express");
const mongoose = require("mongoose");
const apiRoutes = require("./routes/index");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.FE_ROUTE,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// parse cookies so req.cookies is available in routes
app.use(cookieParser());

// app.get("/test-cors", (req, res) => {
//   console.log("Hitting the test");
//   res.json({ message: "CORS works!" });
// });
// Give me something to display when I hit the base route
app.get("/", (req, res) => {
  res.send("Welcome to the AlgoAtlas API");
});
app.use("/api", apiRoutes);
console.log(" process.env.FE_ROUTE", process.env.FE_ROUTE);
mongoose.connect(process.env.MONGO_URI);

// Use a non-conflicting default port (5001) in case 5000 is occupied by system services
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
