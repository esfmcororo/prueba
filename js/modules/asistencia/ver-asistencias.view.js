// Vista para ver lista de asistencias
const VerAsistenciasView = {
    render(eventoNombre) {
        return `
            <div class="header">
                <h1 id="asistencias-evento-title">Lista de Asistencias - ${eventoNombre}</h1>
                <div class="header-right">
                    <button onclick="VerAsistenciasController.exportarExcel()" class="btn-success" style="margin-right: 10px;">📊 Exportar Excel</button>
                    <button onclick="router.navigate('/asistencia')" class="btn-secondary" style="margin-right: 10px;">← Volver</button>
                    ${this.renderUserDropdown('user-dropdown-asistencias')}
                </div>
            </div>
            <div class="container">
                <div id="asistencias-completas-list"></div>
            </div>
        `;
    },
    
    renderUserDropdown(id) {
        return `
            <div class="user-dropdown" id="${id}">
                <button class="user-dropdown-btn" onclick="VerAsistenciasController.toggleUserDropdown('${id}')">
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
