import Header from "./components/Header"
import Hero from "./components/Hero"
import Features from "./components/Features"
import HowItWorks from "./components/HowItWorks"
import RegistrationPreview from "./components/RegistrationPreview"
import Testimonials from "./components/Testimonials"
import CTA from "./components/CTA"
import Footer from "./components/Footer"
import UserTypeSelection from "./components/UserTypeSelection"
import ChatbotIcon from "./components/ChatbotIcon"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Hero />
        <UserTypeSelection />
        <Features />
        <HowItWorks />
        <RegistrationPreview />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
      <ChatbotIcon />
    </div>
  )
}

