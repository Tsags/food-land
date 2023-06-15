import { Box, useColorModeValue, MenuList, Menu, MenuButton, Link, Text, MenuItem, Divider } from "@chakra-ui/react";
import React, { useState, useEffect, forwardRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BellIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import randomstring from "randomstring";
import { deleteNotification, markAllAsRead } from "../redux/slices/admin";
import { GrFormClose } from "react-icons/gr";

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const supTextColor = useColorModeValue("gray.200", "gray.700");
  const admin = useSelector((state) => state.admin);
  const { notifications } = admin;
  const user = useSelector((state) => state.user);
  const { userInfo } = user;
  const [unreadNotifications, setUnreadNotifications] = useState([]);

  const IconButtonWrapper = forwardRef(({ as: Component, ...rest }, ref) => <Component ref={ref} {...rest} />);

  useEffect(() => {
    const unread = notifications.filter((item) => !item.read);
    setUnreadNotifications(unread);
  }, [notifications]);

  const handleMenuOpen = () => {
    dispatch(markAllAsRead());
  };

  const handleDelete = (index, event) => {
    event.stopPropagation();
    dispatch(deleteNotification(index));
  };

  const handleButtonClick = (data) => {
    navigate("/admin", { state: { data: data } });
  };

  return (
    <Box>
      <Menu>
        <MenuButton
          onClick={handleMenuOpen}
          _hover={{ bg: useColorModeValue("gray.200", "gray.700") }}
          borderRadius="md"
          px={2}
          py={2}
        >
          <BellIcon boxSize={5} />
          {userInfo && userInfo.isAdmin === "true" && unreadNotifications.length > 0 && (
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
              {unreadNotifications.length}
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
                    </Text>
                    <Divider />
                  </Box>
                )}
                {item.orderItems && (
                  <Box onClick={() => handleButtonClick(item.userInfo)}>
                    <Text>
                      Table: <strong>{item.userInfo.name}</strong> added an order
                    </Text>
                    <Divider />
                  </Box>
                )}
                <Box position="relative">
                  <IconButtonWrapper
                    as={GrFormClose}
                    bg="white"
                    height="25px"
                    onClick={(event) => handleDelete(index, event)}
                  />
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
