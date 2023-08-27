import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductsScreen from "./screens/ProductsScreen";
import CartScreen from "./screens/CartScreen";
import ProductScreen from "./screens/ProductScreen";
import Footer from "./components/Footer";
import LandingScreen from "./screens/LandingScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import AdminScreen from "./screens/AdminScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import Socket from "./components/Socket";
import YourOrdersScreen from "./screens/YourOrdersScreen";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ServicesScreen from "./screens/ServicesScreen";
import ReviewsScreen from "./screens/ReviewsScreen";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Navbar />
        <Socket />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <LandingScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reviews"
              element={
                <ProtectedRoute>
                  <ReviewsScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedAdminRoute>
                  <RegisterScreen />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <ProductsScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProtectedRoute>
                  <ProductScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/your-orders"
              element={
                <ProtectedRoute>
                  <YourOrdersScreen />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginScreen />} />
            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <ServicesScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminScreen />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutScreen />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </Router>
    </ChakraProvider>
  );
}

export default App;
