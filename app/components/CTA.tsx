import Link from "next/link"

export default function CTA() {
  return (
    <section id="cta" className="py-20 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Healthcare Experience?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join SmartCare today and say goodbye to long waits, confusing schedules, and impersonal care. Our streamlined
          registration process gets you started in minutes!
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            href="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-50 transition duration-300"
          >
            Register Now
          </Link>
          <Link
            href="#features"
            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  )
}

