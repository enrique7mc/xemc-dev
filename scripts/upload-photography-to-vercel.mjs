#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import path from "node:path";

const inputDir = process.argv[2] ?? "public/photography/images";
const prefix = process.argv[3] ?? "photography";
const cacheMaxAge = Number(process.env.CACHE_MAX_AGE ?? "31536000");
const blobRwToken = process.env.BLOB_READ_WRITE_TOKEN?.trim() ?? "";

const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

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

function resolveVercelCommand() {
  const local = spawnSync("vercel", ["--version"], { encoding: "utf8" });

  if (!local.error && local.status === 0) {
    return {
      command: "vercel",
      baseArgs: [],
      display: "vercel",
    };
  }

  return {
    command: "npx",
    baseArgs: ["-y", "vercel@latest"],
    display: "npx -y vercel@latest",
  };
}

function main() {
  if (!Number.isFinite(cacheMaxAge) || cacheMaxAge < 0) {
    throw new Error(`Invalid CACHE_MAX_AGE value: ${cacheMaxAge}`);
  }

  const files = readdirSync(inputDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .filter((entry) => supportedExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => path.join(inputDir, entry.name))
    .sort((left, right) =>
      path.basename(left).localeCompare(path.basename(right), "en", {
        numeric: true,
        sensitivity: "base",
      }),
    );

  if (files.length === 0) {
    throw new Error(`No image files found in ${inputDir}`);
  }

  const vercel = resolveVercelCommand();

  console.log(`Uploading ${files.length} files to Vercel Blob prefix '${prefix}/'...`);

  for (const filePath of files) {
    const fileName = path.basename(filePath);
    const remotePath = `${prefix}/${fileName}`;
    console.log(` -> ${remotePath}`);

    const args = [
      ...vercel.baseArgs,
      "blob",
      "put",
      filePath,
      "--pathname",
      remotePath,
      "--cache-control-max-age",
      String(cacheMaxAge),
      "--force",
    ];

    if (blobRwToken.length > 0) {
      args.push("--rw-token", blobRwToken);
    }

    run(vercel.command, args, {
      stdio: "inherit",
    });
  }

  console.log("");
  console.log("Upload complete.");
  console.log(`List files with: ${vercel.display} blob list --prefix "${prefix}/" --limit 1000`);
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(1);
}
