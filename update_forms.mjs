import fs from 'fs';
import path from 'path';

const dir = 'd:/Games/New folder-web/Rs B/src/components/forms';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Slate to Zinc
  content = content.replace(/slate/g, 'zinc');

  // Backgrounds & Borders
  content = content.replace(/bg-white(?! dark:)/g, 'bg-white dark:bg-zinc-900 transition-colors');
  content = content.replace(/bg-zinc-50(?! dark:)/g, 'bg-zinc-50 dark:bg-zinc-800/50 transition-colors');
  content = content.replace(/border-zinc-200(?! dark:)/g, 'border-zinc-200 dark:border-zinc-800');
  content = content.replace(/border-zinc-100(?! dark:)/g, 'border-zinc-100 dark:border-zinc-800/50');
  content = content.replace(/border-zinc-300(?! dark:)/g, 'border-zinc-300 dark:border-zinc-700/80');

  // Text Colors
  content = content.replace(/text-zinc-900(?! dark:)/g, 'text-zinc-900 dark:text-zinc-50');
  content = content.replace(/text-zinc-800(?! dark:)/g, 'text-zinc-800 dark:text-zinc-100');
  content = content.replace(/text-zinc-700(?! dark:)/g, 'text-zinc-700 dark:text-zinc-300');
  content = content.replace(/text-zinc-600(?! dark:)/g, 'text-zinc-600 dark:text-zinc-400');
  content = content.replace(/text-zinc-500(?! dark:)/g, 'text-zinc-500 dark:text-zinc-400');
  content = content.replace(/text-zinc-400(?! dark:)/g, 'text-zinc-400 dark:text-zinc-500');
  content = content.replace(/text-zinc-300(?! dark:)/g, 'text-zinc-300 dark:text-zinc-600');

  // Colors
  const colors = ['purple', 'emerald', 'teal', 'pink', 'blue', 'amber', 'rose'];
  colors.forEach(c => {
    content = content.replace(new RegExp(`bg-${c}-50(?!/)`, 'g'), 'bg-zinc-100 dark:bg-zinc-800');
    content = content.replace(new RegExp(`bg-${c}-100`, 'g'), 'bg-zinc-200 dark:bg-zinc-700');
    content = content.replace(new RegExp(`text-${c}-400`, 'g'), 'text-zinc-400 dark:text-zinc-500');
    content = content.replace(new RegExp(`text-${c}-500`, 'g'), 'text-zinc-600 dark:text-zinc-400');
    content = content.replace(new RegExp(`text-${c}-600`, 'g'), 'text-zinc-700 dark:text-zinc-300');
    content = content.replace(new RegExp(`text-${c}-700`, 'g'), 'text-zinc-800 dark:text-zinc-200');
    content = content.replace(new RegExp(`border-${c}-300`, 'g'), 'border-zinc-300 dark:border-zinc-700');
    content = content.replace(new RegExp(`border-${c}-400`, 'g'), 'border-zinc-400 dark:border-zinc-600');
    content = content.replace(new RegExp(`border-${c}-500`, 'g'), 'border-zinc-500 dark:border-zinc-500');
    content = content.replace(new RegExp(`ring-${c}-500/20`, 'g'), 'ring-zinc-900/5 dark:ring-zinc-100/10');
    content = content.replace(new RegExp(`hover:bg-${c}-100`, 'g'), 'hover:bg-zinc-200 dark:hover:bg-zinc-700');
    content = content.replace(new RegExp(`hover:bg-${c}-50`, 'g'), 'hover:bg-zinc-200 dark:hover:bg-zinc-700');
    content = content.replace(new RegExp(`hover:text-${c}-500`, 'g'), 'hover:text-zinc-900 dark:hover:text-zinc-100');
    content = content.replace(new RegExp(`hover:text-${c}-600`, 'g'), 'hover:text-zinc-900 dark:hover:text-zinc-100');
    content = content.replace(new RegExp(`hover:border-${c}-300`, 'g'), 'hover:border-zinc-400 dark:hover:border-zinc-500');
    content = content.replace(new RegExp(`hover:border-${c}-400`, 'g'), 'hover:border-zinc-500 dark:hover:border-zinc-400');
  });

  // Unique Inputs processing (giving inputs a nice dark mode background instead of pure black/white)
  content = content.replaceAll('bg-white dark:bg-zinc-900 transition-colors placeholder:text-zinc-400', 'bg-white dark:bg-zinc-950 transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600');
  content = content.replaceAll('bg-white dark:bg-zinc-900 transition-colors', 'bg-white dark:bg-[#09090b] transition-colors');

  fs.writeFileSync(filePath, content);
});

console.log('Successfully completed monochromatic dark mode script!');
