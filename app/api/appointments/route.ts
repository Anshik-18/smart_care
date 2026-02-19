import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { patientId, doctorId, scheduledAt, duration } = body;

        // Validate required fields
        if (!patientId || !doctorId || !scheduledAt || duration === undefined || duration === null) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const scheduledDate = new Date(scheduledAt);

        // Validate date format
        if (isNaN(scheduledDate.getTime())) {
            return NextResponse.json(
                { success: false, message: "Invalid scheduledAt date format" },
                { status: 400 }
            );
        }

        const appointment = await prisma.appointment.create({
            data: {
                patientId,
                doctorId,
                scheduledAt: scheduledDate,
                duration: Number(duration),
                status: "SCHEDULED",
            },
        });

        return NextResponse.json({
            success: true,
            appointment,
        });
    } catch (error) {
        console.error("Error creating appointment:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
