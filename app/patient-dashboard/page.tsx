"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import { Progress } from "@/components/ui/progress"
import { Pill, CalendarIcon, FileText, Activity, Award } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface DashboardData {
  user: {
    id: string
    name: string
    email: string
    role: string
    createdAt: string
  }
  appointments: Array<{
    id: string
    status: string
    scheduledAt: string
    computedStartTime?: string
    queuePosition?: number
    estimatedWaitMinutes?: number
    delayReason?: string
    humanReadableStatus?: string
    doctor: {
      name: string
      specialty: string
    }
  }>
  prescriptions: Array<{
    id: string
    medication: string
    dosage: string
    frequency: string
    refillDate: string
  }>
  latestMetrics: {
    BLOOD_PRESSURE?: { value: string; recordedAt: string }
    BLOOD_SUGAR?: { value: string; recordedAt: string }
    BMI?: { value: string; recordedAt: string }
    WEIGHT?: { value: string; recordedAt: string }
  }
  alerts: Array<{
    id: string
    type: string
    message: string
    severity: string
    resolved: boolean
  }>
}

export default function PatientDashboard() {
  const patientId = "cmltm0mp00001t1bc8bzqml62" // Hardcoded for demo purposes
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Booking state
  const [department, setDepartment] = useState("")
  const [doctorId, setDoctorId] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingMessage, setBookingMessage] = useState("")
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [doctors, setDoctors] = useState<Array<{ id: string, name: string, specialty: string | null }>>([])
  const [openDoctorSelect, setOpenDoctorSelect] = useState(false)
  const [openDeptSelect, setOpenDeptSelect] = useState(false)

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`/api/patient/dashboard/${patientId}`)
      if (!res.ok) throw new Error("Failed to fetch")
      const json = await res.json()
      setDashboardData(json)
    } catch (err) {
      console.error(err)
      setError("Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    // Fetch doctors
    fetch('/api/doctors')
      .then(res => res.json())
      .then(data => setDoctors(data))
      .catch(err => console.error("Failed to load doctors", err))
  }, [])

  // Derive unique departments from doctors list
  const departments = Array.from(new Set(doctors.map(d => d.specialty).filter(Boolean))) as string[]

  const handleBookAppointment = async () => {
    if (!date || !doctorId) {
      setBookingStatus('error')
      setBookingMessage("Please select a date and doctor")
      return
    }

    setBookingLoading(true)
    setBookingMessage("")
    setBookingStatus('idle')

    try {
      const scheduledAt = date.toISOString()

      // 1. Create Appointment
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          doctorId,
          scheduledAt,
          duration: 30 // Hardcoded duration
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to book appointment")
      }

      // 2. Recalculate Queue
      await fetch('/api/queue/recalculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId,
          date: scheduledAt
        })
      })

      // 3. Success
      setBookingStatus('success')
      setBookingMessage("Appointment booked successfully!")

      // Refresh dashboard data
      fetchDashboardData()

    } catch (err: any) {
      console.error(err)
      setBookingStatus('error')
      setBookingMessage(err.message || "An error occurred")
    } finally {
      setBookingLoading(false)
    }
  }

  const handleReschedule = async (appointmentId: string, action: 'tomorrow' | 'cancel') => {
    try {
      const res = await fetch('/api/appointments/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId,
          action
        })
      });

      if (!res.ok) {
        throw new Error("Failed to reschedule");
      }

      // Refresh data
      fetchDashboardData();
      alert(action === 'tomorrow' ? "Rescheduled for tomorrow successfully" : "Appointment cancelled");
    } catch (error) {
      console.error(error);
      alert("Failed to process request");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold">Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p className="text-lg font-semibold">{error}</p>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold">No dashboard data available</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome, {dashboardData.user.name}</h1>
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
                <div className="text-3xl font-bold">{dashboardData.prescriptions.length}</div>
                <p className="text-sm text-gray-500">Last updated: Just now</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{dashboardData.appointments.length}</div>
                <p className="text-sm text-gray-500">
                  {dashboardData.appointments.length > 0
                    ? `Next: ${new Date(dashboardData.appointments[0].scheduledAt).toLocaleDateString()}`
                    : "No upcoming appointments"}
                </p>
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
                <MetricCard
                  title="Blood Pressure"
                  value={dashboardData.latestMetrics.BLOOD_PRESSURE?.value || "N/A"}
                  unit="mmHg"
                  icon={<Activity className="h-6 w-6" />}
                />
                <MetricCard
                  title="Blood Sugar"
                  value={dashboardData.latestMetrics.BLOOD_SUGAR?.value || "N/A"}
                  unit="mg/dL"
                  icon={<Pill className="h-6 w-6" />}
                />
                <MetricCard
                  title="BMI"
                  value={dashboardData.latestMetrics.BMI?.value || "N/A"}
                  unit=""
                  icon={<Award className="h-6 w-6" />}
                />
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
                  {dashboardData.appointments.map((apt) => (
                    <AppointmentItem
                      key={apt.id}
                      id={apt.id}
                      date={new Date(apt.scheduledAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                      time={new Date(apt.scheduledAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      doctor={apt.doctor.name}
                      department={apt.doctor.specialty || "General"}
                      onReschedule={handleReschedule}
                      details={apt}
                    />
                  ))}
                  {dashboardData.appointments.length === 0 && (
                    <p className="text-gray-500">No upcoming appointments.</p>
                  )}
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
                  <Label>Department</Label>
                  <Popover open={openDeptSelect} onOpenChange={setOpenDeptSelect}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openDeptSelect}
                        className="w-full justify-between"
                      >
                        {department
                          ? departments.find((dept) => dept === department)
                          : "Select department..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search department..." />
                        <CommandList>
                          <CommandEmpty>No department found.</CommandEmpty>
                          <CommandGroup>
                            {departments.map((dept) => (
                              <CommandItem
                                key={dept}
                                value={dept}
                                onSelect={(currentValue) => {
                                  setDepartment(currentValue === department ? "" : currentValue)
                                  setOpenDeptSelect(false)
                                  // Clear doctor selection if department changes
                                  setDoctorId("")
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    department === dept ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {dept}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Doctor</Label>
                  <Popover open={openDoctorSelect} onOpenChange={setOpenDoctorSelect}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openDoctorSelect}
                        className="w-full justify-between"
                        disabled={!department}
                      >
                        {doctorId
                          ? doctors.find((doctor) => doctor.id === doctorId)?.name
                          : "Select doctor..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search doctor..." />
                        <CommandList>
                          <CommandEmpty>No doctor found.</CommandEmpty>
                          <CommandGroup>
                            {doctors
                              .filter(d => !department || d.specialty === department)
                              .map((doctor) => (
                                <CommandItem
                                  key={doctor.id}
                                  value={doctor.name}
                                  onSelect={() => {
                                    setDoctorId(doctor.id === doctorId ? "" : doctor.id)
                                    setOpenDoctorSelect(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      doctorId === doctor.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {doctor.name}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </div>
                <Button onClick={handleBookAppointment} disabled={bookingLoading}>
                  {bookingLoading ? "Booking..." : "Book Appointment"}
                </Button>
                {bookingMessage && (
                  <p className={`text-sm ${bookingStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {bookingMessage}
                  </p>
                )}
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
                  {dashboardData.prescriptions.map((script) => (
                    <MedicationItem
                      key={script.id}
                      name={script.medication}
                      dosage={script.dosage}
                      frequency={script.frequency || "As needed"}
                      refillDate={new Date(script.refillDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    />
                  ))}
                  {dashboardData.prescriptions.length === 0 && (
                    <p className="text-gray-500">No active prescriptions.</p>
                  )}
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
                  <DocumentItem
                    name="Cardiology Consultation"
                    date="1 April 2023"
                    type="Doctor's Note"
                  />
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
              <CardTitle>Personalized Health Insights (Alerts)</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {dashboardData.alerts.map((alert) => (
                    <InsightItem
                      key={alert.id}
                      title={alert.type}
                      description={`${alert.message} (Severity: ${alert.severity})`}
                    />
                  ))}
                  {dashboardData.alerts.length === 0 && (
                    <p className="text-gray-500">No active alerts.</p>
                  )}
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

function MetricCard({ title, value, unit, icon }: any) {
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

function AppointmentItem({ id, date, time, doctor, department, onReschedule, details }: any) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Options
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border shadow-md">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowDetails(true)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onReschedule(id, 'tomorrow')}>
              Reschedule for Tomorrow
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onReschedule(id, 'cancel')} className="text-red-600">
              Cancel Appointment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              Real-time status of your appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="font-semibold">Doctor:</span>
              <span>{doctor}</span>
              <span className="font-semibold">Department:</span>
              <span>{department}</span>
              <span className="font-semibold">Scheduled:</span>
              <span>{date}, {time}</span>
              <span className="font-semibold">Status:</span>
              <span className="capitalize">{details.status.toLowerCase()}</span>
            </div>

            <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-1 flex items-center gap-2">
                <Activity className="h-4 w-4" /> Live Status
              </h4>
              <p className="text-sm text-blue-700 mb-2">{details.humanReadableStatus}</p>
              <div className="grid grid-cols-2 gap-1 text-xs text-blue-600">
                <span>Queue Position:</span>
                <span className="font-mono font-bold">#{details.queuePosition || '-'}</span>
                <span>Est. Wait Time:</span>
                <span className="font-mono font-bold">{details.estimatedWaitMinutes} mins</span>
                {details.delayReason && details.delayReason !== 'On schedule' && (
                  <>
                    <span>Delay Reason:</span>
                    <span>{details.delayReason}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function MedicationItem({ name, dosage, frequency, refillDate }: any) {
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

function DocumentItem({ name, date, type }: any) {
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

function InsightItem({ title, description }: any) {
  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}

function GoalItem({ title, current, target, unit = "" }: any) {
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
