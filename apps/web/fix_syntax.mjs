import fs from 'fs';
import path from 'path';

const filesToFix = [
  './app/page.tsx',
  './app/dashboard/page.tsx',
  './app/profile/page.tsx',
  './components/itinerary/Timeline.tsx',
  './components/Navigation.tsx',
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
  
  // Fix the regex mistake
  content = content.replace(/ \/ width=/g, ' width=');
  content = content.replace(/\/width=/g, ' width=');
  
  fs.writeFileSync(file, content);
});
console.log("Syntax fixed");
