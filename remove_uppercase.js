const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const targetDirs = [
  path.join(__dirname, 'app'),
  path.join(__dirname, 'components')
];

let filesModified = 0;

targetDirs.forEach(dir => {
  walkDir(dir, function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.jsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      if (content.includes('uppercase')) {
         let lines = content.split('\n');
         let newContent = lines.map(line => {
             // Apenas remove a palavra uppercase (e espaçamentos duplos residuais)
             return line.replace(/\buppercase\b/g, '')
                        .replace(/  +/g, ' ')
                        .replace(/` `/g, "``")
                        .replace(/" "/g, '""')
                        .replace(/' '/g, "''");
         }).join('\n');

         if (content !== newContent) {
             fs.writeFileSync(filePath, newContent, 'utf8');
             console.log("Updated", filePath);
             filesModified++;
         }
      }
    }
  });
});

console.log("Total files modified:", filesModified);
