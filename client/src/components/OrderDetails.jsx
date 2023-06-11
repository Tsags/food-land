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
} from "@chakra-ui/react";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, deleteOrder, setDelivered, resetErrorAndRemoval } from "../redux/actions/adminActions";
import ConfirmRemovalAlert from "./ConfirmRemovalAlert";
import { CheckCircleIcon, DeleteIcon } from "@chakra-ui/icons";

const OrderDetails = ({ orders, user, orderRemoval, deliveredFlag }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const dispatch = useDispatch();
  const [orderToDelete, setOrderToDelete] = useState("");
  const toast = useToast();
  const onSetToDelivered = (order) => {
    dispatch(resetErrorAndRemoval());
    dispatch(setDelivered(order.orderId));
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
  }, [dispatch, orderRemoval, deliveredFlag, toast]);

  let totalTotalPrice = 0;
  orders.forEach((order) => {
    if (user && user._id === order.userInfo._id) {
      totalTotalPrice += parseFloat(order.totalPrice);
    }
  });

  return (
    <Box flex="1">
      {user && (
        <TableContainer border="1px" borderRadius="10%" boxShadow="#ccc 3px 3px 5px 6px">
          <Heading textAlign="center">{user && user.name}</Heading>
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th>Time of order</Th>
                <Th>Items ordered</Th>
                <Th>Price</Th>
                <Th>Delivered</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders &&
                orders.map((order) => {
                  if (user && user._id === order.userInfo._id) {
                    return (
                      <React.Fragment key={order.orderId}>
                        <Tr>
                          <Td>
                            {new Date(order.createdAt).toLocaleString("el-GR", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </Td>
                          <Td>
                            {order.orderItems.map((item) => (
                              <UnorderedList key={item.id}>
                                <ListItem>
                                  {item.qty} x {item.name}
                                </ListItem>
                              </UnorderedList>
                            ))}
                          </Td>
                          <Td>
                            {order.orderItems.map((item) => (
                              <Text key={item.id} textAlign="right">
                                {(item.price * item.qty).toFixed(2)}€
                              </Text>
                            ))}
                          </Td>
                          <Td>
                            <Flex direction="column">
                              {order.isDelivered ? <CheckCircleIcon color="green.300" mx="25px" /> : "Pending"}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex direction="column">
                              {!order.isDelivered && (
                                <Button variant="outline" onClick={() => onSetToDelivered(order)}>
                                  <Text>Delivered</Text>
                                </Button>
                              )}
                              <Button mt="5px" bg="red" variant="outline" onClick={() => openDeleteConfirmBox(order)}>
                                <DeleteIcon mr="5px" />
                                Remove Order
                              </Button>
                            </Flex>
                          </Td>
                        </Tr>
                        <Tr key={`price-${order.orderId}`}>
                          <Td></Td>
                          <Td colSpan={3} textAlign="right">
                            Order Price: {parseFloat(order.totalPrice).toFixed(2)}€<hr></hr>
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
                    <strong>Total Price: {totalTotalPrice.toFixed(2)}€ </strong>
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
  );
};

export default OrderDetails;
