import fs from 'fs';
import path from 'path';

const filesToFix = [
  './components/memory/themes/CinematicTheme.tsx',
  './components/memory/themes/ClassicTheme.tsx',
  './components/memory/themes/MagazineTheme.tsx',
  './components/memory/themes/PolaroidTheme.tsx',
  './components/memory/themes/ScrapbookTheme.tsx',
  './components/memory/themes/SummerTheme.tsx'
];

filesToFix.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace src={images[0]} with src={images[0] || ''}
  content = content.replace(/src=\{images\[(\d+)\]\}/g, 'src={images[$1] || ""}');
  
  // Replace unoptimized check typeof images[0] === 'string' && (images[0].startsWith...
  // to avoid errors if undefined
  content = content.replace(/unoptimized=\{typeof images\[(\d+)\] === 'string' && \(images\[\d+\]\.startsWith\('blob:'\) \|\| images\[\d+\]\.startsWith\('data:'\)\)\}/g, 
    'unoptimized={typeof images[$1] === "string" && (images[$1].startsWith("blob:") || images[$1].startsWith("data:"))}');

  fs.writeFileSync(file, content);
});
console.log("Types fixed");
