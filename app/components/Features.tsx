import { Clock, Stethoscope, UserCircle } from "lucide-react"

export default function Features() {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">SmartCare Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Clock className="w-12 h-12 text-blue-600" />}
            title="Zero Queue"
            description="Real-time queue management and precise appointment scheduling"
          />
          <FeatureCard
            icon={<Stethoscope className="w-12 h-12 text-blue-600" />}
            title="AI Medicine Assistant"
            description="Smart medication recommendations and interaction checks"
          />
          <FeatureCard
            icon={<UserCircle className="w-12 h-12 text-blue-600" />}
            title="Personalized Care"
            description="Tailored healthcare experiences based on your medical history"
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

