
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Github, FileCode, Camera, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const technologies = [
  { name: "React", description: "Frontend UI library for building interactive components" },
  { name: "TensorFlow.js", description: "Machine learning library for face detection algorithms" },
  { name: "TypeScript", description: "Type-safe JavaScript for improved developer experience" },
  { name: "Tailwind CSS", description: "Utility-first CSS framework for styling" },
  { name: "WebRTC", description: "Real-time communication for webcam access" },
  { name: "Vite", description: "Next generation frontend tooling for faster development" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const DevInsights = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Camera className="h-6 w-6 text-blue-600" />
            <span className="font-bold">FaceExam AI</span>
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Developer Insights
          </motion.h1>
          <motion.p 
            className="text-gray-600 mb-12"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Explore the technical details and architecture behind our AI-powered face detection exam system. This page provides insights into the technology stack, development process, and key features.
          </motion.p>

          <motion.section 
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6">Technology Stack</h2>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {technologies.map((tech, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{tech.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{tech.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6">Architecture Overview</h2>
            <Card className="border border-gray-200 mb-6">
              <CardContent className="pt-6">
                <motion.div 
                  className="bg-blue-50 border border-blue-100 rounded-lg p-6"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">
{`Client Application
├── User Interface (React + TypeScript)
│   ├── Exam Management Dashboard
│   ├── Student Authentication Module
│   └── Proctor Monitoring Interface
├── Face Detection Engine (TensorFlow.js)
│   ├── Face Recognition Models
│   ├── Anti-Spoofing Protection
│   └── Real-time Processing
└── Secure Communication Layer (WebRTC + Encrypted Websockets)

Server Infrastructure
├── API Gateway
├── Authentication Services
├── Analytics & Reporting Engine
└── Data Storage & Management`}
                  </pre>
                </motion.div>
              </CardContent>
            </Card>
            <p className="text-gray-600">
              The system is designed with a focus on privacy, performance, and reliability, using a microservices architecture that enables scalability and easy maintenance.
            </p>
          </motion.section>

          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6">Developer Resources</h2>
            <div className="flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gray-900 hover:bg-gray-800 flex items-center gap-2">
                  <Github className="h-4 w-4" /> GitHub Repository
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileCode className="h-4 w-4" /> API Documentation
                </Button>
              </motion.div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6">About the Developer</h2>
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <motion.img 
                    src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?crop=faces&fit=crop&w=200&h=200" 
                    alt="Developer Profile" 
                    className="rounded-full w-24 h-24 object-cover"
                    initial={{ opacity: 0, rotate: -10 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  />
                  <div>
                    <motion.h3 
                      className="text-xl font-bold mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      Lead Developer
                    </motion.h3>
                    <motion.p 
                      className="text-gray-600 mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                    >
                      With a background in computer vision and machine learning, our lead developer has worked on numerous AI projects focusing on privacy-preserving facial recognition technology and secure authentication systems.
                    </motion.p>
                    <motion.div 
                      className="flex flex-wrap gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1 }}
                    >
                      <Link to="#" className="text-blue-600 hover:underline flex items-center gap-1">
                        <Github className="h-4 w-4" /> GitHub
                      </Link>
                      <span className="text-gray-400">|</span>
                      <Link to="#" className="text-blue-600 hover:underline flex items-center gap-1">
                        <ExternalLink className="h-4 w-4" /> Portfolio
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </main>
      
      <motion.footer 
        className="bg-white border-t border-gray-200 mt-12 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
      >
        <div className="container mx-auto px-4 md:px-6 text-center text-gray-500">
          &copy; {new Date().getFullYear()} FaceExam AI. All rights reserved.
        </div>
      </motion.footer>
    </div>
  );
};

export default DevInsights;
