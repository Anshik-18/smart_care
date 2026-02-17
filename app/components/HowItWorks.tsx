export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How SmartCare Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Step number={1} title="Create Account" description="Register with your basic details and medical history" />
          <Step
            number={2}
            title="Book Appointment"
            description="Choose department, doctor, and get instant slot confirmation"
          />
          <Step
            number={3}
            title="Get Treated"
            description="Track your queue, receive reminders, and get personalized care"
          />
        </div>
      </div>
    </section>
  )
}

function Step({ number, title, description }) {
  return (
    <div className="text-center">
      <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

