import React, { useState } from "react";
import { motion } from "framer-motion";

const Help = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issueType: "Bug Report",
    description: "",
    steps: "",
    screenshot: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, screenshot: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process form submission
    console.log("Form submitted:", formData);
    alert("Your issue has been submitted successfully. We'll get back to you soon!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-blue-500">Help Center</h1>
        <p className="text-lg text-gray-300 mt-4">
          Facing an issue or have feedback? Fill out the form below to let us know!
        </p>
      </motion.div>

      {/* Form Section */}
      <motion.form
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8"
      >
        {/* Name */}
        <div className="mb-6">
          <label className="block text-gray-400 font-medium mb-2" htmlFor="name">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="block text-gray-400 font-medium mb-2" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Issue Type */}
        <div className="mb-6">
          <label className="block text-gray-400 font-medium mb-2" htmlFor="issueType">
            Issue Type
          </label>
          <select
            id="issueType"
            name="issueType"
            value={formData.issueType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="Bug Report">Bug Report</option>
            <option value="Feature Request">Feature Request</option>
            <option value="General Feedback">General Feedback</option>
          </select>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-gray-400 font-medium mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="5"
            className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Provide a detailed description of the issue or feedback"
            required
          ></textarea>
        </div>

        {/* Steps to Reproduce */}
        <div className="mb-6">
          <label className="block text-gray-400 font-medium mb-2" htmlFor="steps">
            Steps to Reproduce (if applicable)
          </label>
          <textarea
            id="steps"
            name="steps"
            value={formData.steps}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="List steps to reproduce the issue (optional)"
          ></textarea>
        </div>

        {/* Screenshot */}
        <div className="mb-6">
          <label className="block text-gray-400 font-medium mb-2" htmlFor="screenshot">
            Upload Screenshot (optional)
          </label>
          <input
            type="file"
            id="screenshot"
            name="screenshot"
            onChange={handleFileChange}
            className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            Submit Issue
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default Help;
