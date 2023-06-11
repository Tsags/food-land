import { useState, useEffect } from "react";
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
import QRCode from "qrcode";

function RegisterScreen() {
  const dispatch = useDispatch();

  const toast = useToast();
  const headingBR = useBreakpointValue({ base: "xs", md: "sm" });
  const boxBR = useBreakpointValue({ base: "transparent", md: "bg-surface" });

  const user = useSelector((state) => state.user);
  const { loading, error, userInfo } = user;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [qrCodeData, setQRCodeData] = useState("");

  const handleRegister = async (values) => {
    try {
      const randomPassword = randomstring.generate(10);
      const url = `http://192.168.68.52:3000/login?username=${values.name}&password=${randomPassword}`;
      const qrCodeInfo = await QRCode.toDataURL(url);
      setQRCodeData(qrCodeInfo);
      dispatch(register(values.name, randomPassword, qrCodeInfo));
      toast({
        title: "Success!",
        description: "Table created!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setUsername(values.name);
      setPassword(randomPassword);
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <Flex direction="row-reverse" alignItems="center" justifyContent="center" minHeight="50vh" width="100%">
      <Formik
        initialValues={{ name: "", password: "" }}
        validationSchema={Yup.object({
          name: Yup.string().label("Invalid user").required("A table is required"),
        })}
        onSubmit={handleRegister}
      >
        {(formik) => (
          <Box px={{ base: "4", md: "32" }} bg={mode("transparent", "bg-surface")}>
            <Stack spacing="6" as="form" onSubmit={formik.handleSubmit}>
              {error && (
                <Alert status="error" alignItems="center" justifyContent="center" textAlign="center">
                  <AlertIcon />
                  <AlertTitle>We are sorry!</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Stack spacing="5">
                <FormControl w="150%">
                  <TextField type="text" name="name" placeholder="" label="Table number" />
                </FormControl>
              </Stack>
              <Stack spacing="6">
                <Button colorScheme="orange" size="lg" type="submit" w="150%">
                  New Table
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}
      </Formik>
      <QRcodeGenerator username={username} password={password} qrCodeData={qrCodeData} px={{ base: "4", md: "20" }} />
    </Flex>
  );
}

export default RegisterScreen;
