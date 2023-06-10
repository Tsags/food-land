import QRCode from "qrcode";
import { useState, useEffect, useRef } from "react";
import { Box, Image } from "@chakra-ui/react";
import ReactToPrint from "react-to-print";

const QRCodeGenerator = ({ username, password }) => {
  const [qrCodeData, setQRCodeData] = useState("");
  const imageRef = useRef();

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
      <Image ref={imageRef} mx="auto" src={qrCodeData} alt="QR Code" w="100%" h="100%" />
      <ReactToPrint
        trigger={() => <button>Print this out!</button>}
        content={() => imageRef.current}
        documentTitle="QR Code"
      />
    </Box>
  );
};

export default QRCodeGenerator;
