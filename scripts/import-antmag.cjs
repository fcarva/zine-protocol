#!/usr/bin/env node

const fs = require("node:fs/promises");
const fssync = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");

const projectRoot = process.cwd();
const antmagFetchDir = path.join(projectRoot, "antmag_fetch");
const contentDir = path.join(projectRoot, "content", "zines");
const imageRootDir = path.join(projectRoot, "public", "images", "zines", "antmag");

try {
  const { Agent, setGlobalDispatcher } = require("undici");
  setGlobalDispatcher(
    new Agent({
      headersTimeout: 60_000,
      bodyTimeout: 180_000,
    }),
  );
} catch {
  // Fallback for environments where undici is unavailable as a standalone module.
}

function toSlug(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function yamlString(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function normalizeTextLine(value) {
  return decodeHtml(value)
    .replace(/\{image\s+\d+\}/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractJsonScript(html, dataSet) {
  const pattern = new RegExp(
    `<script type="text/json" data-set="${dataSet}" >(.*?)<\\/script>`,
    "s",
  );
  const match = html.match(pattern);
  if (!match) return null;
  return JSON.parse(match[1]);
}

function extractCurrentPage(html, fallbackProjectUrl) {
  const defaults = extractJsonScript(html, "defaults");
  const scaffolding = extractJsonScript(html, "ScaffoldingData");
  if (!scaffolding || !Array.isArray(scaffolding.pages)) return null;

  const byPid =
    defaults && defaults.direct_link_pid
      ? scaffolding.pages.find((page) => String(page.id) === String(defaults.direct_link_pid))
      : null;
  if (byPid) return byPid;

  return (
    scaffolding.pages.find((page) => page.project_url === fallbackProjectUrl) ||
    scaffolding.pages.find((page) => toSlug(page.project_url || "") === toSlug(fallbackProjectUrl))
  );
}

function extractContextLines(page) {
  const chunks = [
    page.title_no_html || "",
    page.excerpt || "",
    page.content_no_html || "",
  ];

  const seen = new Set();
  const lines = [];

  for (const chunk of chunks) {
    const rawLines = String(chunk)
      .split(/\r?\n+/)
      .map(normalizeTextLine)
      .filter(Boolean);

    for (const line of rawLines) {
      const lowered = line.toLowerCase();
      if (
        lowered.includes("{image") ||
        lowered === "zines" ||
        lowered === "info" ||
        lowered === "cart" ||
        lowered.includes("show_cart")
      ) {
        continue;
      }

      const dedupeKey = lowered.replace(/\s+/g, " ");
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      lines.push(line);
      if (lines.length >= 10) return lines;
    }
  }

  return lines;
}

function readIntField(markdown, fieldName) {
  const match = markdown.match(new RegExp(`^${fieldName}:\\s*(\\d+)\\s*$`, "m"));
  return match ? Number(match[1]) : null;
}

async function getCurrentMaxValues() {
  const entries = await fs.readdir(contentDir, { withFileTypes: true });
  let maxSortOrder = 0;
  let maxRevnetProject = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const filePath = path.join(contentDir, entry.name, "index.md");
    if (!fssync.existsSync(filePath)) continue;
    const markdown = await fs.readFile(filePath, "utf8");
    const parsed = matter(markdown);
    const sortOrder = Number(parsed.data.sort_order || readIntField(markdown, "sort_order") || 0);
    const revnet = Number(
      parsed.data.revnet_project_id || readIntField(markdown, "revnet_project_id") || 0,
    );
    maxSortOrder = Math.max(maxSortOrder, sortOrder);
    maxRevnetProject = Math.max(maxRevnetProject, revnet);
  }

  return { maxSortOrder, maxRevnetProject };
}

function buildWallet(index) {
  const hex = (0xabc000 + index).toString(16);
  return `0x${hex.padStart(40, "0")}`;
}

function buildImageFileName(name, index) {
  const originalExt = path.extname(name || "").toLowerCase();
  const ext =
    originalExt && /^[.][a-z0-9]{2,5}$/.test(originalExt) ? originalExt : ".jpg";
  const baseName = toSlug(path.basename(name || `pagina-${index + 1}`, originalExt)) || `pagina-${index + 1}`;
  return `${String(index + 1).padStart(2, "0")}-${baseName}${ext}`;
}

async function downloadImage(url, destination) {
  if (fssync.existsSync(destination)) {
    return false;
  }

  const retries = 3;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        cache: "no-store",
        signal: AbortSignal.timeout(180_000),
      });
      if (!response.ok) {
        throw new Error(`Falha ao baixar ${url}: ${response.status}`);
      }

      const bytes = Buffer.from(await response.arrayBuffer());
      await fs.writeFile(destination, bytes);
      return true;
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, attempt * 1_000));
    }
  }

  return false;
}

async function importAntmagPages() {
  const files = (await fs.readdir(antmagFetchDir))
    .filter((name) => name.endsWith(".html"))
    .sort((a, b) => a.localeCompare(b));

  const { maxSortOrder, maxRevnetProject } = await getCurrentMaxValues();
  let nextSort = maxSortOrder + 1;
  let nextRevnet = Math.max(500, maxRevnetProject + 1);

  let imported = 0;
  let downloadedImages = 0;
  let failedImages = 0;
  const skipped = [];

  for (const fileName of files) {
    const sourcePath = path.join(antmagFetchDir, fileName);
    const html = await fs.readFile(sourcePath, "utf8");
    const projectUrl = fileName.replace(/\.html$/i, "");
    const page = extractCurrentPage(html, projectUrl);

    if (!page || !Array.isArray(page.images) || page.images.length === 0) {
      skipped.push(projectUrl);
      continue;
    }

    const slug = toSlug(projectUrl);
    const title = normalizeTextLine(page.title_no_html || page.title || slug) || slug;
    const contextLines = extractContextLines(page);
    const artistName = normalizeTextLine(page.title_no_html || page.title || title) || title;

    const excerpt =
      contextLines.slice(0, 3).join(" / ").slice(0, 220) ||
      `Edicao aberta do arquivo antmag: ${title}.`;

    const sortedImages = [...page.images].sort((a, b) => {
      const sortA = Number(a.sort || 0);
      const sortB = Number(b.sort || 0);
      if (sortA !== sortB) return sortA - sortB;
      return Number(a.id || 0) - Number(b.id || 0);
    });

    const imageDir = path.join(imageRootDir, slug);
    await fs.mkdir(imageDir, { recursive: true });

    const manifest = [];
    for (let index = 0; index < sortedImages.length; index += 1) {
      const image = sortedImages[index];
      if (!image.hash) continue;
      const file = buildImageFileName(image.name || `pagina-${index + 1}.jpg`, index);
      const destination = path.join(imageDir, file);
      const remoteName = encodeURIComponent(image.name || file).replace(/%2F/g, "/");
      const url = `https://freight.cargo.site/t/original/i/${image.hash}/${remoteName}`;

      try {
        const wasDownloaded = await downloadImage(url, destination);
        if (wasDownloaded) {
          downloadedImages += 1;
        }
      } catch (error) {
        failedImages += 1;
        console.warn(`Falha no download (${slug}): ${url}`);
        continue;
      }

      manifest.push({
        index: index + 1,
        id: image.id,
        hash: image.hash,
        name: image.name || file,
        width: image.width || null,
        height: image.height || null,
        source: url,
        localPath: `/images/zines/antmag/${slug}/${file}`,
      });
    }

    if (manifest.length === 0) {
      skipped.push(projectUrl);
      continue;
    }

    await fs.writeFile(
      path.join(imageDir, "manifest.json"),
      JSON.stringify(
        {
          sourcePage: `https://antmagjpg.com/${projectUrl}`,
          title,
          imageCount: manifest.length,
          images: manifest,
        },
        null,
        2,
      ),
    );

    const contentLines = [];
    contentLines.push("## Contexto editorial");
    if (contextLines.length > 0) {
      for (const line of contextLines) {
        contentLines.push(`- ${line}`);
      }
    } else {
      contentLines.push("- Edicao importada do arquivo antmag.");
    }
    contentLines.push("");
    contentLines.push("## Paginas abertas");
    contentLines.push("");
    for (let index = 0; index < manifest.length; index += 1) {
      const item = manifest[index];
      contentLines.push(`![${title} pagina ${String(index + 1).padStart(2, "0")}](${item.localPath})`);
      contentLines.push("");
    }

    const markdown = `---
slug: "${yamlString(slug)}"
title: "${yamlString(title)}"
artist_name: "${yamlString(artistName)}"
artist_wallet: "${buildWallet(nextSort)}"
cover_image: "${manifest[0].localPath}"
excerpt: "${yamlString(excerpt)}"
tags:
  - "antmag"
  - "zine"
  - "arquivo"
revnet_project_id: ${nextRevnet}
funding_mode: "continuous"
status: "published"
sort_order: ${nextSort}
---

${contentLines.join("\n")}
`;

    const zineDir = path.join(contentDir, slug);
    await fs.mkdir(zineDir, { recursive: true });
    await fs.writeFile(path.join(zineDir, "index.md"), markdown, "utf8");

    imported += 1;
    nextSort += 1;
    nextRevnet += 1;
  }

  console.log(
    JSON.stringify(
      {
        imported,
        downloadedImages,
        failedImages,
        skipped,
      },
      null,
      2,
    ),
  );
}

importAntmagPages().catch((error) => {
  console.error(error);
  process.exit(1);
});
