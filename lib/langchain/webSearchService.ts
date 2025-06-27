// 缓存机制，避免重复请求相同的查询
const searchCache = new Map<string, { timestamp: number; data: any }>();
// 缓存有效期 - 1小时（毫秒）
const CACHE_TTL = 60 * 60 * 1000;

/**
 * 聊天消息接口
 */
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * 搜索结果接口
 */
export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

/**
 * 搜索响应接口
 */
export interface SearchResponse {
  success: boolean;
  answer: string;
  sources: SearchResult[];
  searchResults?: SearchResult[];
  error?: string;
}

/**
 * Serper API 响应接口
 */
interface SerperApiResponse {
  organic: Array<{
    title: string;
    link: string;
    snippet: string;
  }>;
}

/**
 * 使用网络搜索回答问题（支持对话上下文）
 * @param {string} query 用户查询
 * @param {ChatMessage[]} conversationHistory 对话历史
 * @param {Object} options 选项
 * @returns {Promise<SearchResponse>} 包含答案和搜索结果的对象
 */
export async function getAnswerFromWebSearchWithContext(
  query: string,
  conversationHistory: ChatMessage[] = [],
  options: Record<string, any> = {}
): Promise<SearchResponse> {
  // 确保有API密钥
  const serperApiKey = process.env.SERPER_API_KEY;
  if (!serperApiKey) {
    console.error("缺少SERPER_API_KEY环境变量");
    return {
      success: false,
      answer: "无法执行网络搜索，未配置SERPER_API_KEY环境变量。",
      sources: [],
      error: "无法执行网络搜索，未配置SERPER_API_KEY环境变量。",
    };
  }

  // 构建包含上下文的搜索查询
  const contextualQuery = buildContextualQuery(query, conversationHistory);

  // 缓存键 - 使用原始查询和上下文哈希
  const cacheKey = `${query.trim().toLowerCase()}_${hashConversation(
    conversationHistory
  )}`;

  // 检查缓存
  if (searchCache.has(cacheKey)) {
    const cachedResult = searchCache.get(cacheKey);
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
      console.log(`从缓存获取结果: "${query}"`);
      return cachedResult.data;
    } else {
      searchCache.delete(cacheKey);
    }
  }

  try {
    console.log(`执行网络搜索: "${query}"`);
    console.log(`上下文查询: "${contextualQuery}"`);
    const startTime = Date.now();

    // 1. 获取搜索结果
    let searchResults: SearchResult[] = [];
    try {
      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": serperApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: contextualQuery, // 使用包含上下文的查询
          gl: "cn",
          hl: "zh-cn",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP错误! 状态码: ${response.status}`);
      }

      const data: SerperApiResponse = await response.json();

      if (data.organic) {
        searchResults = data.organic.slice(0, 3).map(
          (item: any): SearchResult => ({
            title: item.title || "",
            link: item.link || "",
            snippet: item.snippet || "",
          })
        );
      }

      console.log(
        `找到 ${searchResults.length} 个搜索结果 (${Date.now() - startTime}ms)`
      );
    } catch (searchError) {
      console.error("获取搜索结果失败:", searchError);
    }

    // 2. 结合对话历史和搜索结果生成回答
    if (searchResults.length > 0) {
      const searchContext = formatSearchResultsAsContext(searchResults);

      // 创建包含上下文的回答
      let answer = "";

      answer = searchContext;

      // 保存到缓存
      const result: SearchResponse = {
        success: true,
        answer,
        sources: searchResults,
        searchResults: searchResults,
      };

      searchCache.set(cacheKey, {
        timestamp: Date.now(),
        data: result,
      });

      console.log(`生成答案完成，总耗时: ${Date.now() - startTime}ms`);
      return result;
    } else {
      const noResultsAnswer = "抱歉，我没有找到与您问题相关的搜索结果。";
      return {
        success: true,
        answer: noResultsAnswer,
        sources: [],
        error: noResultsAnswer,
      };
    }
  } catch (error: unknown) {
    console.error("网络搜索回答问题失败:", error);
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    return {
      success: false,
      answer: `我无法通过搜索回答此问题。错误: ${errorMessage}`,
      sources: [],
      error: `我无法通过搜索回答此问题。错误: ${errorMessage}`,
    };
  }
}

/**
 * 构建包含上下文的搜索查询
 * @param {string} currentQuery 当前查询
 * @param {ChatMessage[]} history 对话历史
 * @returns {string} 上下文化的查询
 */
function buildContextualQuery(
  currentQuery: string,
  history: ChatMessage[]
): string {
  if (!history || history.length === 0) {
    return currentQuery;
  }

  // 获取最近的对话内容作为上下文
  const recentMessages = history.slice(-4); // 最近4条消息
  const contextKeywords: string[] = [];

  recentMessages.forEach((msg) => {
    if (msg.role === "user" || msg.role === "assistant") {
      // 提取关键词（简单实现）
      const words = msg.content
        .split(/\s+/)
        .filter(
          (word) =>
            word.length > 2 &&
            !["什么", "怎么", "为什么", "如何", "请问"].includes(word)
        );
      contextKeywords.push(...words.slice(0, 3)); // 每条消息最多3个关键词
    }
  });

  // 去重并限制关键词数量
  const uniqueKeywords = Array.from(new Set(contextKeywords)).slice(0, 5);

  if (uniqueKeywords.length > 0) {
    return `${currentQuery} ${uniqueKeywords.join(" ")}`;
  }

  return currentQuery;
}

/**
 * 格式化对话历史
 * @param {ChatMessage[]} history 对话历史
 * @returns {string} 格式化的对话历史
 */
function formatConversationHistory(history: ChatMessage[]): string {
  if (!history || history.length === 0) {
    return "";
  }

  const recentHistory = history.slice(-6); // 最近6条消息
  return recentHistory
    .filter((msg) => msg.role !== "system")
    .map((msg) => {
      const role = msg.role === "user" ? "用户" : "AI";
      return `${role}: ${msg.content}`;
    })
    .join("\n");
}

/**
 * 生成对话历史的哈希值用于缓存
 * @param {ChatMessage[]} history 对话历史
 * @returns {string} 哈希值
 */
function hashConversation(history: ChatMessage[]): string {
  if (!history || history.length === 0) {
    return "no_context";
  }

  const recentHistory = history.slice(-4);
  const contextString = recentHistory
    .map((msg) => `${msg.role}:${msg.content}`)
    .join("|");

  // 简单哈希函数
  let hash = 0;
  for (let i = 0; i < contextString.length; i++) {
    const char = contextString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 转换为32位整数
  }

  return hash.toString();
}

/**
 * 使用网络搜索回答问题（原有函数，保持向后兼容）
 * @param {string} query 用户查询
 * @param {Object} options 选项
 * @returns {Promise<SearchResponse>} 包含答案和搜索结果的对象
 */
export async function getAnswerFromWebSearch(
  query: string,
  options: Record<string, any> = {}
): Promise<SearchResponse> {
  return getAnswerFromWebSearchWithContext(query, [], options);
}

/**
 * 使用Serper API执行网络搜索
 * @param {string} query 查询文本
 * @param {number} maxResults 最大结果数
 * @returns {Promise<SearchResult[]>} 搜索结果数组
 */
export async function searchWeb(
  query: string,
  maxResults: number = 3
): Promise<SearchResult[]> {
  if (!query || query.trim().length === 0) {
    throw new Error("查询内容为空");
  }

  // 使用环境变量中的API密钥
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    throw new Error("未设置SERPER_API_KEY环境变量");
  }

  try {
    console.log(`使用Serper执行网络搜索: "${query}"`);

    // 直接调用serper.dev API
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: query,
        gl: "cn",
        hl: "zh-cn",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const searchData: SerperApiResponse = await response.json();

    // 兼容不同的结果结构
    const organic = searchData?.organic || [];

    if (!organic || organic.length === 0) {
      console.log("未找到搜索结果");
      return [];
    }

    // 格式化返回结果
    const results: SearchResult[] = organic.slice(0, maxResults).map(
      (item: any): SearchResult => ({
        title: item.title || "",
        link: item.link || "",
        snippet: item.snippet || "",
      })
    );

    console.log(`找到 ${results.length} 个搜索结果`);
    return results;
  } catch (error) {
    console.error("网络搜索失败:", error);
    throw error;
  }
}

/**
 * 将搜索结果格式化为上下文字符串
 * @param {SearchResult[]} searchResults 搜索结果数组
 * @returns {string} 格式化后的上下文
 */
export function formatSearchResultsAsContext(
  searchResults: SearchResult[]
): string {
  if (!searchResults || searchResults.length === 0) {
    return "";
  }

  return searchResults
    .map(
      (result: SearchResult, index: number) => `[${index + 1}] ${result.title}
来源: ${result.link}
链接: ${result.link}
摘要: ${result.snippet}
`
    )
    .join("\n");
}
