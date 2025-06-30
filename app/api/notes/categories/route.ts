import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSessionFromRequest } from "@/lib/auth";

const prisma = new PrismaClient();

/**
 * 获取用户的所有分类
 */
export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    const categories = await prisma.noteCategory.findMany({
      where: {
        userId: session.userId,
      },
      include: {
        _count: {
          select: {
            notes: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("获取分类失败:", error);
    return NextResponse.json({ error: "获取分类失败" }, { status: 500 });
  }
}

/**
 * 创建新分类
 */
export async function POST(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    const { name, color } = await request.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "分类名称不能为空" }, { status: 400 });
    }

    if (name.trim().length > 50) {
      return NextResponse.json(
        { error: "分类名称不能超过50个字符" },
        { status: 400 }
      );
    }

    // 检查分类名是否已存在
    const existingCategory = await prisma.noteCategory.findFirst({
      where: {
        userId: session.userId,
        name: name.trim(),
      },
    });

    if (existingCategory) {
      return NextResponse.json({ error: "分类名称已存在" }, { status: 400 });
    }

    const category = await prisma.noteCategory.create({
      data: {
        name: name.trim(),
        color: color || "#3B82F6",
        userId: session.userId,
      },
      include: {
        _count: {
          select: {
            notes: true,
          },
        },
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("创建分类失败:", error);
    return NextResponse.json({ error: "创建分类失败" }, { status: 500 });
  }
}
