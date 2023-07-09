import {
  TableContainer,
  Table,
  Td,
  Stack,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  Th,
  Tbody,
  Tr,
  Thead,
  ListItem,
  UnorderedList,
  Wrap,
  Flex,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCompletedOrders } from "../redux/actions/adminActions";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { CheckCircleIcon } from "@chakra-ui/icons";

const OrderHistoryTab = () => {
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin);
  const { loading, error, completedOrders, orders, userInfo } = admin;
  const location = useLocation();

  useEffect(() => {
    dispatch(getAllCompletedOrders());
  }, [dispatch, orders]);

  return (
    <>
      {loading ? (
        <Wrap justify="center" direction="column" align="center" mt="20px" minH="100vh">
          <Stack direction="row" spacing={4}>
            <Spinner mt={20} thickness="5px" speed="0.65s" emptyColor="gray.200" color="orange.500" size="xl" />
          </Stack>
        </Wrap>
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{error}..</AlertTitle>
        </Alert>
      ) : (
        completedOrders && (
          <TableContainer minHeight="108vh">
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Table</Th>
                  <Th>Order Date</Th>
                  <Th>Paid Total</Th>
                  <Th>Items</Th>
                </Tr>
              </Thead>
              <Tbody>
                {completedOrders.map((order) => (
                  <Tr key={order._id}>
                    <Td>{order.username}</Td>
                    <Td>
                      {" "}
                      {new Date(order.createdAt).toLocaleString("el-GR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </Td>
                    <Td>{parseFloat(order.totalPrice).toFixed(2)}€</Td>
                    <Td>
                      {order.orderItems.map((item) => (
                        <UnorderedList key={item._id}>
                          <ListItem>
                            {item.qty} x {item.name} ({item.price.toFixed(2)}€ each)
                          </ListItem>
                        </UnorderedList>
                      ))}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )
      )}
    </>
  );
};

export default OrderHistoryTab;
