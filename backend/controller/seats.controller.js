const Seat = require("../models/seats.model");

// Controller for booking seats
const bookingController = async (req, res) => {
  const { numOfSeats } = req.body;
  const userId = req.user._id;

  if (numOfSeats > 7) {
    return res
      .status(400)
      .json({ message: "Cannot book more than 7 seats at a time" });
  }

  try {
    const availableSeats = await Seat.find({ isBooked: false }).sort({
      rowNumber: 1,
      seatNumber: 1,
    });

    if (availableSeats.length < numOfSeats) {
      return res.status(400).json({
        message: `Booking failed, only ${availableSeats.length} seats are available`,
      });
    }

    const sameRowSeats = await bookSeatsInSameRow(
      availableSeats,
      numOfSeats,
      userId
    );
    if (sameRowSeats) {
      return res.status(200).json({ data: sameRowSeats });
    }

    const rowCount = 12;
    const nearbySeats = findNearbyRows(availableSeats, numOfSeats, rowCount);

    if (nearbySeats.length > 0) {
      await Promise.all(
        nearbySeats.map((seat) => {
          seat.isBooked = true;
          seat.bookedBy = userId;
          return seat.save();
        })
      );
      return res.status(200).json({ data: nearbySeats });
    }

    return res
      .status(400)
      .json({ message: "Booking failed. Unable to find seats." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller for getting all seats
const getSeats = async (req, res) => {
  try {
    const seats = await Seat.find()
      .populate("bookedBy", "username")
      .sort({ rowNumber: 1, seatNumber: 1 });
    return res.status(200).json({ seats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller for canceling a booking
const cancelBooking = async (req, res) => {
  const { seatId } = req.params;
  const userId = req.user._id;

  try {
    const seat = await Seat.findById(seatId);

    if (!seat) {
      return res.status(404).json({ message: "Seat not found" });
    }

    if (seat.bookedBy?.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this booking" });
    }

    seat.isBooked = false;
    seat.bookedBy = null;
    await seat.save();

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller for resetting all seats
const resetSeatsController = async (req, res) => {
  try {
    await Seat.deleteMany();

    const totalRows = 12;
    const seatsPerRow = 7;
    const seats = [];
    let seatNumber = 1;

    for (let row = 1; row <= totalRows; row++) {
      const rowSeats = row === totalRows ? 80 % seatsPerRow : seatsPerRow;
      for (let seatNum = 1; seatNum <= rowSeats; seatNum++) {
        seats.push(
          new Seat({
            seatNumber: seatNumber++,
            rowNumber: row,
            isBooked: false,
            bookedBy: null,
          })
        );
      }
    }

    await Seat.insertMany(seats);
    return res.json({ message: "Seats successfully reset" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Helper functions
const bookSeatsInSameRow = async (availableSeats, numOfSeats, userId) => {
  const rowCount = 12;

  for (let row = 1; row <= rowCount; row++) {
    const rowSeats = availableSeats.filter((seat) => seat.rowNumber === row);
    const availableToBook = rowSeats
      .filter((seat) => !seat.isBooked)
      .slice(0, numOfSeats);

    if (availableToBook.length === numOfSeats) {
      await Promise.all(
        availableToBook.map((seat) => {
          seat.isBooked = true;
          seat.bookedBy = userId;
          return seat.save();
        })
      );
      return availableToBook;
    }
  }
  return null;
};

const findNearbyRows = (availableSeats, numOfSeats, rowCount) => {
  const rowAvailability = Array.from({ length: rowCount }, (_, row) => {
    return availableSeats.filter(
      (seat) => seat.rowNumber === row + 1 && !seat.isBooked
    ).length;
  });

  let minLength = Infinity;
  let minStart = -1;
  let sum = 0,
    start = 0;

  for (let end = 0; end < rowAvailability.length; end++) {
    sum += rowAvailability[end];

    while (sum >= numOfSeats) {
      const length = end - start + 1;
      if (length < minLength) {
        minLength = length;
        minStart = start;
      }
      sum -= rowAvailability[start++];
    }
  }

  if (minStart !== -1) {
    const rowsToBook = [];
    for (let row = minStart + 1; rowsToBook.length < numOfSeats; row++) {
      rowsToBook.push(
        ...availableSeats.filter(
          (seat) => seat.rowNumber === row && !seat.isBooked
        )
      );
    }
    return rowsToBook.slice(0, numOfSeats);
  }
  return [];
};

module.exports = {
  bookingController,
  getSeats,
  resetSeatsController,
  cancelBooking,
};
