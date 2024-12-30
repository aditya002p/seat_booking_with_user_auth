import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Seats API calls
export const fetchSeats = async () => {
  try {
    const { data } = await api.get("/seats");
    return data.seats || [];
  } catch (error) {
    console.error("Error fetching seats:", error);
    throw error;
  }
};

export const bookSeats = async (numOfSeats) => {
  try {
    const { data } = await api.post("/seats/book", { numOfSeats });
    return data.data;
  } catch (error) {
    console.error("Error booking seats:", error);
    throw error;
  }
};

export const cancelBooking = async (seatId) => {
  try {
    const { data } = await api.post(`/seats/cancel/${seatId}`);
    return data;
  } catch (error) {
    console.error("Error canceling booking:", error);
    throw error;
  }
};

export const resetBookings = async () => {
  try {
    const { data } = await api.post("/seats");
    return data;
  } catch (error) {
    console.error("Error resetting bookings:", error);
    throw error;
  }
};

// Auth API calls
export const loginUser = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await api.post("/auth/register", userData);
  return data;
};

// Error handler helper
export const handleApiError = (error) => {
  const message = error.response?.data?.message || "An error occurred";
  return {
    error: true,
    message,
    status: error.response?.status,
  };
};

export default api;
