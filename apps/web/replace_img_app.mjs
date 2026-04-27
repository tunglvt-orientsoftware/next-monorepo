import fs from 'fs';
import path from 'path';

const filesToUpdate = [
  './app/page.tsx',
  './app/dashboard/page.tsx',
  './app/profile/page.tsx',
  './components/itinerary/Timeline.tsx',
  './components/Navigation.tsx'
];

filesToUpdate.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('<img')) return;

  if (!content.includes("import Image from 'next/image'")) {
    content = content.replace(/(import .* from .*)/, "import Image from 'next/image'\n$1");
  }

  content = content.replace(/<img([^>]*)src=\{([^}]*)\}([^>]*)>/g, (match, p1, src, p2) => {
    return `<Image${p1}src={${src}}${p2} width={1200} height={1200} unoptimized={typeof ${src} === 'string' && (${src}.startsWith('blob:') || ${src}.startsWith('data:'))} />`;
  });
  
  content = content.replace(/<img([^>]*)src="([^"]*)"([^>]*)>/g, (match, p1, src, p2) => {
    return `<Image${p1}src="${src}"${p2} width={1200} height={1200} unoptimized={"${src}".startsWith('blob:') || "${src}".startsWith('data:')} />`;
  });

  fs.writeFileSync(file, content);
});
console.log("Done updating app pages");
