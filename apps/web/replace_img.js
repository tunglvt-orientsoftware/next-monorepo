const fs = require('fs');
const glob = require('glob'); // Not available by default, let's just use fs.readdirSync
const path = require('path');

const themesDir = './components/memory/themes/';
const files = fs.readdirSync(themesDir).filter(f => f.endsWith('Theme.tsx'));

files.forEach(file => {
  const filePath = path.join(themesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Add import Image if not exists
  if (!content.includes("import Image from 'next/image'")) {
    content = content.replace(/(import .* from .*)/, "import Image from 'next/image'\n$1");
  }

  // Replace <img src={src} alt={alt} className={className} />
  // Note: some have self closing, some might not. They are all self closing in React.
  content = content.replace(/<img([^>]*)src=\{([^}]*)\}([^>]*)>/g, (match, p1, src, p2) => {
    // If it's a blob url it needs unoptimized. We'll just add it inline.
    // Let's use `fill` and hope the parent is relative, OR just use width=1200 height=1200 for simplicity
    // and rely on w-full h-full object-cover to resize it.
    return `<Image${p1}src={${src}}${p2} width={1200} height={1200} unoptimized={typeof ${src} === 'string' && (${src}.startsWith('blob:') || ${src}.startsWith('data:'))} />`;
  });
  
  content = content.replace(/<img([^>]*)src="([^"]*)"([^>]*)>/g, (match, p1, src, p2) => {
    return `<Image${p1}src="${src}"${p2} width={1200} height={1200} unoptimized={"${src}".startsWith('blob:') || "${src}".startsWith('data:')} />`;
  });

  fs.writeFileSync(filePath, content);
});
console.log("Done updating themes");
