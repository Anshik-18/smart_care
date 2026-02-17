"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import { Progress } from "@/components/ui/progress"
import { Pill, CalendarIcon, FileText, Activity, Award } from "lucide-react"

export default function PatientDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome, Sanya sadaf </h1>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Health Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="records">Medical Records</TabsTrigger>
          <TabsTrigger value="insights">Health Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Prescriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3</div>
                <p className="text-sm text-gray-500">Last updated: 2 days ago</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2</div>
                <p className="text-sm text-gray-500">Next: Dr. Kumar, 15 May</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Lab Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1</div>
                <p className="text-sm text-gray-500">Blood work, 3 days ago</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Health Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">85/100</div>
                <Progress value={85} className="mt-2" />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Health Metrics Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard title="Blood Pressure" value="120/80" unit="mmHg" icon={<Activity className="h-6 w-6" />} />
                <MetricCard title="Blood Sugar" value="95" unit="mg/dL" icon={<Pill className="h-6 w-6" />} />
                <MetricCard title="BMI" value="22.5" unit="" icon={<Award className="h-6 w-6" />} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  <AppointmentItem
                    date="15 May 2023"
                    time="10:00 AM"
                    doctor="Dr. Rajesh Kumar"
                    department="Cardiology"
                  />
                  <AppointmentItem
                    date="22 May 2023"
                    time="2:30 PM"
                    doctor="Dr. Anita Desai"
                    department="Endocrinology"
                  />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Book New Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" placeholder="Select department" />
                </div>
                <div>
                  <Label htmlFor="doctor">Doctor</Label>
                  <Input id="doctor" placeholder="Select doctor" />
                </div>
                <div>
                  <Label>Select Date</Label>
                  <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                </div>
                <Button>Book Appointment</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="medications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  <MedicationItem name="Metformin" dosage="500mg" frequency="Twice daily" refillDate="1 June 2023" />
                  <MedicationItem name="Telmisartan" dosage="40mg" frequency="Once daily" refillDate="15 June 2023" />
                  <MedicationItem name="Aspirin" dosage="75mg" frequency="Once daily" refillDate="1 July 2023" />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Medication Interaction Checker</CardTitle>
            </CardHeader>
            <CardContent>
              <Input placeholder="Enter medication name" className="mb-2" />
              <Button>Check Interactions</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  <DocumentItem name="Blood Test Results" date="10 May 2023" type="Lab Report" />
                  <DocumentItem name="Cardiology Consultation" date="1 April 2023" type="Doctor's Note" />
                  <DocumentItem name="Chest X-Ray" date="15 March 2023" type="Imaging" />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upload New Document</CardTitle>
            </CardHeader>
            <CardContent>
              <Input type="file" className="mb-2" />
              <Button>Upload Document</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Health Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  <InsightItem
                    title="Blood Pressure Trend"
                    description="Your blood pressure has been stable over the last 3 months. Keep up the good work!"
                  />
                  <InsightItem
                    title="Medication Adherence"
                    description="You've been consistent with your medication schedule. This is crucial for managing your condition effectively."
                  />
                  <InsightItem
                    title="Exercise Recommendation"
                    description="Consider increasing your daily steps to 8000. This can help improve your cardiovascular health."
                  />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Health Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <GoalItem title="Daily Steps" current={6500} target={8000} />
                <GoalItem title="Weekly Exercise" current={3} target={5} unit="days" />
                <GoalItem title="Weight" current={68} target={65} unit="kg" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricCard({ title, value, unit, icon }) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg">
      {icon}
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-2xl font-bold">
          {value} <span className="text-sm font-normal">{unit}</span>
        </p>
      </div>
    </div>
  )
}

function AppointmentItem({ date, time, doctor, department }) {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
      <div className="flex items-center space-x-4">
        <CalendarIcon className="h-6 w-6 text-blue-500" />
        <div>
          <p className="font-semibold">
            {date}, {time}
          </p>
          <p className="text-sm text-gray-600">
            {doctor} - {department}
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm">
        Reschedule
      </Button>
    </div>
  )
}

function MedicationItem({ name, dosage, frequency, refillDate }) {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
      <div>
        <p className="font-semibold">
          {name} - {dosage}
        </p>
        <p className="text-sm text-gray-600">{frequency}</p>
      </div>
      <div className="text-right">
        <p className="text-sm">Refill by:</p>
        <p className="font-semibold">{refillDate}</p>
      </div>
    </div>
  )
}

function DocumentItem({ name, date, type }) {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
      <div className="flex items-center space-x-4">
        <FileText className="h-6 w-6 text-blue-500" />
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-600">
            {type} - {date}
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm">
        View
      </Button>
    </div>
  )
}

function InsightItem({ title, description }) {
  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}

function GoalItem({ title, current, target, unit = "" }) {
  const progress = (current / target) * 100
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="font-semibold">{title}</span>
        <span>
          {current}/{target} {unit}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}

