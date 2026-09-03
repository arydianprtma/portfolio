const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function createFavicons() {
  const svgPath = path.join(__dirname, '../app/icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  // Generate PNGs of different sizes
  const sizes = [16, 32, 48, 64, 180, 192, 512];
  const pngBuffers = {};

  for (const size of sizes) {
    pngBuffers[size] = await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toBuffer();
  }

  // Save standalone PNGs
  fs.writeFileSync(path.join(__dirname, '../public/icon-192.png'), pngBuffers[192]);
  fs.writeFileSync(path.join(__dirname, '../public/icon-512.png'), pngBuffers[512]);
  fs.writeFileSync(path.join(__dirname, '../public/apple-touch-icon.png'), pngBuffers[180]);
  fs.writeFileSync(path.join(__dirname, '../public/apple-icon.png'), pngBuffers[180]);
  fs.writeFileSync(path.join(__dirname, '../public/icon.png'), pngBuffers[32]);

  // Build a multi-resolution ICO with 16, 32, 48
  const icoSizes = [16, 32, 48];
  const count = icoSizes.length;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(count, 4); // count

  let offset = 6 + count * 16;
  const dirEntries = [];
  const imageBuffers = [];

  for (const size of icoSizes) {
    const imgBuf = pngBuffers[size];
    imageBuffers.push(imgBuf);

    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0); // width
    entry.writeUInt8(size === 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(imgBuf.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset

    dirEntries.push(entry);
    offset += imgBuf.length;
  }

  const icoBuffer = Buffer.concat([header, ...dirEntries, ...imageBuffers]);

  // Write to both public/favicon.ico and app/favicon.ico
  fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(__dirname, '../app/favicon.ico'), icoBuffer);

  console.log('Successfully generated custom ARDP favicons and ico files in public and app directories!');
}

createFavicons().catch(err => {
  console.error(err);
  process.exit(1);
});
