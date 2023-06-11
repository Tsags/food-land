import {
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Link,
  Skeleton,
  Stack,
  useColorModeValue,
  Text,
  textDecoration,
} from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";
import { Link as ReactLink } from "react-router-dom";
import { MdFastfood } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

export const LandingScreen = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  console.log(userInfo);
  return (
    <Box maxW="8xl" mx="auto" px={{ base: "0", lg: "12" }} py={{ base: "0", lg: "12" }} minH="5xl" mt="5">
      <Stack direction={{ base: "column-reverse", lg: "row" }} spacing={{ base: "0", lg: "20" }}>
        <Box
          width={{ lg: "sm" }}
          transform={{ base: "translateY(-50%)", lg: "none" }}
          bg={{ base: useColorModeValue("red.50", "gray.700"), lg: "transparent" }}
          mx={{ base: "10", md: "8", lg: "0" }}
          my={{ base: "20", md: "0", lg: "0" }}
          px={{ base: "5", md: "8", lg: "0" }}
          py={{ base: "5", md: "8", lg: "12" }}
        >
          <Stack spacing={{ base: "8", lg: "10" }}>
            <Stack spacing={{ base: "2", lg: "4" }}>
              <Flex alignItems="center">
                <Icon as={MdFastfood} h={12} w={12} color={useColorModeValue("orange.400", "orange.300")} />
                <Text fontSize="4xl" fontWeight="extrabold" color={useColorModeValue("orange.400", "orange.300")}>
                  FoodLand
                </Text>
              </Flex>
              <Heading size="xl" fontWeight="normal">
                Trust your palate.
              </Heading>
            </Stack>
            <HStack spacing="3">
              <Link
                as={ReactLink}
                to="/products"
                color={useColorModeValue("red.500", "red.300")}
                fontWeight="bold"
                fontSize="lg"
                style={{ textDecoration: "none" }}
              >
                Discover now
              </Link>
              <Icon color={useColorModeValue("red.500", "red.300")} as={FaArrowRight} />
            </HStack>
          </Stack>
        </Box>
        <Flex flex="1" overflow="hidden">
          <Image
            src="/images/pxfuel.jpg"
            alt="Lovely Image"
            fallback={<Skeleton />}
            maxH="550px"
            minW="300px"
            objectFit="cover"
            flex="1"
          />
        </Flex>
      </Stack>
    </Box>
  );
};

export default LandingScreen;
