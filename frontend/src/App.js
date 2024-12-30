import { Box, Flex } from "@chakra-ui/react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Compartment from "./components/Compartment";
import InputBox from "./components/InputBox";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Header from "./components/Header";
import { useAuth } from "./context/AuthContext";
import { fetchSeats, handleApiError } from "./utils/api";

function App() {
  const { user, loading: authLoading } = useAuth();
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadSeats = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const seatsData = await fetchSeats();
      setSeats(
        Array.isArray(seatsData) ? seatsData : seatsData?.availableSeats || []
      );
    } catch (error) {
      const { message } = handleApiError(error);
      console.error("Error fetching seats:", message);
      setSeats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadSeats();
    } else {
      setSeats([]);
    }
  }, [user]);

  if (authLoading) {
    return (
      <Box h="100vh" display="flex" alignItems="center" justifyContent="center">
        Loading...
      </Box>
    );
  }

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const seatStats = seats.reduce(
    (acc, seat) => {
      if (seat.isBooked) {
        acc.bookedSeatsCount++;
      } else {
        acc.availableSeatsCount++;
      }
      return acc;
    },
    { bookedSeatsCount: 0, availableSeatsCount: 0 }
  );

  return (
    <Box>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Box pt="60px">
                <Flex
                  justify="space-around"
                  align="center"
                  minH="calc(100vh - 60px)"
                  bg="#E5E7EB"
                  p={4}
                >
                  <Compartment
                    data={seats}
                    loading={loading}
                    onCancelBooking={loadSeats}
                    {...seatStats}
                  />
                  <InputBox fetchData={loadSeats} />
                </Flex>
              </Box>
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
}

export default App;
