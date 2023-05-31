import { useSelector } from "react-redux";
import { Link as ReactLink } from "react-router-dom";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

import { useColorModeValue as mode } from "@chakra-ui/react";
import { useState, useEffect } from "react";

import UsersTab from "../components/UsersTab";
import OrdersTab from "../components/OrdersTab";

const AdminScreen = () => {
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const { userInfo, loading, error } = user;

  const [activeTable, setActiveTable] = useState([]);
  const [table, setTable] = useState([]);
  console.log(table);
  console.log(activeTable);

  return userInfo && userInfo.isAdmin === "true" ? (
    <Box>
      <Stack direction={{ base: "column", lg: "row" }} align={{ lg: "flex-start" }}>
        <Stack pr={{ base: 0, md: 14 }} spacing={{ base: 8, md: 10 }} flex="1.5" mb={{ base: 12, md: "none" }}>
          <Heading fontSize="2xl" fontWeight="extrabold">
            Admin Console
          </Heading>
          <Tabs size="md" variant="enclosed" colorScheme="orange">
            <TabList>
              <Tab fontWeight="bold">Orders</Tab>
              <Tab fontWeight="bold">All Tables</Tab>
              <Tab fontWeight="bold"> Products</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <OrdersTab />
              </TabPanel>
              <TabPanel>
                <UsersTab />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </Stack>
    </Box>
  ) : (
    <Navigate to="/" replace={true} state={{ from: location }} />
  );
};

export default AdminScreen;
