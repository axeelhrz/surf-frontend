// ==================== CONFIGURACIÓN ====================

let API_URL;
let adminData = {
    folders: [],
    photos: [],
    payments: [],
    stats: {}
};

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    API_URL = "http://localhost:8000";
} else {
    const storedURL = localStorage.getItem('backendURL');
    API_URL = storedURL || "http://localhost:8000";
}

console.log('🔗 API_URL (Admin):', API_URL);

// ==================== INICIALIZACIÓN ====================

window.addEventListener('load', async () => {
    try {
        // Verificar autenticación
        checkAdminAuth();
        
        // Cargar datos iniciales
        await loadDashboardData();
        await loadFolders();
        await loadFoldersForUpload();
        await loadAllPhotos();
        await loadPayments();
        
        // Configurar drag & drop
        setupDragAndDrop();
        
        showAlert('✓ Panel de administrador cargado', 'success');
    } catch (error) {
        console.error('Error inicializando admin:', error);
        showAlert('Error al cargar el panel', 'error');
    }
});

// ==================== AUTENTICACIÓN ====================

function checkAdminAuth() {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
        // Redirigir a login si no hay token
        // Por ahora, permitir acceso directo para desarrollo
        console.warn('⚠️ No hay token de administrador');
    }
}

function logoutAdmin() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('adminToken');
        window.location.href = 'index.html';
    }
}

// ==================== NAVEGACIÓN DE TABS ====================

function switchAdminTab(tabName, evt) {
    // Ocultar todos los tabs
    const tabs = document.querySelectorAll('.admin-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Mostrar el tab seleccionado
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Actualizar nav links
    const navLinks = document.querySelectorAll('.admin-nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    if (evt) {
        evt.target.closest('.admin-nav-link').classList.add('active');
    }
    
    // Cargar datos específicos del tab
    if (tabName === 'folders') {
        loadFolders();
    } else if (tabName === 'photos') {
        loadFoldersForUpload();
        loadAllPhotos();
        // Configurar drag & drop cuando se cambia al tab
        setTimeout(() => {
            setupDragAndDrop();
        }, 100);
    } else if (tabName === 'payments') {
        loadPayments();
    } else if (tabName === 'reports') {
        loadReports();
    }
}

// ==================== ALERTAS ====================

function showAlert(message, type = 'info') {
    const alertId = `${type}Alert`;
    const alert = document.getElementById(alertId);
    
    if (alert) {
        alert.textContent = message;
        alert.classList.add('active');
        
        setTimeout(() => {
            alert.classList.remove('active');
        }, 5000);
    }
}

// ==================== DASHBOARD ====================

async function loadDashboardData() {
    try {
        // Cargar carpetas
        const foldersResponse = await fetch(`${API_URL}/folders/list`);
        const foldersData = await foldersResponse.json();
        const totalFolders = foldersData.folders ? foldersData.folders.length : 0;
        
        // Cargar todas las fotos
        let totalPhotos = 0;
        if (foldersData.folders) {
            for (const folder of foldersData.folders) {
                const photosResponse = await fetch(`${API_URL}/photos/list?folder_name=${folder.name}`);
                const photosData = await photosResponse.json();
                totalPhotos += photosData.photos ? photosData.photos.length : 0;
            }
        }
        
        // Actualizar stats
        document.getElementById('totalFolders').textContent = totalFolders;
        document.getElementById('totalPhotos').textContent = totalPhotos;
        
        // Datos simulados para pagos (en producción vendrían del backend)
        const totalRevenue = totalPhotos * 9.99 * 0.5; // Simulación
        const totalTransactions = Math.floor(totalPhotos / 3);
        
        document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
        document.getElementById('totalTransactions').textContent = totalTransactions;
        
        // Cargar actividad reciente
        loadRecentActivity();
        
    } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
        showAlert('Error al cargar datos del dashboard', 'error');
    }
}

async function loadRecentActivity() {
    try {
        const activities = [
            { type: 'Carpeta', description: 'Nueva carpeta creada', date: new Date().toLocaleDateString(), status: 'Completado' },
            { type: 'Foto', description: 'Fotos subidas', date: new Date().toLocaleDateString(), status: 'Completado' },
            { type: 'Pago', description: 'Transacción procesada', date: new Date().toLocaleDateString(), status: 'Completado' }
        ];
        
        const tbody = document.getElementById('recentActivityTable');
        tbody.innerHTML = activities.map(activity => `
            <tr>
                <td><strong>${activity.type}</strong></td>
                <td>${activity.description}</td>
                <td>${activity.date}</td>
                <td><span class="badge badge-success">${activity.status}</span></td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error cargando actividad reciente:', error);
    }
}

// ==================== GESTIÓN DE CARPETAS ====================

async function loadFolders() {
    try {
        const response = await fetch(`${API_URL}/folders/list`);
        const data = await response.json();
        
        adminData.folders = data.folders || [];
        
        const tbody = document.getElementById('foldersTable');
        
        if (adminData.folders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; color: #94a3b8;">
                        No hay carpetas disponibles
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = adminData.folders.map(folder => `
            <tr>
                <td><strong>${folder.name}</strong></td>
                <td>${folder.photo_count || 0}</td>
                <td>${new Date(folder.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="action-btn action-btn-view" onclick="viewFolderPhotos('${folder.name}')">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="action-btn action-btn-delete" onclick="deleteFolder('${folder.name}')">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error cargando carpetas:', error);
        showAlert('Error al cargar carpetas', 'error');
    }
}

function openCreateFolderModal() {
    document.getElementById('createFolderModal').classList.add('active');
}

function closeCreateFolderModal() {
    document.getElementById('createFolderModal').classList.remove('active');
    document.getElementById('folderNameInput').value = '';
}

async function createNewFolder() {
    const folderName = document.getElementById('folderNameInput').value.trim();
    
    if (!folderName) {
        showAlert('Por favor ingresa un nombre de carpeta', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/folders/create?folder_name=${encodeURIComponent(folderName)}`, {
            method: 'POST'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error creando carpeta');
        }
        
        showAlert(`✓ Carpeta "${folderName}" creada exitosamente`, 'success');
        closeCreateFolderModal();
        await loadFolders();
        await loadDashboardData();
    } catch (error) {
        console.error('Error creando carpeta:', error);
        showAlert('Error: ' + error.message, 'error');
    }
}

async function deleteFolder(folderName) {
    if (!confirm(`¿Estás seguro de que deseas eliminar la carpeta "${folderName}" y todas sus fotos?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/folders/delete?folder_name=${encodeURIComponent(folderName)}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error eliminando carpeta');
        }
        
        showAlert(`✓ Carpeta "${folderName}" eliminada exitosamente`, 'success');
        await loadFolders();
        await loadDashboardData();
    } catch (error) {
        console.error('Error eliminando carpeta:', error);
        showAlert('Error: ' + error.message, 'error');
    }
}

function viewFolderPhotos(folderName) {
    alert(`Ver fotos de: ${folderName}\n\nFuncionalidad en desarrollo`);
}

// ==================== GESTIÓN DE FOTOS ====================

// Variables para subida masiva
let selectedPhotosFiles = [];
let uploadFileStatuses = {}; // Para rastrear el estado de cada archivo
let uploadedPhotos = []; // Para almacenar las fotos subidas exitosamente

// Cargar carpetas en el selector de subida
async function loadFoldersForUpload() {
    try {
        const response = await fetch(`${API_URL}/folders/list`);
        const data = await response.json();
        
        const select = document.getElementById('uploadFolderSelect');
        if (!select) return;
        
        select.innerHTML = '<option value="">-- Selecciona una carpeta --</option>';
        
        if (data.folders && data.folders.length > 0) {
            data.folders.forEach(folder => {
                const option = document.createElement('option');
                option.value = folder.name;
                option.textContent = folder.name;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error cargando carpetas para subida:', error);
    }
}

// Configurar drag & drop
function setupDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');
    const bulkPhotosInput = document.getElementById('bulkPhotosInput');
    
    if (!uploadArea) return;
    
    // Prevenir comportamiento por defecto
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Efectos visuales
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.add('dragover');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.remove('dragover');
        }, false);
    });
    
    // Manejar drop
    uploadArea.addEventListener('drop', (e) => {
        const files = Array.from(e.dataTransfer.files).filter(file => 
            file.type.startsWith('image/')
        );
        if (files.length > 0) {
            handleFilesSelection(files);
        }
    }, false);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Manejar selección de archivos (fotos individuales)
function handleBulkPhotoSelect(event) {
    const files = Array.from(event.target.files).filter(file => 
        file.type.startsWith('image/')
    );
    handleFilesSelection(files);
}

// Manejar selección de carpeta completa
function handleBulkFolderSelect(event) {
    const files = Array.from(event.target.files).filter(file => 
        file.type.startsWith('image/')
    );
    handleFilesSelection(files);
}

// Función común para manejar selección de archivos
function handleFilesSelection(files) {
    console.log('📁 Archivos seleccionados:', files.length);
    
    if (files.length === 0) {
        showAlert('No se seleccionaron imágenes válidas', 'error');
        return;
    }
    
    selectedPhotosFiles = files;
    uploadFileStatuses = {};
    
    // Inicializar estados (sin loguear cada archivo para mejor rendimiento)
    files.forEach(file => {
        uploadFileStatuses[file.name] = 'pending';
    });
    
    const uploadArea = document.getElementById('uploadArea');
    const uploadAreaContent = document.getElementById('uploadAreaContent');
    const selectedPreview = document.getElementById('selectedPhotosPreview');
    const selectedGrid = document.getElementById('selectedPhotosGrid');
    const selectedCount = document.getElementById('selectedPhotosCount');
    const uploadBtn = document.getElementById('uploadBulkBtn');
    
    if (!uploadArea || !selectedPreview || !selectedGrid || !uploadBtn) {
        console.error('❌ Elementos del DOM no encontrados');
        return;
    }
    
    // Ocultar contenido de subida y mostrar preview
    if (uploadAreaContent) {
        uploadAreaContent.style.display = 'none';
    }
    selectedPreview.style.display = 'block';
    uploadArea.classList.add('has-selected');
    uploadArea.style.cursor = 'default';
    
    // Calcular tamaño total
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    
    // Actualizar contador con información detallada
    if (selectedCount) {
        selectedCount.textContent = `${files.length} foto${files.length > 1 ? 's' : ''} seleccionada${files.length > 1 ? 's' : ''} • ${formatFileSize(totalSize)}`;
    }
    
    // Limitar thumbnails para mejor rendimiento (máximo 50)
    const MAX_THUMBNAILS = 50;
    const showThumbnails = files.length <= MAX_THUMBNAILS;
    const filesToShow = showThumbnails ? files : files.slice(0, MAX_THUMBNAILS);
    
    // Mostrar indicador de carga
    const loadingIndicator = document.getElementById('selectedPhotosLoading');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
    }
    
    // Limpiar grid primero
    selectedGrid.innerHTML = '';
    
    // Deshabilitar botón mientras se procesa
    uploadBtn.disabled = true;
    
    // Usar setTimeout para permitir que la UI se actualice primero
    setTimeout(() => {
        // Mostrar mensaje si hay muchas fotos
        if (!showThumbnails) {
            const infoDiv = document.createElement('div');
            infoDiv.style.cssText = 'padding: 15px; background: #eff6ff; border-radius: 8px; margin-bottom: 15px; text-align: center; color: #1e40af; font-size: 14px;';
            infoDiv.innerHTML = `<i class="fas fa-info-circle"></i> Mostrando las primeras ${MAX_THUMBNAILS} fotos de ${files.length} seleccionadas`;
            selectedGrid.appendChild(infoDiv);
        }
        
        // Generar thumbnails de forma asíncrona para no bloquear la UI
        let processed = 0;
        const BATCH_SIZE = 5; // Procesar 5 a la vez para mejor rendimiento
        
        function processBatch() {
            const batch = filesToShow.slice(processed, processed + BATCH_SIZE);
            
            batch.forEach((file) => {
                try {
                    const thumbnailUrl = URL.createObjectURL(file);
                    
                    const photoItem = document.createElement('div');
                    photoItem.className = 'selected-photo-item';
                    
                    const img = document.createElement('img');
                    img.src = thumbnailUrl;
                    img.alt = file.name;
                    img.className = 'selected-photo-thumbnail';
                    img.loading = 'lazy';
                    img.onload = function() {
                        this.classList.add('loaded');
                    };
                    img.onerror = function() {
                        // Si hay error cargando la imagen, mostrar placeholder
                        this.style.background = '#f1f5f9';
                        this.style.display = 'flex';
                        this.style.alignItems = 'center';
                        this.style.justifyContent = 'center';
                        this.innerHTML = '<i class="fas fa-image" style="color: #94a3b8; font-size: 24px;"></i>';
                    };
                    
                    const overlay = document.createElement('div');
                    overlay.className = 'selected-photo-overlay';
                    overlay.textContent = file.name;
                    
                    photoItem.appendChild(img);
                    photoItem.appendChild(overlay);
                    selectedGrid.appendChild(photoItem);
                } catch (e) {
                    console.error('Error procesando foto:', file.name, e);
                }
            });
            
            processed += batch.length;
            
            if (processed < filesToShow.length) {
                // Usar requestIdleCallback si está disponible, sino setTimeout
                if (window.requestIdleCallback) {
                    requestIdleCallback(processBatch, { timeout: 100 });
                } else {
                    setTimeout(processBatch, 10);
                }
            } else {
                // Ocultar indicador de carga
                if (loadingIndicator) {
                    loadingIndicator.style.display = 'none';
                }
                uploadBtn.disabled = false;
                console.log('✅ Vista previa actualizada con', files.length, 'fotos');
            }
        }
        
        // Iniciar procesamiento
        processBatch();
    }, 50);
}

// Limpiar selección de fotos
function clearBulkPhotos() {
    selectedPhotosFiles = [];
    uploadFileStatuses = {};
    
    const input = document.getElementById('bulkPhotosInput');
    if (input) input.value = '';
    
    const folderInput = document.getElementById('bulkFolderInput');
    if (folderInput) folderInput.value = '';
    
    const uploadArea = document.getElementById('uploadArea');
    const uploadAreaContent = document.getElementById('uploadAreaContent');
    const selectedPreview = document.getElementById('selectedPhotosPreview');
    
    if (uploadArea) {
        uploadArea.classList.remove('has-selected');
        uploadArea.style.cursor = 'pointer';
    }
    
    if (uploadAreaContent) {
        uploadAreaContent.style.display = 'block';
    }
    
    if (selectedPreview) {
        selectedPreview.style.display = 'none';
    }
    
    const uploadBtn = document.getElementById('uploadBulkBtn');
    if (uploadBtn) uploadBtn.disabled = true;
    
    console.log('🧹 Selección limpiada');
}

// Mostrar fotos subidas en la galería
function displayUploadedPhotos() {
    const gallery = document.getElementById('uploadedPhotosGallery');
    const grid = document.getElementById('uploadedPhotosGrid');
    const count = document.getElementById('uploadedPhotosCount');
    const uploadArea = document.getElementById('uploadArea');
    
    if (!gallery || !grid || !uploadArea) {
        console.error('❌ Elementos del DOM no encontrados para mostrar fotos');
        return;
    }
    
    if (uploadedPhotos.length === 0) {
        gallery.style.display = 'none';
        return;
    }
    
    console.log(`🖼️ Mostrando ${uploadedPhotos.length} fotos subidas`);
    
    // Mostrar galería (dentro del área de subida, después de las fotos seleccionadas)
    gallery.style.display = 'block';
    
    // Actualizar contador
    if (count) {
        count.textContent = `${uploadedPhotos.length} foto${uploadedPhotos.length > 1 ? 's' : ''} subida${uploadedPhotos.length > 1 ? 's' : ''}`;
    }
    
    // Generar thumbnails y mostrar fotos
    grid.innerHTML = uploadedPhotos.map((photo, index) => {
        let thumbnailUrl = '';
        try {
            if (photo.file && photo.file instanceof File) {
                thumbnailUrl = URL.createObjectURL(photo.file);
            } else if (photo.thumbnailUrl) {
                thumbnailUrl = photo.thumbnailUrl;
            } else {
                // Si no hay archivo, usar un placeholder
                thumbnailUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5NDEzYjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW48L3RleHQ+PC9zdmc+';
            }
        } catch (e) {
            console.error('Error creando thumbnail:', e);
            thumbnailUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5NDEzYjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5FcnJvcjwvdGV4dD48L3N2Zz4=';
        }
        
        return `
            <div class="uploaded-photo-item">
                <div class="uploaded-photo-badge">
                    <i class="fas fa-check"></i> Subida
                </div>
                <img src="${thumbnailUrl}" alt="${photo.filename}" class="uploaded-photo-thumbnail" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5NDEzYjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5FcnJvcjwvdGV4dD48L3N2Zz4='" />
                <div class="uploaded-photo-info">
                    <div class="uploaded-photo-name" title="${photo.filename}">${photo.filename}</div>
                    <div class="uploaded-photo-size">${formatFileSize(photo.size || 0)}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Limpiar fotos subidas
function clearUploadedPhotos() {
    uploadedPhotos = [];
    displayUploadedPhotos();
    console.log('🧹 Fotos subidas limpiadas');
}

// Abrir modal de progreso
function openUploadProgressModal() {
    const modal = document.getElementById('uploadProgressModal');
    if (modal) {
        modal.classList.add('active');
        // Resetear valores
        document.getElementById('uploadModalTotal').textContent = selectedPhotosFiles.length;
        document.getElementById('uploadModalUploaded').textContent = '0';
        document.getElementById('uploadModalErrors').textContent = '0';
        document.getElementById('uploadModalProgressBar').style.width = '0%';
        document.getElementById('uploadModalTitle').textContent = 'Subiendo Fotos...';
        document.getElementById('uploadModalSubtitle').textContent = 'Preparando archivos para subir';
        document.getElementById('uploadModalIcon').className = 'fas fa-cloud-upload-alt';
        document.getElementById('uploadModalClose').style.display = 'none';
        document.getElementById('uploadModalFooter').style.display = 'none';
        document.getElementById('uploadModalFileList').style.display = 'none';
    }
}

// Cerrar modal de progreso
function closeUploadProgressModal() {
    const modal = document.getElementById('uploadProgressModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Actualizar modal de progreso
function updateUploadProgressModal(uploaded, errors, total) {
    const progressBar = document.getElementById('uploadModalProgressBar');
    const uploadedEl = document.getElementById('uploadModalUploaded');
    const errorsEl = document.getElementById('uploadModalErrors');
    const title = document.getElementById('uploadModalTitle');
    const subtitle = document.getElementById('uploadModalSubtitle');
    const icon = document.getElementById('uploadModalIcon');
    const closeBtn = document.getElementById('uploadModalClose');
    const footer = document.getElementById('uploadModalFooter');
    
    const progress = total > 0 ? ((uploaded + errors) / total) * 100 : 0;
    
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (uploadedEl) uploadedEl.textContent = uploaded;
    if (errorsEl) errorsEl.textContent = errors;
    
    if (uploaded + errors >= total) {
        // Completado
        if (title) title.textContent = errors > 0 ? 'Subida Completada con Errores' : '¡Subida Completada!';
        if (subtitle) subtitle.textContent = `${uploaded} de ${total} fotos subidas exitosamente`;
        if (icon) icon.className = errors > 0 ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle';
        if (closeBtn) closeBtn.style.display = 'block';
        if (footer) footer.style.display = 'flex';
    } else {
        // En progreso
        if (subtitle) subtitle.textContent = `Subiendo... ${uploaded + errors} de ${total} procesados`;
    }
}

// Subir fotos masivamente (por lotes)
async function uploadBulkPhotos() {
    console.log('🚀 Iniciando subida de fotos...');
    
    const folderSelect = document.getElementById('uploadFolderSelect');
    const selectedFolder = folderSelect ? folderSelect.value : '';
    
    console.log('📁 Carpeta seleccionada:', selectedFolder);
    console.log('📸 Archivos seleccionados:', selectedPhotosFiles.length);
    
    if (!selectedFolder) {
        showAlert('Por favor selecciona una carpeta de destino', 'error');
        return;
    }
    
    if (selectedPhotosFiles.length === 0) {
        showAlert('Por favor selecciona al menos una foto', 'error');
        return;
    }
    
    try {
        // Abrir modal de progreso
        console.log('📊 Abriendo modal de progreso...');
        openUploadProgressModal();
        
        // Deshabilitar botón
        const uploadBtn = document.getElementById('uploadBulkBtn');
        if (uploadBtn) uploadBtn.disabled = true;
        
        // Actualizar estado inicial
        updateUploadProgressModal(0, 0, selectedPhotosFiles.length);
        
        // Verificar conexión con el backend primero
        console.log('🔍 Verificando conexión con el backend...');
        try {
            const healthController = new AbortController();
            const healthTimeout = setTimeout(() => healthController.abort(), 5000);
            
            const healthCheck = await fetch(`${API_URL}/health`, { 
                method: 'GET',
                signal: healthController.signal
            });
            
            clearTimeout(healthTimeout);
            
            if (!healthCheck.ok) {
                throw new Error(`Backend respondió con error: ${healthCheck.status}`);
            }
            const healthData = await healthCheck.json();
            console.log('✅ Backend conectado:', healthData);
        } catch (healthError) {
            console.error('❌ Error conectando al backend:', healthError);
            const errorMsg = healthError.name === 'AbortError' 
                ? 'Timeout: El backend no respondió en 5 segundos'
                : `Error: No se pudo conectar al backend en ${API_URL}. Verifica que esté corriendo.`;
            showAlert(errorMsg, 'error');
            const uploadBtn = document.getElementById('uploadBulkBtn');
            if (uploadBtn) uploadBtn.disabled = false;
            closeUploadProgressModal();
            return;
        }
        
        // Configuración de lotes
        const BATCH_SIZE = 20; // Subir 20 fotos a la vez
        const totalFiles = selectedPhotosFiles.length;
        let totalUploaded = 0;
        let totalErrors = 0;
        const allErrors = [];
        
        console.log(`📦 Subiendo ${totalFiles} fotos en lotes de ${BATCH_SIZE}...`);
        console.log(`📊 Total de lotes: ${Math.ceil(totalFiles / BATCH_SIZE)}`);
        
        // Subir por lotes
        for (let i = 0; i < totalFiles; i += BATCH_SIZE) {
            const batch = selectedPhotosFiles.slice(i, i + BATCH_SIZE);
            const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
            const totalBatches = Math.ceil(totalFiles / BATCH_SIZE);
            
            console.log(`📤 Lote ${batchNumber}/${totalBatches}: Subiendo ${batch.length} fotos...`);
            
            // Actualizar subtítulo
            const subtitle = document.getElementById('uploadModalSubtitle');
            if (subtitle) {
                subtitle.textContent = `Subiendo lote ${batchNumber} de ${totalBatches} (${i + 1}-${Math.min(i + BATCH_SIZE, totalFiles)} de ${totalFiles})`;
            }
            
            try {
                // Crear FormData para este lote
                const formData = new FormData();
                batch.forEach(file => {
                    formData.append('photos', file);
                });
                
                console.log(`  📤 Enviando lote ${batchNumber}...`);
                console.log(`  📍 URL: ${API_URL}/photos/upload?folder_name=${encodeURIComponent(selectedFolder)}`);
                console.log(`  📦 Tamaño del lote: ${batch.length} archivos`);
                
                // Subir lote con timeout extendido
                const controller = new AbortController();
                const timeoutId = setTimeout(() => {
                    controller.abort();
                    console.error(`⏱️ Timeout en lote ${batchNumber} después de 5 minutos`);
                }, 300000); // 5 minutos por lote
                
                let response;
                try {
                    response = await fetch(
                        `${API_URL}/photos/upload?folder_name=${encodeURIComponent(selectedFolder)}`,
                        {
                            method: 'POST',
                            body: formData,
                            signal: controller.signal
                        }
                    );
                    clearTimeout(timeoutId);
                } catch (fetchError) {
                    clearTimeout(timeoutId);
                    if (fetchError.name === 'AbortError') {
                        throw new Error('Timeout: El servidor tardó más de 5 minutos en responder');
                    } else if (fetchError.name === 'TypeError' && fetchError.message.includes('Failed to fetch')) {
                        throw new Error('Error de conexión: No se pudo conectar al servidor. Verifica que el backend esté corriendo.');
                    } else {
                        throw fetchError;
                    }
                }
                
                console.log(`  📡 Respuesta recibida para lote ${batchNumber}:`, response.status, response.statusText);
                
                if (!response.ok) {
                    let errorMessage = 'Error subiendo lote';
                    try {
                        const error = await response.json();
                        errorMessage = error.detail || errorMessage;
                    } catch (e) {
                        errorMessage = `Error HTTP ${response.status}: ${response.statusText}`;
                    }
                    console.error(`❌ Error en lote ${batchNumber}:`, errorMessage);
                    // Continuar con el siguiente lote en lugar de fallar completamente
                    batch.forEach((file, batchIndex) => {
                        allErrors.push(`${file.name}: Error en lote - ${errorMessage}`);
                    });
                    totalErrors += batch.length;
                    continue;
                }
                
                let data;
                try {
                    data = await response.json();
                } catch (jsonError) {
                    console.error(`❌ Error parseando JSON del lote ${batchNumber}:`, jsonError);
                    const textResponse = await response.text();
                    console.error('  Respuesta del servidor:', textResponse);
                    throw new Error(`Error parseando respuesta del servidor: ${textResponse.substring(0, 100)}`);
                }
                
                console.log(`✅ Lote ${batchNumber} completado:`, {
                    uploaded: data.uploaded || 0,
                    photos: data.photos ? data.photos.length : 0,
                    errors: data.errors ? data.errors.length : 0
                });
                
                // Procesar resultados del lote
                if (data.photos && Array.isArray(data.photos)) {
                    console.log(`  📸 Fotos subidas en este lote: ${data.photos.length}`);
                    data.photos.forEach(photo => {
                        const file = batch.find(f => f.name === photo.filename);
                        if (file) {
                            uploadedPhotos.push({
                                file: file,
                                filename: photo.filename,
                                size: photo.size,
                                folder: selectedFolder
                            });
                            totalUploaded++;
                            console.log(`    ✓ ${photo.filename}`);
                        }
                    });
                } else {
                    console.warn(`  ⚠️ No se recibieron fotos en el lote ${batchNumber}`);
                }
                
                if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                    console.log(`  ⚠️ Errores en este lote: ${data.errors.length}`);
                    data.errors.forEach(err => console.log(`    ✗ ${err}`));
                    allErrors.push(...data.errors);
                    totalErrors += data.errors.length;
                }
                
                // Actualizar progreso después de cada lote
                const processed = totalUploaded + totalErrors;
                updateUploadProgressModal(totalUploaded, totalErrors, totalFiles);
                
                console.log(`  ✅ Lote ${batchNumber} procesado. Progreso: ${processed}/${totalFiles}`);
                
                // Pequeña pausa entre lotes para no sobrecargar el servidor
                if (i + BATCH_SIZE < totalFiles) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
                
            } catch (error) {
                console.error(`❌ Error en lote ${batchNumber}:`, error);
                console.error('  Tipo de error:', error.name);
                console.error('  Mensaje:', error.message);
                
                // Si es un error de aborto (timeout), informar específicamente
                if (error.name === 'AbortError') {
                    console.error('  ⏱️ Timeout: El servidor tardó demasiado en responder');
                    batch.forEach(file => {
                        allErrors.push(`${file.name}: Timeout - El servidor tardó demasiado`);
                    });
                } else {
                    // Otros errores
                    batch.forEach(file => {
                        allErrors.push(`${file.name}: ${error.message || 'Error desconocido'}`);
                    });
                }
                totalErrors += batch.length;
                
                // Actualizar progreso incluso si hay error
                updateUploadProgressModal(totalUploaded, totalErrors, totalFiles);
            }
        }
        
        console.log(`✅ Proceso completado: ${totalUploaded} subidas, ${totalErrors} errores`);
        
        // Actualizar progreso final
        updateUploadProgressModal(totalUploaded, totalErrors, totalFiles);
        
        const data = {
            uploaded: totalUploaded,
            photos: uploadedPhotos.map(p => ({ filename: p.filename, size: p.size })),
            errors: allErrors
        };
        
        // Mostrar fotos subidas en la galería
        displayUploadedPhotos();
        
        // Mostrar alertas
        if (totalUploaded > 0) {
            showAlert(`✓ ${totalUploaded} foto(s) subida(s) exitosamente`, 'success');
        }
        
        if (totalErrors > 0) {
            showAlert(`⚠ ${totalErrors} foto(s) tuvieron errores. Revisa el modal para más detalles.`, 'error');
        }
        
        // Recargar datos
        console.log('🔄 Recargando datos...');
        await loadAllPhotos();
        await loadDashboardData();
        
        // Limpiar selección después de 3 segundos
        setTimeout(() => {
            if (totalErrors === 0) {
                clearBulkPhotos();
            }
        }, 3000);
        
    } catch (error) {
        console.error('❌ Error subiendo fotos:', error);
        console.error('Stack:', error.stack);
        showAlert('Error: ' + error.message, 'error');
        
        // Actualizar modal con error
        const title = document.getElementById('uploadModalTitle');
        const subtitle = document.getElementById('uploadModalSubtitle');
        const icon = document.getElementById('uploadModalIcon');
        const closeBtn = document.getElementById('uploadModalClose');
        const footer = document.getElementById('uploadModalFooter');
        
        if (title) title.textContent = 'Error en la Subida';
        if (subtitle) subtitle.textContent = error.message;
        if (icon) icon.className = 'fas fa-exclamation-circle';
        if (closeBtn) closeBtn.style.display = 'block';
        if (footer) footer.style.display = 'flex';
        
        const uploadBtn = document.getElementById('uploadBulkBtn');
        if (uploadBtn) uploadBtn.disabled = false;
    }
}

async function loadAllPhotos() {
    try {
        const foldersResponse = await fetch(`${API_URL}/folders/list`);
        const foldersData = await foldersResponse.json();
        
        let allPhotos = [];
        
        if (foldersData.folders) {
            for (const folder of foldersData.folders) {
                const photosResponse = await fetch(`${API_URL}/photos/list?folder_name=${folder.name}`);
                const photosData = await photosResponse.json();
                
                if (photosData.photos) {
                    photosData.photos.forEach(photo => {
                        photo.folder = folder.name;
                    });
                    allPhotos = allPhotos.concat(photosData.photos);
                }
            }
        }
        
        adminData.photos = allPhotos;
        
        const tbody = document.getElementById('photosTable');
        
        if (allPhotos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: #94a3b8;">
                        No hay fotos disponibles
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = allPhotos.map(photo => `
            <tr>
                <td><strong>${photo.filename}</strong></td>
                <td>${photo.folder}</td>
                <td>${formatFileSize(photo.size)}</td>
                <td>${new Date(photo.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="action-btn action-btn-delete" onclick="deletePhoto('${photo.folder}', '${photo.filename}')">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error cargando fotos:', error);
        showAlert('Error al cargar fotos', 'error');
    }
}

async function deletePhoto(folderName, filename) {
    if (!confirm(`¿Estás seguro de que deseas eliminar "${filename}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(
            `${API_URL}/photos/delete?folder_name=${encodeURIComponent(folderName)}&filename=${encodeURIComponent(filename)}`,
            { method: 'DELETE' }
        );
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error eliminando foto');
        }
        
        showAlert(`✓ Foto "${filename}" eliminada exitosamente`, 'success');
        await loadAllPhotos();
        await loadDashboardData();
    } catch (error) {
        console.error('Error eliminando foto:', error);
        showAlert('Error: ' + error.message, 'error');
    }
}

// ==================== GESTIÓN DE PAGOS ====================

async function loadPayments() {
    try {
        // Datos simulados de pagos (en producción vendrían del backend)
        const payments = [
            {
                id: 'TXN001',
                customer: 'Cliente 1',
                amount: 29.97,
                date: new Date().toLocaleDateString(),
                status: 'Completado'
            },
            {
                id: 'TXN002',
                customer: 'Cliente 2',
                amount: 19.98,
                date: new Date().toLocaleDateString(),
                status: 'Completado'
            },
            {
                id: 'TXN003',
                customer: 'Cliente 3',
                amount: 9.99,
                date: new Date().toLocaleDateString(),
                status: 'Pendiente'
            }
        ];
        
        adminData.payments = payments;
        
        const tbody = document.getElementById('paymentsTable');
        
        tbody.innerHTML = payments.map(payment => `
            <tr>
                <td><strong>${payment.id}</strong></td>
                <td>${payment.customer}</td>
                <td>$${payment.amount.toFixed(2)}</td>
                <td>${payment.date}</td>
                <td>
                    <span class="badge ${payment.status === 'Completado' ? 'badge-success' : 'badge-warning'}">
                        ${payment.status}
                    </span>
                </td>
                <td>
                    <button class="action-btn action-btn-view" onclick="viewPaymentDetails('${payment.id}')">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error cargando pagos:', error);
        showAlert('Error al cargar pagos', 'error');
    }
}

function viewPaymentDetails(paymentId) {
    const payment = adminData.payments.find(p => p.id === paymentId);
    if (payment) {
        alert(`Detalles de Pago:\n\nID: ${payment.id}\nCliente: ${payment.customer}\nMonto: $${payment.amount.toFixed(2)}\nFecha: ${payment.date}\nEstado: ${payment.status}`);
    }
}

// ==================== REPORTES ====================

async function loadReports() {
    try {
        // Cargar datos para reportes
        const foldersResponse = await fetch(`${API_URL}/folders/list`);
        const foldersData = await foldersResponse.json();
        
        // Fotos por escuela
        let photosBySchool = {};
        let totalPhotos = 0;
        
        if (foldersData.folders) {
            for (const folder of foldersData.folders) {
                const photosResponse = await fetch(`${API_URL}/photos/list?folder_name=${folder.name}`);
                const photosData = await photosResponse.json();
                const count = photosData.photos ? photosData.photos.length : 0;
                photosBySchool[folder.name] = count;
                totalPhotos += count;
            }
        }
        
        // Mostrar fotos por escuela
        const schoolDiv = document.getElementById('photosBySchool');
        if (Object.keys(photosBySchool).length > 0) {
            schoolDiv.innerHTML = Object.entries(photosBySchool)
                .map(([school, count]) => `<div>${school}: <strong>${count}</strong> fotos</div>`)
                .join('');
        } else {
            schoolDiv.innerHTML = '<div>No hay datos disponibles</div>';
        }
        
        // Ingresos por mes (simulado)
        const revenueDiv = document.getElementById('revenueByMonth');
        const monthlyRevenue = totalPhotos * 9.99 * 0.5;
        revenueDiv.innerHTML = `<div>Este mes: <strong>$${monthlyRevenue.toFixed(2)}</strong></div>`;
        
        // Tabla de reportes
        const tbody = document.getElementById('reportsTable');
        tbody.innerHTML = `
            <tr>
                <td>Total de Fotos</td>
                <td><strong>${totalPhotos}</strong></td>
                <td><span class="badge badge-success">↑ 45</span></td>
            </tr>
            <tr>
                <td>Total de Carpetas</td>
                <td><strong>${foldersData.folders ? foldersData.folders.length : 0}</strong></td>
                <td><span class="badge badge-success">↑ 2</span></td>
            </tr>
            <tr>
                <td>Ingresos Totales</td>
                <td><strong>$${monthlyRevenue.toFixed(2)}</strong></td>
                <td><span class="badge badge-success">↑ 12%</span></td>
            </tr>
            <tr>
                <td>Transacciones</td>
                <td><strong>${Math.floor(totalPhotos / 3)}</strong></td>
                <td><span class="badge badge-success">↑ 8</span></td>
            </tr>
        `;
    } catch (error) {
        console.error('Error cargando reportes:', error);
        showAlert('Error al cargar reportes', 'error');
    }
}

// ==================== CONFIGURACIÓN ====================

function saveSettings() {
    const backendUrl = document.getElementById('backendUrlSetting').value.trim();
    const photoPrice = document.getElementById('photoPriceSetting').value;
    const taxRate = document.getElementById('taxRateSetting').value;
    
    if (!backendUrl || !photoPrice || !taxRate) {
        showAlert('Por favor completa todos los campos', 'error');
        return;
    }
    
    // Guardar en localStorage
    localStorage.setItem('backendURL', backendUrl);
    localStorage.setItem('photoPrice', photoPrice);
    localStorage.setItem('taxRate', taxRate);
    
    showAlert('✓ Configuración guardada exitosamente', 'success');
}

// ==================== UTILIDADES ====================

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Cargar configuración al iniciar
window.addEventListener('load', () => {
    const savedBackendUrl = localStorage.getItem('backendURL');
    const savedPhotoPrice = localStorage.getItem('photoPrice');
    const savedTaxRate = localStorage.getItem('taxRate');
    
    if (savedBackendUrl) document.getElementById('backendUrlSetting').value = savedBackendUrl;
    if (savedPhotoPrice) document.getElementById('photoPriceSetting').value = savedPhotoPrice;
    if (savedTaxRate) document.getElementById('taxRateSetting').value = savedTaxRate;
});

