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

const OrdersTab = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin);
  const { error, loading, orders, userList, orderRemoval, deliveredFlag } = admin;
  const [orderToDelete, setOrderToDelete] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const toast = useToast();

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

  useEffect(() => {
    dispatch(getAllOrders());
    dispatch(resetErrorAndRemoval());
    if (orderRemoval) {
      toast({ description: "Order has been removed.", status: "success", isClosable: true });
    }
    if (deliveredFlag) {
      toast({ description: "Order has been set to delivered.", status: "success", isClosable: true });
    }
  }, [dispatch, selectedUser, orderRemoval, deliveredFlag, toast]);

  let totalTotalPrice = 0;
  orders.forEach((order) => {
    if (selectedUser && selectedUser._id === order.user) {
      totalTotalPrice += order.totalPrice;
    }
  });
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
                  const hasOrder = orders.some((order) => order.user === user._id);
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
          <Box flex="1" >
            {selectedUser && (
              <TableContainer border="1px" borderRadius="10%">
                <Heading textAlign="center">{selectedUser && selectedUser.name}</Heading>
                <Table variant="unstyled">
                  <Thead>
                    <Tr>
                      <Th>Time of order</Th>
                      <Th>Items ordered</Th>
                      <Th>Delivered</Th>
                      <Th>Price</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {orders &&
                      orders.map((order) => {
                        if (selectedUser && selectedUser._id === order.user) {
                          return (
                            <React.Fragment key={order._id}>
                              <Tr>
                                <Td>
                                  {new Date(order.createdAt).toLocaleString("el-GR", {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                  })}
                                </Td>
                                <Td>
                                  {order.orderItems.map((item) => (
                                    <Text key={item._id}>
                                      {item.qty} x {item.name}
                                    </Text>
                                  ))}
                                </Td>
                                <Td>
                                  <Flex direction="column">{order.isDelivered ? <CheckCircleIcon /> : "Pending"}</Flex>
                                </Td>
                                <Td>
                                  {order.orderItems.map((item) => (
                                    <Text key={item.id}> {(item.price * item.qty).toFixed(2)}€</Text>
                                  ))}
                                </Td>
                                <Td>
                                  <Flex direction="column">
                                    {!order.isDelivered && (
                                      <Button variant="outline" onClick={() => onSetToDelivered(order)}>
                                        <Text>Delivered</Text>
                                      </Button>
                                    )}
                                    <Button
                                      mt="5px"
                                      bg="red"
                                      variant="outline"
                                      onClick={() => openDeleteConfirmBox(order)}
                                    >
                                      <DeleteIcon mr="5px" />
                                      Remove Order
                                    </Button>
                                  </Flex>
                                </Td>
                              </Tr>
                              <Tr key={`price-${order._id}`}>
                                <Td></Td>
                                <Td colSpan={3} textAlign="right">
                                  Order Price: {order.totalPrice.toFixed(2)}€<hr></hr>
                                </Td>
                              </Tr>
                            </React.Fragment>
                          );
                        }
                        return null;
                      })}
                  </Tbody>
                  {orders.length > 1 && (
                    <tfoot>
                      <Tr>
                        <Td></Td>
                        <Td colSpan={3} textAlign="right">
                          <strong>Total Price: {totalTotalPrice.toFixed(2)}€</strong>
                        </Td>
                      </Tr>
                    </tfoot>
                  )}
                </Table>
              </TableContainer>
            )}
            <ConfirmRemovalAlert
              isOpen={isOpen}
              onOpen={onOpen}
              onClose={onClose}
              cancelRef={cancelRef}
              itemToDelete={orderToDelete}
              deleteAction={deleteOrder}
            />
          </Box>
        </Flex>
      )}
    </Box>
  );
};

export default OrdersTab;
