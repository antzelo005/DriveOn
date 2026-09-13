import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const source = process.argv[2];
if (!source)
  throw new Error(
    "Pass the directory containing the original generated photographs.",
  );
await mkdir("public/images", { recursive: true });
const images = [
  ["exec-9a337caf-e36c-4ba4-8496-a21a7850d709.png", "driveon-car"],
  ["exec-b205d20f-380c-4022-a5c6-5902a99231ac.png", "driveon-team"],
  ["exec-0c8e43c3-a5b0-46a6-aea5-7a9a368640f9.png", "driveon-motorcycle"],
];
for (const [file, name] of images) {
  await sharp(`${source}/${file}`)
    .resize(1536, 1024, { fit: "inside" })
    .webp({ quality: 82 })
    .toFile(`public/images/${name}.webp`);
  await sharp(`${source}/${file}`)
    .resize(1536, 1024, { fit: "inside" })
    .avif({ quality: 55, effort: 6 })
    .toFile(`public/images/${name}.avif`);
}
await sharp(`${source}/${images[0][0]}`)
  .resize(768)
  .webp({ quality: 80 })
  .toFile("public/images/driveon-car-small.webp");
await sharp(`${source}/${images[0][0]}`)
  .resize(768)
  .avif({ quality: 55, effort: 6 })
  .toFile("public/images/driveon-car-small.avif");
// Optional separately designed social card; do not overwrite it with a plain crop.
if (process.argv[3])
  await sharp(process.argv[3])
    .resize(1200, 630, { fit: "cover" })
    .jpeg({ quality: 84 })
    .toFile("public/images/social.jpg");
