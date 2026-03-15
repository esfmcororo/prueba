// Controlador para ver lista de asistencias
const VerAsistenciasController = {
    eventoId: null,
    eventoNombre: null,
    
    async init(params = {}) {
        this.eventoId = params.eventoId;
        this.eventoNombre = params.eventoNombre;
        
        if (!this.eventoId) {
            alert('ID de evento no especificado');
            router.navigate('/asistencia');
            return;
        }
        
        await this.cargarAsistencias();
    },
    
    async cargarAsistencias() {
        const listEl = document.getElementById('asistencias-completas-list');
        listEl.innerHTML = '<p>Cargando asistencias...</p>';
        
        try {
            const result = await Database.query(`
                SELECT 
                    a.timestamp,
                    e.codigo_unico,
                    e.dni,
                    e.nombre,
                    e.apellido_paterno,
                    e.apellido_materno,
                    e.especialidad,
                    e.anio_formacion
                FROM asistencias a
                JOIN estudiantes e ON a.estudiante_id = e.id
                WHERE a.evento_id = ?
                ORDER BY e.especialidad, e.anio_formacion, e.codigo_unico
            `, [this.eventoId]);
            
            if (!result.rows || result.rows.length === 0) {
                listEl.innerHTML = '<p>No hay asistencias registradas para este evento.</p>';
                return;
            }
            
            // Agrupar por especialidad y año
            const grouped = {};
            result.rows.forEach(asistencia => {
                const esp = asistencia.especialidad || 'Sin Especialidad';
                const anio = asistencia.anio_formacion || 'Sin Año';
                if (!grouped[esp]) grouped[esp] = {};
                if (!grouped[esp][anio]) grouped[esp][anio] = [];
                grouped[esp][anio].push(asistencia);
            });
            
            // Crear estructura de acordeón
            let html = `<h3>Total de asistencias: ${result.rows.length}</h3>`;
            
            Object.keys(grouped).sort().forEach(especialidad => {
                const totalEsp = Object.values(grouped[especialidad]).flat().length;
                const espId = especialidad.replace(/\\s/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
                
                html += `
                    <div class="accordion">
                        <div class="accordion-header" onclick="VerAsistenciasController.toggleAccordion(this)">
                            <span>🎓 ${especialidad} (${totalEsp} asistencias)</span>
                            <span>▼</span>
                        </div>
                        <div class="accordion-content">
                            <div id="anios-${espId}">`;
                
                Object.keys(grouped[especialidad]).sort((a, b) => {
                    const orden = ['PRIMERO', 'SEGUNDO', 'TERCERO', 'CUARTO', 'QUINTO'];
                    return orden.indexOf(a) - orden.indexOf(b);
                }).forEach(anio => {
                    const asistencias = grouped[especialidad][anio];
                    
                    html += `
                        <div class="sub-accordion">
                            <div class="sub-accordion-header" onclick="VerAsistenciasController.toggleSubAccordion(this)">
                                <span>📅 Año ${anio} (${asistencias.length} asistencias)</span>
                                <span>▼</span>
                            </div>
                            <div class="sub-accordion-content">`;
                    
                    asistencias.forEach(asistencia => {
                        const fecha = new Date(asistencia.timestamp).toLocaleString('es-BO', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        });
                        const nombreCompleto = `${asistencia.nombre} ${asistencia.apellido_paterno} ${asistencia.apellido_materno || ''}`.trim();
                        
                        html += `
                            <div class="estudiante-item">
                                <div>
                                    <strong>${nombreCompleto}</strong><br>
                                    <small>📋 ${asistencia.codigo_unico} | 🆔 ${asistencia.dni || 'Sin DNI'} | 🕒 ${fecha}</small>
                                </div>
                            </div>`;
                    });
                    
                    html += `
                            </div>
                        </div>`;
                });
                
                html += `
                            </div>
                        </div>
                    </div>`;
            });
            
            listEl.innerHTML = html;
            
        } catch (error) {
            console.error('Error cargando asistencias:', error);
            listEl.innerHTML = '<p>Error cargando las asistencias.</p>';
        }
    },
    
    toggleAccordion(element) {
        const content = element.nextElementSibling;
        content.classList.toggle('active');
        const arrow = element.querySelector('span:last-child');
        arrow.textContent = content.classList.contains('active') ? '▲' : '▼';
    },
    
    toggleSubAccordion(element) {
        const content = element.nextElementSibling;
        content.classList.toggle('active');
        const arrow = element.querySelector('span:last-child');
        arrow.textContent = content.classList.contains('active') ? '▲' : '▼';
    },
    
    async exportarExcel() {
        alert('Exportación a Excel pendiente de implementar\\n(Requiere librería XLSX.js)');
    },
    
    toggleUserDropdown(id) {
        const dropdown = document.getElementById(id);
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }
};
