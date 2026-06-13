import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

function getUserId(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) throw new Error("Unauthorized");

  const payload = verifyToken(token);

  return Number(payload.userId);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const taskId = Number(id);

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: {
      status: !task.status,
    },
  });

  return NextResponse.json(updated);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const taskId = Number(id);

  if (isNaN(taskId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const { title, description } = await req.json();

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: {
      title,
      description,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const taskId = Number(id);

  if (isNaN(taskId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  return NextResponse.json({ success: true });
}
