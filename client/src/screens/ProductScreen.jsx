import { useParams } from "react-router-dom";
import {
  Box,
  Image,
  Text,
  Wrap,
  Stack,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  Flex,
  Badge,
  Heading,
  HStack,
  Button,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { MinusIcon, AddIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../redux/actions/productActions";
import { addCartItem } from "../redux/actions/cartActions";
import { useEffect, useState } from "react";

const ProductScreen = () => {
  const [amount, setAmount] = useState(1);
  let { id } = useParams();
  const toast = useToast();
  //redux
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const { loading, error, product } = products;
  const cartContent = useSelector((state) => state.cart);
  const { cart } = cartContent;

  const userData = JSON.parse(sessionStorage.getItem("userInfo"));
  const [cartId, setCartId] = useState("");

  //GIA NA VRW TO CART ID

  // useEffect(() => {
  //   fetch(`/api/carts/${userData._id}`, {
  //     headers: {
  //       Authorization: `Bearer ${userData.token}`,
  //     },
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Cart not found");
  //       }
  //       return response.json();
  //     })
  //     .then((cart) => {
  //       setCartId(cart._id);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, []);

  useEffect(() => {
    dispatch(getProduct(id));
  }, [dispatch, id, cart]);

  const changeAmount = (input) => {
    if (input === "plus" && amount < product.stock) {
      setAmount(amount + 1);
    }
    if (input === "minus" && amount > 1) {
      setAmount(amount - 1);
    }
  };

  const itemToAdd = {
    id: product._id,
    name: product.name,
    image: product.image,
    price: product.price,
    qty: amount,
  };

  //IN PRODUCTION
  // const updateCart = async (itemToAdd) => {
  //   try {
  //     const response = await fetch(`/api/carts/${cartId}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${userData.token}`,
  //       },
  //       body: JSON.stringify({ items: [itemToAdd] }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Cart update failed");
  //     }

  //     const updatedCart = await response.json();
  //     console.log(updatedCart);
  //   } catch (error) {
  //     console.error("Error updating cart:", error);
  //   }
  // };

  const addItem = () => {
    // updateCart(itemToAdd);
    // // VGALE COMMENT GIA NA MPAINEI STO LOCALSTORAGE
    dispatch(addCartItem(product._id, amount));
    toast({ description: "Item has been added.", status: "success", isClosable: true });
  };
  return (
    <Wrap spacing="30px" justify="center" minHeight="100vh">
      {loading ? (
        <Stack direction="row" spacing={4}>
          <Spinner mt={20} thickness="5px" speed="0.65s" emptyColor="gray.200" color="orange.500" size="xl" />
        </Stack>
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>We are sorry!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <Box
          maxW={{ base: "3xl", lg: "5xl" }}
          mx="auto"
          px={{ base: "4", md: "8", lg: "12" }}
          py={{ base: "6", md: "8", lg: "12" }}
        >
          <Stack direction={{ base: "column", lg: "row-reverse" }} align={{}}>
            <Flex flex="1">
              <Image src={product.image} alt={product.name} borderRadius={50} />
            </Flex>
            <Stack
              pr={{ base: "0", md: "12" }}
              spacing={{ base: "8", md: "4" }}
              flex="1.5"
              mb={{ base: "12", md: "none" }}
            >
              {product.productIsNew && (
                <Badge rounded="full" w="40px" fontSize="0.8em" colorScheme="green">
                  New
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge rounded="full" w="40px" fontSize="0.8em" colorScheme="red">
                  New
                </Badge>
              )}
              <Heading fontSize="2xl" fontWeight="extrabold">
                {product.name}
              </Heading>
              <Text>{product.description}</Text>
              <Text fontSize="xl">{isNaN(product.price) ? "" : product.price.toFixed(2)}€</Text>
              <Flex w="170px" p="5px" border="1px" borderRadius={7} borderColor="gray.200" alignItems="center">
                <Button onClick={() => changeAmount("minus")}>
                  <MinusIcon />
                </Button>
                <Text mx="30px"> {amount} </Text>
                <Button onClick={() => changeAmount("plus")}>
                  <AddIcon />
                </Button>
              </Flex>

              <Button isDisabled={product.stock === 0} colorScheme="orange" onClick={() => addItem()}>
                Add to Cart
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}
    </Wrap>
  );
};

export default ProductScreen;
