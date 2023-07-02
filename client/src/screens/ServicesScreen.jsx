import { Box, Button, SimpleGrid, Divider } from "@chakra-ui/react";

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
    <Box width="70%" mx="auto" textAlign="center" my={5}>
      <SimpleGrid columns={[1, 2, 2]} spacing={5}>
        <Button
          onClick={() => handleRequest("call-waiter")}
          bg="cyan.400"
          height="80px"
          style={{
            backgroundImage: "url('/images/call-waiter.jpg')",
            backgroundSize: "cover",
          }}
        >
          Call Waiter
        </Button>
        <Button
          onClick={() => handleRequest("napkins")}
          bg="cyan.400"
          height="80px"
          style={{
            backgroundImage: "url('/images/napkins.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          Napkins
        </Button>
        <Button
          onClick={() => handleRequest("utensils")}
          bg="cyan.400"
          height="80px"
          style={{
            backgroundImage: "url('/images/utensils.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "top",
          }}
        >
          <strong> Utensils</strong>
        </Button>
      </SimpleGrid>
      <Divider my={5} height="5px" />
      <SimpleGrid columns={[1, 2]} spacing={5}>
        <Button onClick={() => handleRequest("pay by cash")} bg="green.400" height="80px">
          Pay Cash
        </Button>
        <Button onClick={() => handleRequest("pay by card")} bg="blue.400" height="80px">
          Pay By Card
        </Button>
      </SimpleGrid>
    </Box>
  );
};

export default ServicesScreen;
