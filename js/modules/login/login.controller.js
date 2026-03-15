// ========== MÓDULO LOGIN - CONTROLADOR ==========
const LoginController = {
    // Cargar módulo
    async load(container, params) {
        // Si ya está autenticado, redirigir al dashboard
        if (Auth.isAuthenticated()) {
            router.navigate('/dashboard');
            return;
        }
        
        // Renderizar vista
        container.innerHTML = LoginView.render();
        
        // Configurar eventos
        this.setupEvents();
    },
    
    // Configurar eventos
    setupEvents() {
        const elements = LoginView.getElements();
        
        // Click en botón login
        elements.loginBtn.addEventListener('click', () => this.handleLogin());
        
        // Enter en campos de texto
        elements.emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });
        
        elements.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });
        
        // Focus en primer campo
        elements.emailInput.focus();
    },
    
    // Manejar login
    async handleLogin() {
        const elements = LoginView.getElements();
        const email = elements.emailInput.value.trim();
        const password = elements.passwordInput.value;
        
        // Limpiar error
        elements.errorMsg.textContent = '';
        
        // Validar campos
        if (!email || !password) {
            elements.errorMsg.textContent = 'Completa todos los campos';
            return;
        }
        
        // Deshabilitar botón
        elements.loginBtn.disabled = true;
        elements.loginBtn.textContent = 'Ingresando...';
        
        try {
            // Intentar login
            const result = await Auth.login(email, password);
            
            if (result.success) {
                // Login exitoso
                if (CONFIG.DEBUG) console.log('✅ Login exitoso');
                router.navigate('/dashboard');
            } else {
                // Login fallido
                elements.errorMsg.textContent = result.error || 'Credenciales incorrectas';
                elements.loginBtn.disabled = false;
                elements.loginBtn.textContent = 'Ingresar';
            }
        } catch (error) {
            console.error('❌ Error en login:', error);
            elements.errorMsg.textContent = 'Error de conexión. Intenta nuevamente.';
            elements.loginBtn.disabled = false;
            elements.loginBtn.textContent = 'Ingresar';
        }
    }
};

// Exportar módulo
const LoginModule = {
    load: (container, params) => LoginController.load(container, params)
};
