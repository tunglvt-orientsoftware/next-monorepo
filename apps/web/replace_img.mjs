import fs from 'fs';
import path from 'path';

const themesDir = './components/memory/themes/';
const files = fs.readdirSync(themesDir).filter(f => f.endsWith('Theme.tsx'));

files.forEach(file => {
  const filePath = path.join(themesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes("import Image from 'next/image'")) {
    content = content.replace(/(import .* from .*)/, "import Image from 'next/image'\n$1");
  }

  content = content.replace(/<img([^>]*)src=\{([^}]*)\}([^>]*)>/g, (match, p1, src, p2) => {
    return `<Image${p1}src={${src}}${p2} width={1200} height={1200} unoptimized={typeof ${src} === 'string' && (${src}.startsWith('blob:') || ${src}.startsWith('data:'))} />`;
  });
  
  content = content.replace(/<img([^>]*)src="([^"]*)"([^>]*)>/g, (match, p1, src, p2) => {
    return `<Image${p1}src="${src}"${p2} width={1200} height={1200} unoptimized={"${src}".startsWith('blob:') || "${src}".startsWith('data:')} />`;
  });

  fs.writeFileSync(filePath, content);
});
console.log("Done updating themes");
