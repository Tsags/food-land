import {
  Box,
  useColorModeValue,
  MenuList,
  Menu,
  MenuButton,
  Link,
  Text,
  MenuItem,
  Divider,
  CloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BellIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import randomstring from "randomstring";
import { deleteNotification } from "../redux/slices/admin";

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const supTextColor = useColorModeValue("gray.200", "gray.700");
  const admin = useSelector((state) => state.admin);
  const { notifications } = admin;

  const user = useSelector((state) => state.user);
  const { userInfo } = user;
  const [notificationsCount, setNotificationsCount] = useState(0);
  console.log(notifications);

  useEffect(() => {
    setNotificationsCount(notifications.length);
  }, [notifications]);

  const handleClick = () => {
    setNotificationsCount(0);
  };
  const handleDelete = (index, event) => {
    event.stopPropagation();
    dispatch(deleteNotification(index));
  };

  return (
    <Box>
      <Menu>
        <MenuButton
          onClick={handleClick}
          _hover={{ bg: useColorModeValue("gray.200", "gray.700") }}
          borderRadius="md"
          px={2}
          py={2}
        >
          <BellIcon boxSize={5} />
          {userInfo && userInfo.isAdmin === "true" && notificationsCount > 0 && (
            <Box
              as="sup"
              display="inline-block"
              position="relative"
              backgroundColor="red"
              color={supTextColor}
              borderRadius="50%"
              width="22px"
              height="22px"
              textAlign="center"
              lineHeight="20px"
              fontWeight="bold"
              whiteSpace="nowrap"
              top="-0.5rem"
              left="-0.3rem"
            >
              {notificationsCount}
            </Box>
          )}
        </MenuButton>

        <MenuList>
          {notifications.map((item, index) => {
            return (
              <MenuItem key={randomstring.generate(10)}>
                {item.request && (
                  <Box>
                    <Text>
                      Table: <strong>{item.userInfo.name}</strong> requested <strong>{item.request}</strong>
                      <Divider />
                    </Text>
                  </Box>
                )}
                {item.orderItems && (
                  <Box>
                    <Text>
                      Table: <strong>{item.userInfo.name}</strong> added an order
                      <Divider />
                    </Text>
                  </Box>
                )}
                <Box position="relative">
                  <CloseButton size="sm" onClick={(event) => handleDelete(index, event)} />
                </Box>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default Notifications;
