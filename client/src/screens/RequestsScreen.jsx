import {
  Box,
  TableContainer,
  Th,
  Tr,
  Table,
  Td,
  Thead,
  Tbody,
  Button,
  useDisclosure,
  useToast,
  Flex,
  Heading,
  Text,
  ListItem,
  UnorderedList,
  SimpleGrid,
} from "@chakra-ui/react";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, deleteOrder, setDelivered, resetErrorAndRemoval } from "../redux/actions/adminActions";
import { CheckCircleIcon, DeleteIcon } from "@chakra-ui/icons";

import { io } from "socket.io-client";
const socket = io("/");

const RequestsScreen = () => {
  const user = useSelector((state) => state.user);
  const { loading, error, userInfo } = user;
  const handleRequest = (request) => {
    // Emit the request event to the server
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

export default RequestsScreen;
