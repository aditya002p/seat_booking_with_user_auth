const express = require("express");
const connectionDB = require("./config/db");
const seatsRoutes = require("./routes/seats.routes");
const authRoutes = require("./routes/auth.routes");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
app.use(cors());
dotenv.config();
app.use(express.json());

// Connect to database
connectionDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/seats", seatsRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("Seat Booking API is running");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
