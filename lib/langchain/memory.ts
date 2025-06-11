import { BufferMemory } from "langchain/memory";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";

interface SessionMemory {
  memory: BufferMemory;
  history: ChatMessageHistory;
  lastUsed: Date;
}

// 会话记忆存储
const sessionMemories = new Map<string, SessionMemory>();

// 自动清理间隔（30分钟）
const CLEANUP_INTERVAL = 30 * 60 * 1000;
// 会话过期时间（2小时）
const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;

/**
 * 获取会话记忆实例
 * @param sessionId 会话ID
 * @returns 会话记忆实例
 */
export function getMemoryForSession(sessionId: string): BufferMemory {
  if (!sessionId) {
    throw new Error("会话ID不能为空");
  }

  let sessionMemory = sessionMemories.get(sessionId);

  if (!sessionMemory) {
    const history = new ChatMessageHistory();
    const memory = new BufferMemory({
      chatHistory: history,
      memoryKey: "chat_history",
      returnMessages: true,
      inputKey: "question",
      outputKey: "answer",
    });

    sessionMemory = {
      memory,
      history,
      lastUsed: new Date(),
    };

    sessionMemories.set(sessionId, sessionMemory);
    console.log(`创建新的会话记忆: ${sessionId}`);
  } else {
    sessionMemory.lastUsed = new Date();
  }

  return sessionMemory.memory;
}

/**
 * 添加消息到会话记忆
 * @param sessionId 会话ID
 * @param userMessage 用户消息
 * @param aiMessage AI回复
 */
export async function addToMemory(
  sessionId: string,
  userMessage: string,
  aiMessage: string
): Promise<void> {
  const memory = getMemoryForSession(sessionId);

  await memory.saveContext({ question: userMessage }, { answer: aiMessage });
}

/**
 * 获取格式化的历史记录
 * @param sessionId 会话ID
 * @returns 格式化的历史记录文本
 */
export async function getFormattedHistory(sessionId: string): Promise<string> {
  const sessionMemory = sessionMemories.get(sessionId);

  if (!sessionMemory) {
    return "";
  }

  const messages = await sessionMemory.history.getMessages();

  return messages
    .map((msg, index) => {
      const role = msg._getType() === "human" ? "用户" : "助手";
      return `${role}: ${msg.content}`;
    })
    .join("\n");
}

/**
 * 清除会话记忆
 * @param sessionId 会话ID
 */
export function clearMemory(sessionId: string): void {
  if (sessionMemories.has(sessionId)) {
    sessionMemories.delete(sessionId);
    console.log(`清除会话记忆: ${sessionId}`);
  }
}

/**
 * 清理过期的会话记忆
 */
function cleanupExpiredSessions(): void {
  const now = new Date();
  const expiredSessions: string[] = [];

  Array.from(sessionMemories.entries()).forEach(
    ([sessionId, sessionMemory]) => {
      if (now.getTime() - sessionMemory.lastUsed.getTime() > SESSION_TIMEOUT) {
        expiredSessions.push(sessionId);
      }
    }
  );

  expiredSessions.forEach((sessionId) => {
    sessionMemories.delete(sessionId);
    console.log(`自动清理过期会话: ${sessionId}`);
  });

  if (expiredSessions.length > 0) {
    console.log(`清理了 ${expiredSessions.length} 个过期会话`);
  }
}

// 启动自动清理定时器
setInterval(cleanupExpiredSessions, CLEANUP_INTERVAL);

/**
 * 获取会话记忆（别名函数，用于API兼容）
 * @param sessionId 会话ID
 * @returns 会话记忆实例
 */
export function getSessionMemory(sessionId: string): BufferMemory {
  return getMemoryForSession(sessionId);
}

/**
 * 获取会话统计信息
 * @param sessionId 会话ID
 * @returns 会话统计信息
 */
export async function getSessionStats(sessionId: string): Promise<{
  messageCount: number;
  lastUsed: Date | null;
  exists: boolean;
}> {
  const sessionMemory = sessionMemories.get(sessionId);

  if (!sessionMemory) {
    return {
      messageCount: 0,
      lastUsed: null,
      exists: false,
    };
  }

  const messages = await sessionMemory.history.getMessages();

  return {
    messageCount: messages.length,
    lastUsed: sessionMemory.lastUsed,
    exists: true,
  };
}
