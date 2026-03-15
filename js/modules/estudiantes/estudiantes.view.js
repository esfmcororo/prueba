// Vista para gestión de estudiantes
const EstudiantesView = {
    render() {
        return `
            <div class="header">
                <h1>Gestión de Estudiantes</h1>
                <div class="header-right">
                    <button onclick="router.navigate('/asistencia')" class="btn-secondary" style="margin-right: 10px;">← Volver</button>
                    ${this.renderUserDropdown('user-dropdown-estudiantes')}
                </div>
            </div>
            <div class="container">
                <div id="especialidades-accordion"></div>
            </div>
        `;
    },
    
    renderUserDropdown(id) {
        return `
            <div class="user-dropdown" id="${id}">
                <button class="user-dropdown-btn" onclick="EstudiantesController.toggleUserDropdown('${id}')">
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
