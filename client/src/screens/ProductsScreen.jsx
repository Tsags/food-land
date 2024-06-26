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
} from "@chakra-ui/react";

import ProductCard from "../components/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../redux/actions/productActions";
import { useEffect, useState } from "react";
import Recommendations from "../components/Recommendations";

const ProductsScreen = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.products);
  const { loading, error, products } = productList;
  const customOrder = ["appetizers", "salads", "mains", "desserts"];
  const uniqueCategories = [...new Set(products.map((product) => product.category))].sort((a, b) => {
    return customOrder.indexOf(a) - customOrder.indexOf(b);
  });
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  function CapitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    setShowModal(true);
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <Wrap spacing="30px" justify="center" minHeight="79vh">
      {loading ? (
        <Stack direction="row" spacing={4}>
          <Spinner mt={20} thickness="5px" speed="0.65s" emptyColor="gray.200" color="orange.500" size="xl" />
        </Stack>
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{error}..</AlertTitle>
        </Alert>
      ) : (
        <Box width="100%">
          <Recommendations isOpen={showModal} onClose={closeModal} />
          <Tabs variant="soft-rounded" isFitted scrollbuttons="auto" size={{ base: "lg", md: "md" }}>
            <TabList
              overflowX="auto"
              whiteSpace="nowrap"
              sx={{
                "::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {uniqueCategories.map((category, index) => (
                <Tab key={index} _selected={{ color: "white", bg: "orange.400" }}>
                  {CapitalizeFirstLetter(category)}
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              {uniqueCategories.map((category, index) => (
                <TabPanel key={index}>
                  <Box spacing="30px">
                    <Wrap spacing="30px" justify="center">
                      {products
                        .filter((product) => product.category === category)
                        .map((product) => (
                          <WrapItem key={product._id}>
                            <Center w="250" h="550px">
                              <ProductCard product={product} />
                            </Center>
                          </WrapItem>
                        ))}
                    </Wrap>
                  </Box>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>
      )}
    </Wrap>
  );
};

export default ProductsScreen;
