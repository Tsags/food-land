import {
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue as mode,
  Badge,
  Box,
  Link,
  Divider,
  useDisclosure,
  Wrap,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Link as ReactLink } from "react-router-dom";
import { PhoneIcon, EmailIcon, ChatIcon } from "@chakra-ui/icons";
import { useEffect, useState, useCallback } from "react";
import CheckoutItem from "./CheckoutItem";
import { createOrder } from "../redux/actions/orderActions";
import { resetCart } from "../redux/actions/cartActions";

const CheckoutOrderSummary = () => {
  const colorMode = mode("gray.600", "gray.400");
  const orderItems = useSelector((state) => state.order);
  const { order } = orderItems;
  const cartItems = useSelector((state) => state.cart);
  const { cart, total } = cartItems;
  const user = useSelector((state) => state.user);
  const { userInfo, loading, error } = user;
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const dispatch = useDispatch();

  const [cartToOrder, setCartToOrder] = useState(cart);
  const [orderTotal, setOrderTotal] = useState(total);

  useEffect(() => {
    const createOrderAndClearCart = async () => {
      dispatch(
        createOrder({
          orderItems: cartToOrder,
          totalPrice: orderTotal,
          userInfo,
        })
      );
      dispatch(resetCart());
    };

    if (cartToOrder.length > 0) {
      createOrderAndClearCart();
    }
  }, [dispatch, userInfo, cartToOrder, orderTotal]);
  const moneyFromLocalStorage = localStorage.getItem("totalOrder");
  const money = JSON.parse(moneyFromLocalStorage);

  return (
    <Box>
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
        <Stack spacing="4" rounded="xl" padding="8" width="full">
          <Heading size="md">Order Summary</Heading>
          {order.map((item) => (
            <CheckoutItem key={item.id} orderItem={item} />
          ))}
          <Stack spacing="6">
            <Flex justify="space-between">
              <Text fontSize="lg" fontWeight="semibold">
                Total
              </Text>
              <Text fontSize="xl" fontWeight="extrabold">
                {money}€
              </Text>
            </Flex>
          </Stack>
          <Box align="center">
            <Text fontSize="sm">Have questions? or need help to complete your order?</Text>
            <Flex justifyContent="center" color={mode("orange.500", "orange.100")}>
              <Flex align="center">
                <ChatIcon />
                <Text m="2">Live Chat</Text>
              </Flex>
              <Flex align="center">
                <PhoneIcon />
                <Text m="2">Phone</Text>
              </Flex>
              <Flex align="center">
                <EmailIcon />
                <Text m="2">Email</Text>
              </Flex>
            </Flex>
          </Box>
          <Divider bg={mode("gray.400", "gray.800")} />
          <Flex justifyContent="center" my="6" fontWeight="semibold">
            <p>or</p>
            <Link as={ReactLink} to="/products" ml="1">
              Continue Shopping
            </Link>
          </Flex>
        </Stack>
      )}
    </Box>
  );
};

export default CheckoutOrderSummary;
