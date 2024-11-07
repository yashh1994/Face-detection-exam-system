import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './Pages/Components/Header';
import Home from './Pages/HomePage';
import Analysis from './Pages/AnalysisPage';
import About from './Pages/AboutPage';
import Help from './Pages/HelpPage';
import CreateTest from './Pages/CreateTest';
import PrivateRoute from './Auth/PrivateRoute'; // Import the PrivateRoute component
import SignIn from './Pages/SigninPage';

const AppContent = () => {
  const location = useLocation();

  return (
    <>
      {/* Conditionally render the Header based on the current path */}
      {location.pathname !== '/login' && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        <Route 
          path="/analysis"  
          element={
              <Analysis />
          } 
        />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route 
          path="/create-test" 
          element={
              <CreateTest />
          } 
        />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
