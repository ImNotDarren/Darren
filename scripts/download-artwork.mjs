// Download album artwork into public/album-art/ for self-hosting.
// Run: node scripts/download-artwork.mjs
import { mkdir, writeFile } from "node:fs/promises";

const ART = {
  "darren": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/72/70/6e/72706ea6-cbd4-1559-ebdd-142d1fd83bee/056870740492.png/600x600bb.jpg",
  "murderer": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/b7/da/40/b7da401a-716f-1e89-282f-4a0e2ae1553c/0675804467726.png/600x600bb.jpg",
  "playboy": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/b3/f8/d1/b3f8d13c-9dff-4545-b03e-d985199f5a7e/198000910501.jpg/600x600bb.jpg",
  "3am": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ed/74/4c/ed744c2c-1c98-6765-af8f-f1832a557a47/056870736594.png/600x600bb.jpg",
  "bystander": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/19/f3/40/19f34056-6a24-dcf8-d8a2-b4858ec391dc/056870803845.png/600x600bb.jpg",
  "hello": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d0/58/e3/d058e399-e677-428d-3730-cd1eaf3ae8ed/0675804223698.png/600x600bb.jpg",
  "telepath": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b0/61/17/b061179e-a97b-d995-9303-6c278b229f3b/0675804379081.png/600x600bb.jpg",
  "whispers-of-return": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/65/6f/f3/656ff353-2432-9559-eed5-121805a5b7cd/0675804479620.png/600x600bb.jpg",
  "dream": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/b7/be/ae/b7beaeee-4c71-b16d-8e76-39fbd22cd566/0675804626185.png/600x600bb.jpg",
};

await mkdir("public/album-art", { recursive: true });
for (const [slug, url] of Object.entries(ART)) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`FAIL ${slug}: ${res.status}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(`public/album-art/${slug}.jpg`, buf);
    console.log(`OK ${slug} (${buf.length} bytes)`);
  } catch (e) {
    console.error(`ERR ${slug}: ${e.message}`);
  }
}
