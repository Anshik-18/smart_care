import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MetricType } from "@prisma/client";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { patientId, type, value1, value2 } = body;

        // Validate required fields
        if (!patientId || !type || value1 === undefined || value1 === null) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Validate metric type
        if (!Object.values(MetricType).includes(type as MetricType)) {
            return NextResponse.json(
                { success: false, message: "Invalid metric type" },
                { status: 400 }
            );
        }

        // Format the value string
        // If value2 is present, format as "value1/value2" (e.g. for Blood Pressure)
        // Otherwise just "value1"
        let value = String(value1);
        if (value2 !== undefined && value2 !== null) {
            value = `${value1}/${value2}`;
        }

        const metric = await prisma.healthMetric.create({
            data: {
                patientId,
                type: type as MetricType,
                value,
            },
        });

        return NextResponse.json({
            success: true,
            metric,
        });
    } catch (error) {
        console.error("Error creating health metric:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
