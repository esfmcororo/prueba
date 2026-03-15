// Vista para editar evento
const EditarEventoView = {
    render() {
        return `
            <div class="header">
                <h1>Editar Evento</h1>
                <div class="header-right">
                    <button onclick="router.navigate('/asistencia')" class="btn-secondary" style="margin-right: 10px;">← Volver</button>
                    ${this.renderUserDropdown('user-dropdown-editar-evento')}
                </div>
            </div>
            <div class="container">
                <div class="card">
                    <input type="hidden" id="edit-evento-id">
                    <label style="color: #666; font-size: 14px; margin-bottom: 5px;">Nombre del Evento:</label>
                    <input type="text" id="edit-evento-nombre" placeholder="Nombre del evento">
                    <label style="color: #666; font-size: 14px; margin-bottom: 5px;">Fecha del Evento:</label>
                    <input type="date" id="edit-evento-fecha">
                    <label style="color: #666; font-size: 14px; margin-bottom: 5px;">Hora Inicio (formato 24h):</label>
                    <input type="text" id="edit-evento-hora-inicio" placeholder="HH:MM (ej: 17:00)" maxlength="5">
                    <label style="color: #666; font-size: 14px; margin-bottom: 5px;">Hora Fin (formato 24h):</label>
                    <input type="text" id="edit-evento-hora-fin" placeholder="HH:MM (ej: 17:00)" maxlength="5">
                    <button onclick="EditarEventoController.actualizarEvento()" class="btn-primary">Actualizar Evento</button>
                </div>
            </div>
        `;
    },
    
    renderUserDropdown(id) {
        return `
            <div class="user-dropdown" id="${id}">
                <button class="user-dropdown-btn" onclick="EditarEventoController.toggleUserDropdown('${id}')">
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
