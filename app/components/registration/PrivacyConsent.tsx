import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function PrivacyConsent({ onSubmit, onPrevious, data }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: data,
  })

  const handleFormSubmit = (data) => {
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-start">
          <Checkbox
            id="termsOfService"
            {...register("termsOfService", { required: "You must accept the terms of service" })}
          />
          <Label htmlFor="termsOfService" className="ml-2 text-sm">
            I agree to the{" "}
            <a href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </a>
          </Label>
        </div>
        {errors.termsOfService && <p className="text-red-500 text-sm">{errors.termsOfService.message}</p>}

        <div className="flex items-start">
          <Checkbox id="dataUsage" {...register("dataUsage", { required: "You must consent to data usage" })} />
          <Label htmlFor="dataUsage" className="ml-2 text-sm">
            I consent to the collection and use of my data as described in the{" "}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </Label>
        </div>
        {errors.dataUsage && <p className="text-red-500 text-sm">{errors.dataUsage.message}</p>}

        <div className="flex items-start">
          <Checkbox
            id="hipaaCompliance"
            {...register("hipaaCompliance", { required: "You must agree to HIPAA compliance" })}
          />
          <Label htmlFor="hipaaCompliance" className="ml-2 text-sm">
            I understand and agree to comply with HIPAA regulations
          </Label>
        </div>
        {errors.hipaaCompliance && <p className="text-red-500 text-sm">{errors.hipaaCompliance.message}</p>}
      </div>

      <div className="flex justify-between">
        <Button type="button" onClick={onPrevious} variant="outline">
          Previous
        </Button>
        <Button type="submit">Submit Registration</Button>
      </div>
    </form>
  )
}

