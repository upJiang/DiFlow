// 缓存机制，避免重复请求相同的查询
const searchCache = new Map<string, { timestamp: number; data: any }>();
// 缓存有效期 - 1小时（毫秒）
const CACHE_TTL = 60 * 60 * 1000;

// 定义搜索结果类型
interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
}

// 定义API响应类型
interface SearchResponse {
  answer: string;
  output: string;
  searchResults: SearchResult[];
}

// 定义Serper API响应类型
interface SerperApiResponse {
  organic?: Array<{
    title?: string;
    link?: string;
    snippet?: string;
    displayedLink?: string;
  }>;
}

/**
 * 使用网络搜索回答问题
 * @param {string} query 用户查询
 * @param {Object} options 选项
 * @returns {Promise<SearchResponse>} 包含答案和搜索结果的对象
 */
export async function getAnswerFromWebSearch(
  query: string,
  options: Record<string, any> = {}
): Promise<SearchResponse> {
  // 确保有API密钥
  const serperApiKey = process.env.SERPER_API_KEY;
  if (!serperApiKey) {
    console.error("缺少SERPER_API_KEY环境变量");
    return {
      answer: "无法执行网络搜索，未配置SERPER_API_KEY环境变量。",
      output: "无法执行网络搜索，未配置SERPER_API_KEY环境变量。",
      searchResults: [],
    };
  }

  // 缓存键 - 使用查询文本作为键
  const cacheKey = query.trim().toLowerCase();

  // 检查缓存
  if (searchCache.has(cacheKey)) {
    const cachedResult = searchCache.get(cacheKey);
    // 检查缓存是否过期
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
      console.log(`从缓存获取结果: "${query}"`);
      return cachedResult.data;
    } else {
      // 缓存过期，删除
      searchCache.delete(cacheKey);
    }
  }

  try {
    console.log(`执行网络搜索: "${query}"`);
    const startTime = Date.now();

    // 1. 获取搜索结果
    let searchResults: SearchResult[] = [];
    try {
      // 直接调用serper.dev API
      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": serperApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: query,
          gl: "cn",
          hl: "zh-cn",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP错误! 状态码: ${response.status}`);
      }

      const data: SerperApiResponse = await response.json();

      // 提取有用的搜索结果
      if (data.organic) {
        searchResults = data.organic.slice(0, 3).map(
          (item: any): SearchResult => ({
            title: item.title || "",
            link: item.link || "",
            snippet: item.snippet || "",
            displayLink: item.displayedLink || item.link || "",
          })
        );
      }

      console.log(
        `找到 ${searchResults.length} 个搜索结果 (${Date.now() - startTime}ms)`
      );
    } catch (searchError) {
      console.error("获取搜索结果失败:", searchError);
    }

    // 2. 使用简单的文本拼接来总结搜索结果
    if (searchResults.length > 0) {
      // 准备搜索结果上下文
      const searchContext = formatSearchResultsAsContext(searchResults);

      // 创建基于搜索结果的回答
      const answer = `${searchContext}

以上是我通过网络搜索找到的相关信息，希望对您有帮助。`;

      // 保存到缓存
      const result: SearchResponse = {
        answer,
        output: answer,
        searchResults: searchResults,
      };

      // 添加到缓存
      searchCache.set(cacheKey, {
        timestamp: Date.now(),
        data: result,
      });

      console.log(`生成答案完成，总耗时: ${Date.now() - startTime}ms`);
      return result;
    } else {
      const noResultsAnswer = "抱歉，我没有找到与您问题相关的搜索结果。";
      return {
        answer: noResultsAnswer,
        output: noResultsAnswer,
        searchResults: [],
      };
    }
  } catch (error: unknown) {
    console.error("网络搜索回答问题失败:", error);
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    return {
      answer: `我无法通过搜索回答此问题。错误: ${errorMessage}`,
      output: `我无法通过搜索回答此问题。错误: ${errorMessage}`,
      searchResults: [],
    };
  }
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
        displayLink: item.displayedLink || item.link || "",
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
来源: ${result.displayLink}
链接: ${result.link}
摘要: ${result.snippet}
`
    )
    .join("\n");
}
