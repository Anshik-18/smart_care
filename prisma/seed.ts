import { PrismaClient, Role, MetricType, AppointmentStatus, Severity } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    try {
        // Clear existing data in correct order to avoid FK constraints
        await prisma.appointment.deleteMany();
        await prisma.prescription.deleteMany();
        await prisma.healthMetric.deleteMany();
        await prisma.alert.deleteMany();
        await prisma.user.deleteMany();

        // Create Doctor
        const doctor = await prisma.user.create({
            data: {
                name: "Dr. Rajesh Kumar",
                email: "rajesh.kumar@example.com",
                role: Role.DOCTOR,
                specialty: "Cardiology",
            },
        });

        // Create Patients
        const patientsData = [
            { name: "John Doe", email: "john.doe@example.com" },
            { name: "Sarah Khan", email: "sarah.khan@example.com" },
            { name: "Amit Verma", email: "amit.verma@example.com" },
        ];

        for (let i = 0; i < patientsData.length; i++) {
            const p = patientsData[i];
            const patient = await prisma.user.create({
                data: {
                    name: p.name,
                    email: p.email,
                    role: Role.PATIENT,
                },
            });

            // Create 3 Health Metrics
            await prisma.healthMetric.createMany({
                data: [
                    {
                        patientId: patient.id,
                        type: MetricType.BLOOD_PRESSURE,
                        value: "120/80",
                    },
                    {
                        patientId: patient.id,
                        type: MetricType.BLOOD_SUGAR,
                        value: "95",
                    },
                    {
                        patientId: patient.id,
                        type: MetricType.BMI,
                        value: "22.5",
                    },
                ],
            });

            // Create 1 Prescription
            const nextMonth = new Date();
            nextMonth.setDate(nextMonth.getDate() + 30);

            await prisma.prescription.create({
                data: {
                    patientId: patient.id,
                    medication: "Amoxicillin",
                    dosage: "500mg",
                    frequency: "Twice daily",
                    refillDate: nextMonth,
                },
            });

            // Create 2 Scheduled Appointments (different times tomorrow)
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            // Appointment 1: Morning slot (9:00, 10:00, 11:00 based on index)
            const date1 = new Date(tomorrow);
            date1.setHours(9 + i, 0, 0, 0);

            await prisma.appointment.create({
                data: {
                    patientId: patient.id,
                    doctorId: doctor.id,
                    scheduledAt: date1,
                    duration: 20,
                    status: AppointmentStatus.SCHEDULED,
                },
            });

            // Appointment 2: Afternoon slot (14:00, 15:00, 16:00 based on index)
            const date2 = new Date(tomorrow);
            date2.setHours(14 + i, 0, 0, 0);

            await prisma.appointment.create({
                data: {
                    patientId: patient.id,
                    doctorId: doctor.id,
                    scheduledAt: date2,
                    duration: 20,
                    status: AppointmentStatus.SCHEDULED,
                },
            });
        }

        console.log("Database seeded successfully");
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
