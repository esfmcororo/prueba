// ========== APLICACIÓN PRINCIPAL ==========

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', async () => {
    console.log(`🚀 Iniciando ${CONFIG.APP_NAME} v${CONFIG.VERSION}`);
    
    // Inicializar componentes core
    Auth.init();
    await Database.initializeData();
    
    // Registrar rutas
    registerRoutes();
    
    // Inicializar router
    router.init('app');
    
    console.log('✅ Aplicación inicializada');
});

// Registrar todas las rutas
function registerRoutes() {
    // Ruta: Login
    router.register('/', LoginModule);
    
    // Ruta: Dashboard
    router.register('/dashboard', DashboardModule);
    
    // Ruta: Asistencia
    router.register('/asistencia', {
        load: async (container) => {
            container.innerHTML = AsistenciaView.render();
            await AsistenciaController.init();
        }
    });
    
    // Ruta: Crear Evento
    router.register('/crear-evento', {
        requiresAdmin: true,
        load: async (container) => {
            container.innerHTML = CrearEventoView.render();
            await CrearEventoController.init();
        }
    });
    
    // Ruta: Editar Evento
    router.register('/editar-evento', {
        requiresAdmin: true,
        load: async (container, params) => {
            container.innerHTML = EditarEventoView.render();
            await EditarEventoController.init(params);
        }
    });
    
    // Ruta: Scanner
    router.register('/scanner', {
        load: async (container, params) => {
            container.innerHTML = ScannerView.render(params.eventoNombre || 'Evento');
            await ScannerController.init(params);
        }
    });
    
    // Ruta: Ver Asistencias
    router.register('/ver-asistencias', {
        load: async (container, params) => {
            container.innerHTML = VerAsistenciasView.render(params.eventoNombre || 'Evento');
            await VerAsistenciasController.init(params);
        }
    });
    
    // Ruta: Estudiantes
    router.register('/estudiantes', {
        requiresAdmin: true,
        load: async (container) => {
            container.innerHTML = EstudiantesView.render();
            await EstudiantesController.init();
        }
    });
    
    // Ruta: Personal
    router.register('/personal', {
        requiresAdmin: true,
        load: async (container) => {
            container.innerHTML = `
                <div class="header">
                    <h1>Gestión de Personal</h1>
                    <button onclick="router.navigate('/asistencia')" class="btn-secondary">← Volver</button>
                </div>
                <div class="container">
                    <p style="color: white;">Módulo en construcción...</p>
                </div>
            `;
        }
    });
    
    // Ruta: Usuarios (placeholder por ahora)
    router.register('/usuarios', {
        requiresAdmin: true,
        load: async (container) => {
            container.innerHTML = `
                <div class="header">
                    <h1>Gestión de Usuarios</h1>
                    <button onclick="router.navigate('/dashboard')" class="btn-secondary">← Volver</button>
                </div>
                <div class="container">
                    <p style="color: white;">Módulo en construcción...</p>
                </div>
            `;
        }
    });
    
    // Ruta: Biblioteca (placeholder por ahora)
    router.register('/biblioteca', {
        load: async (container) => {
            container.innerHTML = `
                <div class="header">
                    <h1>Biblioteca</h1>
                    <button onclick="router.navigate('/dashboard')" class="btn-secondary">← Volver</button>
                </div>
                <div class="container">
                    <p style="color: white;">Módulo próximamente disponible...</p>
                </div>
            `;
        }
    });
    
    if (CONFIG.DEBUG) console.log('📍 Rutas registradas');
}
