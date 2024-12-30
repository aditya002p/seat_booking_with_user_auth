const express = require("express");
const router = express.Router();
const {
  bookingController,
  getSeats,
  resetSeatsController,
  cancelBooking,
} = require("../controller/seats.controller");
const { protect } = require("../middleware/auth.middleware");

// Check if all controllers are defined before setting up routes
if (
  !bookingController ||
  !getSeats ||
  !resetSeatsController ||
  !cancelBooking
) {
  console.error("One or more controller functions are undefined:", {
    bookingController: !!bookingController,
    getSeats: !!getSeats,
    resetSeatsController: !!resetSeatsController,
    cancelBooking: !!cancelBooking,
  });
}

// Reset all seats
router.post("/", resetSeatsController);

// Get all seats
router.get("/", getSeats);

// Book seats (protected route)
router.post("/book", protect, bookingController);

// Cancel booking (protected route)
router.post("/cancel/:seatId", protect, cancelBooking);

module.exports = router;
