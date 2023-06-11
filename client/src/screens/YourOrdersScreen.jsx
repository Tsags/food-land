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
import { getUserOrders } from "../redux/actions/userActions";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { CheckCircleIcon } from "@chakra-ui/icons";

const YourOrdersScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { loading, error, orders, userInfo } = user;
  const location = useLocation();

  useEffect(() => {
    if (userInfo) {
      dispatch(getUserOrders());
    }
  }, [dispatch, userInfo]);
  console.log(orders);
  return userInfo ? (
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
        orders && (
          <TableContainer minHeight="108vh">
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Order Id</Th>
                  <Th>Order Date</Th>
                  <Th>Paid Total</Th>
                  <Th>Items</Th>
                  <Th>Delivered</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders.map((order) => (
                  <Tr key={order._id}>
                    <Td>{order._id}</Td>
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
                    <Td>
                      <Flex direction="column">
                        {order.isDelivered ? <CheckCircleIcon color="green.300" mx="20px" /> : "Pending"}
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )
      )}
    </>
  ) : (
    <Navigate to="/login" replace={true} state={{ from: location }} />
  );
};

export default YourOrdersScreen;
