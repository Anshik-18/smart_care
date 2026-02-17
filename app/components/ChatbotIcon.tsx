"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ChatbotIcon() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg p-4 w-80 h-96 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">SmartCare Assistant</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex-grow bg-gray-100 rounded-lg p-2 overflow-y-auto mb-4">
            {/* Chat messages would go here */}
          </div>
          <div className="flex">
            <input type="text" placeholder="Type your message..." className="flex-grow border rounded-l-lg px-2 py-1" />
            <Button className="rounded-l-none">Send</Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setIsOpen(true)} className="rounded-full w-12 h-12 flex items-center justify-center">
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}

