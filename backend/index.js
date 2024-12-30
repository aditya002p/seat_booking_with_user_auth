const express = require("express");
const connectionDB = require("./config/db");
const seatsRoutes = require("./routes/seats.routes");
const authRoutes = require("./routes/auth.routes");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

dotenv.config();

// CORS configuration
const corsOptions = {
  origin: [
    "https://seat-booking-with-user-auth.vercel.app",
    "https://seat-booking-with-user-auth-9k82.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Explicitly handle preflight requests

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
