// Vista para el módulo de scanner
const ScannerView = {
    render(eventoNombre) {
        return `
            <div class="header">
                <h1 id="evento-title">${eventoNombre}</h1>
                <div class="header-right">
                    <button onclick="router.navigate('/asistencia')" class="btn-secondary" style="margin-right: 10px;">← Volver</button>
                    ${this.renderUserDropdown('user-dropdown-scanner')}
                </div>
            </div>
            
            <div class="container">
                <!-- Controles de escaneo -->
                <div class="scanner-controls">
                    <button id="btn-camera" class="btn-primary" style="padding: 8px 16px; font-size: 14px; margin: 0 5px;">📷 Cámara</button>
                    <button id="btn-file" class="btn-secondary" style="padding: 8px 16px; font-size: 14px; margin: 0 5px;">📁 Cargar Foto</button>
                </div>
                
                <!-- Área principal - solo se muestra UNA opción a la vez -->
                <div id="scanner-container"></div>
                
                <!-- Herramientas para cargar fotos (ocultas por defecto) -->
                <div id="photo-tools" class="scanner-controls" style="display: none; background: #e8f5e8; border: 2px solid #28a745;">
                    <input type="file" id="qr-file-input" accept="image/*" style="padding: 8px; margin: 0 5px; border-radius: 5px; border: 1px solid #28a745;">
                    <button id="btn-process-image" class="btn-success" style="padding: 8px 16px; font-size: 14px; margin: 0 5px;">🔍 Procesar Imagen</button>
                    <p style="color: #28a745; font-size: 12px; margin: 5px; text-align: center; width: 100%;">Selecciona una imagen con código QR y presiona "Procesar Imagen"</p>
                </div>
                
                <div id="reader"></div>
                <div id="mensaje"></div>
                <div class="asistencias-box">
                    <h3>📋 Asistencias Registradas</h3>
                    <div id="asistencias-list"></div>
                </div>
            </div>
        `;
    },
    
    renderUserDropdown(id) {
        return `
            <div class="user-dropdown" id="${id}">
                <button class="user-dropdown-btn" onclick="ScannerController.toggleUserDropdown('${id}')">
                    <span class="user-display-name">${Auth.getUserName()}</span>
                    <span>▼</span>
                </button>
                <div class="user-dropdown-content">
                    <p><strong>Rol:</strong> <span class="dropdown-rol">${Auth.getUserRole().toUpperCase()}</span></p>
                    <button onclick="Auth.logout()" class="btn-secondary" style="width: 100%; margin-top: 10px;">Cerrar Sesión</button>
                </div>
            </div>
        `;
    }
};
