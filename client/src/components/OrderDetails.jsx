import { Box } from "@chakra-ui/react";

const OrderDetails = ({ userId }) => {
  const id = userId;
  return <Box bg="tomato">{id}</Box>;
};

export default OrderDetails;
