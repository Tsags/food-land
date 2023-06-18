import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Icon,
  Text,
  useDisclosure,
  Button,
  Stack,
  useColorModeValue,
  useColorMode,
  useOutsideClick,
  useToast,
  MenuItem,
  Menu,
  MenuDivider,
  MenuButton,
  MenuList,
  Spacer,
  Badge,
} from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { MdFastfood, MdLogout } from "react-icons/md";
import { BsPersonLinesFill } from "react-icons/bs";
import { TbReportMoney } from "react-icons/tb";
import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/actions/userActions";
import { RiShoppingCart2Line, RiComputerLine } from "react-icons/ri";
import { useEffect } from "react";
import Notifications from "./Notifications";
import randomstring from "randomstring";
import { getUserOrders } from "../redux/actions/userActions";

const CartIcon = () => {
  const cartInfo = useSelector((state) => state.cart);
  const { cart } = cartInfo;

  return (
    <Flex>
      {!!cart.length && (
        <Text fontStyle="italic" as="sub" fontSize="xs">
          {cart.length}
        </Text>
      )}
      <Icon ml="-1.5" as={RiShoppingCart2Line} h="4" w="7" alignSelf="center" />
      Cart
    </Flex>
  );
};

const ServicesIcon = () => {
  return (
    <Flex>
      <Icon ml="-1.5" as={BsPersonLinesFill} h="4" w="7" alignSelf="center" />
      Services
    </Flex>
  );
};

const links = [
  { linkName: "Products", path: "/products" },
  { linkName: <CartIcon />, path: "/cart" },
  { linkName: <ServicesIcon />, path: "/services" },
];

const NavLink = ({ path, children }) => {
  return (
    <Link
      as={ReactLink}
      to={path}
      px={2}
      py={2}
      rounded="md"
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
    >
      {children}
    </Link>
  );
};
const Navbar = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const [isHovering, setIsHovering] = useState(false);
  const user = useSelector((state) => state.user);
  const { loading, error, orders, userInfo } = user;
  const dispatch = useDispatch();
  const toast = useToast();
  const adminLinkColor = useColorModeValue("gray.200", "gray.700");
  const ref = useRef();

  useOutsideClick({
    ref: ref,
    handler: () => onClose(true),
  });

  const logoutHandler = () => {
    dispatch(logout());
    toast({
      description: "You have been logged out.",
      status: "success",
      isClosable: true,
    });
  };

  useEffect(() => {
    if (userInfo) {
      dispatch(getUserOrders());
    }
  }, [dispatch, userInfo]);

  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack>
          <Link
            as={ReactLink}
            to="/"
            style={{ textDecoration: "none" }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Flex alignItems="center">
              <Icon as={MdFastfood} h={6} w={6} color={isHovering ? "cyan.400" : "orange.400"} />
              <Text fontWeight="extrabold">FoodLand</Text>
            </Flex>
          </Link>
          <HStack as="nav" spacing={4} display={{ base: "none", md: "flex" }}>
            {links.map((link) => (
              <NavLink key={randomstring.generate(10)} path={link.path}>
                {link.linkName}
              </NavLink>
            ))}

            {userInfo && userInfo.isAdmin === "true" && (
              <Box
                as={ReactLink}
                to="/admin"
                px={2}
                py={2}
                rounded="md"
                _hover={{ textDecoration: "none", bg: adminLinkColor }}
              >
                <Icon ml="-1.5" as={RiComputerLine} h="4" w="7" alignSelf="center" />
                Admin-Console
              </Box>
            )}
          </HStack>
        </HStack>
        <HStack>
          <NavLink>
            <Icon as={colorMode === "light" ? MoonIcon : SunIcon} onClick={() => toggleColorMode()} />
          </NavLink>

          <Notifications />

          {userInfo ? (
            <Menu>
              <Box>
                <MenuButton px="4" py="2" transition="all 0.3s" as={Button}>
                  {userInfo.name} <ChevronDownIcon />
                </MenuButton>
                <MenuList>
                  <MenuItem as={ReactLink} to="/your-orders">
                    <Text ml="2">Your Orders</Text>
                  </MenuItem>

                  <MenuDivider />
                  <MenuItem onClick={logoutHandler}>
                    <MdLogout />
                    <Text ml="2">Logout</Text>
                  </MenuItem>
                </MenuList>
              </Box>
            </Menu>
          ) : (
            <>
              <Button as={ReactLink} to="/login" p={2} fontSize="sm" fontWeight={400} variant="link">
                Sign In
              </Button>
              <Button
                as={ReactLink}
                to="/registration"
                m={2}
                display={{ base: "none", md: "inline-flex" }}
                fontSize="sm"
                fontWeight={600}
                _hover={{ bg: "orange.400" }}
                bg="orange.500"
                color="white"
              >
                Sign Up
              </Button>
            </>
          )}
        </HStack>
      </Flex>
      {isOpen ? (
        <Box pb={4} display={{ md: "none" }} ref={ref}>
          <Stack as="nav" spacing={4} onClick={onClose}>
            {links.map((link) => (
              <NavLink key={randomstring.generate(10)} path={link.path}>
                {link.linkName}
              </NavLink>
            ))}
            {userInfo && userInfo.isAdmin === "true" && (
              <Box
                as={ReactLink}
                to="/admin"
                px={2}
                py={2}
                rounded="md"
                _hover={{ textDecoration: "none", bg: adminLinkColor }}
              >
                <Icon ml="-1.5" as={RiComputerLine} h="4" w="7" alignSelf="center" />
                Admin-Console
              </Box>
            )}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};

export default Navbar;
