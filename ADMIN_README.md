# Panel de Administrador - SurfShot

## 📋 Descripción

El panel de administrador de SurfShot es una interfaz completa para gestionar:
- **Carpetas**: Crear, ver y eliminar carpetas de fotos
- **Fotos**: Gestionar todas las fotos subidas en el sistema
- **Pagos**: Monitorear transacciones y pagos de clientes
- **Reportes**: Ver estadísticas y análisis del negocio
- **Configuración**: Ajustar parámetros del sistema

## 🚀 Acceso al Panel

### URL
```
http://localhost:8001/admin.html
```

O en producción:
```
https://tu-dominio.com/admin.html
```

## 📊 Secciones del Panel

### 1. Dashboard
- **Estadísticas Generales**: Total de carpetas, fotos, ingresos y transacciones
- **Actividad Reciente**: Últimas acciones realizadas en el sistema
- **Métricas Clave**: Información rápida del estado del negocio

### 2. Gestión de Carpetas
- **Crear Carpeta**: Agregar nuevas carpetas para organizar fotos
- **Ver Carpetas**: Lista completa de todas las carpetas
- **Eliminar Carpeta**: Remover carpetas y su contenido
- **Información**: Fecha de creación y cantidad de fotos

### 3. Gestión de Fotos
- **Ver Todas las Fotos**: Listado completo de fotos en el sistema
- **Información de Foto**: Nombre, carpeta, tamaño y fecha
- **Eliminar Foto**: Remover fotos individuales
- **Organización**: Fotos agrupadas por carpeta

### 4. Transacciones de Pago
- **Historial de Pagos**: Todas las transacciones realizadas
- **Detalles de Pago**: ID, cliente, monto, fecha y estado
- **Estados**: Completado, Pendiente, Fallido
- **Búsqueda**: Filtrar por cliente o fecha

### 5. Reportes
- **Fotos por Escuela**: Distribución de fotos por ubicación
- **Ingresos por Mes**: Análisis de ingresos mensuales
- **Métricas Detalladas**: Cambios y tendencias
- **Exportar**: Descargar reportes en diferentes formatos

### 6. Configuración
- **URL del Backend**: Configurar la dirección del servidor
- **Precio por Foto**: Ajustar el precio de venta
- **Tasa de Impuesto**: Configurar el porcentaje de impuestos
- **Guardar**: Aplicar cambios al sistema

## 🔧 Funcionalidades

### Crear Nueva Carpeta
1. Ir a la sección "Carpetas"
2. Hacer clic en "Nueva Carpeta"
3. Ingresar el nombre de la carpeta
4. Hacer clic en "Crear Carpeta"

### Eliminar Carpeta
1. Ir a la sección "Carpetas"
2. Encontrar la carpeta a eliminar
3. Hacer clic en "Eliminar"
4. Confirmar la eliminación

### Ver Detalles de Pago
1. Ir a la sección "Pagos"
2. Hacer clic en "Ver" en la transacción deseada
3. Se mostrará un popup con los detalles

### Generar Reportes
1. Ir a la sección "Reportes"
2. Los reportes se cargan automáticamente
3. Ver estadísticas por escuela e ingresos por mes

### Configurar Sistema
1. Ir a la sección "Configuración"
2. Actualizar los valores deseados
3. Hacer clic en "Guardar Configuración"

## 📈 Estadísticas Disponibles

### Dashboard
- Total de Carpetas
- Total de Fotos
- Ingresos Totales
- Transacciones Completadas

### Reportes
- Fotos por Escuela
- Ingresos por Mes
- Cambios Semanales
- Tendencias de Crecimiento

## 🔐 Seguridad

### Autenticación
- El panel requiere autenticación de administrador
- Se utiliza un token almacenado en localStorage
- Cerrar sesión elimina el token

### Permisos
- Solo administradores pueden acceder
- Todas las acciones se registran
- Confirmación requerida para operaciones críticas

## 🛠️ Mantenimiento

### Backup de Datos
- Realizar backups regulares de la carpeta `photos_storage`
- Guardar la base de datos de pagos
- Documentar cambios de configuración

### Limpieza
- Eliminar fotos antiguas regularmente
- Archivar carpetas no utilizadas
- Revisar transacciones fallidas

## 📞 Soporte

### Problemas Comunes

**Error: "No se pudo conectar al servidor"**
- Verificar que el backend está corriendo
- Comprobar la URL del backend en configuración
- Revisar la consola del navegador (F12)

**Error: "Carpeta ya existe"**
- Usar un nombre diferente para la carpeta
- Eliminar la carpeta existente si es necesario

**Error: "Foto no se puede eliminar"**
- Verificar que la foto existe
- Comprobar permisos de archivo
- Reintentar la operación

## 📱 Responsive Design

El panel de administrador es completamente responsive:
- **Desktop**: Interfaz completa con sidebar
- **Tablet**: Menú adaptado
- **Mobile**: Interfaz optimizada para pantallas pequeñas

## 🎨 Temas y Personalización

### Colores
- Azul primario: #3b82f6
- Verde de éxito: #10b981
- Rojo de error: #ef4444
- Naranja de advertencia: #f59e0b

### Fuentes
- Poppins para títulos
- Inter para contenido

## 📚 API Endpoints Utilizados

### Carpetas
- `GET /folders/list` - Listar carpetas
- `POST /folders/create` - Crear carpeta
- `DELETE /folders/delete` - Eliminar carpeta

### Fotos
- `GET /photos/list` - Listar fotos
- `DELETE /photos/delete` - Eliminar foto

### Pagos
- `GET /payments/list` - Listar pagos
- `POST /payments/record` - Registrar pago

### Estadísticas
- `GET /statistics/dashboard` - Estadísticas del dashboard
- `GET /statistics/photos-by-school` - Fotos por escuela
- `GET /statistics/revenue-by-month` - Ingresos por mes

## 🚀 Próximas Mejoras

- [ ] Autenticación con contraseña
- [ ] Exportar reportes a PDF
- [ ] Gráficos interactivos
- [ ] Búsqueda avanzada
- [ ] Filtros personalizados
- [ ] Notificaciones en tiempo real
- [ ] Integración con sistemas de pago
- [ ] Análisis predictivo

## 📝 Notas

- Todos los datos se almacenan localmente en el servidor
- Los pagos son simulados en la versión actual
- Se recomienda usar HTTPS en producción
- Realizar backups regularmente

---

**Versión**: 1.0.0  
**Última actualización**: 2024  
**Desarrollado por**: SurfShot Team