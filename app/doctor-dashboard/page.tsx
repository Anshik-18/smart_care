"use client"

import { useState, useEffect } from "react"
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

interface DoctorDashboardData {
  doctor: {
    id: string;
    name: string;
    email: string;
    specialty: string;
  };
  todaysAppointments: Array<{
    id: string;
    status: string;
    scheduledAt: string;
    time: string;
    patientName: string;
    patient: {
      id: string;
      name: string;
      gender?: string;
    }
  }>;
  queue: Array<{
    number: number;
    patient: string;
    estimatedWait: string;
    status: string;
  }>;
  upcomingAppointments: Array<{
    id: string;
    status: string;
    scheduledAt: string;
    patient: { name: string };
  }>;
  stats: {
    totalPatientsToday: number;
    pendingAppointments: number;
  }
}

export default function DoctorDashboard() {
  const doctorId = "cmltm0lts0000t1bc78be3w9a"; // Hardcoded for demo
  const [dashboardData, setDashboardData] = useState<DoctorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date())

  const [isEmergencyLoading, setIsEmergencyLoading] = useState(false);
  const [emergencyMessage, setEmergencyMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchData = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const res = await fetch(`/api/doctor/dashboard/${doctorId}`);
      if (!res.ok) throw new Error("Failed to load dashboard data");
      const json = await res.json();
      setDashboardData(json);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSimulateEmergency = async () => {
    setIsEmergencyLoading(true);
    setEmergencyMessage(null);
    try {
      const res = await fetch("/api/queue/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId, date: new Date().toISOString() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to simulate emergency");

      setEmergencyMessage({ type: "success", text: "Emergency inserted" });
      await fetchData(false);
      setTimeout(() => setEmergencyMessage(null), 3000);
    } catch (err: any) {
      console.error(err);
      setEmergencyMessage({ type: "error", text: err.message || "Error inserting emergency" });
    } finally {
      setIsEmergencyLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading dashboard...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!dashboardData) return <div className="p-4">No data available</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold">{dashboardData.doctor.name}'s Dashboard</h1>
        <div className="flex flex-col items-end mt-4 sm:mt-0">
          <Button
            onClick={handleSimulateEmergency}
            disabled={isEmergencyLoading}
            className="bg-red-600 hover:bg-red-700 text-white font-bold"
          >
            {isEmergencyLoading ? "Simulating..." : "🚨 Simulate Emergency"}
          </Button>
          {emergencyMessage && (
            <span className={`text-sm mt-2 font-medium ${emergencyMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
              {emergencyMessage.text}
            </span>
          )}
        </div>
      </div>
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
              <CardTitle>Today's Schedule ({dashboardData.stats.totalPatientsToday} Total)</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {dashboardData.todaysAppointments.map((apt) => (
                    <AppointmentItem
                      key={apt.id}
                      time={apt.time}
                      patient={apt.patientName}
                      status={apt.status}
                    />
                  ))}
                  {dashboardData.todaysAppointments.length === 0 && <p className="text-gray-500">No appointments today.</p>}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Queue ({dashboardData.stats.pendingAppointments} Pending)</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {dashboardData.queue.map((item) => (
                      <QueueItem
                        key={item.number}
                        number={item.number}
                        patient={item.patient}
                        estimatedWait={item.estimatedWait}
                      />
                    ))}
                    {dashboardData.queue.length === 0 && <p className="text-gray-500">Queue is empty.</p>}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments (Next 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border mx-auto" />
                </div>
                <ScrollArea className="h-[150px]">
                  <div className="space-y-2">
                    {dashboardData.upcomingAppointments.map(apt => (
                      <div key={apt.id} className="text-sm p-2 bg-gray-50 rounded flex justify-between">
                        <span>{new Date(apt.scheduledAt).toLocaleDateString()} - {new Date(apt.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="font-semibold">{apt.patient.name}</span>
                      </div>
                    ))}
                    {dashboardData.upcomingAppointments.length === 0 && <p className="text-gray-500 text-center">No upcoming appointments this week.</p>}
                  </div>
                </ScrollArea>
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

function AppointmentItem({ time, patient, status }: { time: any, patient: any, status: any }) {
  return (
    <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
      <span>{time}</span>
      <span>{patient}</span>
      <span
        className={`px-2 py-1 rounded text-sm ${status === "Confirmed" || status === "SCHEDULED"
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

function QueueItem({ number, patient, estimatedWait }: { number: any, patient: any, estimatedWait: any }) {
  return (
    <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
      <span>#{number}</span>
      <span>{patient}</span>
      <span className="text-sm text-gray-500">{estimatedWait}</span>
    </div>
  )
}

function MessageItem({ sender, preview }: { sender: any, preview: any }) {
  return (
    <div className="p-2 bg-gray-100 rounded">
      <div className="font-semibold">{sender}</div>
      <div className="text-sm text-gray-600">{preview}</div>
    </div>
  )
}
