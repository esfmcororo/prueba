// ========== SISTEMA DE RUTAS ==========
class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.container = null;
    }
    
    // Inicializar router
    init(containerId = 'app') {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container no encontrado:', containerId);
            return;
        }
        
        // Escuchar cambios de hash
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // Cargar ruta inicial
        this.handleRoute();
    }
    
    // Registrar ruta
    register(path, module) {
        this.routes.set(path, module);
        if (CONFIG.DEBUG) console.log(`📍 Ruta registrada: ${path}`);
    }
    
    // Navegar a ruta
    navigate(path, params = {}) {
        if (CONFIG.DEBUG) console.log(`🧭 Navegando a: ${path}`, params);
        
        // Guardar parámetros en sessionStorage
        if (Object.keys(params).length > 0) {
            sessionStorage.setItem('routeParams', JSON.stringify(params));
        }
        
        // Cambiar hash
        window.location.hash = path;
    }
    
    // Obtener parámetros de ruta
    getParams() {
        const params = sessionStorage.getItem('routeParams');
        if (params) {
            sessionStorage.removeItem('routeParams');
            return JSON.parse(params);
        }
        return {};
    }
    
    // Manejar cambio de ruta
    async handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const route = this.routes.get(hash);
        
        if (!route) {
            console.warn(`⚠️ Ruta no encontrada: ${hash}`);
            this.navigate('/');
            return;
        }
        
        // Verificar autenticación
        if (hash !== '/' && !Auth.isAuthenticated()) {
            console.log('🔒 Usuario no autenticado, redirigiendo a login');
            this.navigate('/');
            return;
        }
        
        // Verificar permisos de admin
        if (route.requiresAdmin && !Auth.isAdmin()) {
            console.warn('⛔ Acceso denegado: requiere permisos de admin');
            alert('Solo administradores pueden acceder a esta sección');
            this.navigate('/dashboard');
            return;
        }
        
        try {
            // Limpiar container
            this.container.innerHTML = '<div class="loading">Cargando...</div>';
            
            // Cargar módulo
            const params = this.getParams();
            await route.load(this.container, params);
            
            this.currentRoute = hash;
            
            if (CONFIG.DEBUG) console.log(`✅ Ruta cargada: ${hash}`);
        } catch (error) {
            console.error('❌ Error cargando ruta:', error);
            this.container.innerHTML = `
                <div class="error-container">
                    <h2>Error al cargar la página</h2>
                    <p>${error.message}</p>
                    <button onclick="router.navigate('/dashboard')">Volver al inicio</button>
                </div>
            `;
        }
    }
    
    // Volver atrás
    back() {
        window.history.back();
    }
    
    // Recargar ruta actual
    reload() {
        this.handleRoute();
    }
}

// Instancia global del router
const router = new Router();
