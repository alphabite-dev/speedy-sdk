import fs from "fs";
import path from "path";

/**
 * Script to split large Speedy API documentation into smaller logical files
 */

const INPUT_FILE = "view-source_https___api.speedy.bg_api_docs_.html";
const OUTPUT_DIR = "docs/sections";

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log("Reading documentation file...");
const content = fs.readFileSync(INPUT_FILE, "utf-8");
const lines = content.split("\n");

console.log(`Total lines: ${lines.length}`);

// Find major sections based on HTML structure
const sections = [];
let currentSection = null;
let sectionContent = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Look for section markers - common patterns in API docs
  // H1, H2, H3 headers or major div sections
  const h1Match = line.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const h2Match = line.match(/<h2[^>]*>(.*?)<\/h2>/i);
  const h3Match = line.match(/<h3[^>]*>(.*?)<\/h3>/i);
  const sectionMatch = line.match(/<section[^>]*id=["']([^"']+)["']/i);
  const divIdMatch = line.match(/<div[^>]*id=["']([^"']+)["'][^>]*class=["'][^"']*section/i);

  if (h1Match || h2Match || sectionMatch || divIdMatch) {
    // Save previous section if exists
    if (currentSection && sectionContent.length > 0) {
      sections.push({
        name: currentSection,
        content: sectionContent.join("\n"),
        lineStart: i - sectionContent.length,
        lineEnd: i,
      });
    }

    // Start new section
    if (h1Match) {
      currentSection = h1Match[1].replace(/<[^>]+>/g, "").trim();
    } else if (h2Match) {
      currentSection = h2Match[1].replace(/<[^>]+>/g, "").trim();
    } else if (sectionMatch) {
      currentSection = sectionMatch[1];
    } else if (divIdMatch) {
      currentSection = divIdMatch[1];
    }

    sectionContent = [line];
  } else {
    sectionContent.push(line);
  }
}

// Save last section
if (currentSection && sectionContent.length > 0) {
  sections.push({
    name: currentSection,
    content: sectionContent.join("\n"),
    lineStart: lines.length - sectionContent.length,
    lineEnd: lines.length,
  });
}

console.log(`\nFound ${sections.length} sections:\n`);

// Create a sanitized filename from section name
function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 50);
}

// Save sections to files
const sectionIndex = [];
sections.forEach((section, index) => {
  const filename = `${String(index + 1).padStart(2, "0")}-${sanitizeFilename(section.name)}.html`;
  const filepath = path.join(OUTPUT_DIR, filename);

  fs.writeFileSync(filepath, section.content, "utf-8");

  sectionIndex.push({
    index: index + 1,
    name: section.name,
    filename: filename,
    lines: section.lineEnd - section.lineStart,
    lineStart: section.lineStart,
    lineEnd: section.lineEnd,
  });

  console.log(`  ${index + 1}. ${section.name} (${section.lineEnd - section.lineStart} lines) -> ${filename}`);
});

// Save index file
const indexContent = {
  sourceFile: INPUT_FILE,
  totalLines: lines.length,
  sectionsCount: sections.length,
  sections: sectionIndex,
};

fs.writeFileSync(path.join(OUTPUT_DIR, "00-index.json"), JSON.stringify(indexContent, null, 2), "utf-8");

console.log(`\n✓ Documentation split into ${sections.length} files in ${OUTPUT_DIR}/`);
console.log(`✓ Index saved to ${OUTPUT_DIR}/00-index.json`);
