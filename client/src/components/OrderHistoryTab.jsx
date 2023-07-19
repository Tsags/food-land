import {
  Stack,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  Wrap,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
} from "@chakra-ui/react";
import CompletedOrdersTab from "./CompletedOrdersTab";
import AnalyticsTab from "./AnalyticsTab";
import { useDispatch, useSelector } from "react-redux";
import { getAllCompletedOrders } from "../redux/actions/adminActions";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { CheckCircleIcon } from "@chakra-ui/icons";

const OrderHistoryTab = () => {
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin);
  const { loading, error, completedOrders, orders, userInfo } = admin;
  const location = useLocation();

  useEffect(() => {
    dispatch(getAllCompletedOrders());
  }, [dispatch, orders]);

  return (
    <>
      {loading ? (
        <Wrap justify="center" direction="column" align="center" mt="20px" minH="100vh">
          <Stack direction="row" spacing={4}>
            <Spinner mt={20} thickness="5px" speed="0.65s" emptyColor="gray.200" color="orange.500" size="xl" />
          </Stack>
        </Wrap>
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{error}..</AlertTitle>
        </Alert>
      ) : (
        <Box>
          <Tabs size="md" variant="enclosed" colorScheme="orange">
            <TabList>
              <Tab fontWeight="bold">Orders</Tab>
              <Tab fontWeight="bold" marginLeft="auto">
                Analytics
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel><CompletedOrdersTab completedOrders={completedOrders} /></TabPanel>
              <TabPanel><AnalyticsTab completedOrders={completedOrders}/></TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      )}
    </>
  );
};

export default OrderHistoryTab;
