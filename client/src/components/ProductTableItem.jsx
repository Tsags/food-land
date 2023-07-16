import { useState, useRef } from "react";
import {
  Tr,
  Td,
  Button,
  Image,
  VStack,
  Textarea,
  Tooltip,
  Input,
  useToast,
  Flex,
  FormControl,
  FormLabel,
  Switch,
  Badge,
  useDisclosure,
  Select,
  SimpleGrid,
  Box,
  IconButton,
} from "@chakra-ui/react";
import { MdOutlineDataSaverOn } from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import { DeleteIcon } from "@chakra-ui/icons";
import { useDispatch } from "react-redux";
import { updateProduct, deleteProduct } from "../redux/actions/adminActions";
import ConfirmRemovalAlert from "./ConfirmRemovalAlert";

const ProductTableItem = ({ product }) => {
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [stock, setStock] = useState(product.stock);
  const [price, setPrice] = useState(product.price);
  const [productIsNew, setProductIsNew] = useState(product.productIsNew);
  const [description, setDescription] = useState(product.description);
  const [image, setImage] = useState(product.image.substring(8));
  const [allergies, setAllergies] = useState(product.allergies);
  const [features, setFeatures] = useState(product.features);
  const [selectedFeatures, setSelectedFeature] = useState("");
  const [selectedAllergy, setSelectedAllergy] = useState("");
  const dispatch = useDispatch();
console.log(selectedFeatures)
  const onSaveProduct = () => {
    dispatch(
      updateProduct(name, category, stock, price, product._id, productIsNew, description, image, allergies, features)
    );
  };
  const handleAllergyDelete = (allergy) => {
    setAllergies((prevAllergies) => prevAllergies.filter((a) => a !== allergy));
  };
  const handleAllergySubmit = () => {
    if (selectedAllergy !== "" && !allergies.includes(selectedAllergy)) {
      setAllergies((prevAllergies) => [...prevAllergies, selectedAllergy]);
      setSelectedAllergy("");
    }
  };

  const handleFeatureDelete = (feature) => {
    setFeatures((prevFeatures) => prevFeatures.filter((a) => a !== feature));
  };
  const handleFeatureSubmit = () => {
    if (selectedFeatures !== "" && !features.includes(selectedFeatures)) {
      setFeatures((prevFeatures) => [...prevFeatures, selectedFeatures]);
      setSelectedFeature("");
    }
  };

  const openDeleteConfirmBox = () => {
    onOpen();
  };

  return (
    <>
      <Tr>
        <Td>
          <Input size="sm" value={image} onChange={(e) => setImage(e.target.value)} />
          <Tooltip label={product.image} fontSize="sm">
            <Image src={product.image} boxSize="100px" fit="contain" />
          </Tooltip>
        </Td>
        <Td>
          <Flex direction="column" gap="2">
            <Input size="sm" value={name} onChange={(e) => setName(e.target.value)} />
          </Flex>
        </Td>
        <Td>
          <Textarea
            w="270px"
            h="120px"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="sm"
          />
        </Td>
        <Td>
          <VStack>
            <Select value={selectedAllergy} onChange={(e) => setSelectedAllergy(e.target.value)} width={60}>
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
          </VStack>
          <SimpleGrid columns={4} spacing={1}>
            {allergies.map((allergy) => (
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
                <IconButton
                  icon={<FaTimes />}
                  size="xs"
                  colorScheme="red"
                  onClick={() => handleAllergyDelete(allergy)}
                />
              </Box>
            ))}
          </SimpleGrid>
        </Td>
        <Td>
          <VStack>
            <Select value={selectedFeatures} onChange={(e) => setSelectedFeature(e.target.value)} width={60}>
              <option value="" disabled>
                Select an option
              </option>
              <option value="Meat">Meat</option>
              <option value="Fish">Fish</option>
              <option value="Meatless">Meatless</option>
              <option value="Vegetable">Vegetable</option>
              <option value="Fruit">Fruit</option>
              <option value="Cheese">Cheese</option>
              <option value="Spicy">Spicy</option>
              <option value="Sweet">Sweet</option>
            </Select>
            <Button colorScheme="orange" onClick={handleFeatureSubmit}>
              Submit
            </Button>
          </VStack>
          <SimpleGrid columns={4} spacing={1}>
            {features.map((feature) => (
              <Box
                key={feature}
                bg="blue.50"
                height="30px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                px="2"
                borderRadius="md"
                color="black"
              >
                {feature}
                <IconButton
                  icon={<FaTimes />}
                  size="xs"
                  colorScheme="red"
                  onClick={() => handleFeatureDelete(feature)}
                />
              </Box>
            ))}
          </SimpleGrid>
        </Td>
        <Td>
          <Flex direction="column" gap="2">
            <Input size="sm" value={category} onChange={(e) => setCategory(e.target.value)} />
            <Input size="sm" value={price} onChange={(e) => setPrice(e.target.value)} />
          </Flex>
        </Td>
        <Td>
          <Flex direction="column" gap="2">
            <Input size="sm" value={stock} onChange={(e) => setStock(e.target.value)} />
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="productIsNewFlag" mb="0" fontSize="sm">
                Enable
                <Badge rounded="full" px="1" mx="1" fontSize="0.8em" colorScheme="green">
                  New
                </Badge>
                badge?
              </FormLabel>
              <Switch id="productIsNewFlag" onChange={() => setProductIsNew(!productIsNew)} isChecked={productIsNew} />
            </FormControl>
          </Flex>
        </Td>
        <Td>
          <VStack>
            <Button colorScheme="red" w="160px" variant="outline" onClick={openDeleteConfirmBox}>
              <DeleteIcon mr="5px" />
              Remove Product
            </Button>
            <Button colorScheme="orange" w="160px" variant="outline" onClick={onSaveProduct}>
              <MdOutlineDataSaverOn style={{ marginRight: "5px" }} />
              Save Changes
            </Button>
          </VStack>
        </Td>
      </Tr>
      <ConfirmRemovalAlert
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        cancelRef={cancelRef}
        itemToDelete={product}
        deleteAction={deleteProduct}
      />
    </>
  );
};

export default ProductTableItem;
