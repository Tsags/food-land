import { useState } from "react";
import {
  Flex,
  Box,
  Container,
  FormControl,
  Heading,
  Stack,
  useBreakpointValue,
  useColorModeValue as mode,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Button,
} from "@chakra-ui/react";
import TextField from "../components/TextField";
import PasswordTextField from "../components/PasswordTextField";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/actions/userActions";
import QRcodeGenerator from "../components/QRcodeGenerator";
import randomstring from "randomstring";
import axios from "axios";

function RegisterScreen() {
  const dispatch = useDispatch();
  const toast = useToast();
  const headingBR = useBreakpointValue({ base: "xs", md: "sm" });
  const boxBR = useBreakpointValue({ base: "transparent", md: "bg-surface" });

  const user = useSelector((state) => state.user);
  const { loading, error, userInfo } = user;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  return (
    <Flex>
      <QRcodeGenerator username={username} password={password} />
      <Formik
        initialValues={{ name: "", password: "" }}
        validationSchema={Yup.object({
          name: Yup.string().label("Invalid user").required("A table is required"),
        })}
        onSubmit={(values) => {
          const randomPassword = randomstring.generate();
          dispatch(register(values.name, randomPassword));
          if (!loading) {
            toast({
              title: "Success!",
              description: "Table created!",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            setUsername(values.name);
            setPassword(randomPassword);
          }
        }}
      >
        {(formik) => (
          <Container>
            <Stack justifyContent="center" textAlign="center">
              <Heading size={headingBR}>Register Table</Heading>
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
                    </FormControl>
                  </Stack>
                  <Stack spacing="6">
                    <Button colorScheme="orange" size="lg" type="submit">
                      New Table
                    </Button>
                    <Button>Create Cart</Button>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Container>
        )}
      </Formik>
    </Flex>
  );
}

export default RegisterScreen;
