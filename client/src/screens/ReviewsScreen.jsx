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
} from "@chakra-ui/react";

import { StarIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getProducts } from "../redux/actions/productActions";
import { useDispatch, useSelector } from "react-redux";

const saveRating = async (productId, rating, customerId, productName) => {
  await axios.post(`/api/products/${productId}/rating`, { rating: rating });
  await axios.post(`/api/customers`, { rating: rating, product: productName, customerId: customerId });
};

const Rating = ({ onRate }) => {
  const [rating, setRating] = useState(0);
  const iconSize = "14px";

  const handleStarClick = (starNumber) => {
    setRating(starNumber);
    if (onRate) {
      onRate(starNumber);
    }
  };

  return (
    <Flex>
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

  return (
    <Wrap spacing="30px" justify="center" minHeight="79vh">
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

              <Flex mt="1" justifyContent="space-between" alignContent="center">
                <Box fontSize="2x1" fontWeight="semibold" lineHeight="tight">
                  {product.name}
                </Box>
              </Flex>
              <Flex justifyContent="space-between" alignContent="center" py="2">
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
    </Wrap>
  );
};

export default ReviewsScreen;
