"use client"

import { useState } from "react"
import Link from "next/link"
import PersonalInfo from "../components/registration/PersonalInfo"
import MedicalProfile from "../components/registration/MedicalProfile"
import HealthInsurance from "../components/registration/HealthInsurance"
import PrivacyConsent from "../components/registration/PrivacyConsent"
import ProgressBar from "../components/registration/ProgressBar"

const steps = ["Personal Information", "Medical Profile", "Health Insurance", "Privacy & Consent"]

export default function Register() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})

  const handleNext = (data) => {
    setFormData({ ...formData, ...data })
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = async (data) => {
    const finalData = { ...formData, ...data }
    console.log("Form submitted:", finalData)
    // Here you would typically send the data to your backend
    // await api.submitRegistration(finalData)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfo onNext={handleNext} data={formData} />
      case 1:
        return <MedicalProfile onNext={handleNext} onPrevious={handlePrevious} data={formData} />
      case 2:
        return <HealthInsurance onNext={handleNext} onPrevious={handlePrevious} data={formData} />
      case 3:
        return <PrivacyConsent onSubmit={handleSubmit} onPrevious={handlePrevious} data={formData} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition duration-300">
            SmartCare
          </Link>
        </div>
        <div className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Patient Registration</h2>
          <ProgressBar steps={steps} currentStep={currentStep} />
          {renderStep()}
        </div>
      </div>
    </div>
  )
}

