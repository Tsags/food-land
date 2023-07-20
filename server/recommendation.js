import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
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

export async function retrieveProductsData() {
  try {
    const products = await Product.find().lean();
    return products;
  } catch (error) {
    console.error("Error retrieving products data:", error);
    throw error;
  }
}

function createItemMatrix(customers, products) {
  const items = new Set();
  const matrix = {};

  for (const customer of customers) {
    const customerId = customer.customerId;
    const itemsTaken = [];
    customer.session.forEach((session) => {
      const sessionItems = session.items;
      itemsTaken.push(...sessionItems);
    });

    if (!matrix[customerId]) {
      matrix[customerId] = {}; // Initialize customer's array
      products.forEach((product) => {
        matrix[customerId][product.name] = 0; // Set initial value to 0 for all items
      });
    }

    itemsTaken.forEach((item) => {
      items.add(item);
      matrix[customerId][item] = 1; // Set item to 1 if customer has taken it
    });
  }

  const allItems = Array.from(items);
  Object.keys(matrix).forEach((customerId) => {
    allItems.forEach((item) => {
      if (!matrix[customerId][item]) {
        matrix[customerId][item] = 0; // Set remaining items to 0
      }
    });
  });

  return matrix;
}

function calculateSimilarity(customers, products) {
  const matrix = createItemMatrix(customers, products);

  const similarityMatrix = {};

  Object.keys(matrix).forEach((customerId1) => {
    similarityMatrix[customerId1] = {};

    Object.keys(matrix).forEach((customerId2) => {
      const vector1 = Object.values(matrix[customerId1]);
      const vector2 = Object.values(matrix[customerId2]);

      const similarity = cosineSimilarity(vector1, vector2);

      similarityMatrix[customerId1][customerId2] = similarity;

      function sortByValueDescending(obj) {
        return Object.entries(obj)
          .sort(([, a], [, b]) => b - a)
          .reduce((sortedObj, [key, value]) => {
            sortedObj[key] = value;
            return sortedObj;
          }, {});
      }
      Object.keys(similarityMatrix).forEach((customerId1) => {
        similarityMatrix[customerId1] = sortByValueDescending(similarityMatrix[customerId1]);
      });
    });
  });

  return similarityMatrix;
}

function findSimilarCustomers(targetCustomerId, similarityMatrix, threshold = 0.5) {
  const similarCustomers = [];

  Object.entries(similarityMatrix[targetCustomerId]).forEach(([otherCustomerId, similarity]) => {
    if (otherCustomerId !== targetCustomerId && similarity >= threshold) {
      similarCustomers.push(otherCustomerId);
    }
  });

  return similarCustomers;
}

// Generate item recommendations for a target customer
function generateRecommendations(targetCustomer, similarCustomers, customers, products) {
  const recommendations = {};
  const itemsTaken = [];
  const targetCustomerAllergies = targetCustomer.allergies;

  targetCustomer.session.forEach((session) => {
    itemsTaken.push(...session.items);
  });
  similarCustomers.forEach((customerId) => {
    const similarCustomer = customers.find((c) => c.customerId === customerId);

    similarCustomer.session.forEach((session) => {
      session.items.forEach((item) => {
        if (!itemsTaken.includes(item)) {
          if (!recommendations[item]) {
            recommendations[item] = 0;
          }
          recommendations[item]++;
        }
      });
    });
  });

  // Sort recommendations based on the number of similar customers who have taken the item
  const sortedRecommendations = Object.entries(recommendations).sort((a, b) => b[1] - a[1]);
  // return sortedRecommendations.map((entry) => entry[0]);

  const recommendationsCollab = sortedRecommendations.filter(([productName]) => {
    // Exclude recommendations with zero similarity score

    // Exclude recommendations that contain any of the customer's allergies
    const productAllergies = products.find((product) => product.name === productName).allergies;

    if (productAllergies.some((allergy) => targetCustomerAllergies.includes(allergy))) {
      return false;
    }

    // Exclude recommendations that are in itemsTaken
    // if (itemsTaken.includes(productName)) {
    //   return false;
    // }

    return true;
  });
  // console.log(recommendationsCollab);
  return recommendationsCollab;
}

async function collaborativeFiltering(targetCustomerId) {
  try {
    const customers = await retrieveCustomersData();
    const products = await retrieveProductsData();
    const similarityMatrix = calculateSimilarity(customers, products);
    // const targetCustomerId = "f953cff8edb5dc9ec71b141713f3a6e9e3655ec1e469f0cd111fd1e805974ad2";
    const targetCustomer = customers.find((c) => c.customerId === targetCustomerId);

    const similarCustomers = findSimilarCustomers(targetCustomerId, similarityMatrix);
    const collaborativeRecommendations = generateRecommendations(
      targetCustomer,
      similarCustomers,
      customers,
      products
    ).map((item) => item[0]);

    return collaborativeRecommendations;
  } catch (error) {
    console.error("Error running content-based filtering:", error);
  }
}

// <----------------------------------------------------------------------------------------------------------->
// <----------------------------------------------------------------------------------------------------------->

async function similarityCalculation(customers, products) {
  const customerPreferences = [];
  for (const customer of customers) {
    const customerFeatures = [];
    const itemsTaken = [];
    customer.session.forEach((session) => {
      const sessionItems = session.items;
      itemsTaken.push(...sessionItems);
    });
    for (const itemTaken of itemsTaken) {
      const product = products.find((p) => p.name === itemTaken);

      const features = product.features;
      for (const feature of features) {
        if (!customerFeatures.includes(feature)) {
          customerFeatures.push(feature);
        }
      }
    }
    const customerPreference = {
      customerId: customer.customerId,
      preferences: {},
    };
    for (const product of products) {
      const productFeatures = product.features;
      const commonFeatures = customerFeatures.filter((feature) => productFeatures.includes(feature));
      const totalFeatures = [...new Set([...customerFeatures, ...productFeatures])];

      // Jaccard similarity coefficient
      const similarity = commonFeatures.length / totalFeatures.length;

      customerPreference.preferences[product.name] = similarity;
    }
    customerPreferences.push(customerPreference);
  }

  return customerPreferences;
}

function getRecommendationsForCustomer(customerPreferences, targetCustomerId, products, customers) {
  // Find the target customer's preferences
  const targetCustomerPreferences = customerPreferences.find((customer) => customer.customerId === targetCustomerId);
  const targetCustomer = customers.find((c) => c.customerId === targetCustomerId);

  const targetCustomerAllergies = targetCustomer.allergies;
  const itemsTaken = [];
  targetCustomer.session.forEach((session) => {
    const sessionItems = session.items;
    itemsTaken.push(...sessionItems);
  });

  if (!targetCustomerPreferences) {
    console.log("Target customer not found.");
    return [];
  }

  // Sort the preferences by similarity in descending order
  const sortedPreferences = Object.entries(targetCustomerPreferences.preferences).sort((a, b) => b[1] - a[1]);
  // Get the top N recommendations
  const recommendations = sortedPreferences.filter(([productName, similarity]) => {
    // Exclude recommendations with zero similarity score
    if (similarity === 0) {
      return false;
    }

    // Exclude recommendations that contain any of the customer's allergies
    const productAllergies = products.find((product) => product.name === productName).allergies;
    if (productAllergies.some((allergy) => targetCustomerAllergies.includes(allergy))) {
      return false;
    }

    // Exclude recommendations that are in itemsTaken
    if (itemsTaken.includes(productName)) {
      return false;
    }

    return true;
  });

  return recommendations;
}

async function contentBasedFiltering(targetCustomerId) {
  try {
    const customers = await retrieveCustomersData();
    const products = await retrieveProductsData();
    const customerPreferences = await similarityCalculation(customers, products);
    // const targetCustomerId = "f953cff8edb5dc9ec71b141713f3a6e9e3655ec1e469f0cd111fd1e805974ad2";
    const contentBasedRecommendations = getRecommendationsForCustomer(
      customerPreferences,
      targetCustomerId,
      products,
      customers
    ).map((item) => item[0]);

    return contentBasedRecommendations;
  } catch (error) {
    console.error("Error running content-based filtering:", error);
  }
}

export async function hybridFiltering(targetCustomerId) {
  try {
    const results1 = await collaborativeFiltering(targetCustomerId);
    const results2 = await contentBasedFiltering(targetCustomerId);

    const intersection = results1.filter((value) => results2.includes(value));

    // console.log(intersection);

    const union = Array.from(new Set(results1.concat(results2)));

    return intersection;
  } catch (error) {
    console.error("Error running Hybrid filtering:", error);
  }
}

// async function findProductFeatures(products) {
//   const customerPreferences = {};
//   const productFeatures = [];
//   for (const product of products) {
//     for (const feature of product.features) {
//       if (!productFeatures.includes(feature)) {
//         productFeatures.push(feature);
//       }
//     }
//   }
//   return productFeatures;
// }
