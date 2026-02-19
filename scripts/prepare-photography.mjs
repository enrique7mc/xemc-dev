#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const sourceDir = process.argv[2] ?? "/Users/oem/Documents/Photo Portfolio";
const outputDir = process.argv[3] ?? "public/photography/images";
const dataFile = process.argv[4] ?? "src/data/photography.ts";

const maxEdge = Number(process.env.MAX_EDGE ?? "2600");
const jpegQuality = Number(process.env.JPEG_QUALITY ?? "82");
const cleanOutput = process.env.CLEAN_OUTPUT !== "0";
const randomizeOrder = process.env.RANDOMIZE_ORDER !== "0";
const blobBaseUrl = (process.env.BLOB_BASE_URL ?? "").trim().replace(/\/+$/, "");

const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".heic", ".heif", ".webp"]);
const outputExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    ...options,
  });

  if (result.error) {
    throw new Error(`${command} failed: ${result.error.message}`);
  }

  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join("\n");
    throw new Error(`${command} exited with status ${result.status}\n${output}`);
  }

  return result;
}

function assertSipsAvailable() {
  try {
    run("sips", ["--help"]);
  } catch {
    throw new Error("sips is required but not available.");
  }
}

function slugify(input) {
  const slug = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "photo";
}

function toTitleCase(input) {
  return input
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function tsEscape(input) {
  return input.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function shuffle(items) {
  const clone = [...items];

  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }

  return clone;
}

function toWebPath(filePath) {
  const normalized = filePath.replace(/\\/g, "/");

  if (normalized.startsWith("public/")) {
    return `/${normalized.slice("public/".length)}`;
  }

  const marker = "/public/";
  const markerIndex = normalized.indexOf(marker);

  if (markerIndex >= 0) {
    return normalized.slice(markerIndex + "/public".length);
  }

  return normalized;
}

function resolveImageSrc(outputPath, outputName) {
  if (blobBaseUrl.length > 0) {
    return `${blobBaseUrl}/${outputName}`;
  }

  return toWebPath(outputPath);
}

function getDimensions(filePath) {
  const result = run("sips", ["-g", "pixelWidth", "-g", "pixelHeight", filePath]);
  const widthMatch = result.stdout.match(/pixelWidth:\s+(\d+)/);
  const heightMatch = result.stdout.match(/pixelHeight:\s+(\d+)/);

  if (!widthMatch || !heightMatch) {
    throw new Error(`Failed to read image dimensions for ${filePath}`);
  }

  return {
    width: Number(widthMatch[1]),
    height: Number(heightMatch[1]),
  };
}

function buildEntry(entry) {
  return `  {
    id: '${tsEscape(entry.id)}',
    src: '${tsEscape(entry.src)}',
    alt: '${tsEscape(entry.alt)}',
    width: ${entry.width},
    height: ${entry.height},
    title: '${tsEscape(entry.title)}',
    takenAt: '${entry.takenAt}',
    location: 'Replace location',
  },`;
}

function main() {
  assertSipsAvailable();

  if (!Number.isFinite(maxEdge) || maxEdge <= 0) {
    throw new Error(`Invalid MAX_EDGE value: ${maxEdge}`);
  }

  if (!Number.isFinite(jpegQuality) || jpegQuality < 1 || jpegQuality > 100) {
    throw new Error(`Invalid JPEG_QUALITY value: ${jpegQuality}`);
  }

  if (blobBaseUrl.length > 0) {
    try {
      new URL(blobBaseUrl);
    } catch {
      throw new Error(`Invalid BLOB_BASE_URL value: ${blobBaseUrl}`);
    }
  }

  const sourceEntries = readdirSync(sourceDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .filter((entry) => supportedExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => path.join(sourceDir, entry.name))
    .sort((left, right) =>
      path.basename(left).localeCompare(path.basename(right), "en", {
        numeric: true,
        sensitivity: "base",
      }),
    );

  if (sourceEntries.length === 0) {
    throw new Error(`No supported image files found in ${sourceDir}`);
  }

  const sourceFiles = randomizeOrder ? shuffle(sourceEntries) : sourceEntries;

  mkdirSync(outputDir, { recursive: true });
  mkdirSync(path.dirname(dataFile), { recursive: true });

  if (cleanOutput) {
    const outputEntries = readdirSync(outputDir, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .filter((entry) => outputExtensions.has(path.extname(entry.name).toLowerCase()))
      .map((entry) => path.join(outputDir, entry.name));

    for (const filePath of outputEntries) {
      rmSync(filePath);
    }
  }

  const slugCountMap = new Map();
  const entries = [];

  for (const sourcePath of sourceFiles) {
    const baseName = path.basename(sourcePath);
    const stem = baseName.replace(path.extname(baseName), "");
    const slugBase = slugify(stem);
    const seenCount = (slugCountMap.get(slugBase) ?? 0) + 1;
    slugCountMap.set(slugBase, seenCount);

    const slug = seenCount > 1 ? `${slugBase}-${seenCount}` : slugBase;
    const outputName = `${slug}.jpg`;
    const outputPath = path.join(outputDir, outputName);

    run("sips", [
      "-s",
      "format",
      "jpeg",
      "-s",
      "formatOptions",
      String(jpegQuality),
      "-Z",
      String(maxEdge),
      sourcePath,
      "--out",
      outputPath,
    ]);

    const { width, height } = getDimensions(outputPath);
    const title = toTitleCase(stem);
    const stat = statSync(sourcePath);

    entries.push(
      buildEntry({
        id: slug,
        src: resolveImageSrc(outputPath, outputName),
        alt: `${title} photograph.`,
        width,
        height,
        title,
        takenAt: stat.mtime.toISOString().slice(0, 10),
      }),
    );
  }

  const fileContent = `export type PhotographyPhoto = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  title: string;
  takenAt: string;
  location?: string;
  note?: string;
};

export const photographyPhotos: PhotographyPhoto[] = [
${entries.join("\n")}
];
`;

  writeFileSync(dataFile, fileContent, "utf8");

  console.log(`Prepared ${entries.length} images.`);
  console.log(`Processed files: ${outputDir}`);
  console.log(`Generated data file: ${dataFile}`);
  console.log(`Order: ${randomizeOrder ? "randomized" : "filename order"}`);
  console.log(`Src mode: ${blobBaseUrl.length > 0 ? `blob (${blobBaseUrl})` : "local public path"}`);
  console.log("");
  console.log("Next:");
  console.log(`1) Review and edit titles/locations in ${dataFile}`);
  if (blobBaseUrl.length === 0) {
    console.log(`2) Upload files with: npm run photos:upload -- "${outputDir}" "photography"`);
    console.log(
      "3) Optional: rerun with BLOB_BASE_URL to write Blob URLs directly into the data file",
    );
  } else {
    console.log("2) Deploy when ready");
  }
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(1);
}
