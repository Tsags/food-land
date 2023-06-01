import React, { useEffect, useState, useRef } from "react";
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
  Wrap,
  useToast,
  Heading,
  Text,
  Flex,
} from "@chakra-ui/react";
import { CheckCircleIcon, DeleteIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import ConfirmRemovalAlert from "./ConfirmRemovalAlert";
import { deleteOrder, setDelivered, resetErrorAndRemoval, getAllOrders } from "../redux/actions/adminActions";

const OrderDetails = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const dispatch = useDispatch();
  const [orderToDelete, setOrderToDelete] = useState("");
  const toast = useToast();
  const admin = useSelector((state) => state.admin);
  const { error, loading, orderRemoval, orders, deliveredFlag } = admin;
  const userName = props.user.name;
  const userId = props.user._id;

  useEffect(() => {
    dispatch(resetErrorAndRemoval());
    if (orderRemoval) {
      toast({ description: "Order has been removed.", status: "success", isClosable: true });
    }
    if (deliveredFlag) {
      toast({ description: "Order has been set to delivered.", status: "success", isClosable: true });
    }
  }, [orderRemoval, deliveredFlag, dispatch, toast, orders, userId]);

  const openDeleteConfirmBox = (order) => {
    setOrderToDelete(order);
    onOpen();
  };

  const onSetToDelivered = (order) => {
    dispatch(resetErrorAndRemoval());
    dispatch(setDelivered(order._id));
  };

  let totalTotalPrice = 0;
  orders.forEach((order) => {
    if (userId === order.user) {
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
        <Box>
          <TableContainer>
            <Heading textAlign="center">{userName}</Heading>
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
                    if (userId === order.user) {
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
                              {" "}
                              <Flex direction="column">
                                {!order.isDelivered && (
                                  <Button variant="outline" onClick={() => onSetToDelivered(order)}>
                                    <Text>Delivered</Text>
                                  </Button>
                                )}{" "}
                                <Button mt="5px" bg="red" variant="outline" onClick={() => openDeleteConfirmBox(order)}>
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
          <ConfirmRemovalAlert
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            cancelRef={cancelRef}
            itemToDelete={orderToDelete}
            deleteAction={deleteOrder}
          />
        </Box>
      )}
    </Box>
  );
};

export default OrderDetails;
