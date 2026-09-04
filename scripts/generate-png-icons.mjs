import fs from 'fs';
import zlib from 'zlib';

function createCrcTable() {
  const cTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    cTable[n] = c;
  }
  return cTable;
}

const crcTable = createCrcTable();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const toCrc = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(toCrc);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, toCrc, crcBuf]);
}

function generatePng(width, height, isMaskable = false) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Raw RGBA scanlines with filter byte 0
  const stride = width * 4;
  const rawData = Buffer.alloc(height * (stride + 1));

  const cx = width / 2;
  const cy = height / 2;
  const scale = width / 100;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (stride + 1);
    rawData[rowOffset] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Base Rose background
      // Gradient from top-left to bottom-right
      const t = (x + y) / (width + height);
      let r = Math.round(251 - t * (251 - 225)); // #fb7185 to #e11d48
      let g = Math.round(113 - t * (113 - 29));
      let b = Math.round(133 - t * (133 - 72));
      let a = 255;

      // Heart / Flower emblem in center
      // Normalize coordinates to -30 .. +30
      const emblemScale = isMaskable ? 0.38 : 0.45;
      const nx = (x - cx) / (width * emblemScale);
      const ny = (y - cy + (isMaskable ? 0 : height * 0.03)) / (height * emblemScale);

      // Heart equation: (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0
      // Invert Y because screen y is downwards
      const hx = nx * 1.35;
      const hy = -ny * 1.35 + 0.15;
      const f = Math.pow(hx * hx + hy * hy - 1, 3) - hx * hx * Math.pow(hy, 3);

      if (f <= 0) {
        // Inner droplet cut / center dot
        const distCenter = Math.sqrt(nx * nx + (ny + 0.1) * (ny + 0.1));
        if (distCenter < 0.28) {
          // Central droplet / core
          r = 244; g = 63; b = 94; // #f43f5e
        } else {
          // Heart shape in pure white
          r = 255; g = 255; b = 255;
        }
      }

      // Rounded corners for non-maskable icons
      if (!isMaskable) {
        const cornerRadius = width * 0.22;
        let inCorner = false;
        let cornerDist = 0;

        if (x < cornerRadius && y < cornerRadius) {
          cornerDist = Math.hypot(x - cornerRadius, y - cornerRadius);
          inCorner = true;
        } else if (x > width - cornerRadius && y < cornerRadius) {
          cornerDist = Math.hypot(x - (width - cornerRadius), y - cornerRadius);
          inCorner = true;
        } else if (x < cornerRadius && y > height - cornerRadius) {
          cornerDist = Math.hypot(x - cornerRadius, y - (height - cornerRadius));
          inCorner = true;
        } else if (x > width - cornerRadius && y > height - cornerRadius) {
          cornerDist = Math.hypot(x - (width - cornerRadius), y - (height - cornerRadius));
          inCorner = true;
        }

        if (inCorner && cornerDist > cornerRadius) {
          a = 0; // Transparent outside rounded corner
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Generate files
fs.writeFileSync('./public/apple-touch-icon.png', generatePng(180, 180, true));
fs.writeFileSync('./public/pwa-192x192.png', generatePng(192, 192, false));
fs.writeFileSync('./public/pwa-512x512.png', generatePng(512, 512, false));
fs.writeFileSync('./public/pwa-maskable-512x512.png', generatePng(512, 512, true));

console.log('PWA PNG icons generated successfully in public/');
