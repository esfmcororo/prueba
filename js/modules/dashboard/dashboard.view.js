// ========== MÓDULO DASHBOARD - VISTA ==========
const DashboardView = {
    // Generar HTML de la vista
    render() {
        return `
            <div class="dashboard-section">
                <div class="header">
                    <h1>
                        <span class="title-line1">ESFM "Simón Bolívar"</span>
                        <span class="title-line2">CORORO</span>
                    </h1>
                    <div class="header-right">
                        <div class="user-dropdown" id="user-dropdown">
                            <button class="user-dropdown-btn" onclick="DashboardController.toggleUserDropdown()">
                                <span class="user-display-name">${Auth.getUserName()}</span>
                                <span>▼</span>
                            </button>
                            <div class="user-dropdown-content">
                                <p><strong>Rol:</strong> <span class="dropdown-rol">${Auth.getUserRole().toUpperCase()}</span></p>
                                <button onclick="Auth.logout()" class="btn-secondary" style="width: 100%; margin-top: 10px;">Cerrar Sesión</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <div class="modules-grid">
                        <div class="module-card" onclick="router.navigate('/asistencia')">
                            <div class="module-icon">📋</div>
                            <h3>Asistencia</h3>
                            <p>Gestión de estudiantes, eventos y registro de asistencias</p>
                        </div>
                        <div class="module-card" onclick="router.navigate('/usuarios')">
                            <div class="module-icon">👥</div>
                            <h3>Gestión de Usuarios</h3>
                            <p>Registro de docentes y carga masiva de estudiantes</p>
                        </div>
                        <div class="module-card" onclick="router.navigate('/biblioteca')">
                            <div class="module-icon">📚</div>
                            <h3>Biblioteca</h3>
                            <p>Sistema de gestión bibliotecaria (próximamente)</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};
