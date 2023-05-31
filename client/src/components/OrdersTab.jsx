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
import { CheckCircleIcon, DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, deleteOrder, setDelivered, resetErrorAndRemoval } from "../redux/actions/adminActions";
import ConfirmRemovalAlert from "./ConfirmRemovalAlert";
import OrderDetails from "./OrderDetails";

const OrdersTab = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [orderToDelete, setOrderToDelete] = useState("");
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin);
  const user = useSelector((state) => state.user);
  const { userInfo } = user;
  const { error, loading, orderRemoval, orders, deliveredFlag, userList } = admin;
  const toast = useToast();

  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    console.log(item);
  };

  useEffect(() => {
    dispatch(getAllOrders());
    dispatch(resetErrorAndRemoval());
    if (orderRemoval) {
      toast({ description: "Order has been removed.", status: "success", isClosable: true });
    }
    if (deliveredFlag) {
      toast({ description: "Order has been delivered.", status: "success", isClosable: true });
    }
  }, [orderRemoval, dispatch, toast, deliveredFlag]);

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
          <SimpleGrid columns={{ base: 1, md: 5 }} spacing={10} flex={{ base: "none", md: "2" }} minChildWidth="180px">
            {orders &&
              [...userList]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((user) => {
                  const hasOrder = orders.some((order) => order.user === user._id);
                  if (hasOrder) {
                    return (
                      <WrapItem key={user._id}>
                        <Stack alignItems="center">
                          <Center bg="orange.400">
                            <Image
                              src="/images/table.png"
                              alt="Lovely Image"
                              fallback={<Skeleton />}
                              onClick={() => handleItemClick(user._id)}
                            />
                          </Center>
                          <div bg="orange.400">{user.name}</div>
                        </Stack>
                      </WrapItem>
                    );
                  }
                  return null;
                })}
          </SimpleGrid>
          <Box flex="1">{selectedItem && <OrderDetails item={selectedItem} />}</Box>
        </Flex>
      )}
      {/* <ConfirmRemovalAlert
        isOpen={isOpen}
        onClose={onClose}
        cancelRef={cancelRef}
        // itemToDelete={userToDelete}
        // deleteAction={deleteUser}
      /> */}
    </Box>
  );
};

export default OrdersTab;
