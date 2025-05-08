import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './Pages/Components/Header';
import Home from './Pages/HomePage';
import AnalysisPage from './Pages/AnalysisPage';
import About from './Pages/AboutPage';
import Help from './Pages/HelpPage';
import CreateTest from './Pages/CreateTest';
import PrivateRoute from './Auth/PrivateRoute'; // Import the PrivateRoute component
import SignIn from './Pages/SigninPage';
import ExamPage from './Pages/ExamPage';
import TestDetailsPage from './Pages/TestDetails';
import LandingPage from './Pages/LandingPage';

const AppContent = () => {
  const location = useLocation();

  return (
    <div className='relative flex flex-col min-h-screen'>
      {location.pathname !== '/login' && location.pathname !== "/exam" && (
        <div className="fixed top-0 right-0 left-0 z-10"><Header /></div>
      )}
      <div className={location.pathname !== '/login' && location.pathname !== "/exam" ? "mt-16" : ""}> {/* Add margin-top to push content below the header */}
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/analysis/:open_link" element={<TestDetailsPage />} />
          <Route path="/exam" element={<ExamPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/create-test" element={<CreateTest />} />
        </Routes>
      </div>
    </div>
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
