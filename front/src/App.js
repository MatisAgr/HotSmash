// filepath: /c:/Users/matis/Desktop/Ceci est un dossier SSD/IPSSI/BigData-IA/S5_REACT_NATIVE/TP_Groupe/front/src/App.js
import React, { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar/Navbar";
import FooterComponent from "./components/Footer/Footer";

import Home from "./pages/Home/Home";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import CreateSmashPage from "./pages/CreateSmashPage/CreateSmashPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { useSelector } from "react-redux";

import CreatePostModal from './components/CreatePostModal/CreatePostModal';

function App() {
  const isAuthenticated = useSelector((state) => !!state.auth.token);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="">
      <header className="fixed top-0 w-full z-10">
        <Navbar />
      </header>

      {/* Content routes */}
      <div className="mx-auto pt-16 bg-black min-h-screen w-full">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/createSmash" element={<CreateSmashPage />} />

          <Route 
            path="/" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Home />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {/* <FooterComponent /> */}

      <CreatePostModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default App;