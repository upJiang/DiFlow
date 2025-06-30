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
 * 获取笔记列表
 */
export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {
      userId: session.userId,
    };

    // 分类筛选
    if (categoryId && categoryId !== "all") {
      where.categoryId = categoryId;
    }

    // 搜索功能
    if (search && search.trim().length > 0) {
      const searchTerm = search.trim();
      where.OR = [
        {
          title: {
            contains: searchTerm,
          },
        },
        {
          content: {
            contains: searchTerm,
          },
        },
        {
          fileName: {
            contains: searchTerm,
          },
        },
      ];
    }

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.note.count({ where }),
    ]);

    return NextResponse.json({
      notes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("获取笔记列表失败:", error);
    return NextResponse.json({ error: "获取笔记列表失败" }, { status: 500 });
  }
}

/**
 * 创建新笔记
 */
export async function POST(request: NextRequest) {
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

    if (!categoryId) {
      return NextResponse.json({ error: "请选择笔记分类" }, { status: 400 });
    }

    // 验证内容长度
    const noteContent = content || "";
    if (noteContent.length > 30000) {
      return NextResponse.json(
        { error: "笔记内容不能超过30000个字符" },
        { status: 400 }
      );
    }

    // 验证分类是否存在且属于当前用户
    const category = await prisma.noteCategory.findFirst({
      where: {
        id: categoryId,
        userId: session.userId,
      },
    });

    if (!category) {
      return NextResponse.json({ error: "指定的分类不存在" }, { status: 400 });
    }

    // 生成文件名
    const fileName = generateFileName(title);

    const note = await prisma.note.create({
      data: {
        title: title.trim(),
        content: noteContent,
        fileName,
        categoryId,
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

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error("创建笔记失败:", error);
    return NextResponse.json({ error: "创建笔记失败" }, { status: 500 });
  }
}
