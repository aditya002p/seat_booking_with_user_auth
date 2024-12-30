import { Box, Text, Tooltip } from "@chakra-ui/react";
import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Seat({
  seatNumber,
  isBooked,
  bookedBy,
  onCancelBooking,
}) {
  const { user } = useAuth();
  const isCurrentUserBooking = bookedBy?._id === user?._id;
  const seatBgColor = isBooked
    ? isCurrentUserBooking
      ? "#4299E1"
      : "#FFC107"
    : "#6CAC48";
  const seatTextColor = "gray.700";

  return (
    <Tooltip label={isBooked ? `Booked by ${bookedBy?.username}` : "Available"}>
      <Box
        color={seatTextColor}
        h="fit-content"
        w="50px"
        display="flex"
        justifyContent="center"
        p={1}
        bg={seatBgColor}
        rounded="lg"
        cursor={isCurrentUserBooking ? "pointer" : "default"}
        onClick={() => isCurrentUserBooking && onCancelBooking()}
      >
        <Text align="center" fontSize="md" as="b">
          {seatNumber}
        </Text>
      </Box>
    </Tooltip>
  );
}
