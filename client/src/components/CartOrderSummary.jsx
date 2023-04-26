import { Button, Flex, Heading, Stack, Text, useColorModeValue as mode } from "@chakra-ui/react";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link as ReactLink, useNavigate } from "react-router-dom";

const CartOrderSummary = () => {
  const [buttonLoading, setButtonLoading] = useState();
  const cartItems = useSelector((state) => state.cart);
  const { total } = cartItems;
  const navigate = useNavigate;

  const checkoutHandler = () => {
    setButtonLoading(true);
    navigate("./checkout");
  };
  return (
    <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" w="full">
      <Heading size="md">Order Summary</Heading>
      <Stack spacing="6">
        <Flex justify="space-between">
          <Text fontWeight="extrabold" fontSize="xl">
            Total
          </Text>
          <Text fontWeight="extrabold" fontSize="xl">
            {total}€
          </Text>
        </Flex>
      </Stack>
      <Button
        as={ReactLink}
        to="/checkout"
        colorScheme="orange"
        size="lg"
        fontSize="md"
        rightIcon={<FaArrowRight />}
        isLoading={buttonLoading}
        onClick={() => checkoutHandler()}
      >
        Checkout
      </Button>
    </Stack>
  );
};

export default CartOrderSummary;
