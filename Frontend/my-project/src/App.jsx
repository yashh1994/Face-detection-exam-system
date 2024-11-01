import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Pages/Components/Header';
import Home from './Pages/HomePage';
import Analysis from './Pages/AnalysisPage';
import About from './Pages/AboutPage';
import Help from './Pages/HelpPage';
import CreateTest from './Pages/CreateTest';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/create-test" element={<CreateTest />} />
      </Routes>
    </Router>
  );
};

export default App;
