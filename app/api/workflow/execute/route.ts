import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface JWTPayload {
  id: string;
  email: string;
  name: string;
  image?: string;
}

/**
 * 从请求中获取用户认证信息
 */
function getUserFromRequest(request: NextRequest): JWTPayload | null {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_PRIVATE_KEY!
    ) as JWTPayload;

    return decoded;
  } catch (error) {
    console.error("获取用户认证失败:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // 验证用户会话
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    const { workflow } = await request.json();

    // 验证工作流数据
    if (!workflow || !workflow.nodes || !workflow.edges) {
      return NextResponse.json(
        { error: "无效的工作流数据格式" },
        { status: 400 }
      );
    }

    // 执行工作流
    const startTime = Date.now();
    const results = [];

    for (const node of workflow.nodes) {
      const result = await executeNode(node);
      results.push({
        nodeId: node.id,
        nodeType: node.type,
        result: result,
      });
    }

    const executionTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      results,
      executionTime,
      message: "工作流执行成功",
    });
  } catch (error) {
    console.error("工作流执行错误:", error);
    return NextResponse.json({ error: "工作流执行失败" }, { status: 500 });
  }
}

async function executeNode(node: any) {
  switch (node.type) {
    case "input":
      return {
        type: "input",
        message: "工作流开始",
      };

    case "ai":
      try {
        // 调用AI聊天API
        const response = await fetch("/api/langchain-chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: node.data?.message || "请处理这个节点",
            sessionId: "workflow-" + Date.now(),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return {
            type: "ai",
            response: data.response || "处理完成",
          };
        } else {
          return {
            type: "ai",
            error: "AI处理失败",
          };
        }
      } catch (error) {
        return {
          type: "ai",
          error: "AI节点执行错误",
        };
      }

    case "output":
      return {
        type: "output",
        message: "工作流输出完成",
      };

    default:
      return {
        type: "unknown",
        message: `未知节点类型: ${node.type}`,
      };
  }
}
