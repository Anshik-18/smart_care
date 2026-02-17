import { Clock, Calendar, Bot, Activity } from "lucide-react"

export default function KeyFeatures() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Clock className="w-12 h-12 text-blue-600" />}
            title="Eliminate Hospital Queues"
            description="Say goodbye to long waits. Our smart system optimizes patient flow."
          />
          <FeatureCard
            icon={<Calendar className="w-12 h-12 text-blue-600" />}
            title="Instant Appointment Booking"
            description="Book your slot in seconds, with real-time availability updates."
          />
          <FeatureCard
            icon={<Bot className="w-12 h-12 text-blue-600" />}
            title="AI Medication Assistant"
            description="Get personalized medication advice and interaction checks."
          />
          <FeatureCard
            icon={<Activity className="w-12 h-12 text-blue-600" />}
            title="Real-Time Queue Tracking"
            description="Monitor your position in the queue and receive timely updates."
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

