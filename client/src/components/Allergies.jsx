import { Box, Select, Button, Heading, Stack, SimpleGrid, IconButton } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { addAllergy, removeAllergy } from "../redux/slices/user";
import { useDispatch } from "react-redux";
import axios from "axios";

const Allergies = () => {
  const dispatch = useDispatch();
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [selectedAllergy, setSelectedAllergy] = useState("");

  useEffect(() => {
    const allergiesFromLocalStorage = JSON.parse(localStorage.getItem("allergies")) || [];
    setSelectedAllergies(allergiesFromLocalStorage);
  }, []);

  const handleAllergySubmit = () => {
    if (selectedAllergy !== "" && !selectedAllergies.includes(selectedAllergy)) {
      setSelectedAllergies((prevAllergies) => [...prevAllergies, selectedAllergy]);
      const updatedAllergies = [...selectedAllergies, selectedAllergy];
      localStorage.setItem("allergies", JSON.stringify(updatedAllergies));
      setSelectedAllergy("");
      axios.put("/api/customers",  updatedAllergies );
    }
  };

  const handleAllergyDelete = (allergy) => {
    setSelectedAllergies((prevAllergies) => prevAllergies.filter((a) => a !== allergy));
    const updatedAllergies = selectedAllergies.filter((a) => a !== allergy);
    localStorage.setItem("allergies", JSON.stringify(updatedAllergies));
    axios.put("/api/customers", updatedAllergies );
  };

  return (
    <Box>
      <Stack>
        <Heading size="md">Do you have any allergies?</Heading>
        <Heading size="sm">Share with us</Heading>
        <Select value={selectedAllergy} onChange={(e) => setSelectedAllergy(e.target.value)}>
          <option value="" disabled>
            Select an option
          </option>
          <option value="Nuts">Nuts</option>
          <option value="Wheat">Wheat</option>
          <option value="Milk">Milk</option>
          <option value="Eggs">Eggs</option>
          <option value="Fish">Fish</option>
          <option value="Shellfish">Shellfish</option>
        </Select>
        <Button colorScheme="orange" onClick={handleAllergySubmit}>
          Submit
        </Button>
        <SimpleGrid columns={2} spacing={2}>
          {selectedAllergies.map((allergy) => (
            <Box
              key={allergy}
              bg="blue.50"
              height="30px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              px="2"
              borderRadius="md"
              color="black"
            >
              {allergy}
              <IconButton icon={<FaTimes />} size="xs" colorScheme="red" onClick={() => handleAllergyDelete(allergy)} />
            </Box>
          ))}
        </SimpleGrid>
      </Stack>
    </Box>
  );
};

export default Allergies;
