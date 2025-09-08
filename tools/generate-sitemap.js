const fs = require("fs");
const path = require("path");

const routes = [
  {
    path: "/landing-page/home",
    lastmod: new Date().toISOString().split("T")[0],
    priority: 1.0,
    changefreq: "daily",
  },
  {
    path: "/landing-page/union",
    lastmod: new Date().toISOString().split("T")[0],
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/landing-page/news",
    lastmod: new Date().toISOString().split("T")[0],
    priority: 0.8,
    changefreq: "weekly",
  },
  {
    path: "/landing-page/Tourism-legislation",
    lastmod: new Date().toISOString().split("T")[0],
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/landing-page/contact-us",
    lastmod: new Date().toISOString().split("T")[0],
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/landing-page/training",
    lastmod: new Date().toISOString().split("T")[0],
    priority: 0.8,
    changefreq: "weekly",
  },
  {
    path: "/landing-page/diving-room",
    lastmod: new Date().toISOString().split("T")[0],
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/landing-page/eat-room",
    lastmod: new Date().toISOString().split("T")[0],
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/landing-page/product-room",
    lastmod: new Date().toISOString().split("T")[0],
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/landing-page/travel-room",
    lastmod: new Date().toISOString().split("T")[0],
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/landing-page/hotel-room",
    lastmod: new Date().toISOString().split("T")[0],
    priority: 0.7,
    changefreq: "monthly",
  },
];

function generateSitemap() {
  const baseUrl = "https://etf-egypt.com";

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  routes.forEach((route) => {
    sitemap += "  <url>\n";
    sitemap += `    <loc>${baseUrl}${route.path}</loc>\n`;
    sitemap += `    <lastmod>${route.lastmod}</lastmod>\n`;
    sitemap += `    <changefreq>${route.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${route.priority}</priority>\n`;
    sitemap += "  </url>\n";
  });

  sitemap += "</urlset>";

  return sitemap;
}

function main() {
  const sitemap = generateSitemap();
  const outputPath = path.join(
    __dirname,
    "../dist/etf-app/browser/sitemap.xml"
  );

  // Ensure the directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, sitemap, "utf8");
  console.log(`Sitemap generated at: ${outputPath}`);
}

main();
