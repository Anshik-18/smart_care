import Image from "next/image"

export default function SolutionOverview() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Solution: SmartCare</h2>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <Image
              src="/placeholder.svg"
              alt="SmartCare App Interface"
              width={500}
              height={300}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-1/2 md:pl-12">
            <h3 className="text-2xl font-semibold mb-4">Intelligent Healthcare Management</h3>
            <p className="text-gray-600 mb-6">
              SmartCare leverages cutting-edge AI and real-time data processing to streamline the entire healthcare
              experience. From appointment booking to follow-ups, we're revolutionizing patient care.
            </p>
            <ul className="space-y-2">
              {[
                "AI-powered appointment scheduling",
                "Real-time queue management",
                "Personalized health insights",
                "Seamless integration with existing systems",
              ].map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

