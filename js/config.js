// ========== CONFIGURACIÓN GLOBAL ==========
const CONFIG = {
    // Base de datos
    DB_URL: 'libsql://pruebas-sfemcororo.aws-us-east-1.turso.io',
    DB_TOKEN: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzM2MDAzNDksImlkIjoiMDE5Y2YyZDEtNjYwMS03ZjRjLTlhYjUtMmZiZjAxNzFlM2VhIiwicmlkIjoiZTFiY2RhYTAtNmU5NC00NTE4LWIyNDktOTlmOWRiYWQxYTQyIn0.UDUxJYB_QG8OguPF1GTJDfRdUZ2XEjW4AfsW383gj-C4pSyQnV4uoQxD06KFbHVdfcGEYj6tdmpn1epVvWwjBA',
    
    // Aplicación
    APP_NAME: 'ESFM "Simón Bolívar" CORORO',
    VERSION: '2.0.0',
    ENVIRONMENT: 'production', // 'development' | 'production'
    
    // Paginación
    EVENTS_PER_PAGE: 5,
    STUDENTS_PER_PAGE: 20,
    
    // Sistema offline
    MAX_BATCH_SIZE: 10,
    SYNC_INTERVAL: 30000, // 30 segundos
    
    // Timeouts
    DB_TIMEOUT: 3000, // 3 segundos
    CAMERA_DELAY: 300, // 300 ms
    SCAN_DELAY: 5000, // 5 segundos
    EVENT_CHECK_INTERVAL: 60000, // 60 segundos
    
    // QR
    QR_SIZE_DISPLAY: 120, // px
    QR_SIZE_DOWNLOAD: 295, // px (2.5cm a 300 DPI)
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
    
    // LocalStorage keys
    STORAGE_KEYS: {
        CURRENT_USER: 'currentUser',
        OFFLINE_QUEUE: 'asistencias_offline',
        STUDENTS_CACHE: 'estudiantes_cache'
    },
    
    // Debug
    DEBUG: false
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
