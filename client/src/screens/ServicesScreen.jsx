import { Box, Button, SimpleGrid } from "@chakra-ui/react";

import { useSelector } from "react-redux";

import { io } from "socket.io-client";
const socket = io("/");

const ServicesScreen = () => {
  const user = useSelector((state) => state.user);
  const { userInfo } = user;
  const handleRequest = (request) => {
    socket.emit("request", { request, userInfo });
  };
  return (
    <Box width="70%" mx="auto">
      <SimpleGrid columns={[2, null, 3]} minChildWidth="120px" spacing="40px">
        <Button onClick={() => handleRequest("call-waiter")} bg="orange.400" height="80px">
          <strong>Call Waiter</strong>
        </Button>
        <Button onClick={() => handleRequest("napkins")} bg="tomato" height="80px">
          Napkins
        </Button>
        <Button onClick={() => handleRequest("utensils")} bg="tomato" height="80px">
          Utensils
        </Button>
      </SimpleGrid>
    </Box>
  );
};

export default ServicesScreen;
