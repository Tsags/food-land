import { ButtonGroup, Container, IconButton, Stack, Text, Box, Icon, useColorModeValue } from "@chakra-ui/react";
import { SlSocialGoogle, SlSocialInstagram, SlSocialFacebook } from "react-icons/sl";
import { MdFastfood } from "react-icons/md";



export const Footer = () => {
  return (
    <Box w="100%" bg={useColorModeValue("gray.100", "gray.900")} mt={{ base: "", md: "265" }}>
      <Container
        maxW="7xl"
        as="footer"
        role="contentinfo"
        py={{
          base: "10",
          md: "10",
        }}
      >
        <Stack
          spacing={{
            base: "4",
            md: "5",
          }}
        >
          <Stack justify="space-between" direction="row" align="center">
            <Stack>
              <Icon as={MdFastfood} h={10} w={10} color="orange.400" />
              <Text fontSize="2xl" fontWeight="extrabold">
                FoodLand
              </Text>
              <Text>For food lovers.</Text>
            </Stack>
            <Stack></Stack>
            <Stack align="center">
              <ButtonGroup variant="ghost" color={useColorModeValue("orange.500", "orange.600")}>
                <IconButton as="a" href="#" aria-label="LinkedIn" icon={<SlSocialFacebook fontSize="1.25rem" />} />
                <IconButton as="a" href="#" aria-label="GitHub" icon={<SlSocialInstagram fontSize="1.25rem" />} />
                <IconButton as="a" href="#" aria-label="Twitter" icon={<SlSocialGoogle fontSize="1.25rem" />} />
              </ButtonGroup>
              <Text>Follow us.</Text>
            </Stack>
          </Stack>
          <Text fontSize="sm" color="subtle">
            &copy; {new Date().getFullYear()} Food Land, Inc. All rights reserved.
          </Text>
          <Stack spacing="0" color={useColorModeValue("gray.100", "white")}>
            <Text fontSize="0.4rem">Everything is frozen.</Text>
            <Text fontSize="0.4rem">Eat with your own responsibility.</Text>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
export default Footer;
