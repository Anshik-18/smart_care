import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Revolutionize Your Healthcare Experience</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">Smart Appointments, Zero Waiting, AI-Powered Care</p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            href="#cta"
            className="bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-50 transition duration-300 flex items-center"
          >
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
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

