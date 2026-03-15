// ========== MÓDULO DE AUTENTICACIÓN ==========
class Auth {
    static currentUser = null;
    
    // Inicializar autenticación
    static init() {
        // Cargar usuario desde localStorage
        const userData = localStorage.getItem(CONFIG.STORAGE_KEYS.CURRENT_USER);
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                if (CONFIG.DEBUG) console.log('👤 Usuario cargado:', this.currentUser.nombre);
            } catch (error) {
                console.error('Error cargando usuario:', error);
                this.logout();
            }
        }
    }
    
    // Login
    static async login(emailOrCi, password) {
        try {
            let email = emailOrCi;
            
            // Si es el CI del admin, convertir a email
            if (emailOrCi === '79310777') {
                email = 'admin@escuela.com';
            }
            
            // Buscar usuario en BD
            const result = await Database.query(
                'SELECT * FROM usuarios WHERE (email = ? OR ci = ?) AND password = ?',
                [email, emailOrCi, password]
            );
            
            if (!result.rows || result.rows.length === 0) {
                throw new Error('Credenciales incorrectas');
            }
            
            const user = result.rows[0];
            
            // Guardar usuario
            this.currentUser = user;
            localStorage.setItem(CONFIG.STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
            
            if (CONFIG.DEBUG) console.log('✅ Login exitoso:', user.nombre);
            
            return { success: true, user };
        } catch (error) {
            console.error('❌ Error en login:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Logout
    static logout() {
        this.currentUser = null;
        localStorage.removeItem(CONFIG.STORAGE_KEYS.CURRENT_USER);
        
        // Limpiar otros datos de sesión
        sessionStorage.clear();
        
        if (CONFIG.DEBUG) console.log('👋 Logout exitoso');
        
        // Redirigir a login
        router.navigate('/');
    }
    
    // Verificar si está autenticado
    static isAuthenticated() {
        return this.currentUser !== null;
    }
    
    // Verificar si es admin
    static isAdmin() {
        return this.currentUser && this.currentUser.rol === CONFIG.ROLES.ADMIN;
    }
    
    // Verificar si es usuario
    static isUsuario() {
        return this.currentUser && this.currentUser.rol === CONFIG.ROLES.USUARIO;
    }
    
    // Obtener usuario actual
    static getUser() {
        return this.currentUser;
    }
    
    // Obtener nombre del usuario
    static getUserName() {
        return this.currentUser ? this.currentUser.nombre : '';
    }
    
    // Obtener rol del usuario
    static getUserRole() {
        return this.currentUser ? this.currentUser.rol : '';
    }
    
    // Verificar permisos
    static hasPermission(permission) {
        if (!this.isAuthenticated()) return false;
        
        // Admin tiene todos los permisos
        if (this.isAdmin()) return true;
        
        // Definir permisos por rol
        const permissions = {
            [CONFIG.ROLES.USUARIO]: [
                'view_events',
                'take_attendance',
                'view_students',
                'generate_qr'
            ],
            [CONFIG.ROLES.ADMIN]: ['*'] // Todos los permisos
        };
        
        const userPermissions = permissions[this.currentUser.rol] || [];
        return userPermissions.includes('*') || userPermissions.includes(permission);
    }
}

// Inicializar al cargar
Auth.init();
