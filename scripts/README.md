# Photography Scripts

This folder contains helper scripts for the `/photography` section.

## What these scripts do

`prepare-photography.mjs`
- Reads originals from a source folder.
- Converts/resizes images to web JPEGs.
- Writes processed files to `public/photography/images`.
- Regenerates `src/data/photography.ts` with dimensions and metadata placeholders.
- Randomizes order by default.
- Can write either local paths or Blob URLs into `src/data/photography.ts`.

`upload-photography-to-vercel.mjs`
- Uploads processed files to Vercel Blob.
- Uploads under a prefix (default `photography/`).
- Overwrites existing files with the same pathname.

## Requirements

- macOS (uses `sips` for image processing).
- Node.js (project runtime).
- Vercel account and Blob store for uploads.

## NPM commands

From project root:

```bash
npm run photos:prepare -- "/path/to/source/folder"
npm run photos:upload -- "public/photography/images" "photography"
```

## Full replace workflow (recommended)

1. Prepare images and generate data file with Blob URLs:

```bash
BLOB_BASE_URL="https://<your-store>.public.blob.vercel-storage.com/photography" \
npm run photos:prepare -- "/Users/oem/Documents/Photo Portfolio"
```

2. Upload processed files:

```bash
BLOB_READ_WRITE_TOKEN="your_rw_token" \
npm run photos:upload -- "public/photography/images" "photography"
```

3. Deploy.

## Environment variables

`prepare-photography.mjs`
- `MAX_EDGE` default `2600`  
  Longest side in pixels after resize.
- `JPEG_QUALITY` default `82`  
  JPEG compression quality (1-100).
- `CLEAN_OUTPUT` default `1`  
  `1` deletes previous processed files in output folder before writing.
- `RANDOMIZE_ORDER` default `1`  
  `1` shuffles image order before generating `src/data/photography.ts`.
- `BLOB_BASE_URL` default empty  
  If set, generated `src` values use this URL base (instead of local `/photography/images/...`).

`upload-photography-to-vercel.mjs`
- `BLOB_READ_WRITE_TOKEN` default empty  
  If set, passed to `vercel blob put --rw-token ...`.
- `CACHE_MAX_AGE` default `31536000`  
  Cache max-age in seconds for uploaded files.

## Script arguments

`prepare-photography.mjs`

```bash
node scripts/prepare-photography.mjs [sourceDir] [outputDir] [dataFile]
```

Defaults:
- `sourceDir`: `/Users/oem/Documents/Photo Portfolio`
- `outputDir`: `public/photography/images`
- `dataFile`: `src/data/photography.ts`

`upload-photography-to-vercel.mjs`

```bash
node scripts/upload-photography-to-vercel.mjs [inputDir] [prefix]
```

Defaults:
- `inputDir`: `public/photography/images`
- `prefix`: `photography`

## Notes

- Filenames are slugified (example: `Portfolio - 1 of 30.jpeg` -> `portfolio-1-of-30.jpg`).
- If filenames change between runs, old Blob files are not automatically deleted.
- `takenAt` in generated data currently uses file modified time.
