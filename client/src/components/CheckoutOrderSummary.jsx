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
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Link as ReactLink } from "react-router-dom";
import { PhoneIcon, EmailIcon, ChatIcon } from "@chakra-ui/icons";
import { useEffect, useState, useCallback } from "react";
import CheckoutItem from "./CheckoutItem";
import { createOrder } from "../redux/actions/orderActions";

const CheckoutOrderSummary = () => {
  const colorMode = mode("gray.600", "gray.400");
  const cartItems = useSelector((state) => state.cart);
  const { cart, total } = cartItems;
  console.log(cart);
  const user = useSelector((state) => state.user);
  const { userInfo } = user;
  console.log(userInfo);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const dispatch = useDispatch();
  const obj = {
    orderItems: cart,
    totalPrice: total,
    userInfo,
  };
  console.log(obj);

  useEffect(() => {
    dispatch(
      createOrder({
        orderItems: cart,
        totalPrice: total,
        userInfo,
      })
    );
  });

  return (
    <Stack spacing="4" rounded="xl" padding="8" width="full">
      <Heading size="md">Order Summary</Heading>
      {cart.map((item) => (
        <CheckoutItem key={item.id} cartItem={item} />
      ))}
      <Stack spacing="6">
        <Flex justify="space-between">
          <Text fontSize="lg" fontWeight="semibold">
            Total
          </Text>
          <Text fontSize="xl" fontWeight="extrabold">
            $ {total}
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
  );
};

export default CheckoutOrderSummary;
