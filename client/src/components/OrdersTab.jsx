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
  Grid,
  GridItem,
  Wrap,
  WrapItem,
  Flex,
  HStack,
  Spacer,
  Center,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../redux/actions/adminActions";
import OrderDetails from "./OrderDetails";

const OrdersTab = () => {
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin);
  const { error, loading, orders, userList } = admin;

  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (user) => {
    setSelectedItem(user);
  };

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch, selectedItem]);

  useEffect(() => {}, [selectedItem, orders]);

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
          <Box flex="1">{selectedItem && <OrderDetails user={selectedItem} />}</Box>
        </Flex>
      )}
    </Box>
  );
};

export default OrdersTab;
