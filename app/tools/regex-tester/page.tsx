"use client";

import { useState, useEffect } from "react";

interface RegexMatch {
  match: string;
  index: number;
  groups?: string[];
}

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  // 常用正则表达式模板
  const regexTemplates = [
    {
      name: "邮箱地址",
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      testString: "user@example.com\ninvalid-email\ntest@domain.org",
    },
    {
      name: "手机号码",
      pattern: "^1[3-9]\\d{9}$",
      testString: "13812345678\n12345678901\n15987654321",
    },
    {
      name: "身份证号",
      pattern:
        "^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$",
      testString: "110101199001011234\n12345678901234567X\n110101200001011234",
    },
    {
      name: "IP地址",
      pattern: "^((25[0-5]|(2[0-4]|1\\d|[1-9]|)\\d)\\.?\\b){4}$",
      testString: "192.168.1.1\n256.256.256.256\n127.0.0.1",
    },
    {
      name: "URL链接",
      pattern:
        "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)",
      testString:
        "https://www.example.com\nhttp://test.org/path?param=value\ninvalid-url",
    },
    {
      name: "中文字符",
      pattern: "[\\u4e00-\\u9fa5]+",
      testString: "这是中文\nHello World\n混合中English文",
    },
  ];

  const testRegex = () => {
    if (!pattern) {
      setMatches([]);
      setError("");
      setIsValid(true);
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const results: RegexMatch[] = [];

      if (flags.includes("g")) {
        let match;
        while ((match = regex.exec(testString)) !== null) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (match.index === regex.lastIndex) {
            break;
          }
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      setMatches(results);
      setError("");
      setIsValid(true);
    } catch (err) {
      setError("正则表达式语法错误: " + (err as Error).message);
      setIsValid(false);
      setMatches([]);
    }
  };

  useEffect(() => {
    testRegex();
  }, [pattern, flags, testString]);

  const loadTemplate = (template: (typeof regexTemplates)[0]) => {
    setPattern(template.pattern);
    setTestString(template.testString);
    setFlags("gm");
  };

  const highlightMatches = (text: string, matches: RegexMatch[]) => {
    if (matches.length === 0) return text;

    let result = "";
    let lastIndex = 0;

    matches.forEach((match, i) => {
      result += text.slice(lastIndex, match.index);
      result += `<mark class="bg-yellow-200 px-1 rounded">${match.match}</mark>`;
      lastIndex = match.index + match.match.length;
    });

    result += text.slice(lastIndex);
    return result;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            正则表达式测试器
          </h1>
          <p className="text-xl text-gray-600">
            测试和验证正则表达式，实时查看匹配结果
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 正则表达式输入 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 正则表达式输入区 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                正则表达式
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">/</span>
                  <input
                    type="text"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="输入正则表达式..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <span className="text-gray-600">/</span>
                  <input
                    type="text"
                    value={flags}
                    onChange={(e) => setFlags(e.target.value)}
                    placeholder="flags"
                    className="w-16 p-3 border border-gray-300 rounded-lg font-mono text-sm text-center focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <label className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={flags.includes("g")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFlags((prev) =>
                            prev.includes("g") ? prev : prev + "g"
                          );
                        } else {
                          setFlags((prev) => prev.replace("g", ""));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600">全局匹配 (g)</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={flags.includes("i")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFlags((prev) =>
                            prev.includes("i") ? prev : prev + "i"
                          );
                        } else {
                          setFlags((prev) => prev.replace("i", ""));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600">
                      忽略大小写 (i)
                    </span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={flags.includes("m")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFlags((prev) =>
                            prev.includes("m") ? prev : prev + "m"
                          );
                        } else {
                          setFlags((prev) => prev.replace("m", ""));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600">多行模式 (m)</span>
                  </label>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 测试字符串输入区 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                测试字符串
              </h2>
              <textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="输入要测试的字符串..."
                className="w-full h-48 p-4 border border-gray-300 rounded-xl resize-none font-mono text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* 匹配结果 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  匹配结果 ({matches.length} 个匹配)
                </h2>
                {matches.length > 0 && (
                  <button
                    onClick={() =>
                      copyToClipboard(matches.map((m) => m.match).join("\n"))
                    }
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors relative"
                  >
                    📋 复制结果
                    {copySuccess && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        已复制到剪贴板
                      </div>
                    )}
                  </button>
                )}
              </div>

              {matches.length > 0 ? (
                <div className="space-y-4">
                  {/* 高亮显示 */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      高亮显示:
                    </h3>
                    <div
                      className="font-mono text-sm whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: highlightMatches(testString, matches),
                      }}
                    />
                  </div>

                  {/* 匹配详情 */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700">
                      匹配详情:
                    </h3>
                    {matches.map((match, index) => (
                      <div
                        key={index}
                        className="p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-mono text-sm bg-green-100 px-2 py-1 rounded">
                            {match.match}
                          </span>
                          <span className="text-xs text-gray-500">
                            位置: {match.index}-
                            {match.index + match.match.length}
                          </span>
                        </div>
                        {match.groups && match.groups.length > 0 && (
                          <div className="text-xs text-gray-600">
                            分组:{" "}
                            {match.groups.map((group, i) => (
                              <span key={i} className="mr-2">
                                ${i + 1}: "{group}"
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  {pattern ? "没有找到匹配项" : "请输入正则表达式开始测试"}
                </p>
              )}
            </div>
          </div>

          {/* 模板和帮助 */}
          <div className="space-y-6">
            {/* 常用模板 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                常用模板
              </h2>
              <div className="space-y-2">
                {regexTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => loadTemplate(template)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="font-medium text-gray-800">
                      {template.name}
                    </div>
                    <div className="text-xs text-gray-500 font-mono truncate">
                      {template.pattern}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 语法帮助 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                语法帮助
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-medium text-gray-700">字符类</div>
                  <div className="text-gray-600 font-mono text-xs">
                    . 任意字符
                    <br />
                    \d 数字
                    <br />
                    \w 字母数字下划线
                    <br />
                    \s 空白字符
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">量词</div>
                  <div className="text-gray-600 font-mono text-xs">
                    * 0次或多次
                    <br />
                    + 1次或多次
                    <br />
                    ? 0次或1次
                    <br />
                    {"{n}"} 恰好n次
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">锚点</div>
                  <div className="text-gray-600 font-mono text-xs">
                    ^ 行开始
                    <br />
                    $ 行结束
                    <br />
                    \b 单词边界
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
