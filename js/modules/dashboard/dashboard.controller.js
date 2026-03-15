// ========== MÓDULO DASHBOARD - CONTROLADOR ==========
const DashboardController = {
    // Cargar módulo
    async load(container, params) {
        // Renderizar vista
        container.innerHTML = DashboardView.render();
        
        // Configurar eventos
        this.setupEvents();
    },
    
    // Configurar eventos
    setupEvents() {
        // Cerrar dropdown al hacer clic fuera
        document.addEventListener('click', (event) => {
            const dropdown = document.getElementById('user-dropdown');
            if (dropdown && !dropdown.contains(event.target)) {
                dropdown.classList.remove('active');
            }
        });
    },
    
    // Toggle dropdown de usuario
    toggleUserDropdown() {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }
};

// Exportar módulo
const DashboardModule = {
    load: (container, params) => DashboardController.load(container, params)
};
