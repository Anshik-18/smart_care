import { Clock, Frown, Thermometer } from "lucide-react"

export default function ProblemStatement() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">The Healthcare Challenge</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ProblemCard
            icon={<Clock className="w-12 h-12 text-red-500" />}
            title="Long Wait Times"
            description="Patients endure hours of waiting, leading to frustration and anxiety."
          />
          <ProblemCard
            icon={<Frown className="w-12 h-12 text-red-500" />}
            title="Inefficient Scheduling"
            description="Outdated booking systems cause overbooking and underutilized resources."
          />
          <ProblemCard
            icon={<Thermometer className="w-12 h-12 text-red-500" />}
            title="Lack of Personalization"
            description="One-size-fits-all approach neglects individual patient needs and history."
          />
        </div>
      </div>
    </section>
  )
}

function ProblemCard({ icon, title, description }) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

