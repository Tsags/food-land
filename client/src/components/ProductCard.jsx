import {
  Flex,
  Circle,
  Box,
  Image,
  Badge,
  useColorModeValue,
  Icon,
  Button,
  Tooltip,
  Stack,
  Link,
  HStack,
  Text,
} from "@chakra-ui/react";
import { GiNotebook } from "react-icons/gi";
import { Link as ReactLink } from "react-router-dom";
import { StarIcon } from "@chakra-ui/icons";
import { useState } from "react";

const Rating = ({ rating, numberOfReviews }) => {
  const { iconSize } = useState("14px");
  return (
    <Flex>
      <HStack spacing="2px">
        <StarIcon size={iconSize} w="14px" color="orange.500" />
        <StarIcon size={iconSize} w="14px" color={rating >= 2 ? "orange.500" : "gray.200"} />
        <StarIcon size={iconSize} w="14px" color={rating >= 3 ? "orange.500" : "gray.200"} />
        <StarIcon size={iconSize} w="14px" color={rating >= 4 ? "orange.500" : "gray.200"} />
        <StarIcon size={iconSize} w="14px" color={rating >= 5 ? "orange.500" : "gray.200"} />
      </HStack>
      <Text fontSize="md" fontWeight="bold" ml="4px">
        {`${numberOfReviews} ${numberOfReviews === 1 ? "Review" : "Reviews"}`}
      </Text>
    </Flex>
  );
};

const ProductCard = ({ product }) => {
  return (
    <Link as={ReactLink} to={`/product${product._id}`} pt="2" cursor="pointer" _hover={{ textDecoration: "none" }}>
      <Stack
        p="2"
        spacing="3px"
        bg={useColorModeValue("white", "gray.800")}
        minW="240px"
        h="450px"
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        position="relative"
      >
        {product.productIsNew && <Circle size="10px" position="absolute" top={2} right={2} bg="green.300" />}
        {product.stock <= 0 && <Circle size="10px" position="absolute" top={2} right={2} bg="red.300" />}
        <Image src={product.image} alt={product.name} rounded="lg" h="250px" w="250px" alignSelf="center" />
        <Box flex="1" maxH="5" alignItems="baseline">
          {product.stock <= 0 && (
            <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="red">
              Sold Out
            </Badge>
          )}
          {product.productIsNew <= 0 && (
            <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="green">
              New
            </Badge>
          )}
        </Box>
        <Flex mt="1" justifyContent="space-between" alignContent="center">
          <Box fontSize="2x1" fontWeight="semibold" lineHeight="tight">
            {product.name}
          </Box>
        </Flex>
        <Flex justifyContent="space-between" alignContent="center" py="2">
          <Rating rating={product.rating} numberOfReviews={product.numberOfReviews} />
        </Flex>
        <Flex justify="space-between">
          <Box fontSize="2x1" color={useColorModeValue("gray.600", "white")}>
            {product.price.toFixed(2)}
            <Box as="span" color={useColorModeValue("gray.600", "white")} fontSize="md">
              €
            </Box>
          </Box>
          <Tooltip label="Add to Cart" bg="white" placement="top" color="gray.800" fintSize="1.2em">
            <Button variant="ghost" display="flex" disabled={product.stock <= 0}>
              <Icon as={GiNotebook} h={7} w={7} alignSelf="center" />
            </Button>
          </Tooltip>
        </Flex>
      </Stack>
    </Link>
  );
};

export default ProductCard;
