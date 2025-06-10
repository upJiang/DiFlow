import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // 验证用户登录状态
    const cookieStore = cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "请先登录才能使用AI助手功能" },
        { status: 401 }
      );
    }

    // 验证JWT token
    try {
      await verifyAccessToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: "登录已过期，请重新登录" },
        { status: 401 }
      );
    }

    const { message, messages = [] } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "消息内容不能为空" }, { status: 400 });
    }

    // 构建对话历史
    const chatMessages = [
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: "user",
        content: message,
      },
    ];

    // 使用 SiliconFlow API (按照 deepseekExample.js 的方式)
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API密钥未配置" }, { status: 500 });
    }

    const response = await fetch(
      "https://api.siliconflow.cn/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "Qwen/QwQ-32B",
          messages: chatMessages,
          stream: true,
          max_tokens: 512,
          min_p: 0.05,
          stop: null,
          temperature: 0.7,
          top_p: 0.7,
          top_k: 50,
          frequency_penalty: 0.5,
          n: 1,
          response_format: { type: "text" },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("SiliconFlow API error:", errorText);
      return NextResponse.json(
        { error: "AI服务暂时不可用，请稍后重试" },
        { status: 500 }
      );
    }

    // 创建流式响应
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              // 发送完成信号
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
              );
              controller.close();
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk
              .split("\n")
              .filter((line) => line.trim() !== "");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);

                if (data === "[DONE]") {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ done: true })}\n\n`
                    )
                  );
                  controller.close();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices[0]?.delta?.content || "";

                  if (content) {
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ content, done: false })}\n\n`
                      )
                    );
                  }
                } catch (e) {
                  // 忽略解析错误
                }
              }
            }
          }
        } catch (error) {
          console.error("Stream processing error:", error);
          controller.error(error);
        } finally {
          reader.releaseLock();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "内部服务器错误" }, { status: 500 });
  }
}
