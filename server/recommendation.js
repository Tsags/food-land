import mongoose from "mongoose";
import CustomerModel from "./models/Customer.js";
import ProductModel from "./models/Product.js";
import cosineSimilarity from "compute-cosine-similarity";

const Customer = mongoose.model("Customer", CustomerModel.CustomerSchema);
const Product = mongoose.model("Product", ProductModel.ProductSchema);

async function retrieveCustomersData() {
  try {
    const customers = await Customer.find().lean();
    return customers;
  } catch (error) {
    console.error("Error retrieving customers data:", error);
    throw error;
  }
}

function createItemMatrix(customers) {
  const items = new Set();
  const matrix = {};

  for (const customer of customers) {
    const customerId = customer.customerId;
    const itemsTaken = [];
    customer.session.forEach((session) => {
      const sessionItems = session.items;
      itemsTaken.push(...sessionItems);
    });

    itemsTaken.forEach((item) => {
      items.add(item);
      if (!matrix[customerId]) {
        matrix[customerId] = {};
      }
      matrix[customerId][item] = 1;
    });
  }

  const allItems = Array.from(items);
  Object.keys(matrix).forEach((customerId) => {
    allItems.forEach((item) => {
      if (!matrix[customerId][item]) {
        matrix[customerId][item] = 0;
      }
    });
  });

  return matrix;
}

function calculateSimilarity(customers) {
  const matrix = createItemMatrix(customers);

  const similarityMatrix = {};

  Object.keys(matrix).forEach((customerId1) => {
    similarityMatrix[customerId1] = {};

    Object.keys(matrix).forEach((customerId2) => {
      const vector1 = Object.values(matrix[customerId1]);
      const vector2 = Object.values(matrix[customerId2]);

      const similarity = cosineSimilarity(vector1, vector2);
      similarityMatrix[customerId1][customerId2] = similarity;
    });
  });

  return similarityMatrix;
}

function findSimilarCustomers(similarityMatrix, threshold = 0.5) {
  const similarCustomers = [];
  const customerId = "f953cff8edb5dc9ec71b141713f3a6e9e3655ec1e469f0cd111fd1e805974ad2";
  Object.entries(similarityMatrix[customerId]).forEach(([otherCustomerId, similarity]) => {
    if (otherCustomerId !== customerId && similarity >= threshold) {
      similarCustomers.push(otherCustomerId);
    }
  });

  return similarCustomers;
}

// <----------------------------------------------------------------------------------------------------------->
// <----------------------------------------------------------------------------------------------------------->

// Generate item recommendations for a target customer
// function generateRecommendations(targetCustomer, similarCustomers, customers) {
//   const recommendations = {};

//   similarCustomers.forEach((customerId) => {
//     const customer = customers.find((c) => c.customerId === customerId);

//     customer.itemsTaken.forEach((item) => {
//       if (!targetCustomer.itemsTaken.includes(item)) {
//         if (!recommendations[item]) {
//           recommendations[item] = 0;
//         }
//         recommendations[item]++;
//       }
//     });
//   });

//   // Sort recommendations based on the number of similar customers who have taken the item
//   const sortedRecommendations = Object.entries(recommendations).sort((a, b) => b[1] - a[1]);

//   return sortedRecommendations.map((entry) => entry[0]);
// }

// <----------------------------------------------------------------------------------------------------------->
// <----------------------------------------------------------------------------------------------------------->

export async function collaborativeFiltering() {
  try {
    const customers = await retrieveCustomersData();
    const similarityMatrix = calculateSimilarity(customers);
    const similarCustomers = findSimilarCustomers(similarityMatrix);
  } catch (error) {
    console.error("Error running content-based filtering:", error);
  }
}

async function retrieveProductsData() {
  try {
    const products = await Product.find().lean();

    return products;
  } catch (error) {
    console.error("Error retrieving products data:", error);
    throw error;
  }
}

async function findProductFeatures(products) {
  const customerPreferences = {};
  const productFeatures = [];
  for (const product of products) {
    for (const feature of product.features) {
      if (!productFeatures.includes(feature)) {
        productFeatures.push(feature);
      }
    }
  }
  return productFeatures;
}

async function findCustomerFeatures(customers) {
  for (const customer of customers) {
    const itemsTaken = [];
    const customerFeatures = [];
    customer.session.forEach((session) => {
      const sessionItems = session.items;
      itemsTaken.push(...sessionItems);
    });
    for (const itemTaken of itemsTaken) {
      const product = await Product.findOne({ name: itemTaken });
      const features = product.features;
      for (const feature of features) {
        if (!customerFeatures.includes(feature)) {
          customerFeatures.push(feature);
        }
      }
    }

    return customerFeatures;
  }
}
// for (const customer of customers) {
//   customerPreferences[customer.id] = {};

//   for (const product of products) {
//     const similarity = calculateFeatureSimilarity(customer.features, product.features);
//     customerPreferences[customer.id][product.id] = similarity;
//   }
// }

// return customerPreferences;

// Helper function to calculate similarity between two sets of features
function calculateFeatureSimilarity(customerFeatures, productFeatures) {
  // Jaccard similarity coefficient
  const similarity = customerFeatures.length / productFeatures.length;

  return similarity;
}

// Helper function to get common features between two sets
function getCommonFeatures(customerFeatures, productFeatures) {
  return customerFeatures.filter((feature) => productFeatures.includes(feature));
}

export async function contentBasedFiltering() {
  try {
    const customers = await retrieveCustomersData();
    const products = await retrieveProductsData();
    const productFeatures = await findProductFeatures(products);
    const customerFeatures = await findCustomerFeatures(customers);
    calculateFeatureSimilarity(customerFeatures, productFeatures);
  } catch (error) {
    console.error("Error running content-based filtering:", error);
  }
}

// // Example usage
// const similarityMatrix = calculateSimilarity(customers);
// const targetCustomer = customers.find((customer) => customer.customerId === 'customer1');
// const similarCustomers = findSimilarCustomers(targetCustomer.customerId, similarityMatrix);
// const recommendedItems = generateRecommendations(targetCustomer, similarCustomers, customers);

// console.log('Recommended items for', targetCustomer.customerId, ':', recommendedItems);

// const currentUser = await Customer.findOne({ customerId });

// if (!currentUser) {
//   console.log('Customer not found');
//   return [];
// }

//   for (const customer of customers) {
//     const customerId = customer.customerId;
//     const otherCustomers = await Customer.find({
//       customerId: { $ne: customerId },
//     });
//     const customerWeights = {};
//     const itemWeights = {};

//     const allCustomerItems = [];
//     customer.session.forEach((session) => {
//       const sessionItems = session.items;
//       allCustomerItems.push(...sessionItems);
//     });

//     const sessionLength = allCustomerItems.length;

//     const weightIncrement = 1 / sessionLength; // Divide weight equally among items in all sessions

//     allCustomerItems.forEach((item) => {
//       if (!itemWeights[item]) {
//         itemWeights[item] = 0;
//       }
//       itemWeights[item] += weightIncrement;
//     });

//     customerWeights[customerId] = itemWeights;

//     for (const otherCustomer of otherCustomers) {
//       const OtherCustomerWeights = {};
//       const allOtherCustomerItems = [];
//       const OtherItemWeights = {};
//       otherCustomer.session.forEach((session) => {
//         const sessionItems = session.items;
//         allOtherCustomerItems.push(...sessionItems);
//       });

//       const otherSessionLength = allOtherCustomerItems.length;

//       const OtherWeightIncrement = 1 / otherSessionLength; // Divide weight equally among items in all sessions

//       allOtherCustomerItems.forEach((item) => {
//         if (!OtherItemWeights[item]) {
//           OtherItemWeights[item] = 0;
//         }
//         OtherItemWeights[item] += OtherWeightIncrement;
//       });

//       OtherCustomerWeights[otherCustomer.customerId] = OtherItemWeights;
//       console.log(OtherCustomerWeights[otherCustomer.customerId]);
//       const longerArray =
//         allCustomerItems.length >= allOtherCustomerItems.length ? allCustomerItems : allOtherCustomerItems;
//       const shorterArray =
//         allCustomerItems.length < allOtherCustomerItems.length ? allCustomerItems : allOtherCustomerItems;

//       const paddingLength = longerArray.length - shorterArray.length;
//       const paddedShorterArray = [...shorterArray, ...Array(paddingLength).fill(0)];

//       const similarity = cosineSimilarity(longerArray, paddedShorterArray);
//     }
//   }

//   const recommendations = [];

//   return recommendations;
// }

// export function calculateWeights(customers) {
//   const customerWeights = {};

//   customers.forEach((customer) => {
//     const customerId = customer.customerId;
//     const itemWeights = {};

//     const allSessionsItems = [];
//     customer.session.forEach((session) => {
//       const sessionItems = session.items;
//       allSessionsItems.push(...sessionItems);
//     });

//     const sessionLength = allSessionsItems.length;

//     const weightIncrement = 1 / sessionLength; // Divide weight equally among items in all sessions

//     allSessionsItems.forEach((item) => {
//       if (!itemWeights[item]) {
//         itemWeights[item] = 0;
//       }
//       itemWeights[item] += weightIncrement;
//     });

//     customerWeights[customerId] = itemWeights;
//   });

//   return customerWeights;
// }

// export async function retrieveProductData() {
//   try {
//     const products = await Product.find().lean();
//     return products;
//   } catch (error) {
//     console.error("Error retrieving product data:", error);
//     throw error;
//   }
// }

// export function extractProductFeatures(products) {
//   const productFeatures = [];

//   products.forEach((product) => {
//     const features = {
//       productId: product._id, // Replace with your actual product ID field
//       productName: product.name,
//       productCategory: product.category,
//       productPrice: product.price,
//       productAllergens: product.allergies,
//     };

//     // Check if the product already exists in productFeatures
//     const existingProduct = productFeatures.find((feature) => feature.productId === features.productId);

//     if (!existingProduct) {
//       productFeatures.push(features);
//     }
//   });

//   return productFeatures;
// }

// export function aggregateAndExtractFeatures(customers, customerWeights, productFeatures) {
//   const customerProfiles = {};

//   customers.forEach((customer) => {
//     const customerId = customer.customerId;
//     const profile = {};

//     customer.session.forEach((session) => {
//       const sessionItems = session.items;

//       sessionItems.forEach((item) => {
//         const productFeature = productFeatures.find((feature) => feature.productName === item);

//         if (productFeature) {
//           const weight = customerWeights[customerId][item]; // Access the weight for the specific customerId and item

//           profile[item] = {
//             weight: weight,
//             features: productFeature,
//           };
//         } else {
//           // console.log(`Product feature not found for item: ${item}`);
//         }
//       });
//     });

//     customerProfiles[customerId] = profile;
//   });

//   return customerProfiles;
// }

// function calculateWeightedSimilarity(profile1, profile2) {
//   let dotProduct = 0;
//   let magnitude1 = 0;
//   let magnitude2 = 0;

//   // Iterate over the features in profile1
//   Object.keys(profile1).forEach((item) => {
//     if (profile2[item]) {
//       const weight1 = profile1[item].weight;

//       const weight2 = profile2[item].weight;

//       // Calculate the weighted dot product
//       dotProduct += weight1 * weight2;

//       // Calculate the squared magnitudes for each profile
//       magnitude1 += weight1 * weight1;
//       magnitude2 += weight2 * weight2;
//     }
//   });

//   // Calculate the magnitudes
//   magnitude1 = Math.sqrt(magnitude1);
//   magnitude2 = Math.sqrt(magnitude2);

//   // Avoid division by zero
//   if (magnitude1 === 0 || magnitude2 === 0) {
//     return 0;
//   }

//   // Calculate the weighted similarity score
//   const similarityScore = dotProduct / (magnitude1 * magnitude2);
//   // console.log(similarityScore);
//   return similarityScore;
// }

// export function calculateSimilarity(customerProfiles) {
//   const similarityMatrix = {};

//   Object.keys(customerProfiles).forEach((customerId1) => {
//     const profile1 = customerProfiles[customerId1];
//     similarityMatrix[customerId1] = {};

//     Object.keys(customerProfiles).forEach((customerId2) => {
//       if (customerId1 !== customerId2) {
//         const profile2 = customerProfiles[customerId2];
//         const similarityScore = calculateWeightedSimilarity(profile1, profile2);
//         similarityMatrix[customerId1][customerId2] = similarityScore;
//       }
//     });
//   });

//   return similarityMatrix;
// }

// export function generateRecommendations(customerId, customerProfiles, similarityMatrix) {
//   const customerProfile = customerProfiles[customerId];

//   if (!customerProfile) {
//     console.log(`Customer with ID ${customerId} not found.`);
//     return [];
//   }

//   const recommendations = {};

//   Object.keys(similarityMatrix[customerId]).forEach((otherCustomerId) => {
//     const similarityScore = similarityMatrix[customerId][otherCustomerId];

//     if (similarityScore > 0) {
//       const otherCustomerProfile = customerProfiles[otherCustomerId];
//       const otherCustomerItems = Object.keys(otherCustomerProfile);

//       Object.keys(otherCustomerProfile).forEach((item) => {
//         // Exclude items that the customer has already ordered
//         if (!customerProfile[item]) {
//           if (!recommendations[item]) {
//             recommendations[item] = 0;
//           }
//           recommendations[item] += similarityScore * otherCustomerProfile[item].weight;
//         }
//       });
//     }
//   });

//   // Sort recommendations based on the weighted scores
//   const sortedRecommendations = Object.entries(recommendations).sort((a, b) => b[1] - a[1]);

//   return sortedRecommendations.map((recommendation) => recommendation[0]);
// }

// ... previous code for calculating similarity and finding similar customers ...
