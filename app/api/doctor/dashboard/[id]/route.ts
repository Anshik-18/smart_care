import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // 1. Fetch Doctor details
        const doctor = await prisma.user.findUnique({
            where: { id },
        });

        if (!doctor || doctor.role !== Role.DOCTOR) {
            return NextResponse.json(
                { message: "Doctor not found or unauthorized" },
                { status: 404 }
            );
        }

        // 2. Fetch Today's Appointments (00:00 to 23:59)
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const todaysAppointments = await prisma.appointment.findMany({
            where: {
                doctorId: id,
                scheduledAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                status: {
                    not: "CANCELLED", // Optionally exclude cancelled
                },
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        name: true,
                        // gender: true, // Removed as it doesn't exist on User model
                        // Add other patient details if available in schema
                    },
                },
            },
            orderBy: [
                { isEmergency: "desc" },
                { scheduledAt: "asc" },
            ],
        });

        // Explicit in-memory sort to guarantee emergencies are first
        todaysAppointments.sort((a, b) => {
            const aRef = a as any;
            const bRef = b as any;
            if (aRef.isEmergency && !bRef.isEmergency) return -1;
            if (!aRef.isEmergency && bRef.isEmergency) return 1;

            // if both are emergency or both are not, use queuePosition if available
            if (aRef.queuePosition && bRef.queuePosition) {
                return aRef.queuePosition - bRef.queuePosition;
            }
            // fallback to scheduled time
            return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
        });

        // Calculate Queue (Simple logic: based on scheduled time)
        // In a real app, this might be more complex (e.g., check-in time)
        const queue = todaysAppointments.map((apt, index) => {
            // Estimate wait time: (computed start time - now) or 0 if past
            const now = new Date();
            const effectiveTime = apt.computedStartTime || apt.scheduledAt;
            const diffMs = new Date(effectiveTime).getTime() - now.getTime();
            const waitMins = diffMs > 0 ? Math.ceil(diffMs / (1000 * 60)) : 0;

            return {
                number: index + 1,
                patient: apt.patient.name,
                estimatedWait: `${waitMins} mins`,
                status: apt.status
            };
        });


        // 3. Fetch Upcoming Appointments (Testing: Next 7 days)
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        const upcomingAppointments = await prisma.appointment.findMany({
            where: {
                doctorId: id,
                scheduledAt: {
                    gt: endOfDay,
                    lte: nextWeek,
                },
                status: "SCHEDULED",
            },
            include: {
                patient: {
                    select: { name: true }
                }
            },
            orderBy: {
                scheduledAt: "asc",
            },
        });

        const stats = {
            totalPatientsToday: todaysAppointments.length,
            pendingAppointments: todaysAppointments.filter(a => a.status === 'SCHEDULED').length
        }

        return NextResponse.json({
            doctor,
            todaysAppointments: todaysAppointments.map(apt => ({
                ...apt,
                time: new Date(apt.computedStartTime || apt.scheduledAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                patientName: apt.patient.name
            })),
            queue,
            upcomingAppointments,
            stats
        });

    } catch (error) {
        console.error("Error fetching doctor dashboard data:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
