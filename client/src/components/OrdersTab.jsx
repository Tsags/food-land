import {
  Box,
  Alert,
  Stack,
  Spinner,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Image,
  Skeleton,
  Wrap,
  WrapItem,
  Flex,
  Center,
  SimpleGrid,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import OrderDetails from "./OrderDetails";
import { getAllOrders } from "../redux/actions/adminActions";

const OrdersTab = ({ data }) => {
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin);
  const { error, loading, orders, userList, orderRemoval, deliveredFlag, orderSetCompleted } = admin;

  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (data && data.data) {
      const userSelected = userList.find((user) => user._id === data.data._id);
      setSelectedUser(userSelected);
    }
  }, [data, userList]);

  const handleItemClick = (user) => {
    setSelectedUser(user);
  };
  // console.log(orders);
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
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10} flex={{ base: "none", md: "2" }} minChildWidth="100px">
            {orders &&
              [...userList]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((user) => {
                  const hasOrder = orders.some((order) =>
                    order.userInfo ? order.userInfo._id === user._id : order.user === user._id
                  );
                  if (hasOrder) {
                    return (
                      <WrapItem key={user._id}>
                        <Stack alignItems="center">
                          <Center>
                            <Image
                              src="/images/table.png"
                              alt="Lovely Image"
                              width="50%"
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
          <OrderDetails
            orders={orders}
            user={selectedUser}
            orderRemoval={orderRemoval}
            deliveredFlag={deliveredFlag}
            orderSetCompleted={orderSetCompleted}
          />
        </Flex>
      )}
    </Box>
  );
};

export default OrdersTab;
