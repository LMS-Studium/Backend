const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./app/routes/auth");
const instructorAuth = require("./app/routes/instructorAuth");
const courseRoutes = require("./app/routes/coursesRoutes");
const corsOptions = require("./app/config/config");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors(corsOptions));

mongoose
  .connect(process.env.MONGO_URI_AUTH)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/instructor-auth", instructorAuth);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
