const fs = require('fs');
const path = require('path');

const pagesDir = './app';

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else if (file.endsWith('.tsx')) {
      callback(fullPath);
    }
  });
}

walkDir(pagesDir, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Eliminar bloques completos {!isOnline && ( ... )}
  // Patrón: {!isOnline && ( cualquier cosa hasta el cierre de paréntesis y llave }
  // Esto es complejo, mejor eliminar líneas que contengan !isOnline y luego limpiar )} sueltos
  
  // Primero elimina líneas que contengan !isOnline
  const lines = content.split('\n');
  const newLines = [];
  let skipUntilClosing = false;
  let braceCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('!isOnline') && line.includes('&&')) {
      // Inicio de bloque condicional, lo omitimos y activamos skip
      skipUntilClosing = true;
      braceCount = 0;
      // Buscar la llave de apertura en esta misma línea
      if (line.includes('{')) braceCount++;
      if (line.includes('}')) braceCount--;
      continue;
    }
    if (skipUntilClosing) {
      // Contamos llaves para saber cuándo termina el bloque
      for (let ch of line) {
        if (ch === '{') braceCount++;
        if (ch === '}') braceCount--;
      }
      if (braceCount <= 0 && (line.includes(')}') || line.includes('}'))) {
        skipUntilClosing = false;
      }
      continue;
    }
    // Eliminar líneas que contengan solo ')}' o '})' (restos)
    if (line.trim() === ')}' || line.trim() === '})' || line.trim() === ')};') {
      continue;
    }
    newLines.push(line);
  }
  
  content = newLines.join('\n');
  
  // Eliminar importaciones de useNetworkStatus y useOfflineMutation si aún existen
  content = content.replace(/import \{ useNetworkStatus \} from ['"]@\/hooks\/useNetworkStatus['"];?\n?/g, '');
  content = content.replace(/import \{ useOfflineMutation \} from ['"]@\/hooks\/useOfflineMutation['"];?\n?/g, '');
  content = content.replace(/import \{ WifiOff \} from ['"]lucide-react['"];?\n?/g, '');
  
  // Eliminar declaraciones de variables
  content = content.replace(/const isOnline = useNetworkStatus\(\);?\n?/g, '');
  content = content.replace(/const \{ mutate \} = useOfflineMutation\(['"][\w]+['"]\);?\n?/g, '');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Limpiado: ${filePath}`);
});

console.log('Limpieza completada. Revisa los archivos por si quedaron paréntesis sueltos.');