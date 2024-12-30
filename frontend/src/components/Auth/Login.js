import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Heading,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email,
          password,
        }
      );
      login(data);
      navigate("/");
      toast({
        title: "Login successful",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <Heading mb={6} textAlign="center">
        Login
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={loading}
          >
            Login
          </Button>
          <Text>
            Don't have an account?{" "}
            <ChakraLink as={Link} to="/register" color="blue.500">
              Register here
            </ChakraLink>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default Login;
