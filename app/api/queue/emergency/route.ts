import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { doctorId, date } = body;

        if (!doctorId || !date) {
            return NextResponse.json(
                { message: "Missing required fields: doctorId, date" },
                { status: 400 }
            );
        }

        const updatedQueue = await prisma.$transaction(async (tx) => {
            // 1. Create a new emergency patient dynamically
            const randomEmail = `emergency_${Math.random().toString(36).substring(2, 9)}@example.com`;
            const patient = await tx.user.create({
                data: {
                    name: "Emergency Patient",
                    email: randomEmail,
                    role: "PATIENT",
                },
            });

            // 2. Create a new Appointment
            const now = new Date(); // Request says: scheduledAt = current time
            await tx.appointment.create({
                data: {
                    patientId: patient.id,
                    doctorId,
                    scheduledAt: now,
                    duration: 15,
                    status: "SCHEDULED",
                    isEmergency: true,
                    delayMinutes: 0,
                },
            });

            // 3. Recalculate entire queue:
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const appointments = await tx.appointment.findMany({
                where: {
                    doctorId,
                    scheduledAt: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                    status: {
                        in: ["SCHEDULED"],
                    },
                },
                orderBy: [
                    { isEmergency: "desc" },
                    { scheduledAt: "asc" },
                ],
            });

            // Explicit in-memory sort to guarantee emergencies are first
            // even if the generated Prisma Client was missing the isEmergency column
            appointments.sort((a, b) => {
                const aRef = a as any;
                const bRef = b as any;
                if (aRef.isEmergency && !bRef.isEmergency) return -1;
                if (!aRef.isEmergency && bRef.isEmergency) return 1;
                return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
            });

            const enhancements = [];
            let currentStartTime: Date | null = null;
            let queuePosition = 1;
            let totalDelayBefore = 0;

            for (let i = 0; i < appointments.length; i++) {
                const appointment = appointments[i];
                const duration = appointment.duration || 15;
                const delay = appointment.delayMinutes || 0;

                if (i === 0) {
                    currentStartTime = new Date(appointment.scheduledAt);
                }

                const start = new Date(currentStartTime!);
                start.setMinutes(start.getMinutes() + delay);

                const end = new Date(start);
                end.setMinutes(end.getMinutes() + duration);

                const updatedAppointment = await tx.appointment.update({
                    where: { id: appointment.id },
                    data: {
                        computedStartTime: start,
                        computedEndTime: end,
                        queuePosition: queuePosition++,
                    },
                });

                const nowTime = new Date();
                const diffMs = start.getTime() - nowTime.getTime();
                const estimatedWaitMinutes = diffMs > 0 ? Math.ceil(diffMs / (1000 * 60)) : 0;

                let delayReason = "On schedule";
                if (totalDelayBefore > 0) {
                    delayReason = "There are delayed appointments ahead.";
                }

                const humanReadableStatus = `You are position ${updatedAppointment.queuePosition} in queue. Estimated wait time is ${estimatedWaitMinutes} minutes.`;

                enhancements.push({
                    ...updatedAppointment,
                    estimatedWaitMinutes,
                    totalDelayBefore,
                    delayReason,
                    humanReadableStatus
                });

                currentStartTime = end;

                if (delay > 0) {
                    totalDelayBefore += delay;
                }
            }

            return enhancements;
        }, {
            maxWait: 5000,
            timeout: 20000,
        });

        return NextResponse.json({
            success: true,
            message: "Emergency inserted",
            updatedQueue,
        });

    } catch (error) {
        console.error("Emergency queue error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
