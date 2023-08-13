import {
  Button,
  Box,
  Container,
  FormControl,
  Heading,
  Stack,
  useBreakpointValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import TextField from "../components/TextField";
import PasswordTextField from "../components/PasswordTextField";
import { login } from "../redux/actions/userActions";
import { fetchCart } from "../redux/actions/cartActions";
import { getAllOrders } from "../redux/actions/adminActions";
import { getRecommendationsForCustomer } from "../redux/actions/userActions";

//TODO: redefine password length
const LoginScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const redirect = "/products";
  const toast = useToast();

  const user = useSelector((state) => state.user);
  const { loading, error, userInfo } = user;

  const headingBR = useBreakpointValue({ base: "xs", md: "sm" });
  const boxBR = useBreakpointValue({ base: "transparent", md: "bg-surface" });

  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get("username");
  const password = queryParams.get("password");

  useEffect(() => {
    if (username && password) {
      dispatch(login(username, password));
    }
  }, [dispatch, username, password]);

  useEffect(() => {
    if (userInfo) {
      if (location.state?.from) {
        navigate(location.state.from);
      } else {
        if (userInfo.isAdmin === "true") {
          dispatch(getAllOrders());
        }
        dispatch(fetchCart());
        dispatch(getRecommendationsForCustomer());
        navigate("/");
      }
      // window.location.reload();
      toast({ description: "Login Successful", status: "success", isClosable: true });
    }
  }, [userInfo, navigate, location.state, toast, dispatch]);

  return (
    <Formik
      initialValues={{ name: "", password: "" }}
      validationSchema={Yup.object({
        name: Yup.string().label("Invalid user").required("A registered user is required"),
        password: Yup.string().min(1, "Password too short").required("Password is required"),
      })}
      onSubmit={(values) => {
        dispatch(login(values.name, values.password));
      }}
    >
      {(formik) => (
        <Container>
          <Stack justifyContent="center" textAlign="center">
            <Heading size={headingBR}>Login Table</Heading>
            <Box py={{ base: "0", md: "8" }} px={{ base: "4", md: "10" }} bg={{ boxBR }}>
              <Stack spacing="6" as="form" onSubmit={formik.handleSubmit}>
                {error && (
                  <Alert status="error" alignItems="center" justifyContent="center" textAlign="center">
                    <AlertIcon />
                    <AlertTitle>We are sorry!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Stack spacing="5">
                  <FormControl>
                    <TextField type="text" name="name" placeholder="" label="table number" />
                    <PasswordTextField type="password" name="password" label="password" />
                  </FormControl>
                </Stack>
                <Stack spacing="6">
                  <Button colorScheme="orange" size="lg" type="submit">
                    Log in
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Container>
      )}
    </Formik>
  );
};

export default LoginScreen;
