
import { Button } from "@/components/ui/button";
import { Github, Link, User } from "lucide-react";

const AboutDeveloper = () => {
  return (
    <section className="container mx-auto px-4 md:px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">About the Developer</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Meet the mind behind our AI-powered face detection examination system.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/3">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-1 rounded-full">
            <div className="bg-white p-1 rounded-full">
              <img
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?crop=faces&fit=crop&w=400&h=400"
                alt="Developer Profile"
                className="w-full h-auto rounded-full"
              />
            </div>
          </div>
        </div>

        <div className="md:w-2/3 space-y-6">
          <h3 className="text-2xl font-bold">Meet the Developer</h3>
          <p className="text-gray-700">
            As a passionate developer with expertise in AI and computer vision, I've dedicated my career to creating technology that enhances education. The FaceExam AI system represents years of research and development in facial recognition algorithms, security protocols, and user experience design.
          </p>
          <p className="text-gray-700">
            My goal is to provide educational institutions with tools that maintain academic integrity while embracing the digital transformation of learning and assessment.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              <span>Portfolio</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>LinkedIn</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutDeveloper;
