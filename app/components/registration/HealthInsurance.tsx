import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function HealthInsurance({ onNext, onPrevious, data }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: data,
  })

  const onSubmit = (data) => {
    onNext(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="insuranceProvider">Insurance Provider</Label>
        <Input
          id="insuranceProvider"
          {...register("insuranceProvider", { required: "Insurance provider is required" })}
          className="mt-1"
        />
        {errors.insuranceProvider && <p className="text-red-500 text-sm mt-1">{errors.insuranceProvider.message}</p>}
      </div>

      <div>
        <Label htmlFor="policyNumber">Policy Number</Label>
        <Input
          id="policyNumber"
          {...register("policyNumber", { required: "Policy number is required" })}
          className="mt-1"
        />
        {errors.policyNumber && <p className="text-red-500 text-sm mt-1">{errors.policyNumber.message}</p>}
      </div>

      <div>
        <Label htmlFor="insuranceCard">Upload Insurance Card</Label>
        <Input
          id="insuranceCard"
          type="file"
          {...register("insuranceCard", { required: "Insurance card is required" })}
          className="mt-1"
        />
        {errors.insuranceCard && <p className="text-red-500 text-sm mt-1">{errors.insuranceCard.message}</p>}
      </div>

      <div className="flex justify-between">
        <Button type="button" onClick={onPrevious} variant="outline">
          Previous
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  )
}

