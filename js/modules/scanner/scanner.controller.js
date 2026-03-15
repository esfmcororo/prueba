// Controlador para el módulo de scanner
const ScannerController = {
    eventoId: null,
    eventoNombre: null,
    html5QrCode: null,
    isScanning: false,
    
    async init(params = {}) {
        this.eventoId = params.eventoId;
        this.eventoNombre = params.eventoNombre;
        
        if (!this.eventoId || !this.eventoNombre) {
            alert('Información del evento no especificada');
            router.navigate('/asistencia');
            return;
        }
        
        // Configurar botones
        document.getElementById('btn-camera').onclick = () => this.startCameraScanner();
        document.getElementById('btn-file').onclick = () => this.showFileUpload();
        document.getElementById('btn-process-image').onclick = () => this.processSelectedImage();
        
        // Estado inicial: todo oculto
        const scannerContainer = document.getElementById('scanner-container');
        const photoTools = document.getElementById('photo-tools');
        if (scannerContainer) scannerContainer.style.display = 'none';
        if (photoTools) photoTools.style.display = 'none';
        
        // Cargar asistencias
        await this.loadAsistencias();
    },
    
    startCameraScanner() {
        const scannerContainer = document.getElementById('scanner-container');
        const photoTools = document.getElementById('photo-tools');
        
        // Detener cámara anterior si existe
        if (this.html5QrCode) {
            if (this.html5QrCode.isScanning) {
                this.html5QrCode.stop().catch(console.error);
            }
            this.html5QrCode = null;
        }
        
        // Ocultar herramientas de foto
        if (photoTools) photoTools.style.display = 'none';
        
        // Preparar área de cámara
        if (scannerContainer) {
            scannerContainer.innerHTML = '<div id="camera-reader" style="width: 100%; max-width: 500px; margin: 0 auto; min-height: 300px; background: #000; border-radius: 8px;"></div>';
            scannerContainer.style.display = 'block';
        }
        
        // Actualizar botones
        document.getElementById('btn-camera').className = 'btn-primary';
        document.getElementById('btn-file').className = 'btn-secondary';
        
        // Inicializar cámara
        setTimeout(() => {
            const cameraReader = document.getElementById('camera-reader');
            if (!cameraReader) return;
            
            this.html5QrCode = new Html5Qrcode("camera-reader");
            
            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            };
            
            this.html5QrCode.start(
                { facingMode: "environment" },
                config,
                (decodedText) => this.onScanSuccess(decodedText),
                () => {} // Silenciar errores de escaneo
            ).catch(err => {
                console.error('Error iniciando cámara:', err);
                if (cameraReader) {
                    cameraReader.innerHTML = `
                        <div style="text-align: center; padding: 20px; color: #dc3545; background: #f8d7da; border-radius: 8px;">
                            <h4>❌ Error de Cámara</h4>
                            <p>No se pudo acceder a la cámara.</p>
                            <small>Verifica los permisos del navegador</small>
                        </div>
                    `;
                }
            });
        }, 300);
    },
    
    showFileUpload() {
        const scannerContainer = document.getElementById('scanner-container');
        const photoTools = document.getElementById('photo-tools');
        
        // Detener cámara
        if (this.html5QrCode) {
            if (this.html5QrCode.isScanning) {
                this.html5QrCode.stop().catch(console.error);
            }
            this.html5QrCode = null;
        }
        
        // Ocultar área de cámara
        if (scannerContainer) {
            scannerContainer.innerHTML = '';
            scannerContainer.style.display = 'none';
        }
        
        // Mostrar herramientas de foto
        if (photoTools) photoTools.style.display = 'flex';
        
        // Actualizar botones
        document.getElementById('btn-camera').className = 'btn-secondary';
        document.getElementById('btn-file').className = 'btn-primary';
        
        // Limpiar input
        const fileInput = document.getElementById('qr-file-input');
        if (fileInput) fileInput.value = '';
    },
    
    processSelectedImage() {
        const fileInput = document.getElementById('qr-file-input');
        const file = fileInput.files[0];
        
        if (!file) {
            alert('Selecciona primero una imagen');
            return;
        }
        
        // Crear escáner temporal
        const tempScannerId = 'temp-file-scanner-' + Date.now();
        const tempDiv = document.createElement('div');
        tempDiv.id = tempScannerId;
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);
        
        const fileScanner = new Html5Qrcode(tempScannerId);
        
        fileScanner.scanFile(file, true)
            .then(decodedText => {
                document.body.removeChild(tempDiv);
                this.onScanSuccess(decodedText);
            })
            .catch(err => {
                console.error('Error escaneando archivo:', err);
                document.body.removeChild(tempDiv);
                alert('❌ No se pudo leer el código QR de la imagen.');
            });
        
        fileInput.value = '';
    },
    
    async onScanSuccess(qrData) {
        if (this.isScanning) return;
        this.isScanning = true;
        
        try {
            // Extraer código único del QR
            const qrParts = qrData.split('|');
            const codigoUnico = qrParts[qrParts.length - 1];
            
            // Buscar estudiante
            const result = await Database.query(
                'SELECT * FROM estudiantes WHERE codigo_unico = ?',
                [codigoUnico]
            );
            
            if (!result.rows || result.rows.length === 0) {
                this.showBigAlert('Código no encontrado', 'error', 'Este código QR no corresponde a ningún estudiante');
                setTimeout(() => { this.isScanning = false; }, 3000);
                return;
            }
            
            const estudiante = result.rows[0];
            const nombreCompleto = `${estudiante.nombre} ${estudiante.apellido_paterno} ${estudiante.apellido_materno || ''}`.trim();
            
            // Verificar duplicados
            const existeResult = await Database.query(
                'SELECT id FROM asistencias WHERE estudiante_id = ? AND evento_id = ?',
                [estudiante.id, this.eventoId]
            );
            
            if (existeResult.rows && existeResult.rows.length > 0) {
                this.showBigAlert(nombreCompleto, 'warning', 'YA REGISTRADO\n\nEsta persona ya tiene su asistencia registrada');
                setTimeout(() => { this.isScanning = false; }, 3000);
                return;
            }
            
            // Registrar asistencia
            await Database.query(
                'INSERT INTO asistencias (estudiante_id, evento_id, timestamp) VALUES (?, ?, ?)',
                [estudiante.id, this.eventoId, new Date().toISOString()]
            );
            
            this.showBigAlert(nombreCompleto, 'success', 'ASISTENCIA REGISTRADA\n\nRegistro guardado correctamente');
            setTimeout(() => this.loadAsistencias(), 1000);
            setTimeout(() => { this.isScanning = false; }, 3000);
            
        } catch (error) {
            console.error('Error procesando QR:', error);
            this.showBigAlert('Error', 'error', 'Ocurrió un error al procesar el código');
            setTimeout(() => { this.isScanning = false; }, 3000);
        }
    },
    
    showBigAlert(nombre, tipo, mensaje) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const alertBox = document.createElement('div');
        const bgColor = tipo === 'success' ? '#28a745' : tipo === 'warning' ? '#ffc107' : '#dc3545';
        const textColor = tipo === 'warning' ? '#000' : '#fff';
        
        alertBox.style.cssText = `
            background: ${bgColor};
            color: ${textColor};
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            max-width: 90%;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        `;
        
        alertBox.innerHTML = `
            <div style="font-size: 4rem; margin-bottom: 20px;">
                ${tipo === 'success' ? '✅' : tipo === 'warning' ? '⚠️' : '❌'}
            </div>
            <h2 style="font-size: 2rem; margin-bottom: 15px; font-weight: bold;">
                ${nombre}
            </h2>
            <p style="font-size: 1.5rem; margin: 0; white-space: pre-line;">
                ${mensaje}
            </p>
        `;
        
        overlay.appendChild(alertBox);
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        }, 3000);
        
        overlay.addEventListener('click', () => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        });
    },
    
    async loadAsistencias() {
        const listEl = document.getElementById('asistencias-list');
        
        try {
            const result = await Database.query(`
                SELECT a.*, e.nombre, e.apellido_paterno, e.apellido_materno, e.codigo_unico, e.dni
                FROM asistencias a
                JOIN estudiantes e ON a.estudiante_id = e.id
                WHERE a.evento_id = ?
                ORDER BY a.timestamp DESC
            `, [this.eventoId]);
            
            if (!result.rows || result.rows.length === 0) {
                listEl.innerHTML = '<p style="text-align: center; color: #666;">No hay asistencias registradas</p>';
                return;
            }
            
            listEl.innerHTML = '';
            result.rows.forEach(asistencia => {
                const item = document.createElement('div');
                item.className = 'asistencia-item';
                const time = new Date(asistencia.timestamp).toLocaleString('es-BO', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour12: false
                });
                const nombreCompleto = `${asistencia.nombre} ${asistencia.apellido_paterno} ${asistencia.apellido_materno || ''}`.trim();
                item.innerHTML = `
                    <div style="width: 100%;">
                        <strong style="font-size: 16px; color: #333;">${nombreCompleto}</strong><br>
                        <small style="color: #666; font-size: 13px;">
                            📋 ${asistencia.codigo_unico} | 🆔 ${asistencia.dni || 'Sin DNI'}
                        </small>
                    </div>
                    <span style="color: #007bff; font-weight: bold;">${time}</span>
                `;
                listEl.appendChild(item);
            });
        } catch (error) {
            console.error('Error cargando asistencias:', error);
            listEl.innerHTML = '<p style="color: red;">Error cargando asistencias</p>';
        }
    },
    
    toggleUserDropdown(id) {
        const dropdown = document.getElementById(id);
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }
};
