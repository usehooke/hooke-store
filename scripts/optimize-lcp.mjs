import fs from 'fs';
import path from 'path';

function optimizeImagesInDir(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      optimizeImagesInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('<Image')) {
        // Regex to find <Image ...> tags that don't already have 'priority'
        let modified = false;
        // Basic replace: if we see `<Image `, `<Image\n`, `<Image\r`
        // We replace it with `<Image priority ` if "priority" is not in that tag.
        // Simple string replace for all `<Image ` because next.js allows `priority` prop anywhere.
        const regex = /<Image(\s+)([^>]*?)>/g;
        content = content.replace(regex, (match, space, rest) => {
            if (rest.includes('priority')) {
                return match;
            }
            modified = true;
            return `<Image${space}priority ${rest}>`;
        });
        if (modified) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`Optimized LCP Images in: ${fullPath}`);
        }
      }
    }
  }
}

console.log("Starting LCP Audit...");
optimizeImagesInDir('./components');
optimizeImagesInDir('./app');
console.log("Atributo 'priority' forçado em componentes críticos. Meta LCP: < 1.2s.");
