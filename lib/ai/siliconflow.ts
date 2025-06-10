import {
  BaseAIService,
  ChatMessage,
  ChatOptions,
  ChatResponse,
  StreamChunk,
} from "./types";

export class SiliconFlowService extends BaseAIService {
  private baseURL = "https://api.siliconflow.cn/v1";

  async chat(
    messages: ChatMessage[],
    options: ChatOptions = {}
  ): Promise<ChatResponse> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model || "Qwen/QwQ-32B",
        messages,
        stream: false,
        max_tokens: options.maxTokens || 512,
        enable_thinking: false,
        thinking_budget: 4096,
        min_p: 0.05,
        stop: null,
        temperature: options.temperature || 0.7,
        top_p: 0.7,
        top_k: 50,
        frequency_penalty: 0.5,
        n: 1,
        response_format: { type: "text" },
        tools: [],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `SiliconFlow API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();

    return {
      content: data.choices[0]?.message?.content || "",
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
    };
  }

  async *streamChat(
    messages: ChatMessage[],
    options: ChatOptions = {}
  ): AsyncIterable<StreamChunk> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model || "Qwen/QwQ-32B",
        messages,
        stream: true,
        max_tokens: options.maxTokens || 512,
        enable_thinking: false,
        thinking_budget: 4096,
        min_p: 0.05,
        stop: null,
        temperature: options.temperature || 0.7,
        top_p: 0.7,
        top_k: 50,
        frequency_penalty: 0.5,
        n: 1,
        response_format: { type: "text" },
        tools: [],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `SiliconFlow API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    if (!response.body) {
      throw new Error("No response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          yield { delta: "", done: true };
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            if (data === "[DONE]") {
              yield { delta: "", done: true };
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || "";

              if (content) {
                yield { delta: content, done: false };
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
