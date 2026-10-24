import https from 'https';
import fs from 'fs';
import path from 'path';

// More professional Indian-looking doctor photos to test
const candidates = [
  { name: 'c1.jpg', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80' },
  { name: 'c2.jpg', url: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=800&q=80' },
  { name: 'c3.jpg', url: 'https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?auto=format&fit=crop&w=800&q=80' },
  { name: 'c4.jpg', url: 'https://images.unsplash.com/photo-1588776814546-1ffea1e75e6b?auto=format&fit=crop&w=800&q=80' },
  { name: 'c5.jpg', url: 'https://images.unsplash.com/photo-1654616851386-9e25c21e2bc1?auto=format&fit=crop&w=800&q=80' },
  { name: 'c6.jpg', url: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=80' },
  { name: 'c7.jpg', url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80' },
  { name: 'c8.jpg', url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80' },
];

async function download(item) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(item.name);
    https.get(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      res.pipe(file);
      file.on('finish', () => { file.close(); console.log('OK', item.name, res.statusCode); resolve(); });
    }).on('error', (e) => { console.error('ERR', item.name, e.message); resolve(); });
  });
}

for (const item of candidates) { await download(item); }
