import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { doctorId, date, change } = body;

        if (!doctorId || !date) {
            return NextResponse.json(
                { message: "Missing required fields: doctorId, date" },
                { status: 400 }
            );
        }

        // Start a transaction to ensure data integrity
        const updatedQueue = await prisma.$transaction(async (tx) => {
            // 1. Apply single appointment change if provided
            if (change?.appointmentId) {
                const { appointmentId, newStatus, delayMinutes } = change;

                await tx.appointment.update({
                    where: { id: appointmentId },
                    data: {
                        ...(newStatus && { status: newStatus as any }),
                        ...(delayMinutes !== undefined && { delayMinutes }),
                    },
                });
            }

            // 2. Fetch all actionable appointments for the day
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
                        in: ["SCHEDULED", "IN_PROGRESS"], // Fixed: using "IN_PROGRESS" based on enum if available, or just SCHEDULED if valid
                    },
                },
                orderBy: {
                    scheduledAt: "asc",
                },
            });

            // 3. Recalculate queue
            const updates = [];
            let currentStartTime: Date | null = null;
            let queuePosition = 1;

            for (let i = 0; i < appointments.length; i++) {
                const appointment = appointments[i];
                const duration = appointment.duration || 15; // Default 15 mins if null
                const delay = appointment.delayMinutes || 0;

                // Calculate start time
                if (i === 0) {
                    // First appointment starts at scheduled time or later if delayed
                    currentStartTime = new Date(appointment.scheduledAt);
                } else {
                    // Subsequent appointments start after previous one ends
                    // BUT: They cannot start before their scheduled time
                    // Logic: Max(scheduledAt, previousEndTime)
                    // However, the requirement says: 
                    // "computedStartTime = previous computedEndTime OR scheduledAt (for first one)"
                    // This implies a strict ripple effect for the queue.
                    // If strictly following requirements:
                    // "computedStartTime = previous computedEndTime" (for non-first)

                    // Let's stick to the prompt's loose logic description but ensure sanity:
                    // If previous ended early, do we pull forward? 
                    // Prompt says: "computedStartTime = previous computedEndTime"
                    // This creates a dense queue.

                    if (!currentStartTime) {
                        currentStartTime = new Date(appointment.scheduledAt);
                    }
                }

                // Apply delay to the start time
                // "computedStartTime += delayMinutes"
                const start = new Date(currentStartTime);
                start.setMinutes(start.getMinutes() + delay);

                // Calculate end time
                const end = new Date(start);
                end.setMinutes(end.getMinutes() + duration);

                // Prepare update
                // We push the promise to array to await all at once or handle sequentially
                // Since we need to return the updated queue, we can update in memory then batch update DB
                // But prisma doesn't support bulk update with different values easily.
                // We will do individual updates within transaction.

                const updatedAppointment = await tx.appointment.update({
                    where: { id: appointment.id },
                    data: {
                        computedStartTime: start,
                        computedEndTime: end,
                        queuePosition: queuePosition++,
                    },
                });

                updates.push(updatedAppointment);

                // Update currentStartTime for next iteration
                // "computedEndTime" becomes next "computedStartTime"
                currentStartTime = end;
            }

            return updates;
        });

        return NextResponse.json({
            success: true,
            updatedQueue,
        });

    } catch (error) {
        console.error("Queue recalculation error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
