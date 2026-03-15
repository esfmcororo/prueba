// ========== MÓDULO ASISTENCIA - VISTA ==========
const AsistenciaView = {
    // Renderizar vista principal (lista de eventos)
    render() {
        return `
            <div class="header">
                <h1>Módulo de Asistencia</h1>
                <div class="header-right">
                    <button onclick="router.navigate('/estudiantes')" class="btn-secondary" style="margin-right: 10px;">🎓 Estudiantes</button>
                    <button onclick="router.navigate('/personal')" class="btn-secondary" style="margin-right: 10px;">👥 Personal</button>
                    <button onclick="router.navigate('/dashboard')" class="btn-secondary" style="margin-right: 10px;">← Volver</button>
                    ${this.renderUserDropdown('user-dropdown-asistencia')}
                </div>
            </div>
            <div class="container">
                <button onclick="AsistenciaController.showCreateEvent()" class="btn-create">+ Crear Evento</button>
                <div id="eventos-list"></div>
                <div id="pagination-controls" class="pagination-controls"></div>
            </div>
        `;
    },
    
    // Renderizar dropdown de usuario
    renderUserDropdown(id) {
        return `
            <div class="user-dropdown" id="${id}">
                <button class="user-dropdown-btn" onclick="AsistenciaController.toggleUserDropdown('${id}')">
                    <span class="user-display-name">${Auth.getUserName()}</span>
                    <span>▼</span>
                </button>
                <div class="user-dropdown-content">
                    <p><strong>Rol:</strong> <span class="dropdown-rol">${Auth.getUserRole().toUpperCase()}</span></p>
                    <button onclick="Auth.logout()" class="btn-secondary" style="width: 100%; margin-top: 10px;">Cerrar Sesión</button>
                </div>
            </div>
        `;
    },
    
    // Renderizar card de evento
    renderEventCard(evento, tieneAsistencias) {
        const fechaInicio = evento.fecha_inicio.split('T')[0].split('-');
        const fechaFin = evento.fecha_fin.split('T')[0].split('-');
        const fechaInicioStr = `${fechaInicio[2]}/${fechaInicio[1]}/${fechaInicio[0]}`;
        const fechaFinStr = `${fechaFin[2]}/${fechaFin[1]}/${fechaFin[0]}`;
        const rangoFecha = fechaInicioStr === fechaFinStr ? fechaInicioStr : `${fechaInicioStr} - ${fechaFinStr}`;
        
        return `
            <div class="evento-card">
                <div class="evento-info">
                    <h3>${evento.nombre}</h3>
                    <p>📅 ${rangoFecha}</p>
                    <p>🕒 ${evento.hora_inicio} - ${evento.hora_fin}</p>
                </div>
                <div class="evento-actions">
                    <button class="btn-asistencia" onclick="AsistenciaController.showScanner('${evento.id}', '${evento.nombre}')">
                        Tomar Asistencia
                    </button>
                    <button class="btn-info" onclick="AsistenciaController.verListaAsistencias('${evento.id}', '${evento.nombre.replace(/'/g, "\\'")}')">📋 Ver Lista</button>
                    ${Auth.isAdmin() ? 
                        `<button class="btn-warning" onclick="AsistenciaController.editarEvento('${evento.id}')">✏️ Editar</button>` : ''
                    }
                    ${!tieneAsistencias && Auth.isAdmin() ? 
                        `<button class="btn-danger" onclick="AsistenciaController.eliminarEvento('${evento.id}')">🗑️ Eliminar</button>` : ''
                    }
                </div>
            </div>
        `;
    },
    
    // Renderizar controles de paginación
    renderPagination(currentPage, totalPages, totalEvents) {
        if (totalPages <= 1) return '';
        
        return `
            <button class="pagination-btn" onclick="AsistenciaController.loadEventos(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                ← Anterior
            </button>
            <span class="pagination-info">
                Página ${currentPage} de ${totalPages} (${totalEvents} eventos)
            </span>
            <button class="pagination-btn" onclick="AsistenciaController.loadEventos(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                Siguiente →
            </button>
        `;
    }
};
