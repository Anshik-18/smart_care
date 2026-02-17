"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Activity } from "lucide-react"

export default function DoctorDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dr. Rajesh Kumar's Dashboard</h1>
      <Tabs defaultValue="appointments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  <AppointmentItem time="09:00 AM" patient="Priya Sharma" status="Confirmed" />
                  <AppointmentItem time="10:30 AM" patient="Amit Patel" status="In Progress" />
                  <AppointmentItem time="02:00 PM" patient="Neha Gupta" status="Waiting" />
                  <AppointmentItem time="03:30 PM" patient="Rahul Singh" status="Confirmed" />
                  <AppointmentItem time="05:00 PM" patient="Anita Desai" status="Confirmed" />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    <QueueItem number={1} patient="Vikram Mehta" estimatedWait="5 mins" />
                    <QueueItem number={2} patient="Sonia Reddy" estimatedWait="15 mins" />
                    <QueueItem number={3} patient="Arjun Nair" estimatedWait="25 mins" />
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar>
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Patient" />
                  <AvatarFallback>AP</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">Amit Patel</h3>
                  <p className="text-sm text-gray-500">Age: 42 | Gender: Male | Blood Group: B+</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Medical History</Label>
                  <ScrollArea className="h-[100px] mt-2 p-2 border rounded-md">
                    <p>
                      Patient has a history of hypertension and type 2 diabetes. Recent checkup showed improved blood
                      pressure control.
                    </p>
                  </ScrollArea>
                </div>
                <div>
                  <Label>Current Prescription</Label>
                  <ScrollArea className="h-[100px] mt-2 p-2 border rounded-md">
                    <ul className="list-disc list-inside">
                      <li>Metformin 500mg twice daily</li>
                      <li>Telmisartan 40mg once daily</li>
                      <li>Aspirin 75mg once daily</li>
                    </ul>
                  </ScrollArea>
                </div>
                <div>
                  <Label>Previous Consultation Notes</Label>
                  <Textarea placeholder="Enter consultation notes" className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ai-insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Treatment Protocols</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <p>
                    Based on the patient's history of hypertension and diabetes, consider the following treatment
                    options:
                  </p>
                  <ul className="list-disc list-inside mt-2">
                    <li>Adjust Metformin dosage to 1000mg twice daily</li>
                    <li>Add Empagliflozin 10mg once daily for better glycemic control</li>
                    <li>Recommend lifestyle modifications including low-sodium diet and regular exercise</li>
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Potential Drug Interactions</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <p>Caution: Potential interaction between Metformin and the newly prescribed Empagliflozin:</p>
                  <ul className="list-disc list-inside mt-2">
                    <li>Monitor for signs of lactic acidosis</li>
                    <li>Adjust dosages if necessary</li>
                    <li>Educate patient on symptoms to watch for</li>
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Patient Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Patient is at moderate risk for cardiovascular complications:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Recommend comprehensive cardiovascular assessment</li>
                <li>Consider adding statin therapy for primary prevention</li>
                <li>Emphasize importance of regular follow-ups and adherence to medication</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="communication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Message Inbox</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  <MessageItem sender="Priya Sharma" preview="Doctor, I've been experiencing some side effects..." />
                  <MessageItem sender="Rahul Singh" preview="My blood sugar levels have improved since..." />
                  <MessageItem sender="Neha Gupta" preview="Can we discuss alternative treatment options?" />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Prescription Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea placeholder="Enter prescription details" className="mb-2" />
                <Button>Generate Prescription</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Referral Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Input placeholder="Search specialists" className="mb-2" />
                <Button>Create Referral</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Consultation Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18 mins</div>
                <p className="text-sm text-gray-500">Average consultation time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Patient Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8/5</div>
                <p className="text-sm text-gray-500">Based on 150 reviews</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Prescription Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.2%</div>
                <p className="text-sm text-gray-500">Based on pharmacy feedback</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Queue Management Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-sm text-gray-500">Patients seen within 15 minutes of scheduled time</p>
                </div>
                <Activity className="h-16 w-16 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AppointmentItem({ time, patient, status }) {
  return (
    <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
      <span>{time}</span>
      <span>{patient}</span>
      <span
        className={`px-2 py-1 rounded text-sm ${
          status === "Confirmed"
            ? "bg-green-200 text-green-800"
            : status === "In Progress"
              ? "bg-blue-200 text-blue-800"
              : "bg-yellow-200 text-yellow-800"
        }`}
      >
        {status}
      </span>
    </div>
  )
}

function QueueItem({ number, patient, estimatedWait }) {
  return (
    <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
      <span>#{number}</span>
      <span>{patient}</span>
      <span className="text-sm text-gray-500">{estimatedWait}</span>
    </div>
  )
}

function MessageItem({ sender, preview }) {
  return (
    <div className="p-2 bg-gray-100 rounded">
      <div className="font-semibold">{sender}</div>
      <div className="text-sm text-gray-600">{preview}</div>
    </div>
  )
}

