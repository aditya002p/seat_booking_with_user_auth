import React from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <Box
      bg="white"
      px={4}
      py={2}
      shadow="sm"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={10}
    >
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        <Text fontWeight="bold" color="blue.600">
          Welcome, {user.username}!
        </Text>
        <Button colorScheme="blue" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </Flex>
    </Box>
  );
};

export default Header;
