import https from 'https';
import fs from 'fs';
import path from 'path';

function fetchFollowRedirects(url, cb, depth = 0) {
  if (depth > 5) return cb(new Error('Too many redirects'));
  https.get(url, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      fetchFollowRedirects(res.headers.location, cb, depth + 1);
    } else {
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => cb(null, Buffer.concat(chunks), res.statusCode));
    }
  }).on('error', cb);
}

const outDir = 'd:/POrtfolio/public/assets/images/t001-nova';

fetchFollowRedirects('https://github.com/H-A-C-K-design.png?size=600', (err, buf, status) => {
  if (err) { console.error('Error:', err.message); process.exit(1); }
  console.log('status:', status, 'bytes:', buf.length);
  if (status === 200 && buf.length > 1000) {
    const dest = path.join(outDir, 'profile-source.jpg');
    fs.writeFileSync(dest, buf);
    console.log('Saved to', dest);
  } else {
    console.error('Unexpected response');
    process.exit(1);
  }
});
