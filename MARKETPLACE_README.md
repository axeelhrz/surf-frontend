# 🏄 SurfShot - Marketplace de Fotos de Surf

Plataforma moderna y profesional para comprar y vender fotos de surf. Los usuarios pueden capturar su rostro con la cámara, filtrar automáticamente las fotos donde aparecen, y comprar sus imágenes favoritas.

## ✨ Características Principales

### 📷 Análisis Facial Inteligente
- Captura tu rostro con la cámara web
- Reconocimiento facial avanzado usando FaceNet
- Filtrado automático de fotos donde apareces
- Porcentajes de similitud precisos

### 🛍️ Marketplace Completo
- Galería de fotos organizadas por escuelas de surf y fechas
- Filtros dinámicos por escuela, día y ordenamiento
- Carrito de compras persistente
- Checkout seguro

### 🎨 Diseño Moderno
- Interfaz minimalista y profesional
- Diseño responsive (mobile-first)
- Animaciones suaves
- Paleta de colores moderna

### 💾 Gestión de Datos
- Almacenamiento de embeddings faciales
- Búsqueda rápida y eficiente
- Persistencia de carrito en localStorage

## 🛠️ Tecnologías

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos y responsive
- **JavaScript Vanilla** - Interactividad sin dependencias
- **MediaDevices API** - Acceso a cámara

### Backend
- **FastAPI** - Framework web moderno
- **DeepFace** - Reconocimiento facial
- **FaceNet** - Embeddings faciales
- **OpenCV** - Procesamiento de imágenes
- **NumPy & SciPy** - Cálculos matemáticos

## 📋 Requisitos

- Python 3.11+
- Navegador moderno con soporte WebRTC
- Cámara web (para análisis facial)

## 🚀 Instalación Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/surf.git
cd surf
```

### 2. Crear entorno virtual
```bash
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

### 3. Instalar dependencias
```bash
pip install -r backend/requirements.txt
```

### 4. Ejecutar el backend
```bash
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### 5. Ejecutar el frontend (en otra terminal)
```bash
python -m http.server 8001 --directory frontend --bind 127.0.0.1
```

### 6. Abrir en navegador
```
http://127.0.0.1:8001/index.html
```

## 📊 Estructura del Proyecto

```
surf/
├── backend/
│   ├── main.py                 # API FastAPI
│   ├── requirements.txt         # Dependencias Python
│   └── Dockerfile              # Configuración Docker
├── frontend/
│   ├── index.html              # Página principal del marketplace
│   ├── marketplace.js          # Lógica del marketplace
│   ├── styles.css              # Estilos
│   └── MARKETPLACE_README.md   # Este archivo
├── photos_storage/             # Almacenamiento de fotos
├── embeddings_storage/         # Almacenamiento de embeddings
├── Dockerfile                  # Docker principal
├── vercel.json                 # Configuración Vercel
├── railway.json                # Configuración Railway
└── README.md                   # Documentación general
```

## 🔧 Configuración

### Precio de Fotos
Edita `frontend/marketplace.js`:
```javascript
const PHOTO_PRICE = 9.99;  // Precio por foto
const TAX_RATE = 0.10;     // Tasa de impuestos (10%)
```

### Umbral de Similitud Facial
Edita `backend/main.py`:
```python
SIMILARITY_THRESHOLD = 0.60  # 60% de similitud
```

### Tamaño Máximo de Archivo
```python
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
```

## 📡 API Endpoints

### Marketplace

#### GET `/marketplace/photos`
Obtiene todas las fotos disponibles
```bash
curl http://localhost:8000/marketplace/photos
```

#### GET `/marketplace/filters`
Obtiene filtros disponibles (escuelas y días)
```bash
curl http://localhost:8000/marketplace/filters
```

#### POST `/marketplace/search-similar`
Busca fotos similares basadas en un selfie
```bash
curl -X POST http://localhost:8000/marketplace/search-similar \
  -F "selfie=@selfie.jpg"
```

### Gestión de Fotos

#### POST `/photos/upload`
Sube fotos a una carpeta
```bash
curl -X POST http://localhost:8000/photos/upload?folder_name=Escuela1 \
  -F "photos=@foto1.jpg" \
  -F "photos=@foto2.jpg"
```

#### GET `/photos/list`
Lista fotos en una carpeta
```bash
curl http://localhost:8000/photos/list?folder_name=Escuela1
```

#### DELETE `/photos/delete`
Elimina una foto
```bash
curl -X DELETE "http://localhost:8000/photos/delete?folder_name=Escuela1&filename=foto.jpg"
```

### Gestión de Carpetas

#### POST `/folders/create`
Crea una nueva carpeta
```bash
curl -X POST "http://localhost:8000/folders/create?folder_name=Escuela1"
```

#### GET `/folders/list`
Lista todas las carpetas
```bash
curl http://localhost:8000/folders/list
```

#### DELETE `/folders/delete`
Elimina una carpeta
```bash
curl -X DELETE "http://localhost:8000/folders/delete?folder_name=Escuela1"
```

## 🎯 Cómo Usar

### Para Comprar Fotos

1. **Accede a la plataforma**
   - Abre `http://localhost:8001/index.html`

2. **Captura tu rostro**
   - Haz clic en "Buscar mis Fotos"
   - Haz clic en "Iniciar Cámara"
   - Permite el acceso a tu cámara
   - Haz clic en "Capturar Selfie"

3. **Filtra tus fotos**
   - El sistema automáticamente busca fotos donde apareces
   - Verás un porcentaje de similitud para cada foto

4. **Compra tus fotos**
   - Haz clic en una foto para ver detalles
   - Haz clic en "Agregar al Carrito"
   - Abre el carrito (🛒)
   - Haz clic en "Proceder al Pago"

### Para Administrar Fotos (Admin)

1. **Crear una escuela**
   - Usa el endpoint `/folders/create`
   - Ejemplo: "Escuela Playa Hermosa"

2. **Subir fotos**
   - Usa el endpoint `/photos/upload`
   - Las fotos se procesan automáticamente
   - Se extraen embeddings faciales

3. **Gestionar fotos**
   - Lista fotos con `/photos/list`
   - Elimina fotos con `/photos/delete`

## 🌐 Despliegue en Producción

### Railway (Recomendado para Backend)

1. Conecta tu repositorio a Railway
2. Railway detectará automáticamente el Dockerfile
3. Configura variables de entorno si es necesario
4. Despliega automáticamente

### Vercel (Para Frontend)

1. Conecta tu repositorio a Vercel
2. Vercel detectará automáticamente la configuración
3. Configura la URL del backend en variables de entorno
4. Despliega automáticamente

## 🔐 Seguridad

- CORS habilitado para desarrollo
- Validación de archivos en frontend y backend
- Límite de tamaño de archivo (5MB)
- Detección de rostros antes de procesar

## 🐛 Solución de Problemas

### Error: "No se pudo conectar al servidor"
- Verifica que el backend esté corriendo en puerto 8000
- Comprueba la URL del API en `marketplace.js`
- En producción, verifica la URL de Railway

### Error: "No se detectó rostro"
- Asegúrate de que la imagen sea clara
- El rostro debe estar visible y bien iluminado
- Intenta con una imagen diferente

### Error: "Archivo demasiado grande"
- Máximo permitido: 5MB
- Comprime la imagen antes de subir
- Usa formatos: JPG, PNG, GIF, BMP

### Carrito vacío después de recargar
- El carrito se guarda en localStorage
- Verifica que localStorage esté habilitado
- Intenta limpiar el cache del navegador

## 📈 Mejoras Futuras

- [ ] Integración con Stripe/PayPal
- [ ] Sistema de autenticación de usuarios
- [ ] Historial de compras
- [ ] Descarga de fotos en alta resolución
- [ ] Galería de fotos del usuario
- [ ] Sistema de reseñas
- [ ] Búsqueda por texto
- [ ] Filtros avanzados

## 📄 Licencia

Este proyecto está bajo licencia MIT.

## 👨‍💻 Autor

Desarrollado con ❤️ por Axel Hernández

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Para reportar bugs o sugerencias, abre un issue en GitHub.

---

**¡Disfruta comprando fotos de surf! 🏄‍♂️**