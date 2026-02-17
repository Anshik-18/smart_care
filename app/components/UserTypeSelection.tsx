import Link from "next/link"

export default function UserTypeSelection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Choose Your Role</h2>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
          <Link
            href="/patient-dashboard"
            className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Patient Dashboard
          </Link>
          <Link
            href="/doctor-dashboard"
            className="bg-green-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-green-700 transition duration-300"
          >
            Doctor Dashboard
          </Link>
        </div>
      </div>
    </section>
  )
}

