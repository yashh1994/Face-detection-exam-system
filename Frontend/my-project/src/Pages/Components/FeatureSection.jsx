
import { Camera, User, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Camera,
    title: "Real-time Face Detection",
    description: "Advanced AI algorithms detect and verify student identity throughout the entire examination period.",
  },
  {
    icon: User,
    title: "Student Authentication",
    description: "Secure biometric authentication ensures only authorized students can access and complete exams.",
  },
  {
    icon: Shield,
    title: "Exam Integrity Protection",
    description: "Continuous monitoring prevents cheating attempts and maintains academic integrity.",
  },
];

const FeatureSection = () => {
  return (
    <section className="container mx-auto px-4 md:px-6 py-16 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Advanced Features</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Our AI-powered system comes with state-of-the-art features designed to make online examinations secure and reliable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <feature.icon className="h-12 w-12 text-blue-600 mb-2" />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <div className="absolute -bottom-4 -right-4 w-48 h-48 bg-blue-200 rounded-full filter blur-3xl opacity-40"></div>
          <img 
            src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
            alt="Face detection in action" 
            className="rounded-lg w-full h-auto object-cover shadow-lg relative z-10"
          />
        </div>
        <div className="flex flex-col justify-center space-y-4">
          <h3 className="text-2xl font-bold">Seamless Integration</h3>
          <p className="text-gray-600">
            Our system easily integrates with your existing learning management systems and exam platforms, providing a smooth experience for both administrators and students.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <span className="text-blue-600 text-sm">✓</span>
              </div>
              <span>Compatible with major LMS platforms</span>
            </li>
            <li className="flex items-center">
              <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <span className="text-blue-600 text-sm">✓</span>
              </div>
              <span>Browser-based - no additional software required</span>
            </li>
            <li className="flex items-center">
              <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <span className="text-blue-600 text-sm">✓</span>
              </div>
              <span>Works with any webcam-equipped device</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
