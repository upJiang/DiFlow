export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface ChatResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface StreamChunk {
  delta: string;
  done: boolean;
}

export type AIProvider = "deepseek" | "openai" | "siliconflow";

export interface ModelConfig {
  provider: AIProvider;
  name: string;
  displayName: string;
  maxTokens: number;
  supportStream: boolean;
}

export abstract class BaseAIService {
  protected apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  abstract chat(
    messages: ChatMessage[],
    options?: ChatOptions
  ): Promise<ChatResponse>;
  abstract streamChat(
    messages: ChatMessage[],
    options?: ChatOptions
  ): AsyncIterable<StreamChunk>;
}
