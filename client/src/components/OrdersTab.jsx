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
  Alert,
  Stack,
  Spinner,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Image,
  Skeleton,
  Wrap,
  WrapItem,
  Flex,
  Center,
  SimpleGrid,
  Heading,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, deleteOrder, setDelivered, resetErrorAndRemoval } from "../redux/actions/adminActions";
import ConfirmRemovalAlert from "./ConfirmRemovalAlert";
import { CheckCircleIcon, DeleteIcon } from "@chakra-ui/icons";
import OrderDetails from "./OrderDetails";

const OrdersTab = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin);
  const { error, loading, orders, userList, orderRemoval, deliveredFlag } = admin;
  const [orderToDelete, setOrderToDelete] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const toast = useToast();
  console.log(orders);
  const handleItemClick = (user) => {
    setSelectedUser(user);
  };

  const onSetToDelivered = (order) => {
    dispatch(resetErrorAndRemoval());
    dispatch(setDelivered(order._id));
  };

  const openDeleteConfirmBox = (order) => {
    setOrderToDelete(order);
    onOpen();
  };

 

 
  return (
    <Box>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Upps!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {loading ? (
        <Wrap justify="center">
          <Stack direction="row" spacing="4">
            <Spinner mt="20" thickness="2px" speed="0.65s" emptyColor="gray.200" color="orange.500" size="xl" />
          </Stack>
        </Wrap>
      ) : (
        <Flex direction={{ base: "column", md: "row" }}>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10} flex={{ base: "none", md: "2" }} minChildWidth="180px">
            {orders &&
              [...userList]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((user) => {
                  const hasOrder = orders.some((order) => order.userInfo._id === user._id);
                  if (hasOrder) {
                    return (
                      <WrapItem key={user._id}>
                        <Stack alignItems="center">
                          <Center>
                            <Image
                              src="/images/table.png"
                              alt="Lovely Image"
                              fallback={<Skeleton />}
                              onClick={() => handleItemClick(user)}
                            />
                          </Center>
                          <div>
                            <strong>{user.name}</strong>
                          </div>
                        </Stack>
                      </WrapItem>
                    );
                  }
                  return null;
                })}
          </SimpleGrid>
          <OrderDetails orders={orders} user={selectedUser} orderRemoval={orderRemoval} deliveredFlag={deliveredFlag}/>
        </Flex>
      )}
    </Box>
  );
};

export default OrdersTab;
