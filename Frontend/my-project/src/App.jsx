import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './Pages/Components/Header';
import Home from './Pages/HomePage';
import AnalysisPage from './Pages/AnalysisPage';
import About from './Pages/AboutPage';
import Help from './Pages/HelpPage';
import CreateTest from './Pages/CreateTest';
import PrivateRoute from './Auth/PrivateRoute';
import SignIn from './Pages/SigninPage';
import ExamPage from './Pages/ExamPage';
import TestDetailsPage from './Pages/TestDetails';
import LandingPage from './Pages/LandingPage';

// Simple 404 Page component
const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-4xl font-bold mb-4">404</h1>
    <p className="text-lg">Page Not Found</p>
  </div>
);

const AppContent = () => {
  const location = useLocation();

  return (
    <div className='relative flex flex-col min-h-screen'>
      {location.pathname !== '/login' && location.pathname !== '/' && location.pathname !== "/exam" && (
        <div className="fixed top-0 right-0 left-0 z-10"><Header /></div>
      )}
      <div className={location.pathname !== '/login' && location.pathname !== "/exam" ? "mt-16" : ""}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/analysis/:open_link" element={<TestDetailsPage />} />
          <Route path="/exam" element={<ExamPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/create-test" element={<CreateTest />} />
          <Route path="*" element={<NotFoundPage />} /> {/* 404 route */}
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
