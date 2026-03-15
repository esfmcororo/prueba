// Controlador del módulo de Asistencia
const AsistenciaController = {
    currentPage: 1,
    eventsPerPage: 5,
    totalEvents: 0,
    allEvents: [],

    async init() {
        await this.loadEventos();
    },

    async loadEventos(page = 1) {
        this.currentPage = page;
        const listEl = document.getElementById('eventos-list');
        const paginationEl = document.getElementById('pagination-controls');
        
        listEl.innerHTML = '<p style="color: white;">Cargando...</p>';
        paginationEl.innerHTML = '';

        try {
            const result = await Database.query('SELECT * FROM eventos ORDER BY created_at DESC');
            let eventos = result.rows || [];
        eventos = eventos.filter(evento => evento.activo);
        eventos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        this.allEvents = eventos;
        this.totalEvents = eventos.length;

        if (this.totalEvents === 0) {
            listEl.innerHTML = '<p style="color: white; text-align: center;">No hay eventos. Crea uno para comenzar.</p>';
            return;
        }

        const startIndex = (this.currentPage - 1) * this.eventsPerPage;
        const endIndex = startIndex + this.eventsPerPage;
        const eventosPage = eventos.slice(startIndex, endIndex);

        listEl.innerHTML = '';
        
        for (const evento of eventosPage) {
            const asistenciasResult = await Database.query(`
                SELECT COUNT(*) as total FROM asistencias WHERE evento_id = ?
            `, [evento.id]);
            
            const tieneAsistencias = asistenciasResult.rows && asistenciasResult.rows[0] && parseInt(asistenciasResult.rows[0].total) > 0;
            
            const card = document.createElement('div');
            card.className = 'evento-card';
            const fechaInicio = evento.fecha_inicio.split('T')[0].split('-');
            const fechaFin = evento.fecha_fin.split('T')[0].split('-');
            const fechaInicioStr = `${fechaInicio[2]}/${fechaInicio[1]}/${fechaInicio[0]}`;
            const fechaFinStr = `${fechaFin[2]}/${fechaFin[1]}/${fechaFin[0]}`;
            const rangoFecha = fechaInicioStr === fechaFinStr ? fechaInicioStr : `${fechaInicioStr} - ${fechaFinStr}`;
            
            card.innerHTML = `
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
            `;
            listEl.appendChild(card);
        }
        
        this.renderPagination();
        } catch (error) {
            console.error('Error cargando eventos:', error);
            listEl.innerHTML = '<p style="color: white;">Error cargando eventos</p>';
        }
    },

    renderPagination() {
        const paginationEl = document.getElementById('pagination-controls');
        const totalPages = Math.ceil(this.totalEvents / this.eventsPerPage);
        
        if (totalPages <= 1) {
            paginationEl.innerHTML = '';
            return;
        }
        
        let paginationHTML = `
            <button class="pagination-btn" onclick="AsistenciaController.loadEventos(${this.currentPage - 1})" ${this.currentPage === 1 ? 'disabled' : ''}>
                ← Anterior
            </button>
            <span class="pagination-info">
                Página ${this.currentPage} de ${totalPages} (${this.totalEvents} eventos)
            </span>
            <button class="pagination-btn" onclick="AsistenciaController.loadEventos(${this.currentPage + 1})" ${this.currentPage === totalPages ? 'disabled' : ''}>
                Siguiente →
            </button>
        `;
        
        paginationEl.innerHTML = paginationHTML;
    },

    async eliminarEvento(eventoId) {
        if (!confirm('¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer.')) {
            return;
        }
        
        try {
            const asistenciasResult = await Database.query(`
                SELECT COUNT(*) as total FROM asistencias WHERE evento_id = ?
            `, [eventoId]);
            
            if (asistenciasResult.rows && asistenciasResult.rows[0] && asistenciasResult.rows[0].total > 0) {
                alert('No se puede eliminar un evento que tiene asistencias registradas.');
                return;
            }
            
            await Database.query(`DELETE FROM eventos WHERE id = ?`, [eventoId]);
            
            alert('Evento eliminado correctamente.');
            this.loadEventos(this.currentPage);
        } catch (error) {
            console.error('Error eliminando evento:', error);
            alert('Error al eliminar el evento.');
        }
    },

    showScanner(eventoId, eventoNombre) {
        router.navigate('/scanner', { eventoId, eventoNombre });
    },

    verListaAsistencias(eventoId, eventoNombre) {
        router.navigate('/ver-asistencias', { eventoId, eventoNombre });
    },

    editarEvento(eventoId) {
        router.navigate('/editar-evento', { eventoId });
    },

    showCreateEvent() {
        router.navigate('/crear-evento');
    },

    toggleUserDropdown(id) {
        const dropdown = document.getElementById(id);
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }
};
