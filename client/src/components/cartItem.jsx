import { CloseButton, Flex, Select, useColorModeValue as mode, Stack, Image, Box, Text } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { addCartItem } from "../redux/actions/cartActions";
import { removeCartItem } from "../redux/actions/cartActions";
import axios from "axios";

const CartItem = ({ cartItem }) => {
  async function makePostRequest(url, data) {
    try {
      const response = await axios.post(url, data);
      console.log(response.data); // log the response data to the console
    } catch (error) {
      console.error(error);
    }
  }
  const { name, image, price, stock, qty, id } = cartItem;
  const dispatch = useDispatch();
  return (
    <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center">
      <Stack direction="row" spacing="5" width="full">
        <Image rounded="lg" w="120px" h="120ox" fit="cover" src={image} alt={name} draggable="false" loading="lazy" />
        <Box pt="4">
          <Stack spacing="0.5">
            <Text fontWeight="medium">{name}</Text>
          </Stack>
        </Box>
      </Stack>
      <Flex
        w="full"
        mt={{ base: "4", md: "0" }}
        align={{ base: "center", md: "baseline" }}
        justify="space-between"
        display="flex"
      >
        <Select
          maxW="64px"
          focusBorderColor={mode("orange.500", "orange.200")}
          value={qty}
          onChange={(e) => {
            dispatch(addCartItem(id, e.target.value));
            makePostRequest("/api/carts", {});
          }}
        >
          {[...Array(stock).keys()].map((x) => (
            <option key={x + 1} value={x + 1}>
              {x + 1}
            </option>
          ))}
        </Select>
        <Text fontWeight="bold">{price * qty}€</Text>
        <CloseButton onClick={() => dispatch(removeCartItem(id))} />
      </Flex>
    </Flex>
  );
};

export default CartItem;
