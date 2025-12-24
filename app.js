// Configurar URL del API
let API_URL;

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    API_URL = "http://localhost:8000";
} else {
    const storedURL = localStorage.getItem('backendURL');
    API_URL = storedURL || "https://surf-backend-production-e2c1.up.railway.app";
}

console.log('🔗 API_URL:', API_URL);

// Variables globales
let currentFolder = null;
let selfieBlob = null;
let photosFiles = [];
let videoStream = null;

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

// ==================== GESTIÓN DE CARPETAS ====================

async function createFolder() {
    const input = document.getElementById('folderNameInput');
    const folderName = input.value.trim();
    
    if (!folderName) {
        showError('Por favor ingresa un nombre para la carpeta');
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
        
        showSuccess(`Carpeta "${folderName}" creada exitosamente`);
        input.value = '';
        loadFolders();
    } catch (error) {
        showError('Error: ' + error.message);
    }
}

async function loadFolders() {
    try {
        const response = await fetch(`${API_URL}/folders/list`);
        
        if (!response.ok) throw new Error('Error cargando carpetas');
        
        const data = await response.json();
        const foldersList = document.getElementById('foldersList');
        
        if (data.folders.length === 0) {
            foldersList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📂</div>
                    <div class="empty-state-text">Sin carpetas</div>
                    <div style="font-size: 13px;">Crea una carpeta para comenzar</div>
                </div>
            `;
            return;
        }
        
        foldersList.innerHTML = data.folders.map(folder => `
            <div class="folder-item ${currentFolder === folder.name ? 'active' : ''}" onclick="selectFolder('${folder.name}')">
                <div class="folder-info">
                    <div class="folder-name">${folder.name}</div>
                    <div class="folder-count">${folder.photo_count} foto(s)</div>
                </div>
                <div class="folder-actions">
                    <button class="btn-delete" onclick="event.stopPropagation(); deleteFolder('${folder.name}')">Eliminar</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        showError('Error cargando carpetas: ' + error.message);
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
        
        if (!response.ok) throw new Error('Error eliminando carpeta');
        
        showSuccess(`Carpeta "${folderName}" eliminada`);
        if (currentFolder === folderName) {
            currentFolder = null;
        }
        loadFolders();
    } catch (error) {
        showError('Error: ' + error.message);
    }
}

function selectFolder(folderName) {
    currentFolder = folderName;
    loadFolders();
    loadPhotos();
    updateUploadUI();
    updateSearchUI();
}

// ==================== GESTIÓN DE FOTOS ====================

async function loadPhotos() {
    if (!currentFolder) return;
    
    try {
        const response = await fetch(`${API_URL}/photos/list?folder_name=${encodeURIComponent(currentFolder)}`);
        
        if (!response.ok) throw new Error('Error cargando fotos');
        
        const data = await response.json();
        const photosContent = document.getElementById('photosContent');
        
        if (data.photos.length === 0) {
            photosContent.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🖼️</div>
                    <div class="empty-state-text">Sin fotos</div>
                    <div style="font-size: 13px;">Sube fotos a esta carpeta</div>
                </div>
            `;
            return;
        }
        
        photosContent.innerHTML = `
            <div class="photos-grid">
                ${data.photos.map(photo => `
                    <div class="photo-card">
                        <img src="data:image/jpeg;base64,..." alt="${photo.filename}" onerror="this.style.display='none'">
                        <div class="photo-info">
                            <div class="photo-name">${photo.filename}</div>
                            <div class="photo-actions">
                                <button class="btn-small btn-small-danger" onclick="deletePhoto('${photo.filename}')">Eliminar</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        showError('Error cargando fotos: ' + error.message);
    }
}

async function deletePhoto(filename) {
    if (!currentFolder) return;
    
    if (!confirm(`¿Estás seguro de que deseas eliminar "${filename}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(
            `${API_URL}/photos/delete?folder_name=${encodeURIComponent(currentFolder)}&filename=${encodeURIComponent(filename)}`,
            { method: 'DELETE' }
        );
        
        if (!response.ok) throw new Error('Error eliminando foto');
        
        showSuccess('Foto eliminada');
        loadPhotos();
    } catch (error) {
        showError('Error: ' + error.message);
    }
}

// ==================== CÁMARA ====================

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

// ==================== SUBIR FOTOS ====================

function updateUploadUI() {
    const uploadContent = document.getElementById('uploadContent');
    
    if (!currentFolder) {
        uploadContent.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📂</div>
                <div class="empty-state-text">Selecciona una carpeta primero</div>
                <div style="font-size: 13px;">Elige una carpeta en el panel izquierdo</div>
            </div>
        `;
        return;
    }
    
    uploadContent.innerHTML = `
        <div class="upload-section">
            <h3>Subir Fotos a "${currentFolder}"</h3>
            <label for="photosInput">Selecciona múltiples fotos:</label>
            <input type="file" id="photosInput" accept="image/*" multiple onchange="handlePhotoSelect(event)">
            <div class="file-info">Máximo: 5MB cada una</div>
            
            <div class="files-preview" id="filesPreview"></div>
            
            <div class="camera-controls" style="margin-top: 20px;">
                <button class="btn-success" id="uploadBtn" onclick="uploadPhotos()" disabled>Subir Fotos</button>
                <button class="btn-danger" onclick="clearPhotos()">Limpiar</button>
            </div>
        </div>
    `;
}

function handlePhotoSelect(event) {
    photosFiles = Array.from(event.target.files);
    updateFilesPreview();
    
    document.getElementById('uploadBtn').disabled = photosFiles.length === 0;
}

function updateFilesPreview() {
    const preview = document.getElementById('filesPreview');
    
    if (photosFiles.length === 0) {
        preview.innerHTML = '';
        return;
    }
    
    let html = `<p>✓ ${photosFiles.length} foto(s) seleccionada(s)</p>`;
    html += '<div class="file-list">';
    
    photosFiles.forEach(file => {
        html += `<div class="file-item">📄 ${file.name}</div>`;
    });
    
    html += '</div>';
    preview.innerHTML = html;
}

function clearPhotos() {
    photosFiles = [];
    const input = document.getElementById('photosInput');
    if (input) input.value = '';
    updateFilesPreview();
    document.getElementById('uploadBtn').disabled = true;
}

async function uploadPhotos() {
    if (!currentFolder) {
        showError('Por favor selecciona una carpeta');
        return;
    }
    
    if (photosFiles.length === 0) {
        showError('Por favor selecciona al menos una foto');
        return;
    }
    
    try {
        const formData = new FormData();
        photosFiles.forEach(file => {
            formData.append('photos', file);
        });
        
        const response = await fetch(
            `${API_URL}/photos/upload?folder_name=${encodeURIComponent(currentFolder)}`,
            {
                method: 'POST',
                body: formData
            }
        );
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error subiendo fotos');
        }
        
        const data = await response.json();
        showSuccess(`${data.uploaded} foto(s) subida(s) exitosamente`);
        
        if (data.errors.length > 0) {
            showError('Errores: ' + data.errors.join(', '));
        }
        
        clearPhotos();
        loadPhotos();
    } catch (error) {
        showError('Error: ' + error.message);
    }
}

// ==================== BÚSQUEDA ====================

function updateSearchUI() {
    const searchContent = document.getElementById('searchContent');
    
    searchContent.innerHTML = `
        <div class="camera-section">
            <h3 style="color: #0f172a; margin-bottom: 20px;">🔍 Buscar Similitudes en TODAS las Carpetas</h3>
            <p style="color: #64748b; margin-bottom: 20px;">Captura tu rostro y busca coincidencias en todas tus carpetas</p>
            
            <div id="searchCameraContainer">
                <div id="searchVideoContainer" style="display: none;">
                    <video id="searchVideo" autoplay playsinline style="width: 100%; max-width: 500px; border-radius: 12px; margin-bottom: 20px;"></video>
                    <div class="camera-controls">
                        <button class="btn-success" onclick="captureSearchSelfie()">Capturar Selfie</button>
                        <button class="btn-danger" onclick="stopSearchCamera()">Detener</button>
                    </div>
                </div>
                
                <div id="searchInitial">
                    <button class="btn-primary" onclick="startSearchCamera()">Iniciar Cámara</button>
                </div>
            </div>
            
            <div class="selfie-preview" id="searchSelfiePreview"></div>
            
            <div id="searchResults" style="display: none; margin-top: 30px;"></div>
        </div>
    `;
}

async function startSearchCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' }
        });
        
        const video = document.createElement('video');
        video.id = 'searchVideo';
        video.autoplay = true;
        video.playsinline = true;
        video.srcObject = stream;
        videoStream = stream;
        
        document.getElementById('searchVideoContainer').style.display = 'block';
        document.getElementById('searchInitial').style.display = 'none';
        
        const container = document.getElementById('searchVideoContainer');
        const existingVideo = container.querySelector('video');
        if (existingVideo) existingVideo.remove();
        container.insertBefore(video, container.firstChild);
        
        showInfo('Cámara iniciada para búsqueda');
    } catch (error) {
        showError('Error al acceder a la cámara: ' + error.message);
    }
}

function captureSearchSelfie() {
    const video = document.getElementById('searchVideo');
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
            const preview = document.getElementById('searchSelfiePreview');
            preview.innerHTML = `
                <p>✓ Selfie capturado</p>
                <img src="${e.target.result}" alt="Selfie">
            `;
        };
        reader.readAsDataURL(blob);
        
        showSuccess('Selfie capturado. Buscando similitudes...');
        searchSimilar();
    });
}

function stopSearchCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
    
    document.getElementById('searchVideoContainer').style.display = 'none';
    document.getElementById('searchInitial').style.display = 'block';
}

async function searchSimilar() {
    if (!selfieBlob) {
        showError('Por favor captura un selfie primero');
        return;
    }
    
    try {
        const formData = new FormData();
        formData.append('selfie', selfieBlob, 'selfie.jpg');
        
        const response = await fetch(
            `${API_URL}/search/similar`,
            {
                method: 'POST',
                body: formData
            }
        );
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error en búsqueda');
        }
        
        const data = await response.json();
        displaySearchResults(data);
    } catch (error) {
        showError('Error: ' + error.message);
    }
}

function displaySearchResults(data) {
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.style.display = 'block';
    
    let html = `
        <div class="statistics">
            <div class="stat-card">
                <div class="stat-value">${data.statistics.total_photos}</div>
                <div class="stat-label">Total de Fotos</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" style="color: #10b981;">${data.statistics.matches_count}</div>
                <div class="stat-label">Coincidencias</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" style="color: #ef4444;">${data.statistics.non_matches_count}</div>
                <div class="stat-label">No Coincidencias</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" style="color: #3b82f6;">${data.statistics.match_percentage}%</div>
                <div class="stat-label">Coincidencia</div>
            </div>
        </div>
    `;
    
    if (data.matches.length > 0) {
        html += `
            <div class="matches-container">
                <h3>✓ Coincidencias Detectadas (${data.matches.length})</h3>
                ${data.matches.map(match => `
                    <div class="match-item">
                        <span class="match-file">${match.file}</span>
                        <span class="match-similarity">${match.similarity}%</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    if (data.non_matches.length > 0) {
        html += `
            <div class="non-matches-container">
                <h3>✗ No Coincidencias (${data.non_matches.length})</h3>
                ${data.non_matches.map(match => `
                    <div class="non-match-item">
                        <span class="non-match-file">${match.file}</span>
                        <span class="non-match-similarity">${match.similarity}%</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    resultsDiv.innerHTML = html;
    showSuccess('Búsqueda completada');
}

// ==================== NAVEGACIÓN ====================

function switchTab(tabName, evt) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName + '-tab').classList.add('active');
    if (evt && evt.target) {
        evt.target.classList.add('active');
    }
}

// ==================== ANÁLISIS AVANZADO ====================

let advancedSelfieFile = null;
let advancedPhotosFiles = [];

// Configurar eventos de upload para análisis avanzado
document.addEventListener('DOMContentLoaded', () => {
    // Selfie upload
    const selfieArea = document.getElementById('selfieUploadArea');
    const selfieInput = document.getElementById('selfieUploadInput');
    
    if (selfieArea && selfieInput) {
        selfieArea.addEventListener('click', () => selfieInput.click());
        selfieArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            selfieArea.classList.add('dragover');
        });
        selfieArea.addEventListener('dragleave', () => {
            selfieArea.classList.remove('dragover');
        });
        selfieArea.addEventListener('drop', (e) => {
            e.preventDefault();
            selfieArea.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                selfieInput.files = e.dataTransfer.files;
                handleAdvancedSelfieChange();
            }
        });
        
        selfieInput.addEventListener('change', handleAdvancedSelfieChange);
    }
    
    // Photos upload
    const photosArea = document.getElementById('photosUploadArea');
    const photosInput = document.getElementById('photosUploadInput');
    
    if (photosArea && photosInput) {
        photosArea.addEventListener('click', () => photosInput.click());
        photosArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            photosArea.classList.add('dragover');
        });
        photosArea.addEventListener('dragleave', () => {
            photosArea.classList.remove('dragover');
        });
        photosArea.addEventListener('drop', (e) => {
            e.preventDefault();
            photosArea.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                photosInput.files = e.dataTransfer.files;
                handleAdvancedPhotosChange();
            }
        });
        
        photosInput.addEventListener('change', handleAdvancedPhotosChange);
    }
});

function handleAdvancedSelfieChange() {
    const input = document.getElementById('selfieUploadInput');
    if (input.files.length > 0) {
        advancedSelfieFile = input.files[0];
        displayAdvancedSelfie();
        updateAdvancedAnalysisButton();
    }
}

function displayAdvancedSelfie() {
    const preview = document.getElementById('selfieUploadPreview');
    preview.innerHTML = '';
    
    if (advancedSelfieFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const item = document.createElement('div');
            item.style.cssText = 'text-align: center; margin-top: 15px;';
            item.innerHTML = `
                <img src="${e.target.result}" alt="Selfie" style="max-width: 150px; max-height: 150px; border-radius: 10px; border: 2px solid #3b82f6;">
                <p style="color: #64748b; font-size: 14px; margin-top: 10px;">✓ ${advancedSelfieFile.name}</p>
                <button onclick="removeAdvancedSelfie()" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px; margin-top: 10px;">Eliminar</button>
            `;
            preview.appendChild(item);
        };
        reader.readAsDataURL(advancedSelfieFile);
    }
}

function removeAdvancedSelfie() {
    advancedSelfieFile = null;
    const input = document.getElementById('selfieUploadInput');
    if (input) input.value = '';
    document.getElementById('selfieUploadPreview').innerHTML = '';
    updateAdvancedAnalysisButton();
}

function handleAdvancedPhotosChange() {
    const input = document.getElementById('photosUploadInput');
    advancedPhotosFiles = Array.from(input.files);
    displayAdvancedPhotos();
    updateAdvancedAnalysisButton();
}

function displayAdvancedPhotos() {
    const preview = document.getElementById('photosUploadPreview');
    preview.innerHTML = '';
    
    if (advancedPhotosFiles.length > 0) {
        const container = document.createElement('div');
        container.style.cssText = 'margin-top: 15px;';
        
        const info = document.createElement('p');
        info.style.cssText = 'color: #64748b; font-size: 14px; margin-bottom: 10px;';
        info.textContent = `✓ ${advancedPhotosFiles.length} foto(s) seleccionada(s)`;
        container.appendChild(info);
        
        const grid = document.createElement('div');
        grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 10px;';
        
        advancedPhotosFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const item = document.createElement('div');
                item.style.cssText = 'position: relative; border-radius: 8px; overflow: hidden;';
                item.innerHTML = `
                    <img src="${e.target.result}" alt="Foto ${index + 1}" style="width: 100%; height: 80px; object-fit: cover;">
                    <button onclick="removeAdvancedPhoto(${index})" style="position: absolute; top: 2px; right: 2px; background: #ef4444; color: white; border: none; border-radius: 4px; padding: 2px 6px; cursor: pointer; font-size: 10px;">✕</button>
                `;
                grid.appendChild(item);
            };
            reader.readAsDataURL(file);
        });
        
        container.appendChild(grid);
        preview.appendChild(container);
    }
}

function removeAdvancedPhoto(index) {
    advancedPhotosFiles.splice(index, 1);
    const input = document.getElementById('photosUploadInput');
    const newFiles = new DataTransfer();
    advancedPhotosFiles.forEach(file => newFiles.items.add(file));
    input.files = newFiles.files;
    displayAdvancedPhotos();
    updateAdvancedAnalysisButton();
}

function updateAdvancedAnalysisButton() {
    const btn = document.getElementById('analyzeBtn');
    // Solo requiere selfie, fotos son opcionales
    const isValid = advancedSelfieFile;
    btn.disabled = !isValid;
    
    if (!isValid) {
        btn.title = 'Sube una foto de referencia';
    } else if (advancedPhotosFiles.length > 0 && (advancedPhotosFiles.length < 4 || advancedPhotosFiles.length > 10)) {
        btn.title = `Si subes fotos, deben ser entre 4 y 10 (tienes ${advancedPhotosFiles.length})`;
        btn.disabled = true;
    } else {
        btn.title = advancedPhotosFiles.length === 0 
            ? 'Buscar en carpeta Surf' 
            : `Comparar con ${advancedPhotosFiles.length} foto(s)`;
    }
}

async function startAdvancedAnalysis() {
    if (!advancedSelfieFile) {
        showError('Por favor sube un selfie');
        return;
    }
    
    try {
        document.getElementById('analysisLoading').style.display = 'block';
        document.getElementById('analysisResults').style.display = 'none';
        
        // Si hay fotos seleccionadas, usar comparación directa
        if (advancedPhotosFiles.length >= 4 && advancedPhotosFiles.length <= 10) {
            const formData = new FormData();
            formData.append('selfie', advancedSelfieFile);
            advancedPhotosFiles.forEach(file => {
                formData.append('photos', file);
            });
            
            const response = await fetch(`${API_URL}/compare-faces`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error en la comparación');
            }
            
            const data = await response.json();
            displayAdvancedResults(data);
        } else {
            // Si no hay fotos, buscar en la carpeta Surf
            showInfo('Buscando en la carpeta Surf...');
            const formData = new FormData();
            formData.append('selfie', advancedSelfieFile);
            
            const response = await fetch(`${API_URL}/search/similar`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error en la búsqueda');
            }
            
            const data = await response.json();
            displayAdvancedResultsFromFolder(data);
        }
        
    } catch (error) {
        showError(`Error: ${error.message}`);
    } finally {
        document.getElementById('analysisLoading').style.display = 'none';
    }
}

function displayAdvancedResultsFromFolder(data) {
    const stats = data.statistics;
    
    // Estadísticas
    const statsHtml = `
        <div class="stat-card">
            <div class="stat-value" style="color: #10b981;">${stats.matches_count}</div>
            <div class="stat-label">Coincidencias en Surf</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.total_photos}</div>
            <div class="stat-label">Fotos Analizadas</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color: #10b981;">${stats.match_percentage}%</div>
            <div class="stat-label">Porcentaje</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color: #3b82f6;">${stats.threshold_used}%</div>
            <div class="stat-label">Umbral</div>
        </div>
    `;
    document.getElementById('analysisStats').innerHTML = statsHtml;
    
    // Coincidencias
    const matchesContainer = document.getElementById('matchesContainer');
    if (data.matches && data.matches.length > 0) {
        const matchesHtml = data.matches.map(match => `
            <div class="match-item">
                <span class="match-file">✅ ${match.file} (${match.folder})</span>
                <span class="match-similarity">${match.similarity.toFixed(1)}%</span>
            </div>
        `).join('');
        document.getElementById('matchesList').innerHTML = matchesHtml;
        matchesContainer.style.display = 'block';
    } else {
        matchesContainer.style.display = 'none';
    }
    
    // No coincidencias
    const nonMatchesContainer = document.getElementById('nonMatchesContainer');
    if (data.non_matches && data.non_matches.length > 0) {
        const nonMatchesHtml = data.non_matches.slice(0, 10).map(match => `
            <div class="non-match-item">
                <span class="non-match-file">❌ ${match.file} (${match.folder})</span>
                <span class="non-match-similarity">${match.similarity.toFixed(1)}%</span>
            </div>
        `).join('');
        document.getElementById('nonMatchesList').innerHTML = nonMatchesHtml;
        nonMatchesContainer.style.display = 'block';
    } else {
        nonMatchesContainer.style.display = 'none';
    }
    
    document.getElementById('analysisResults').style.display = 'block';
    showSuccess('Búsqueda en Surf completada exitosamente');
}

function displayAdvancedResults(data) {
    const stats = data.statistics;
    
    // Estadísticas
    const statsHtml = `
        <div class="stat-card">
            <div class="stat-value">${stats.matches_count}</div>
            <div class="stat-label">Coincidencias</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.total_photos}</div>
            <div class="stat-label">Fotos Analizadas</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color: #10b981;">${stats.match_percentage}%</div>
            <div class="stat-label">Porcentaje</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color: #3b82f6;">${stats.threshold_used}%</div>
            <div class="stat-label">Umbral</div>
        </div>
    `;
    document.getElementById('analysisStats').innerHTML = statsHtml;
    
    // Coincidencias
    const matchesContainer = document.getElementById('matchesContainer');
    if (data.matches.length > 0) {
        const matchesHtml = data.matches.map(match => `
            <div class="match-item">
                <span class="match-file">✅ ${match.file}</span>
                <span class="match-similarity">${match.similarity.toFixed(1)}%</span>
            </div>
        `).join('');
        document.getElementById('matchesList').innerHTML = matchesHtml;
        matchesContainer.style.display = 'block';
    } else {
        matchesContainer.style.display = 'none';
    }
    
    // No coincidencias
    const nonMatchesContainer = document.getElementById('nonMatchesContainer');
    if (data.non_matches.length > 0) {
        const nonMatchesHtml = data.non_matches.map(match => `
            <div class="non-match-item">
                <span class="non-match-file">❌ ${match.file}</span>
                <span class="non-match-similarity">${match.similarity.toFixed(1)}%</span>
            </div>
        `).join('');
        document.getElementById('nonMatchesList').innerHTML = nonMatchesHtml;
        nonMatchesContainer.style.display = 'block';
    } else {
        nonMatchesContainer.style.display = 'none';
    }
    
    document.getElementById('analysisResults').style.display = 'block';
    showSuccess('Análisis completado exitosamente');
}

function resetAnalysis() {
    advancedSelfieFile = null;
    advancedPhotosFiles = [];
    
    const selfieInput = document.getElementById('selfieUploadInput');
    const photosInput = document.getElementById('photosUploadInput');
    
    if (selfieInput) selfieInput.value = '';
    if (photosInput) photosInput.value = '';
    
    document.getElementById('selfieUploadPreview').innerHTML = '';
    document.getElementById('photosUploadPreview').innerHTML = '';
    document.getElementById('analysisResults').style.display = 'none';
    document.getElementById('analysisLoading').style.display = 'none';
    
    updateAdvancedAnalysisButton();
}

// ==================== INICIALIZACIÓN ====================

window.addEventListener('load', async () => {
    try {
        const response = await fetch(`${API_URL}/health`);
        if (response.ok) {
            showInfo('✓ Servidor conectado');
        }
    } catch (error) {
        showError('✗ No se pudo conectar al servidor');
    }
    
    loadFolders();
});