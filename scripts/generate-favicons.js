/**
 * 生成favicon图标脚本
 * 创建DiFlow品牌的favicon文件
 */

const fs = require("fs");
const path = require("path");

/**
 * 创建favicon文件
 */
const createFavicon = () => {
  const publicDir = path.join(__dirname, "..", "public");

  // 确保public目录存在
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 创建主要的favicon.svg
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#8B5CF6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="bgGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:1" />
      <stop offset="80%" style="stop-color:#F8FAFC;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#E2E8F0;stop-opacity:1" />
    </radialGradient>
  </defs>
  
  <circle cx="16" cy="16" r="15" fill="url(#bgGradient)" stroke="url(#gradient)" stroke-width="1"/>
  <path d="M20 8L12 18h4v6l8-10h-4V8z" fill="url(#gradient)" stroke="none"/>
  <circle cx="16" cy="16" r="12" fill="none" stroke="url(#gradient)" stroke-width="0.5" opacity="0.3"/>
</svg>`;

  // 创建简化版本的图标（用于小尺寸）
  const createSimpleIcon = (size) => {
    const centerX = size / 2;
    const centerY = size / 2 + 0.5; // 微调垂直居中
    const fontSize = Math.max(8, size * 0.55); // 调整字体大小比例

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <linearGradient id="gradient${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#8B5CF6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="${size}" height="${size}" rx="${Math.max(
      2,
      size / 8
    )}" fill="url(#gradient${size})"/>
  <text x="${centerX}" y="${centerY}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">⚡</text>
</svg>`;
  };

  // 创建基本的ICO文件内容（简化版本）
  const createIcoContent = () => {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
  <defs>
    <linearGradient id="gradientIco" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#8B5CF6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="16" height="16" rx="2" fill="url(#gradientIco)"/>
  <text x="8" y="8.5" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">⚡</text>
</svg>`;
  };

  // 保存主favicon.svg
  fs.writeFileSync(path.join(publicDir, "favicon.svg"), faviconSvg);
  console.log("Generated favicon.svg");

  // 创建favicon.ico（使用SVG内容）
  const icoContent = createIcoContent();
  fs.writeFileSync(path.join(publicDir, "favicon.ico"), icoContent);
  console.log("Generated favicon.ico");

  // 生成不同尺寸的SVG图标
  const iconSizes = [
    { size: 16, name: "favicon-16x16.png" },
    { size: 32, name: "favicon-32x32.png" },
    { size: 180, name: "apple-touch-icon.png" },
  ];

  iconSizes.forEach(({ size, name }) => {
    const iconSvg = createSimpleIcon(size);
    // 对于PNG文件，我们暂时保存为SVG格式，实际部署时需要转换工具
    const svgName = name.replace(".png", ".svg");
    fs.writeFileSync(path.join(publicDir, svgName), iconSvg);
    console.log(`Generated ${svgName} (for ${name})`);
  });

  console.log("All favicon files generated successfully!");
  console.log(
    "Note: For production, consider converting SVG files to actual PNG/ICO formats using image conversion tools."
  );
};

// 运行生成函数
createFavicon();
