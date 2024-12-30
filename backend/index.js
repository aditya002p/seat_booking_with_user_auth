const express = require("express");
const connectionDB = require("./config/db");
const seatsRoutes = require("./routes/seats.routes");
const authRoutes = require("./routes/auth.routes");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

dotenv.config();
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: [
    "https://seat-booking-with-user-auth.vercel.app",
    "https://seat-booking-with-user-auth-9k82.vercel.app",
  ], // Allowed origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // Allow credentials (if needed)
};
app.use(cors(corsOptions));

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
