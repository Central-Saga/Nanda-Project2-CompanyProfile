import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
const eventSchema = z.object({ digest: z.string().max(100).regex(/^[\w-]+$/), component: z.enum(["RouteError", "SectionBoundary"]), pageRequestId: z.uuid().or(z.literal("")) });
export async function POST(request: NextRequest) {
  try {
    const parsed = eventSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, code: "VALIDATION", message: "Event tidak valid." }, { status: 422 });
    const count = await prisma.auditLog.count({ where: { entityType: "ClientError", createdAt: { gte: new Date(Date.now() - 60_000) } } });
    if (count >= 60) return NextResponse.json({ success: false, code: "SERVER", message: "Batas pelaporan tercapai." }, { status: 429 });
    const requestId = request.headers.get("x-request-id");
    await prisma.auditLog.create({ data: { action: "CREATE", entityType: "ClientError", entityId: parsed.data.digest, newValues: { ...parsed.data, requestId, release: process.env.COMMIT_REF || process.env.RELEASE_SHA || "local" } } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ success: false, code: "SERVER", message: "Pelaporan sementara tidak tersedia." }, { status: 503 }); }
}
