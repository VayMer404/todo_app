import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

function getUserId(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) throw new Error("Unauthorized");

  const payload = verifyToken(token);

  return Number(payload.userId);
}

// все задачи
export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// создать задачу
export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();

    const userId = getUserId(req);

    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// галочка
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const taskId = Number(params.id);

  if (isNaN(taskId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: {
      status: !task.status,
    },
  });

  return NextResponse.json(updated);
}
