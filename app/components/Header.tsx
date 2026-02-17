import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          SmartCare
        </Link>
        <div className="space-x-6">
          <Link href="#features" className="text-gray-600 hover:text-blue-600 transition duration-300">
            Features
          </Link>
          <Link href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition duration-300">
            How It Works
          </Link>
          <Link href="#testimonials" className="text-gray-600 hover:text-blue-600 transition duration-300">
            Testimonials
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-blue-600 transition duration-300">
            Login
          </Link>
          <Link
            href="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Register
          </Link>
        </div>
      </nav>
    </header>
  )
}

