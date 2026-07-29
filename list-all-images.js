const fs = require('fs');
const path = require('path');
const root = process.cwd();
const images = [];
function walk(dir) {
  for (const file of fs.readdirSync(dir)) {
    const p = path.join(dir, file);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) walk(p);
    else if (/\.jpe?g$|\.png$|\.gif$|\.webp$/i.test(file)) images.push(path.relative(root, p));
  }
}
walk(root);
console.log(images.join('\n'));
