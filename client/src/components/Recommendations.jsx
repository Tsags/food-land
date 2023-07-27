import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import ProductCard from "./ProductCard";

const Recommendations = ({ isOpen, onClose }) => {
  const recommendations = JSON.parse(localStorage.getItem("recommendations"));

  if (recommendations && recommendations.length > 0) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="green.500">
          <ModalHeader>We think that is for you!!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Add a horizontal scrollbar for larger screens */}
            <Box display={{ base: "block", md: "flex" }} overflowX={{ md: "auto" }} whiteSpace={{ md: "nowrap" }}>
              {recommendations.map((product, index) => (
                <Box
                  key={index}
                  mb={{ base: 4, md: 0 }}
                  mr={{ base: 0, md: 4 }}
                  minWidth={{ md: "300px" }} // Optional: set a minimum width for each card
                >
                  <ProductCard product={product} />
                </Box>
              ))}
            </Box>
          </ModalBody>
          <ModalFooter>
            {/* <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  // Return null (or any other fallback) if reclen <= 0
  return null;
};

export default Recommendations;
