
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, User, Camera, GalleryHorizontal, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
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

  return (
    <div className="min-h-screen bg-gray-100">
      <motion.aside 
        className="fixed inset-y-0 left-0 bg-white w-64 border-r border-gray-200 shadow-sm z-10 hidden md:block"
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="p-4 border-b border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <Camera className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg">FaceExam AI</span>
          </div>
        </motion.div>
        
        <motion.nav 
          className="p-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <ul className="space-y-1">
            <motion.li variants={itemVariants}>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md bg-blue-50 text-blue-600 font-medium">
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </a>
            </motion.li>
            <motion.li variants={itemVariants}>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                <User className="h-5 w-5" />
                Students
              </a>
            </motion.li>
            <motion.li variants={itemVariants}>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                <GalleryHorizontal className="h-5 w-5" />
                Exams
              </a>
            </motion.li>
            <motion.li variants={itemVariants} className="mt-8">
              <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                Back to Home
              </Link>
            </motion.li>
          </ul>
        </motion.nav>
      </motion.aside>
      
      <div className="md:pl-64">
        <motion.header 
          className="bg-white shadow-sm border-b border-gray-200 py-4 px-4 md:px-6 flex items-center justify-between"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center md:hidden">
            <Camera className="h-6 w-6 text-blue-600 mr-2" />
            <span className="font-bold">FaceExam AI</span>
          </div>
          <h1 className="text-lg font-medium hidden md:block">Dashboard</h1>
          <Button variant="outline" size="sm" className="md:hidden">
            <LayoutDashboard className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Admin</span>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </motion.header>

        <main className="p-4 md:p-6">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">1,248</p>
                  <p className="text-xs text-green-600 flex items-center mt-2">
                    <span>↑ 12% from last month</span>
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Active Exams</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">42</p>
                  <p className="text-xs text-blue-600 flex items-center mt-2">
                    <span>8 exams scheduled today</span>
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Detection Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">99.8%</p>
                  <p className="text-xs text-green-600 flex items-center mt-2">
                    <span>↑ 1.2% improvement</span>
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {[1, 2, 3, 4, 5].map((item) => (
                    <motion.div
                      key={item}
                      variants={itemVariants}
                      className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Student {item + 100}</p>
                          <p className="text-xs text-gray-500">Completed Exam #{item + 20}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {item} hour{item !== 1 ? 's' : ''} ago
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            className="text-center md:text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className="text-sm text-gray-500">This is a demo dashboard. In a real application, you would see actual exam data and controls here.</p>
            <motion.div 
              className="mt-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Return to Landing Page
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
