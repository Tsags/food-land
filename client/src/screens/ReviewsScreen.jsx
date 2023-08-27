import {
  Center,
  Wrap,
  WrapItem,
  Spinner,
  Stack,
  Alert,
  AlertIcon,
  AlertTitle,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  HStack,
  Flex,
  Text,
  useColorModeValue,
  Image,
  Button,
  Icon,
} from "@chakra-ui/react";

import { StarIcon } from "@chakra-ui/icons";
import { FiCheckCircle } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getProducts } from "../redux/actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/actions/userActions";

const saveRating = async (productId, rating, customerId, productName) => {
  await axios.post(`/api/products/${productId}/rating`, { rating: rating });
  await axios.post(`/api/customers`, { rating: rating, product: productName, customerId: customerId });
};

const getRatingDescription = (rating) => {
  switch (rating) {
    case 1:
      return { word: "Bad", color: "red.500" };
    case 2:
      return { word: "Below Average", color: "orange.400" };
    case 3:
      return { word: "Average", color: "yellow.500" };
    case 4:
      return { word: "Good", color: "cyan.500" };
    case 5:
      return { word: "Perfect", color: "green.500" };
    default:
      return { word: "", color: "black" };
  }
};

const Rating = ({ onRate }) => {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState(getRatingDescription(0));
  const iconSize = "14px";

  const handleStarClick = (starNumber) => {
    setRating(starNumber);
    setDescription(getRatingDescription(starNumber));
    if (onRate) {
      onRate(starNumber);
    }
  };

  return (
    <Flex flexDirection="column" alignItems="center">
      <HStack spacing="2px">
        {Array.from({ length: 5 }).map((_, index) => (
          <StarIcon
            key={index}
            size={iconSize}
            w="14px"
            color={rating >= index + 1 ? "orange.500" : "gray.200"}
            onClick={() => handleStarClick(index + 1)}
            cursor="pointer"
          />
        ))}
      </HStack>
      <Text mt={2} as="b" fontSize="lg" color={description.color}>
        {description.word}
      </Text>
    </Flex>
  );
};

const ReviewsScreen = () => {
  const dispatch = useDispatch();
  const customerId = JSON.parse(localStorage.getItem("customerId"));
  const [customer, setCustomer] = useState(null);
  const productList = useSelector((state) => state.products);
  const { loading, error, products } = productList;
  const actualCustomer = customer && customer[0];
  const items = actualCustomer?.session?.[actualCustomer.session.length - 1]?.items || [];

  const relevantProducts = products
    ? products.filter((product) => items.some((item) => item.name === product.name))
    : [];
  console.log(relevantProducts);
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        const { data } = await axios.get(`/api/customers/${customerId}`, config);
        setCustomer(data);
      } catch (error) {
        console.error("Υπήρξε ένα πρόβλημα κατά τη φόρτωση των δεδομένων:", error);
      }
    };

    fetchData();
  }, [customerId]);
  const handleThankYouClick = () => {
    dispatch(logout());
  };

  return (
    <Wrap spacing="30px" justify="center" minHeight="79vh">
      <Center w="100%" mb="20px">
        <Text fontWeight="bold" fontSize="lg" textAlign="center" mt="10">
          Please rate us to help us improve. Your ratings remain anonymous.
        </Text>
      </Center>
      {relevantProducts.map((product) => (
        <WrapItem key={product._id}>
          <Center w="250" h="550px">
            <Stack
              p="2"
              spacing="3px"
              minW="240px"
              h="450px"
              borderWidth="1px"
              rounded="lg"
              shadow="lg"
              position="relative"
            >
              <Image src={product.image} alt={product.name} rounded="lg" h="250px" w="250px" alignSelf="center" />

              <Flex mt="1" justifyContent="center" alignContent="center">
                <Box fontSize="2x1" fontWeight="semibold" lineHeight="tight">
                  {product.name}
                </Box>
              </Flex>
              <Flex justifyContent="center" alignItems="center" py="2" flexDirection="column" flexGrow="1">
                <Rating
                  onRate={(rating) => {
                    // Εδώ, μπορείτε να καλέσετε μια συνάρτηση για να αποθηκεύσετε τη βαθμολογία στη βάση δεδομένων.
                    // Για παράδειγμα:
                    saveRating(product._id, rating, customerId, product.name);
                  }}
                />
              </Flex>

              <Flex justify="space-between">
                {/* <Tooltip label="Add to Cart" bg="white" placement="top" color="gray.800" fontSize="1.2em">
        <Button variant="ghost" display="flex" disabled={product.stock <= 0} onClick={() => addItem(product._id)}>
          <Icon as={GiNotebook} h={7} w={7} alignSelf="center" />
        </Button>
      </Tooltip> */}
              </Flex>
            </Stack>
          </Center>
        </WrapItem>
      ))}
      <Center w="100%" mt="20px" mb="5">
        <Button colorScheme="green" onClick={handleThankYouClick}>
          <Icon as={FiCheckCircle} mr="1"></Icon> Thank you
        </Button>
      </Center>
    </Wrap>
  );
};

export default ReviewsScreen;
