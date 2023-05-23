import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as ReactLink } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Link,
  Stack,
  Spinner,
  Alert,
  AlertTitle,
  AlertIcon,
  AlertDescription,
  Wrap,
} from "@chakra-ui/react";

import { fetchCart } from "../redux/actions/cartActions";
import { useColorModeValue as mode } from "@chakra-ui/react";

import CartItem from "../components/cartItem";
import CartOrderSummary from "../components/CartOrderSummary";

const CartScreen = () => {
  const dispatch = useDispatch();
  const cartInfo = useSelector((state) => state.cart);
  const { loading, error, cart } = cartInfo;

  //TO PARAKATW PAIRNEI TO CART APO TI VASI

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <Wrap spacing="30px" justify="center" minHeight="100vh">
      {loading ? (
        <Stack direction="row" spacing={4}>
          <Spinner mt={20} thickness="5px" speed="0.65s" emptyColor="gray.200" color="orange.500" size="xl" />
        </Stack>
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{error}..</AlertTitle>
        </Alert>
      ) : cart.length <= 0 ? (
        <Alert status="warning">
          <AlertIcon />
          <AlertTitle>Your order is empty.</AlertTitle>
          <AlertDescription>
            <Link as={ReactLink} to="/products">
              Click here to see the menu
            </Link>
          </AlertDescription>
        </Alert>
      ) : (
        <Box
          maxW={{ base: "3xl", lg: "7xl" }}
          mx="auto"
          px={{ base: "4", md: "8", lg: "12" }}
          py={{ base: "4", md: "8", lg: "12" }}
        >
          <Stack
            direction={{ base: "column", lg: "row" }}
            align={{ lg: "flex-start" }}
            spacing={{ base: "8", md: "16" }}
          >
            <Stack spacing={{ base: "8", md: "10" }} flex="2">
              <Heading fontSize="2xl" fontWeight="extrabold">
                Shopping Cart
              </Heading>
              <Stack spacing="6">
                {cart.map((item) => (
                  <CartItem key={item.id} cartItem={item} />
                ))}
              </Stack>
            </Stack>
            <Flex direction="column" align="center" flex="1">
              <CartOrderSummary />
              <HStack mt="6" fontWeight="semibold">
                <p>or</p>
                <Link as={ReactLink} to="/products">
                  Continue Shopping
                </Link>
              </HStack>
            </Flex>
          </Stack>
        </Box>
      )}
    </Wrap>
  );
};

export default CartScreen;
