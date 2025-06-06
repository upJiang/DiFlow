import { DeepSeekService } from './deepseek'
import { BaseAIService, ChatMessage, ChatOptions, ChatResponse, StreamChunk, AIProvider, ModelConfig } from './types'

// 可用模型配置
const AVAILABLE_MODELS: ModelConfig[] = [
  {
    provider: 'deepseek',
    name: 'deepseek-chat',
    displayName: 'DeepSeek Chat',
    maxTokens: 4096,
    supportStream: true
  },
  {
    provider: 'deepseek',
    name: 'deepseek-coder',
    displayName: 'DeepSeek Coder',
    maxTokens: 4096,
    supportStream: true
  }
]

export class AIServiceManager {
  private services: Map<AIProvider, BaseAIService> = new Map()
  private defaultProvider: AIProvider = 'deepseek'

  constructor() {
    this.initializeServices()
  }

  private initializeServices() {
    // 初始化 DeepSeek 服务
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY
    if (deepseekApiKey) {
      this.services.set('deepseek', new DeepSeekService(deepseekApiKey))
    }
  }

  // 获取服务实例
  getService(provider?: AIProvider): BaseAIService {
    const targetProvider = provider || this.defaultProvider
    const service = this.services.get(targetProvider)
    
    if (!service) {
      throw new Error(`AI 服务未配置: ${targetProvider}`)
    }
    
    return service
  }

  // 获取可用模型列表
  getAvailableModels(): ModelConfig[] {
    return AVAILABLE_MODELS.filter(model => 
      this.services.has(model.provider)
    )
  }

  // 检查服务是否可用
  isServiceAvailable(provider: AIProvider): boolean {
    return this.services.has(provider)
  }

  // 聊天接口
  async chat(
    messages: ChatMessage[], 
    model: string = 'deepseek-chat',
    options: ChatOptions = {}
  ): Promise<ChatResponse> {
    const modelConfig = AVAILABLE_MODELS.find(m => m.name === model)
    if (!modelConfig) {
      throw new Error(`未知模型: ${model}`)
    }

    const service = this.getService(modelConfig.provider)
    return service.chat(messages, { ...options, model })
  }

  // 流式聊天接口
  async *streamChat(
    messages: ChatMessage[], 
    model: string = 'deepseek-chat',
    options: ChatOptions = {}
  ): AsyncIterable<StreamChunk> {
    const modelConfig = AVAILABLE_MODELS.find(m => m.name === model)
    if (!modelConfig) {
      throw new Error(`未知模型: ${model}`)
    }

    if (!modelConfig.supportStream) {
      throw new Error(`模型 ${model} 不支持流式输出`)
    }

    const service = this.getService(modelConfig.provider)
    yield* service.streamChat(messages, { ...options, model })
  }
}

// 单例模式
let aiManager: AIServiceManager | null = null

export function getAIManager(): AIServiceManager {
  if (!aiManager) {
    aiManager = new AIServiceManager()
  }
  return aiManager
} 