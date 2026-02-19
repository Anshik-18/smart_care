import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Severity } from "@prisma/client";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    console.log("Fetching patient dashboard data for ID:", await params);
    try {
        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const [appointments, prescriptions, metrics, alerts] = await Promise.all([
            // Upcoming appointments
            prisma.appointment.findMany({
                where: {
                    patientId: id,
                    status: "SCHEDULED",
                    scheduledAt: {
                        gte: new Date(),
                    },
                },
                select: {
                    id: true,
                    status: true,
                    scheduledAt: true,
                    doctor: {
                        select: {
                            name: true,
                            specialty: true,
                        },
                    },
                },
                orderBy: {
                    scheduledAt: "asc",
                },
                take: 3,
            }),

            // Active prescriptions
            prisma.prescription.findMany({
                where: {
                    patientId: id,
                    refillDate: {
                        gte: new Date(),
                    },
                },
            }),

            // Latest health metrics
            Promise.all([
                prisma.healthMetric.findFirst({
                    where: { patientId: id, type: "BLOOD_PRESSURE" },
                    orderBy: { recordedAt: "desc" },
                }),
                prisma.healthMetric.findFirst({
                    where: { patientId: id, type: "BLOOD_SUGAR" },
                    orderBy: { recordedAt: "desc" },
                }),
                prisma.healthMetric.findFirst({
                    where: { patientId: id, type: "BMI" },
                    orderBy: { recordedAt: "desc" },
                }),
                prisma.healthMetric.findFirst({
                    where: { patientId: id, type: "WEIGHT" },
                    orderBy: { recordedAt: "desc" },
                }),
            ]),

            // Active alerts
            prisma.alert.findMany({
                where: {
                    patientId: id,
                    resolved: false,
                },
            }),
        ]);

        const [bp, bs, bmi, weight] = metrics;

        const severityOrder: Record<string, number> = {
            HIGH: 0,
            MEDIUM: 1,
            LOW: 2,
        };

        const sortedAlerts = alerts.sort((a, b) => {
            const orderA = severityOrder[a.severity] ?? 3;
            const orderB = severityOrder[b.severity] ?? 3;
            return orderA - orderB;
        });

        return NextResponse.json({
            user,
            appointments,
            prescriptions,
            latestMetrics: {
                BLOOD_PRESSURE: bp,
                BLOOD_SUGAR: bs,
                BMI: bmi,
                WEIGHT: weight,
            },
            alerts: sortedAlerts,
        });
    } catch (error) {
        console.error("Error fetching patient dashboard data:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
