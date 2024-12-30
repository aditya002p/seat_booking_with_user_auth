import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

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

// Auth API calls
export const loginUser = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await api.post("/auth/register", userData);
  return data;
};

// Seats API calls
export const fetchSeats = async () => {
  const { data } = await api.get("/seats");
  return data.seats;
};

export const bookSeats = async (numOfSeats) => {
  const { data } = await api.post("/seats/book", { numOfSeats });
  return data.data;
};

export const cancelBooking = async (seatId) => {
  const { data } = await api.post(`/seats/cancel/${seatId}`);
  return data;
};

export const resetBookings = async () => {
  const { data } = await api.post("/seats");
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
