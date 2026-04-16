const fs = require('fs');
const path = require('path');

const pagesDir = './app';
const targets = ['obras', 'pagos', 'presupuestos', 'documentos', 'empleados'];

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) walkDir(fullPath, callback);
    else if (file === 'page.tsx') callback(fullPath);
  });
}

walkDir(pagesDir, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Determinar tabla por el path
  let table = '';
  if (filePath.includes('/obras/')) table = 'obras';
  else if (filePath.includes('/pagos/')) table = 'pagos';
  else if (filePath.includes('/presupuestos/')) table = 'presupuestos';
  else if (filePath.includes('/documentos/')) table = 'Documentos';
  else if (filePath.includes('/empleados/')) table = 'empleados';
  else return;
  
  // Eliminar imports y declaraciones
  content = content.replace(/import \{ useOfflineMutation \} from ['"]@\/hooks\/useOfflineMutation['"]\n?/g, '');
  content = content.replace(/import \{ useNetworkStatus \} from ['"]@\/hooks\/useNetworkStatus['"]\n?/g, '');
  content = content.replace(/\s*const \{ mutate \} = useOfflineMutation\(['"][\w]+['"]\);\n?/g, '');
  content = content.replace(/\s*const isOnline = useNetworkStatus\(\);\n?/g, '');
  
  // Transformar mutate insert
  content = content.replace(/const result = await mutate\('insert', payload\);/g, `const { error } = await supabase.from('${table}').insert(payload);`);
  // Transformar mutate update
  content = content.replace(/const result = await mutate\('update', payload, parseInt\(id\)\);/g, `const { error } = await supabase.from('${table}').update(payload).eq('id', parseInt(id));`);
  // Transformar mutate delete
  content = content.replace(/const result = await mutate\('delete', \{\}, id\);/g, `const { error } = await supabase.from('${table}').delete().eq('id', id);`);
  
  // Cambiar result.error por error en las comprobaciones
  content = content.replace(/if \(result\.error\)/g, 'if (error)');
  content = content.replace(/alert\('Error: ' \+ result\.error\.message\)/g, "alert('Error: ' + error.message)");
  
  // Eliminar bloques if (!isOnline) con alert
  content = content.replace(/if \(!isOnline\) \{\s*alert\([^)]+\);\s*\}/g, '');
  // Eliminar JSX condicionales de offline (sencillo: borra líneas que contengan {!isOnline && ...})
  // Esto es más arriesgado, mejor manual o comentar. Lo dejamos fuera.
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Procesado: ${filePath}`);
});