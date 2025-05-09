
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="container mx-auto px-4 md:px-6 py-12 md:py-24 flex flex-col md:flex-row items-center">
      <motion.div 
        className="flex-1 space-y-6 mb-8 md:mb-0 md:pr-12"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Secure Exams with <span className="text-blue-600">AI Face Detection</span>
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600 max-w-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Our advanced face detection technology ensures exam integrity through continuous monitoring and identification.
        </motion.p>
        <motion.div 
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/dev-insights">
              <Button size="lg" variant="outline">
                Learn How It Works
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
      <motion.div 
        className="flex-1 relative"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="absolute -top-8 -left-8 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-50"></div>
        <motion.div 
          className="relative z-10 bg-white p-2 rounded-xl shadow-xl border border-gray-100"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
            alt="Student using face detection system" 
            className="rounded-lg w-full h-auto"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
