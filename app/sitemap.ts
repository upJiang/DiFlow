import { MetadataRoute } from "next";

/**
 * 生成网站地图
 * @returns 网站地图配置
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://diflow.ai";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cursor-mcp`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // 可以根据实际页面添加更多URL
  ];
}
