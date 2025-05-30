import React, { useState, useContext, useEffect } from 'react';
import config from '../config';
import { AuthContext } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [isSignIn, setIsSignIn] = useState(false);
  const { login, authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authToken) {
      navigate('/home');
    }
  }, [authToken, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const checkForLogin = async () => {
    try {
      console.log("This is the url: ", `${config.apiUrl}/login`);
      const response = await fetch(`${config.apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await response.json();
      if (response.ok) {
        login({
          email: data.user['email'],
          id: data.user['id'],
          name: data.user['name'],
        });
        return { success: true, data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Error logging in:", error);
      return { success: false, error: "Network error. Please try again later." };
    }
  };

  const goForSignUp = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Signup Successful! Please login.");
        setIsSignIn(true);
        return { success: true, data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Error signing up:", error);
      return { success: false, error: "Network error. Please try again later." };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSignIn && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    let result;
    if (isSignIn) {
      result = await checkForLogin();
      if (result.success) {
        alert("Login Successful!");
        navigate('/home');
      } else {
        alert(result.error || "Invalid credentials.");
      }
    } else {
      result = await goForSignUp();
      if (!result.success) {
        alert(result.error || "Something went wrong.");
      }
    }
  };

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {isSignIn ? (
        <div className="flex flex-col justify-center w-1/2 px-16 bg-black rounded-lg shadow-lg">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-blue-500 mb-2">Sign in to your account</h2>
            <p className="text-gray-400 mb-8">
              Not a member? <span onClick={toggleForm} className="text-blue-400 cursor-pointer">Register here</span>
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-300">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button type="submit" className="w-full py-2 px-4 border rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                Sign in
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center w-1/2 px-16 bg-black rounded-lg shadow-lg">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-blue-500 mb-2">Create a new account</h2>
            <p className="text-gray-400 mb-8">
              Already have an account? <span onClick={toggleForm} className="text-blue-400 cursor-pointer">Sign in here</span>
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-300">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button type="submit" className="w-full py-2 px-4 border rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                Sign Up
              </button>
            </form>
          </div>
        </div>
      )}
      <QuoteDisplay />
    </div>
  );
};

export default SignIn;




const quotes = [
  "“Talk is cheap. Show me the code.” – Linus Torvalds",
  "“Programs must be written for people to read.” – Harold Abelson",
  "“First, solve the problem. Then, write the code.” – John Johnson",
  "“Code is like humor. When you have to explain it, it’s bad.” – Cory House",
  "“Simplicity is the soul of efficiency.” – Austin Freeman",
];

const QuoteDisplay = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % quotes.length);
        setFade(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-1/2 flex items-center justify-center bg-gray-800 rounded-lg shadow-lg p-12">
      <div
        className={`text-white text-2xl font-semibold text-center transition-opacity duration-500 ${
          fade ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {quotes[currentIndex]}
      </div>
    </div>
  );
};
