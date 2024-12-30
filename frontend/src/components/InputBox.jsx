import { Button, Flex, Input, Text, VStack, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import Seat from "./Seat";
import axios from "axios";
import { useAuth } from '../context/AuthContext';

export default function InputBox({ fetchData }) {
  const [numberOfSeats, setNumberOfSeats] = useState();
  const [bookedSeats, setBookedSeats] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const displayToast = (status, message) => {
    toast({
      title: message,
      status,
      duration: 3000,
      isClosable: true,
    });
  };

  const handleBookTicket = () => {
    if (numberOfSeats > 7) {
      displayToast("error", "You can book up to 7 seats at a time.");
    } else if (!numberOfSeats || numberOfSeats <= 0) {
      displayToast("error", "Enter a valid number of seats.");
    } else {
      bookSeats();
    }
  };

  const bookSeats = async () => {
    setIsBooking(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/seats/book",
        { numOfSeats: numberOfSeats },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setBookedSeats(response.data.data);
      fetchData();
      displayToast("success", "Seats successfully booked!");
    } catch (error) {
      console.error("Error booking seats:", error);
      displayToast(
        "error",
        error.response?.data?.message || "Booking failed."
      );
    } finally {
      setIsBooking(false);
    }
  };

  const handleResetBooking = async () => {
    setIsResetting(true);
    try {
      await axios.post("http://localhost:8080/api/seats");
      setBookedSeats([]);
      fetchData();
      displayToast("success", "Booking successfully reset!");
    } catch (error) {
      console.error("Error resetting booking:", error);
      displayToast("error", "Failed to reset booking.");
    } finally {
      setIsResetting(false);
    }
  };

  const isDisabled = isBooking || isResetting;

  return (
    <VStack align="left" spacing={4}>
      <Flex gap={2} align="center">
        <Text as="b" fontSize="md">
          Booked Seats:
        </Text>
        {bookedSeats.map((seat) => (
          <Seat
            key={seat._id}
            isBooked={true}
            seatNumber={seat.seatNumber}
          />
        ))}
      </Flex>

      <Flex gap={2}>
        <Input
          isDisabled={isDisabled}
          bg="white"
          color="blue.600"
          placeholder="Enter number of seats"
          border="1px solid"
          onChange={(e) => setNumberOfSeats(parseInt(e.target.value, 10))}
          type="number"
        />
        <Button
          isDisabled={isDisabled}
          w="fit-content"
          px={10}
          colorScheme="blue"
          border="1px solid"
          onClick={handleBookTicket}
          isLoading={isBooking}
          loadingText="Processing..."
        >
          Book
        </Button>
      </Flex>

      <Button
        isDisabled={isDisabled}
        w="full"
        mt={2}
        colorScheme="blue"
        border="1px solid"
        onClick={handleResetBooking}
        isLoading={isResetting}
        loadingText="Resetting..."
      >
        Reset Booking
      </Button>
    </VStack>
  );
}