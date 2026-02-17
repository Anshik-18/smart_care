import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function MedicalProfile({ onNext, onPrevious, data }) {
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
        <Label htmlFor="bloodGroup">Blood Group</Label>
        <Select id="bloodGroup" {...register("bloodGroup", { required: "Blood group is required" })} className="mt-1">
          <option value="">Select blood group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </Select>
        {errors.bloodGroup && <p className="text-red-500 text-sm mt-1">{errors.bloodGroup.message}</p>}
      </div>

      <div>
        <Label htmlFor="medicalConditions">Existing Medical Conditions</Label>
        <Textarea
          id="medicalConditions"
          {...register("medicalConditions")}
          className="mt-1"
          placeholder="List any existing medical conditions"
        />
      </div>

      <div>
        <Label htmlFor="allergies">Allergies</Label>
        <Textarea id="allergies" {...register("allergies")} className="mt-1" placeholder="List any allergies" />
      </div>

      <div>
        <Label htmlFor="currentMedications">Current Medications</Label>
        <Textarea
          id="currentMedications"
          {...register("currentMedications")}
          className="mt-1"
          placeholder="List any current medications"
        />
      </div>

      <div>
        <Label htmlFor="emergencyContact">Emergency Contact</Label>
        <Input
          id="emergencyContact"
          {...register("emergencyContact", { required: "Emergency contact is required" })}
          className="mt-1"
          placeholder="Name and phone number"
        />
        {errors.emergencyContact && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact.message}</p>}
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

