#!/usr/bin/env node

/**
 * Script para verificar la configuración del frontend
 * Ejecuta: node check-config.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verificando configuración del frontend...\n');

// Verificar archivos de entorno
const envFiles = ['.env', '.env.local', '.env.production'];
let foundEnvFile = false;

console.log('📁 Archivos de entorno:');
envFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file} existe`);
    foundEnvFile = true;
    
    // Leer y mostrar contenido (sin valores sensibles)
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    lines.forEach(line => {
      if (line.includes('REACT_APP_API_URL')) {
        console.log(`     ${line}`);
      }
    });
  } else {
    console.log(`  ⚠️  ${file} no existe`);
  }
});

if (!foundEnvFile) {
  console.log('\n❌ No se encontró ningún archivo de entorno!');
  console.log('\n💡 Solución:');
  console.log('   Crea un archivo .env.local con:');
  console.log('   REACT_APP_API_URL=https://tu-backend.up.railway.app\n');
}

// Verificar package.json
console.log('\n📦 package.json:');
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log(`  ✅ Nombre: ${pkg.name}`);
  console.log(`  ✅ Versión: ${pkg.version}`);
  
  if (pkg.scripts && pkg.scripts['vercel-build']) {
    console.log('  ✅ Script vercel-build configurado');
  } else {
    console.log('  ⚠️  Script vercel-build no encontrado');
  }
}

// Verificar estructura de carpetas
console.log('\n📂 Estructura:');
const requiredDirs = ['src', 'public'];
requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`  ✅ ${dir}/ existe`);
  } else {
    console.log(`  ❌ ${dir}/ no existe`);
  }
});

// Verificar archivos de servicios
console.log('\n🔌 Servicios API:');
const apiFiles = ['src/services/api.ts', 'src/services/adminApi.ts'];
apiFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file} existe`);
  } else {
    console.log(`  ❌ ${file} no existe`);
  }
});

console.log('\n✅ Verificación completada!\n');

// Instrucciones finales
console.log('📝 Próximos pasos:');
console.log('   1. Asegúrate de tener un archivo .env.local con REACT_APP_API_URL');
console.log('   2. Reinicia el servidor: npm start');
console.log('   3. Verifica en la consola del navegador que la URL sea correcta\n');