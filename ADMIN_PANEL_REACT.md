# Panel de Administración SurfShot - React/TypeScript

Panel de administración moderno desarrollado con React y TypeScript, siguiendo la misma arquitectura de la plataforma principal.

## 🎯 Características

### ✅ Implementado

- **Dashboard**: Estadísticas en tiempo real, actividad reciente, acciones rápidas
- **Gestión de Carpetas**: Crear, listar y eliminar carpetas
- **Subida de Fotos**: Upload múltiple con selección de carpeta
- **Pagos**: Visualización de transacciones y detalles
- **Configuración**: Visualización de settings del sistema
- **Reportes**: Estructura base para reportes futuros

### 🏗️ Arquitectura

```
frontend/src/
├── AdminApp.tsx                    # Aplicación principal del admin
├── index.tsx                       # Entry point con routing condicional
├── services/
│   └── adminApi.ts                 # Servicio API para admin
├── components/admin/
│   ├── AdminNavbar.tsx            # Navegación del admin
│   ├── AdminNavbar.css
│   ├── Dashboard.tsx              # Componente Dashboard
│   └── Dashboard.css
└── pages/admin/
    ├── DashboardPage.tsx          # Página Dashboard
    ├── FoldersPage.tsx            # Gestión de carpetas
    ├── PhotosPage.tsx             # Subida de fotos
    ├── PaymentsPage.tsx           # Listado de pagos
    ├── ReportsPage.tsx            # Reportes (placeholder)
    ├── SettingsPage.tsx           # Configuración
    └── AdminPage.css              # Estilos compartidos
```

## 🚀 Uso

### Acceso al Panel

1. **Desarrollo Local**:
   ```bash
   cd frontend
   npm start
   ```
   Acceder a: `http://localhost:3000/admin`

2. **Producción**:
   ```
   https://tu-dominio.com/admin
   ```

### Navegación

El panel incluye las siguientes secciones:

- **📊 Dashboard**: Vista general con estadísticas y actividad
- **📁 Carpetas**: Gestión de carpetas de fotos
- **📷 Fotos**: Subida de nuevas fotos
- **💳 Pagos**: Historial de transacciones
- **📈 Reportes**: Análisis y estadísticas (en desarrollo)
- **⚙️ Configuración**: Settings del sistema

## 📋 Funcionalidades Detalladas

### Dashboard

**Estadísticas mostradas:**
- Total de carpetas
- Total de fotos
- Ingresos totales (con cambio porcentual)
- Transacciones totales

**Actividad Reciente:**
- Últimos pagos
- Carpetas creadas
- Acciones del sistema

**Acciones Rápidas:**
- Enlaces directos a secciones principales

### Gestión de Carpetas

**Funciones:**
- ✅ Listar todas las carpetas
- ✅ Ver cantidad de fotos por carpeta
- ✅ Crear nueva carpeta
- ✅ Eliminar carpeta (con confirmación)
- ✅ Ver fecha de creación

**Uso:**
1. Click en "Nueva Carpeta"
2. Ingresar nombre (ej: "Surf-2024-01-15")
3. Confirmar creación

### Subida de Fotos

**Funciones:**
- ✅ Seleccionar carpeta destino
- ✅ Upload múltiple de archivos
- ✅ Validación de formatos
- ✅ Progreso de subida
- ✅ Confirmación de éxito

**Uso:**
1. Seleccionar carpeta destino
2. Click en "Seleccionar Fotos"
3. Elegir múltiples archivos
4. Click en "Subir Fotos"

### Pagos

**Información mostrada:**
- ID de transacción
- Nombre del cliente
- Email del cliente
- Monto pagado
- Estado (Completado/Pendiente)
- Fecha y hora

### Configuración

**Settings visibles:**
- Stripe Publishable Key
- Precio por foto
- Tasa de impuestos
- URLs del sistema (Frontend/Backend)

## 🎨 Diseño

### Paleta de Colores

- **Primario**: Gradiente púrpura (#667eea → #764ba2)
- **Fondo**: Gradiente suave (#f5f7fa → #c3cfe2)
- **Texto**: Escala de grises (#1a202c → #718096)
- **Success**: Verde (#48bb78)
- **Error**: Rojo (#e53e3e)
- **Warning**: Naranja (#ed8936)

### Componentes UI

- **Cards**: Bordes redondeados, sombras suaves
- **Botones**: Gradientes, hover effects, estados disabled
- **Tablas**: Hover rows, bordes sutiles
- **Modales**: Overlay oscuro, animaciones suaves
- **Alerts**: Colores contextuales, bordes laterales

## 🔧 Configuración

### Variables de Entorno

```env
REACT_APP_API_URL=http://localhost:8000
```

### API Endpoints Utilizados

```typescript
// Dashboard
GET /admin/dashboard/stats
GET /admin/dashboard/activity

// Folders
GET /folders
POST /folders/create
DELETE /folders/delete

// Photos
POST /photos/upload?folder_name={name}
GET /photos/list?folder_name={name}

// Payments
GET /payments
GET /admin/payments/summary

// Reports
GET /admin/reports/photos-by-folder
GET /admin/reports/revenue-by-period

// Settings
GET /admin/settings
```

## 📱 Responsive Design

El panel es completamente responsive:

- **Desktop (>1200px)**: Layout completo con sidebar
- **Tablet (768px-1200px)**: Navegación adaptada
- **Mobile (<768px)**: Navegación con iconos, tablas scrollables

## 🔐 Seguridad

### Recomendaciones

1. **Autenticación**: Implementar JWT o sesiones
2. **Autorización**: Roles y permisos
3. **HTTPS**: Usar en producción
4. **CORS**: Configurar correctamente
5. **Rate Limiting**: Limitar requests
6. **Validación**: Input validation en frontend y backend

### Próximos Pasos de Seguridad

```typescript
// Ejemplo de autenticación futura
const AdminApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  if (!isAuthenticated) {
    return <LoginPage onLogin={setIsAuthenticated} />;
  }
  
  return <AdminRoutes />;
};
```

## 🚧 Desarrollo Futuro

### Features Pendientes

- [ ] Sistema de autenticación
- [ ] Roles y permisos
- [ ] Reportes avanzados con gráficos
- [ ] Exportación de datos (CSV/PDF)
- [ ] Búsqueda y filtros avanzados
- [ ] Edición de fotos
- [ ] Gestión de usuarios
- [ ] Logs de auditoría
- [ ] Notificaciones en tiempo real
- [ ] Temas claro/oscuro

### Mejoras Técnicas

- [ ] Tests unitarios (Jest)
- [ ] Tests E2E (Cypress)
- [ ] Optimización de imágenes
- [ ] Lazy loading de componentes
- [ ] Service Workers (PWA)
- [ ] Internacionalización (i18n)

## 🐛 Troubleshooting

### Problema: No carga el admin

**Solución:**
```bash
# Verificar que el backend esté corriendo
curl http://localhost:8000/health

# Verificar variable de entorno
echo $REACT_APP_API_URL
```

### Problema: Error al subir fotos

**Solución:**
- Verificar permisos de carpeta `backend/photos_storage`
- Verificar tamaño máximo de archivo en backend
- Verificar formato de imagen (JPG, PNG)

### Problema: No aparecen estadísticas

**Solución:**
- Verificar que existan carpetas y fotos
- Verificar que el endpoint `/admin/dashboard/stats` responda
- Revisar console del navegador para errores

## 📚 Recursos

### Documentación

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Router](https://reactrouter.com/)

### Componentes Utilizados

- React 18.2.0
- TypeScript 4.9.5
- React Router DOM 7.11.0
- Axios 1.6.0

## 🤝 Contribución

Para contribuir al panel de admin:

1. Seguir la estructura de carpetas existente
2. Usar TypeScript para type safety
3. Mantener consistencia en estilos CSS
4. Documentar nuevas funciones
5. Probar en diferentes navegadores

## 📄 Licencia

Este panel es parte del proyecto SurfShot.

---

**Desarrollado con ❤️ usando React + TypeScript**