import { CheckCircle } from "lucide-react"

export default function ProgressBar({ steps, currentStep }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                index <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {index < currentStep ? <CheckCircle className="w-6 h-6" /> : <span>{index + 1}</span>}
            </div>
            <div className={`ml-2 text-sm ${index <= currentStep ? "text-blue-600 font-medium" : "text-gray-500"}`}>
              {step}
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-4 ${index < currentStep ? "bg-blue-600" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

