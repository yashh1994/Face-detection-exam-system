
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Camera, Github, User, LayoutDashboard } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import AboutDeveloper from "@/components/AboutDeveloper";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <motion.nav 
        className="container mx-auto py-6 px-4 md:px-6 flex items-center justify-between"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Camera className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold">FaceExam AI</span>
        </motion.div>
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/dev-insights">
              <Button variant="ghost" className="text-gray-700">Dev Insights</Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      <main>
        <HeroSection />
        <FeatureSection />
        <AboutDeveloper />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
