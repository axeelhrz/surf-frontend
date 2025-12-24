// ==================== CONFIGURACIÓN ==================== 

let API_URL;

// Determinar URL del backend
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Usar el mismo hostname que el frontend para evitar problemas de CORS
    API_URL = `http://${window.location.hostname}:8000`;
} else {
    const storedURL = localStorage.getItem('backendURL');
    // Usar localhost como fallback si Railway no responde
    API_URL = storedURL || "http://localhost:8000";
}

console.log('🔗 API_URL:', API_URL);

// ==================== VARIABLES GLOBALES ==================== 

let selfieBlob = null;
let uploadedPhotoBlob = null;
let videoStream = null;
let allPhotos = [];
let filteredPhotos = [];
let cart = [];
let currentPhotoDetail = null;

const PHOTO_PRICE = 9.99;
const TAX_RATE = 0.10;

// ==================== INICIALIZACIÓN ==================== 

window.addEventListener('load', async () => {
    try {
        const response = await fetch(`${API_URL}/health`);
        if (response.ok) {
            showSuccess('✓ Servidor conectado');
            loadPhotos();
            loadFilters();
        }
    } catch (error) {
        showError('✗ No se pudo conectar al servidor');
    }
    
    // Cargar carrito del localStorage
    loadCartFromStorage();
});

// ==================== FUNCIONES DE ALERTA ==================== 

function showError(message) {
    const alert = document.getElementById('errorAlert');
    alert.textContent = message;
    alert.style.display = 'block';
    document.getElementById('successAlert').style.display = 'none';
    document.getElementById('infoAlert').style.display = 'none';
    setTimeout(() => alert.style.display = 'none', 5000);
}

function showSuccess(message) {
    const alert = document.getElementById('successAlert');
    alert.textContent = message;
    alert.style.display = 'block';
    document.getElementById('errorAlert').style.display = 'none';
    document.getElementById('infoAlert').style.display = 'none';
    setTimeout(() => alert.style.display = 'none', 5000);
}

function showInfo(message) {
    const alert = document.getElementById('infoAlert');
    alert.textContent = message;
    alert.style.display = 'block';
    document.getElementById('errorAlert').style.display = 'none';
    document.getElementById('successAlert').style.display = 'none';
}

// ==================== FUNCIONES DE CÁMARA ==================== 

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' }
        });
        
        const video = document.getElementById('video');
        video.srcObject = stream;
        videoStream = stream;
        
        document.getElementById('startCameraBtn').disabled = true;
        document.getElementById('captureSelfieBtn').disabled = false;
        document.getElementById('stopCameraBtn').disabled = false;
        
        showInfo('Cámara iniciada. Posiciónate frente a la cámara');
    } catch (error) {
        showError('Error al acceder a la cámara: ' + error.message);
    }
}

function captureSelfie() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0);
    
    canvas.toBlob(blob => {
        selfieBlob = blob;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('selfiePreview');
            preview.innerHTML = `
                <p>✓ Selfie capturado</p>
                <img src="${e.target.result}" alt="Selfie">
            `;
        };
        reader.readAsDataURL(blob);
        
        showSuccess('Selfie capturado exitosamente');
        
        // Limpiar foto subida si había una
        if (uploadedPhotoBlob) {
            clearUploadedPhoto();
        }
        
        // Automáticamente buscar fotos similares
        setTimeout(() => {
            searchSimilarPhotos();
        }, 1000);
    });
}

function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
    
    document.getElementById('startCameraBtn').disabled = false;
    document.getElementById('captureSelfieBtn').disabled = true;
    document.getElementById('stopCameraBtn').disabled = true;
    
    showInfo('Cámara detenida');
}

// ==================== FUNCIONES DE FOTOS ==================== 

async function loadPhotos() {
    try {
        document.getElementById('loadingSpinner').style.display = 'flex';
        
        console.log('📸 Cargando fotos desde:', `${API_URL}/marketplace/photos`);
        const response = await fetch(`${API_URL}/marketplace/photos`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Error cargando fotos`);
        }
        
        const data = await response.json();
        console.log('✅ Fotos recibidas:', data.photos?.length || 0);
        allPhotos = data.photos || [];
        filteredPhotos = [...allPhotos];
        
        if (allPhotos.length > 0) {
            console.log('📷 Primera foto:', allPhotos[0]);
            console.log('🔗 URL preview primera foto:', allPhotos[0].thumbnail || allPhotos[0].image);
        }
        
        renderPhotos();
        document.getElementById('loadingSpinner').style.display = 'none';
    } catch (error) {
        console.error('❌ Error cargando fotos:', error);
        showError('Error cargando fotos: ' + error.message);
        document.getElementById('loadingSpinner').style.display = 'none';
    }
}

async function loadFilters() {
    try {
        const response = await fetch(`${API_URL}/marketplace/filters`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Error cargando filtros`);
        }
        
        const data = await response.json();
        
        // Llenar select de escuelas
        const schoolFilter = document.getElementById('schoolFilter');
        if (data.schools && data.schools.length > 0) {
            data.schools.forEach(school => {
                const option = document.createElement('option');
                option.value = school;
                option.textContent = school;
                schoolFilter.appendChild(option);
            });
        }
        
        // Llenar select de días
        const dayFilter = document.getElementById('dayFilter');
        if (data.days && data.days.length > 0) {
            data.days.forEach(day => {
                const option = document.createElement('option');
                option.value = day;
                option.textContent = day;
                dayFilter.appendChild(option);
            });
        }
    } catch (error) {
        console.error('❌ Error cargando filtros:', error);
        showError('No se pudieron cargar los filtros. Verifica la conexión al servidor.');
    }
}

function renderPhotos() {
    const grid = document.getElementById('photosGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (filteredPhotos.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    grid.innerHTML = filteredPhotos.map(photo => {
        // Construir URL de preview con marca de agua
        // El backend devuelve thumbnail como ruta relativa, necesitamos construir la URL completa
        let previewUrl;
        if (photo.thumbnail && photo.thumbnail.startsWith('/')) {
            // Si thumbnail es una ruta relativa que empieza con /, concatenar con API_URL
            previewUrl = `${API_URL}${photo.thumbnail}`;
        } else if (photo.thumbnail) {
            // Si thumbnail es una ruta relativa sin /, agregar /
            previewUrl = `${API_URL}/${photo.thumbnail}`;
        } else {
            // Construir URL desde cero
            previewUrl = `${API_URL}/photos/preview?folder_name=${encodeURIComponent(photo.school)}&filename=${encodeURIComponent(photo.filename)}&watermark=true`;
        }
        
        // URL de fallback sin marca de agua
        const fallbackUrl = `${API_URL}/photos/view?folder_name=${encodeURIComponent(photo.school)}&filename=${encodeURIComponent(photo.filename)}`;
        
        console.log(`🖼️ Construyendo URL para ${photo.filename}:`, previewUrl);
        
        return `
        <div class="photo-card" onclick="openPhotoDetail('${photo.id}')">
            <img src="${previewUrl}" 
                 alt="${photo.filename}" 
                 class="photo-card-image" 
                 loading="lazy"
                 onerror="console.error('❌ Error cargando imagen:', this.src); this.onerror=null; this.src='${fallbackUrl}'; console.log('🔄 Intentando fallback:', '${fallbackUrl}')"
                 onload="console.log('✅ Imagen cargada exitosamente:', this.src)">
            <div class="photo-card-info">
                <div class="photo-card-school">${photo.school}</div>
                <div class="photo-card-date">${photo.date}</div>
                <div class="photo-card-footer">
                    <span class="photo-price">$${PHOTO_PRICE.toFixed(2)}</span>
                    ${photo.similarity ? `<span class="photo-similarity">${photo.similarity}%</span>` : ''}
                </div>
            </div>
        </div>
        `;
    }).join('');
}

function filterPhotos() {
    const school = document.getElementById('schoolFilter').value;
    const day = document.getElementById('dayFilter').value;
    const sort = document.getElementById('sortFilter').value;
    
    // Si hay fotos con similitud (después de una búsqueda facial), mantener solo las que superan el umbral
    const hasSimilaritySearch = allPhotos.some(photo => photo.similarity !== null && photo.similarity !== undefined);
    const threshold = 85; // Umbral por defecto (debería venir del backend, pero usamos 85 como fallback)
    
    // Filtrar
    filteredPhotos = allPhotos.filter(photo => {
        // Si hay una búsqueda de similitud activa, filtrar por umbral
        if (hasSimilaritySearch) {
            if (photo.similarity === null || photo.similarity === undefined) {
                return false; // No mostrar fotos sin similitud calculada
            }
            if (photo.similarity < threshold) {
                return false; // No mostrar fotos que no superan el umbral
            }
        }
        
        // Aplicar filtros de escuela y día
        if (school && photo.school !== school) return false;
        if (day && photo.date !== day) return false;
        return true;
    });
    
    // Ordenar
    switch(sort) {
        case 'newest':
            filteredPhotos.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            filteredPhotos.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'similarity':
            // Ordenar por similitud descendente
            filteredPhotos.sort((a, b) => {
                const simA = a.similarity || 0;
                const simB = b.similarity || 0;
                return simB - simA;
            });
            break;
        case 'price-low':
            // Todos tienen el mismo precio, mantener orden actual
            break;
        case 'price-high':
            // Todos tienen el mismo precio, mantener orden actual
            break;
    }
    
    renderPhotos();
}

// ==================== BÚSQUEDA FACIAL ==================== 

async function searchSimilarPhotos() {
    if (!selfieBlob && !uploadedPhotoBlob) {
        showError('Por favor captura un selfie o sube una foto primero');
        return;
    }
    
    try {
        document.getElementById('loadingSpinner').style.display = 'flex';
        
        const formData = new FormData();
        // Usar la foto subida si está disponible, sino usar el selfie
        const photoToUse = uploadedPhotoBlob || selfieBlob;
        const fileName = uploadedPhotoBlob ? 'uploaded_photo.jpg' : 'selfie.jpg';
        formData.append('selfie', photoToUse, fileName);
        
        const response = await fetch(`${API_URL}/marketplace/search-similar`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            let errorMessage = 'Error en búsqueda';
            try {
                const error = await response.json();
                errorMessage = error.detail || errorMessage;
                
                // Mensajes más amigables para errores comunes
                if (errorMessage.includes('No se detectó un rostro')) {
                    errorMessage = 'No se pudo detectar un rostro en la imagen. Por favor: Asegúrate de que la foto muestre claramente un rostro, tenga buena iluminación, y el rostro esté de frente o de perfil. Intenta con otra foto.';
                } else if (errorMessage.includes('imagen válida')) {
                    errorMessage = 'El archivo no es una imagen válida. Por favor selecciona un archivo JPG, PNG, GIF o BMP';
                }
            } catch (e) {
                // Si no se puede parsear el error, usar el mensaje por defecto
                errorMessage = `Error ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        
        // Obtener umbral de similitud del backend (por defecto 30% si no viene)
        const threshold = data.threshold_used || 30;
        
        console.log('📊 Datos recibidos:', {
            total_photos: data.photos?.length || 0,
            matches_count: data.matches_count || 0,
            threshold: threshold,
            photos: data.photos
        });
        
        // Actualizar todas las fotos con similitud
        allPhotos = data.photos || [];
        
        // MOSTRAR TODAS LAS FOTOS CON SIMILITUD (no filtrar por umbral estricto)
        // Filtrar solo las que tienen similitud calculada y mostrar todas ordenadas
        filteredPhotos = allPhotos.filter(photo => {
            // Incluir todas las fotos que tengan similitud calculada (incluso si es baja)
            return photo.similarity !== null && photo.similarity !== undefined;
        });
        
        // Ordenar por similitud descendente (las más similares primero)
        filteredPhotos.sort((a, b) => {
            const simA = a.similarity || 0;
            const simB = b.similarity || 0;
            return simB - simA;
        });
        
        console.log('✅ Fotos filtradas:', {
            total: allPhotos.length,
            filtradas: filteredPhotos.length,
            umbral: threshold
        });
        
        renderPhotos();
        
        // Mostrar mensaje con información sobre el umbral
        const thresholdInfo = ` (umbral: ${threshold}%)`;
        if (filteredPhotos.length > 0) {
            showSuccess(`Se encontraron ${filteredPhotos.length} fotos similares${thresholdInfo}`);
        } else {
            showInfo(`No se encontraron fotos similares${thresholdInfo}. Intenta con otra foto o ajusta el umbral de similitud.`);
        }
        
        // Scroll a galería
        document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        // Mostrar error con formato mejorado
        const errorMsg = error.message || 'Error desconocido';
        showError(errorMsg);
        console.error('Error en búsqueda:', error);
    } finally {
        document.getElementById('loadingSpinner').style.display = 'none';
    }
}

// ==================== FUNCIONES DE SUBIDA DE FOTO ====================

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        showError('El archivo es demasiado grande. Máximo: 5MB');
        event.target.value = ''; // Limpiar input
        return;
    }
    
    // Validar tipo
    if (!file.type.startsWith('image/')) {
        showError('Por favor selecciona un archivo de imagen válido');
        event.target.value = '';
        return;
    }
    
    // Mostrar mensaje informativo
    showInfo('Procesando imagen... Asegúrate de que la foto muestre claramente un rostro');
    
    // Convertir a blob y mostrar preview
    const reader = new FileReader();
    reader.onload = (e) => {
        // Convertir a blob para enviar al servidor
        uploadedPhotoBlob = file;
        
        // Mostrar preview
        const preview = document.getElementById('uploadedPhotoPreview');
        preview.innerHTML = `
            <div class="uploaded-photo-container">
                <p class="upload-success">✓ Foto seleccionada</p>
                <img src="${e.target.result}" alt="Foto subida" class="uploaded-photo-img">
                <p class="upload-filename">${file.name}</p>
                <button class="action-btn danger" onclick="clearUploadedPhoto()" style="margin-top: 10px;">
                    <i class="fas fa-times"></i>
                    Eliminar
                </button>
            </div>
        `;
        
        // Mostrar botón de búsqueda
        document.getElementById('searchWithUploadBtn').style.display = 'block';
        
        showSuccess('Foto cargada exitosamente');
    };
    reader.readAsDataURL(file);
}

function clearUploadedPhoto() {
    uploadedPhotoBlob = null;
    document.getElementById('photoUploadInput').value = '';
    document.getElementById('uploadedPhotoPreview').innerHTML = '';
    document.getElementById('searchWithUploadBtn').style.display = 'none';
    showInfo('Foto eliminada');
}

function searchWithUploadedPhoto() {
    if (!uploadedPhotoBlob) {
        showError('Por favor sube una foto primero');
        return;
    }
    searchSimilarPhotos();
}

// ==================== MODAL DE DETALLE ==================== 

function openPhotoDetail(photoId) {
    const photo = allPhotos.find(p => p.id === photoId);
    if (!photo) return;
    
    currentPhotoDetail = photo;
    
    document.getElementById('photoTitle').textContent = photo.filename;
    
    // Construir URL de preview con marca de agua
    let previewUrl;
    if (photo.image && photo.image.startsWith('/')) {
        previewUrl = `${API_URL}${photo.image}`;
    } else if (photo.image) {
        previewUrl = `${API_URL}/${photo.image}`;
    } else {
        previewUrl = `${API_URL}/photos/preview?folder_name=${encodeURIComponent(photo.school)}&filename=${encodeURIComponent(photo.filename)}&watermark=true`;
    }
    
    const fallbackUrl = `${API_URL}/photos/view?folder_name=${encodeURIComponent(photo.school)}&filename=${encodeURIComponent(photo.filename)}`;
    
    const imgElement = document.getElementById('photoImage');
    imgElement.onerror = function() {
        console.error('❌ Error cargando imagen en modal:', this.src);
        this.onerror = null;
        this.src = fallbackUrl;
        console.log('🔄 Intentando fallback en modal:', fallbackUrl);
    };
    imgElement.onload = function() {
        console.log('✅ Imagen cargada en modal:', this.src);
    };
    
    imgElement.src = previewUrl;
    document.getElementById('photoSchool').textContent = photo.school;
    document.getElementById('photoDate').textContent = photo.date;
    document.getElementById('photoSimilarity').textContent = photo.similarity ? `${photo.similarity}%` : 'N/A';
    document.getElementById('photoPrice').textContent = `$${PHOTO_PRICE.toFixed(2)}`;
    
    document.getElementById('photoModal').classList.add('active');
}

function closePhotoModal() {
    document.getElementById('photoModal').classList.remove('active');
    currentPhotoDetail = null;
}

function addToCartFromModal() {
    if (currentPhotoDetail) {
        addToCart(currentPhotoDetail);
        closePhotoModal();
    }
}

// ==================== CARRITO ==================== 

function addToCart(photo) {
    // Verificar si ya está en el carrito
    const existingItem = cart.find(item => item.id === photo.id);
    
    if (existingItem) {
        showInfo('Esta foto ya está en tu carrito');
        return;
    }
    
    cart.push({
        id: photo.id,
        filename: photo.filename,
        school: photo.school,
        date: photo.date,
        price: PHOTO_PRICE,
        thumbnail: photo.thumbnail
    });
    
    saveCartToStorage();
    updateCartUI();
    showSuccess('Foto agregada al carrito');
}

function removeFromCart(photoId) {
    cart = cart.filter(item => item.id !== photoId);
    saveCartToStorage();
    updateCartUI();
    showSuccess('Foto removida del carrito');
}

function updateCartUI() {
    const badge = document.getElementById('cartBadge');
    badge.textContent = cart.length;
    
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '';
        emptyCart.style.display = 'block';
    } else {
        emptyCart.style.display = 'none';
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.thumbnail || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22%3E%3Crect fill=%23667eea%22 width=%2280%22 height=%2280%22/%3E%3C/svg%3E'}" alt="${item.filename}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.filename}</div>
                    <div class="cart-item-details">${item.school} • ${item.date}</div>
                </div>
                <div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">Eliminar</button>
                </div>
            </div>
        `).join('');
    }
    
    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const taxes = subtotal * TAX_RATE;
    const total = subtotal + taxes;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('taxes').textContent = `$${taxes.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.toggle('active');
}

function saveCartToStorage() {
    localStorage.setItem('surfshot_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('surfshot_cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartUI();
    }
}

// ==================== CHECKOUT ==================== 

async function checkout() {
    if (cart.length === 0) {
        showError('Tu carrito está vacío');
        return;
    }
    
    try {
        const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
        const taxes = subtotal * TAX_RATE;
        const total = subtotal + taxes;
        
        // Aquí iría la integración con un sistema de pago (Stripe, PayPal, etc.)
        // Por ahora, simulamos el checkout
        
        showSuccess(`Compra realizada por $${total.toFixed(2)}. ¡Gracias por tu compra!`);
        
        // Limpiar carrito
        cart = [];
        saveCartToStorage();
        updateCartUI();
        toggleCart();
        
        // Aquí se enviaría la información de la compra al backend
        // await fetch(`${API_URL}/marketplace/checkout`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         items: cart,
        //         total: total
        //     })
        // });
        
    } catch (error) {
        showError('Error en el checkout: ' + error.message);
    }
}

// ==================== NAVEGACIÓN ==================== 

function scrollToFaceAnalysis() {
    document.getElementById('faceAnalysis').scrollIntoView({ behavior: 'smooth' });
}

// Actualizar nav links activos al hacer scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});