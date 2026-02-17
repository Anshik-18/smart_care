import Image from "next/image"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Patient",
    image: "/placeholder.svg",
    quote: "SmartCare has transformed my healthcare experience. No more wasted hours in waiting rooms!",
  },
  {
    name: "Dr. Michael Lee",
    role: "Cardiologist",
    image: "/placeholder.svg",
    quote:
      "This platform has significantly improved our clinic's efficiency. Highly recommended for all healthcare providers.",
  },
  {
    name: "Emily Rodriguez",
    role: "Nurse Practitioner",
    image: "/placeholder.svg",
    quote: "The AI medication assistant is a game-changer. It helps us provide better care with confidence.",
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What People Are Saying</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ name, role, image, quote }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <Image src={image || "/placeholder.svg"} alt={name} width={50} height={50} className="rounded-full mr-4" />
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-gray-600 text-sm">{role}</p>
        </div>
      </div>
      <p className="text-gray-600 italic">"{quote}"</p>
    </div>
  )
}

