import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { appointmentId, action } = await request.json();

        if (!appointmentId || !action) {
            return NextResponse.json(
                { message: "Missing required fields: appointmentId, action" },
                { status: 400 }
            );
        }

        // Fetch the appointment
        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId },
        });

        if (!appointment) {
            return NextResponse.json(
                { message: "Appointment not found" },
                { status: 404 }
            );
        }

        let updatedAppointment;

        if (action === "tomorrow") {
            // Reschedule for tomorrow same time
            const newScheduledAt = new Date(appointment.scheduledAt);
            newScheduledAt.setDate(newScheduledAt.getDate() + 1);

            updatedAppointment = await prisma.appointment.update({
                where: { id: appointmentId },
                data: {
                    scheduledAt: newScheduledAt,
                    status: "SCHEDULED",
                },
            });
        } else if (action === "cancel") {
            updatedAppointment = await prisma.appointment.update({
                where: { id: appointmentId },
                data: {
                    status: "CANCELLED",
                },
            });
        } else {
            return NextResponse.json(
                { message: "Invalid action" },
                { status: 400 }
            );
        }

        // Trigger Queue Recalculation (if not cancelled, or maybe cancelled needs update too?)
        // Actually, cancelled appts free up slots, so yes, recalculate.
        // Also, rescheduling adds to a new day potentially.
        // Let's recalculate for the doctor on the NEW date (if rescheduled) AND the OLD date (if moved/cancelled).
        // For simplicity, just recalc for the affected doctor on the affected date(s).

        // Recalculate for the original date (to fix hole)
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/queue/recalculate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                doctorId: appointment.doctorId,
                date: appointment.scheduledAt,
            }),
        }).catch(console.error);

        // If rescheduled to tomorrow, recalc queue for tomorrow
        if (action === "tomorrow" && updatedAppointment) {
            await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/queue/recalculate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    doctorId: appointment.doctorId,
                    date: updatedAppointment.scheduledAt,
                }),
            }).catch(console.error);
        }

        return NextResponse.json({
            success: true,
            appointment: updatedAppointment,
        });
    } catch (error) {
        console.error("Error rescheduling appointment:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
