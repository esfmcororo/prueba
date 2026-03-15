// ========== CONFIGURACIÓN DE DESARROLLO ==========
const CONFIG_DEV = {
    // Base de datos LOCAL (SQLite en navegador)
    USE_LOCAL_DB: true, // Cambiar a false para usar Turso
    DB_URL: 'libsql://pruebas-sfemcororo.aws-us-east-1.turso.io',
    DB_TOKEN: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzM2MDAzNDksImlkIjoiMDE5Y2YyZDEtNjYwMS03ZjRjLTlhYjUtMmZiZjAxNzFlM2VhIiwicmlkIjoiZTFiY2RhYTAtNmU5NC00NTE4LWIyNDktOTlmOWRiYWQxYTQyIn0.UDUxJYB_QG8OguPF1GTJDfRdUZ2XEjW4AfsW383gj-C4pSyQnV4uoQxD06KFbHVdfcGEYj6tdmpn1epVvWwjBA',
    
    // Aplicación
    APP_NAME: 'ESFM "Simón Bolívar" CORORO [DEV]',
    VERSION: '2.0.0-dev',
    ENVIRONMENT: 'development',
    
    // Paginación
    EVENTS_PER_PAGE: 5,
    STUDENTS_PER_PAGE: 20,
    
    // Sistema offline
    MAX_BATCH_SIZE: 10,
    SYNC_INTERVAL: 30000,
    
    // Timeouts
    DB_TIMEOUT: 3000,
    CAMERA_DELAY: 300,
    SCAN_DELAY: 5000,
    EVENT_CHECK_INTERVAL: 60000,
    
    // QR
    QR_SIZE_DISPLAY: 120,
    QR_SIZE_DOWNLOAD: 295,
    QR_DPI: 300,
    
    // Especialidades
    ESPECIALIDADES: [
        'EDUCACIÓN PRIMARIA COMUNITARIA VOCACIONAL',
        'ARTES PLÁSTICAS Y VISUALES',
        'MATEMÁTICA',
        'COMUNICACIÓN Y LENGUAJES: LENGUA EXTRANJERA (INGLÉS)',
        'EDUCACIÓN INICIAL EN FAMILIA COMUNITARIA'
    ],
    
    // Años de formación
    ANIOS_FORMACION: ['PRIMERO', 'SEGUNDO', 'TERCERO', 'CUARTO', 'QUINTO'],
    
    // Roles
    ROLES: {
        ADMIN: 'admin',
        USUARIO: 'usuario'
    },
    
    // LocalStorage keys (usar prefijo dev para no interferir)
    STORAGE_KEYS: {
        CURRENT_USER: 'dev_currentUser',
        OFFLINE_QUEUE: 'dev_asistencias_offline',
        STUDENTS_CACHE: 'dev_estudiantes_cache',
        LOCAL_DB: 'dev_local_database'
    },
    
    // Debug
    DEBUG: true
};

// Usar CONFIG_DEV en lugar de CONFIG
const CONFIG = CONFIG_DEV;
