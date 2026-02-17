import Link from "next/link"
import { ClipboardList, UserPlus, ShieldCheck, Stethoscope } from "lucide-react"

export default function RegistrationPreview() {
  return (
    <section id="registration-preview" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Streamlined Registration Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <RegistrationStep
            icon={<UserPlus className="w-12 h-12 text-blue-600" />}
            title="Personal Information"
            description="Quick and easy personal details collection"
          />
          <RegistrationStep
            icon={<Stethoscope className="w-12 h-12 text-blue-600" />}
            title="Medical Profile"
            description="Comprehensive health information gathering"
          />
          <RegistrationStep
            icon={<ClipboardList className="w-12 h-12 text-blue-600" />}
            title="Insurance Integration"
            description="Seamless health insurance verification"
          />
          <RegistrationStep
            icon={<ShieldCheck className="w-12 h-12 text-blue-600" />}
            title="Privacy & Consent"
            description="Secure and compliant data handling"
          />
        </div>
        <div className="text-center mt-12">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Start Your Registration
          </Link>
        </div>
      </div>
    </section>
  )
}

function RegistrationStep({ icon, title, description }) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

