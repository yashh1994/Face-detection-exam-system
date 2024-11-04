import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Pages/Components/Header';
import Home from './Pages/HomePage';
import Analysis from './Pages/AnalysisPage';
import About from './Pages/AboutPage';
import Help from './Pages/HelpPage';
import CreateTest from './Pages/CreateTest';
import PrivateRoute from './Auth/PrivateRoute'; // Import the PrivateRoute component

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/analysis" 
          element={
            <PrivateRoute>
              <Analysis />
            </PrivateRoute>
          } 
        />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route 
          path="/create-test" 
          element={
            <PrivateRoute>
              <CreateTest />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
