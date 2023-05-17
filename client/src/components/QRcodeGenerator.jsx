import QRCode from "qrcode";
import { useState, useEffect } from "react";
import { Box, Image } from "@chakra-ui/react";

const QRCodeGenerator = ({ username, password }) => {
  const [qrCodeData, setQRCodeData] = useState("");

  useEffect(() => {
    const url = `192.168.68.52:3000/login?username=${username}&password=${password}`;
    QRCode.toDataURL(url, (err, dataUrl) => {
      if (err) {
        console.error(err);
        return;
      }
      setQRCodeData(dataUrl);
    });
  }, [username, password]);

  return (
    <Box mx="auto" w="200px" h="200px">
      <Image mx="auto" src={qrCodeData} alt="QR Code" />
    </Box>
  );
};

export default QRCodeGenerator;
