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
      <Image ref={imageRef} mx="auto" src={qrCodeData} alt="QR Code" />
      <ReactToPrint
        trigger={() => <button>Print this out!</button>}
        content={() => imageRef.current}
        documentTitle="QR Code"
        bodyClass="print-body"
      />
      <style>
        {`
          @media print {
            .print-body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              position: fixed;
              top: 0;
              left: 0;
              transform: scale(1);
              transform-origin: top left;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default QRCodeGenerator;
