
import { useState, useEffect, useRef } from "react";
import { Box, Image, Text, Stack, Button } from "@chakra-ui/react";
import ReactToPrint from "react-to-print";

const QRCodeGenerator = ({ username, password, qrCodeData }) => {
  
  const imageRef = useRef();

  return (
    <Box>
      <Stack textAlign="center" justifyContent="center">
        <Stack ref={imageRef} alignItems="center" justifyContent="center">
          <Image src={qrCodeData} alt="QR Code" w="200px" h="200px" />
          {username && (
            <Text>
              Table: <strong>{username}</strong>
            </Text>
          )}
        </Stack>
        <ReactToPrint
          trigger={() => <Button>Print this out!</Button>}
          content={() => imageRef.current}
          documentTitle="QR Code"
        />
      </Stack>
    </Box>
  );
};

export default QRCodeGenerator;
