import {
  Tr,
  Td,
  Button,
  VStack,
  Textarea,
  Tooltip,
  Input,
  FormControl,
  Switch,
  FormLabel,
  Text,
  Badge,
  Box,
  Image,
  Select,
  SimpleGrid,
  IconButton,
} from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";
import { MdDriveFolderUpload } from "react-icons/md";
import { useDispatch } from "react-redux";
import { uploadProduct } from "../redux/actions/adminActions";
import axios from "axios";

const AddNewProduct = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [productIsNew, setProductIsNew] = useState(true);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [allergies, setAllergies] = useState([]);
  const [selectedAllergy, setSelectedAllergy] = useState("");
  const [features, setFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeature] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAllergySubmit = () => {
    if (selectedAllergy !== "" && !allergies.includes(selectedAllergy)) {
      setAllergies((prevAllergies) => [...prevAllergies, selectedAllergy]);
      setSelectedAllergy("");
    }
  };

  const handleAllergyDelete = (allergy) => {
    setAllergies((prevAllergies) => prevAllergies.filter((a) => a !== allergy));
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

  const createNewProduct = () => {
    if (image) {
      const formData = new FormData();

      formData.append("image", image);

      axios
        .post("/api/uploads", formData)
        .then((response) => {
          dispatch(
            uploadProduct({
              name,
              category,
              stock,
              price,
              image: image.name,
              productIsNew,
              description,
              allergies,
              features,
            })
          );
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      //NA FTIAXW TOAST OTI DEN EXEI VALEI TA APARAITITA FIELDS
      dispatch(uploadProduct({ name, category, stock, price, image, productIsNew, description, allergies, features }));
    }
  };

  return (
    <Tr>
      <Td>
        <Text fontSize="sm">Image File</Text>
        <Input type="file" name="image" onChange={handleImageUpload} />
        {imagePreview && (
          <Box>
            <h4>Image Preview:</h4>
            <Image src={imagePreview} alt="Preview" />
          </Box>
        )}
      </Td>

      <Td>
        <Text fontSize="sm">Name</Text>
        <Input size="sm" value={name} onChange={(e) => setName(e.target.value)} placeholder="cheeseBurger" />
      </Td>
      <Td>
        <Text fontSize="sm">Description</Text>
        <Textarea
          value={description}
          w="270px"
          h="120px"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          placeholder="Description"
          size="sm"
        />
      </Td>
      <Td>
        <Text fontSize="sm">Allergies</Text>
        <VStack>
          <Select value={selectedAllergy} onChange={(e) => setSelectedAllergy(e.target.value)} width={60}>
            <option value="" disabled>
              Select an option
            </option>
            <option value="Nuts">Nuts</option>
            <option value="Gluten">Gluten</option>
            <option value="Dairy">Dairy</option>
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
              <IconButton icon={<FaTimes />} size="xs" colorScheme="red" onClick={() => handleAllergyDelete(allergy)} />
            </Box>
          ))}
        </SimpleGrid>
      </Td>
      {/* <Td>
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
              <IconButton icon={<FaTimes />} size="xs" colorScheme="red" onClick={() => handleFeatureDelete(feature)} />
            </Box>
          ))}
        </SimpleGrid>
      </Td> */}
      <Td>
        <Text fontSize="sm">Category</Text>
        <Input size="sm" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="drinks" />
        <Text fontSize="sm">Price</Text>
        <Input size="sm" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
      </Td>
      {/* <Td>
        <Text fontSize="sm">Stock</Text>
        <Input size="sm" value={stock} onChange={(e) => setStock(e.target.value)} />
        <Text fontSize="sm">New badge shown on product card</Text>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="productIsNewFlag" mb="0" fontSize="sm">
            Enable
            <Badge rounded="full" px="1" mx="1" fontSize=".8em" colorScheme="green">
              New
            </Badge>
            badge?
          </FormLabel>
          <Switch id="productIsNewFlag" onChange={() => setProductIsNew(!productIsNew)} isChecked={productIsNew} />
        </FormControl>
      </Td> */}
      <Td>
        <VStack>
          <Button variant="outline" w="160px" colorScheme="orange" onClick={createNewProduct}>
            <MdDriveFolderUpload />
            <Text ml="2">Save Product</Text>
          </Button>
        </VStack>
      </Td>
    </Tr>
  );
};

export default AddNewProduct;
