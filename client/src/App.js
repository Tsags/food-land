import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import { useEffect } from "react";
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

// var socket;

function App() {
  // useEffect(() => {
  //   socket = io("/");
  //   socket.emit("setup", "skata");

  // }, []);

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
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminScreen />
                </ProtectedAdminRoute>
              }
            />
            <Route path="/checkout" element={<CheckoutScreen />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </ChakraProvider>
  );
}

export default App;
