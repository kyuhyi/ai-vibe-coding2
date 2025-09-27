import { SplineSceneBasic } from "@/components/ui/demo";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            3D Interactive Demo
          </h1>
          <p className="text-xl text-gray-300">
            Experience the power of Spline 3D scenes in your web applications
          </p>
        </div>
        
        <div className="mb-8">
          <SplineSceneBasic />
        </div>
        
        <div className="text-center">
          <p className="text-gray-400">
            Move your mouse over the 3D scene to see the interactive spotlight effect
          </p>
        </div>
      </div>
    </div>
  );
}
