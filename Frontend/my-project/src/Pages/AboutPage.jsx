import React from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

const About = () => {
  const features = [
    {
      title: "AI Monitoring",
      description:
        "Leverages OpenCV and NumPy for real-time webcam monitoring, ensuring students remain compliant during exams. AI algorithms analyze movements and provide instant alerts.",
    },
    {
      title: "Dynamic Test Creation",
      description:
        "Fully customizable tests, allowing users to define questions, durations, start and end times, and multiple-choice or single-select options.",
    },
    {
      title: "Real-Time Feedback",
      description:
        "Continuous monitoring during the exam to ensure adherence to rules. Highlights unusual behaviors for review.",
    },
    {
      title: "Webcam Integration",
      description:
        "Captures frames every second and processes them for position validation using AI-powered analysis.",
    },
    {
      title: "Robust Backend",
      description:
        "Uses Flask and SQLAlchemy ORM for seamless API handling, secure data storage, and efficient database operations.",
    },
    {
      title: "Cross-Platform Support",
      description:
        "Optimized for use across devices and browsers, ensuring accessibility for everyone, anytime.",
    },
  ];

  const techStack = [
    {
      name: "React.js",
      description: "Used for creating a responsive and dynamic user interface with reusable components.",
    },
    {
      name: "TailwindCSS",
      description: "Implemented for fast and efficient styling with a modern and clean design approach.",
    },
    {
      name: "Python Flask",
      description: "Serves as the backend framework for managing APIs and server-side logic.",
    },
    {
      name: "OpenCV & NumPy",
      description: "Powers the AI monitoring system with advanced image processing and matrix computations.",
    },
    {
      name: "PostgreSQL",
      description: "Ensures secure and scalable data storage for test details and results.",
    },
    {
      name: "SQLAlchemy ORM",
      description: "Simplifies database queries and ensures seamless interaction with PostgreSQL.",
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-12"
      >
        <h1 className="text-5xl font-bold text-blue-500 mb-4">About Our Project</h1>
        <p className="text-lg max-w-3xl mx-auto text-gray-300">
          This project redefines online exams with advanced AI-powered monitoring, customizable test creation, and a robust backend for seamless operation.
        </p>
      </motion.div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8 py-12">
        {features.map((feature, index) => (
          <Tilt
            key={index}
            className="bg-gradient-to-tl from-blue-700 to-black p-6 rounded-xl shadow-xl hover:shadow-2xl"
            glareEnable={true}
            glareMaxOpacity={0.8}
            glareColor="#ffffff"
            glareBorderRadius="10px"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="text-center"
            >
              <h3 className="text-2xl font-semibold text-blue-400 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-300">{feature.description}</p>
            </motion.div>
          </Tilt>
        ))}
      </div>

      {/* Tech Stack Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="px-8 py-12"
      >
        <h2 className="text-4xl font-bold text-center text-blue-500 mb-8">Tech Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techStack.map((tech, index) => (
            <Tilt
              key={index}
              className="bg-gradient-to-t from-gray-800 to-black p-6 rounded-lg shadow-lg hover:shadow-2xl"
              glareEnable={true}
              glareMaxOpacity={0.7}
              glareColor="#ffffff"
              glareBorderRadius="10px"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center"
              >
                <h3 className="text-xl font-semibold text-blue-400">{tech.name}</h3>
                <p className="text-gray-300 text-sm">{tech.description}</p>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </motion.div>

      {/* About Me Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mt-16 px-8 py-12"
      >
        <h2 className="text-3xl font-bold text-blue-500 mb-4">About the Developer</h2>
        <p className="text-lg text-gray-300 mb-6">
          Hi, I'm Yash Fadadu, a passionate developer skilled in React.js, Python Flask, and AI technologies. I designed and built this project from the ground up, focusing on delivering a seamless user experience with cutting-edge technology.
        </p>
        <p className="text-lg text-gray-300 mb-6">
          I enjoy solving real-world problems with code, continuously learning new technologies, and creating impactful projects. Feel free to explore the code or reach out for collaboration!
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="https://github.com/yashh1994/Face-detection-exam-system"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            View GitHub Repo
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
