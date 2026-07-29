const fs = require('fs');
const path = require('path');
const baseDir = process.cwd();
const imageDir = path.join(baseDir, 'images', '1');
const appPath = path.join(baseDir, 'app.js');

const files = fs.readdirSync(imageDir).filter((f) => fs.statSync(path.join(imageDir, f)).isFile());
const content = fs.readFileSync(appPath, 'utf8');
const regex = /images\/1\/([^"'`\s]+)/g;
const refs = new Set();
let match;
while ((match = regex.exec(content)) !== null) {
  refs.add(match[1]);
}
const missing = [...refs].filter((ref) => !files.includes(ref));
console.log(JSON.stringify({ refs: [...refs], missing }, null, 2));
