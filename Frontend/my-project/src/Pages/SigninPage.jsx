import React, { useState } from 'react';
import config from '../../../config';


const SignIn = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [isSignIn, setIsSignIn] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    };

  const checkForLogin = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await response.json();
      if (response.ok) {
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
      } else {
        alert(result.error || "Invalid credentials.");
      }
    } else {
      result = await goForSignUp();
      if (result.success) {
        alert("Signup Successful!");
      } else {
        alert(result.error || "Something went wrong.");
      }
    }
    };

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
    };

  return (
    <div className="flex h-screen">
      {isSignIn ? (
        <div className="flex flex-col justify-center w-1/2 px-16 bg-white">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in to your account</h2>
            <p className="text-gray-500 mb-8">
              Not a member? <span onClick={toggleForm} className="text-indigo-600 cursor-pointer">Register here</span>
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <button type="submit" className="w-full py-2 px-4 border rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                Sign in
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center w-1/2 px-16 bg-white">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create a new account</h2>
            <p className="text-gray-500 mb-8">
              Already have an account? <span onClick={toggleForm} className="text-indigo-600 cursor-pointer">Sign in here</span>
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <button type="submit" className="w-full py-2 px-4 border rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                Register
              </button>
            </form>
          </div>
        </div>
      )}
      <div
        className="w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://imgs.search.brave.com/LBLpEmiWcQsdE2yvobTwgJXnA21qAhb5nSZRrb3HIWQ/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEwLzAxLzc5LzQx/LzM2MF9GXzEwMDE3/OTQxMTFfd2k2ZDR4/cGVzcGM5TlNSRmFH/Vm1ScEZMQUxXRkV5/aUUuanBn')",
        }}
      ></div>
    </div>
  );
};

export default SignIn;




