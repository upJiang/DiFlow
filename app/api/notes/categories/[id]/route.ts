import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSessionFromRequest } from "@/lib/auth";

const prisma = new PrismaClient();

/**
 * 更新分类
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // 检查分类是否存在且属于当前用户
    const existingCategory = await prisma.noteCategory.findFirst({
      where: {
        id: params.id,
        userId: session.userId,
      },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "分类不存在" }, { status: 404 });
    }

    // 检查新名称是否与其他分类重复
    const duplicateCategory = await prisma.noteCategory.findFirst({
      where: {
        userId: session.userId,
        name: name.trim(),
        id: {
          not: params.id,
        },
      },
    });

    if (duplicateCategory) {
      return NextResponse.json({ error: "分类名称已存在" }, { status: 400 });
    }

    const category = await prisma.noteCategory.update({
      where: {
        id: params.id,
      },
      data: {
        name: name.trim(),
        color: color || existingCategory.color,
      },
      include: {
        _count: {
          select: {
            notes: true,
          },
        },
      },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("更新分类失败:", error);
    return NextResponse.json({ error: "更新分类失败" }, { status: 500 });
  }
}

/**
 * 删除分类
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    // 检查分类是否存在且属于当前用户
    const category = await prisma.noteCategory.findFirst({
      where: {
        id: params.id,
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

    if (!category) {
      return NextResponse.json({ error: "分类不存在" }, { status: 404 });
    }

    // 检查分类下是否有笔记
    if (category._count.notes > 0) {
      return NextResponse.json(
        {
          error: "无法删除包含笔记的分类，请先删除或移动分类下的所有笔记",
        },
        { status: 400 }
      );
    }

    await prisma.noteCategory.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "分类删除成功" });
  } catch (error) {
    console.error("删除分类失败:", error);
    return NextResponse.json({ error: "删除分类失败" }, { status: 500 });
  }
}
