import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSessionFromRequest } from "@/lib/auth";

const prisma = new PrismaClient();

/**
 * 生成文件名（基于标题）
 */
function generateFileName(title: string): string {
  if (!title || title.trim().length === 0) {
    return `note_${Date.now()}`;
  }

  // 移除特殊字符，保留中文、英文、数字和空格
  const cleanTitle = title
    .trim()
    .replace(/[^\w\s\u4e00-\u9fa5]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 50);

  return cleanTitle || `note_${Date.now()}`;
}

/**
 * 获取单个笔记
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    const note = await prisma.note.findFirst({
      where: {
        id: params.id,
        userId: session.userId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    if (!note) {
      return NextResponse.json({ error: "笔记不存在" }, { status: 404 });
    }

    return NextResponse.json({ note });
  } catch (error) {
    console.error("获取笔记失败:", error);
    return NextResponse.json({ error: "获取笔记失败" }, { status: 500 });
  }
}

/**
 * 更新笔记
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

    const { title, content, categoryId } = await request.json();

    // 验证必填字段
    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: "笔记标题不能为空" }, { status: 400 });
    }

    // 验证内容长度
    const noteContent = content || "";
    if (noteContent.length > 30000) {
      return NextResponse.json(
        { error: "笔记内容不能超过30000个字符" },
        { status: 400 }
      );
    }

    // 检查笔记是否存在且属于当前用户
    const existingNote = await prisma.note.findFirst({
      where: {
        id: params.id,
        userId: session.userId,
      },
    });

    if (!existingNote) {
      return NextResponse.json({ error: "笔记不存在" }, { status: 404 });
    }

    // 如果指定了新分类，验证分类是否存在且属于当前用户
    if (categoryId && categoryId !== existingNote.categoryId) {
      const category = await prisma.noteCategory.findFirst({
        where: {
          id: categoryId,
          userId: session.userId,
        },
      });

      if (!category) {
        return NextResponse.json(
          { error: "指定的分类不存在" },
          { status: 400 }
        );
      }
    }

    // 生成新的文件名（如果标题改变了）
    const fileName =
      title.trim() !== existingNote.title
        ? generateFileName(title)
        : existingNote.fileName;

    const note = await prisma.note.update({
      where: {
        id: params.id,
      },
      data: {
        title: title.trim(),
        content: noteContent,
        fileName,
        ...(categoryId && { categoryId }),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    return NextResponse.json({ note });
  } catch (error) {
    console.error("更新笔记失败:", error);
    return NextResponse.json({ error: "更新笔记失败" }, { status: 500 });
  }
}

/**
 * 删除笔记
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

    // 检查笔记是否存在且属于当前用户
    const note = await prisma.note.findFirst({
      where: {
        id: params.id,
        userId: session.userId,
      },
    });

    if (!note) {
      return NextResponse.json({ error: "笔记不存在" }, { status: 404 });
    }

    await prisma.note.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "笔记删除成功" });
  } catch (error) {
    console.error("删除笔记失败:", error);
    return NextResponse.json({ error: "删除笔记失败" }, { status: 500 });
  }
}
