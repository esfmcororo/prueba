// Controlador para gestión de estudiantes
const EstudiantesController = {
    async init() {
        await this.loadEstudiantes();
    },
    
    async loadEstudiantes() {
        const container = document.getElementById('especialidades-accordion');
        container.innerHTML = '<p style="color: white;">Cargando...</p>';
        
        try {
            const result = await Database.query('SELECT * FROM estudiantes ORDER BY especialidad, anio_formacion, codigo_unico');
            
            if (!result.rows || result.rows.length === 0) {
                container.innerHTML = '<p style="color: white;">No hay estudiantes registrados.</p>';
                return;
            }
            
            const data = result.rows;
            
            // Agrupar por especialidad y año
            const grouped = {};
            data.forEach(est => {
                const esp = est.especialidad || 'Sin Especialidad';
                const anio = est.anio_formacion || 'Sin Año';
                if (!grouped[esp]) grouped[esp] = {};
                if (!grouped[esp][anio]) grouped[esp][anio] = [];
                grouped[esp][anio].push(est);
            });
            
            container.innerHTML = '';
            
            Object.keys(grouped).sort().forEach(especialidad => {
                const accordion = document.createElement('div');
                accordion.className = 'accordion';
                
                const totalEst = Object.values(grouped[especialidad]).flat().length;
                const espId = especialidad.replace(/\\s/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
                
                accordion.innerHTML = `
                    <div class="accordion-header" onclick="EstudiantesController.toggleAccordion(this)">
                        <span>🎓 ${especialidad} (${totalEst} estudiantes)</span>
                        <span>▼</span>
                    </div>
                    <div class="accordion-content">
                        <div id="anios-${espId}"></div>
                    </div>
                `;
                container.appendChild(accordion);
                
                const aniosContainer = accordion.querySelector(`#anios-${espId}`);
                Object.keys(grouped[especialidad]).sort((a, b) => {
                    const orden = ['PRIMERO', 'SEGUNDO', 'TERCERO', 'CUARTO', 'QUINTO'];
                    return orden.indexOf(a) - orden.indexOf(b);
                }).forEach(anio => {
                    const subAccordion = document.createElement('div');
                    subAccordion.className = 'sub-accordion';
                    
                    const estudiantes = grouped[especialidad][anio];
                    
                    const headerDiv = document.createElement('div');
                    headerDiv.className = 'sub-accordion-header';
                    headerDiv.onclick = function() { EstudiantesController.toggleSubAccordion(this); };
                    
                    headerDiv.innerHTML = `
                        <span>📅 Año ${anio} (${estudiantes.length} estudiantes)</span>
                        <div>
                            <button class="btn-success" style="padding: 5px 10px; font-size: 12px;">📥 QRs</button>
                            <span style="margin-left: 10px;">▼</span>
                        </div>
                    `;
                    
                    const btnQRs = headerDiv.querySelector('.btn-success');
                    btnQRs.onclick = function(e) {
                        e.stopPropagation();
                        alert('Generación de QRs pendiente de implementar');
                    };
                    
                    subAccordion.appendChild(headerDiv);
                    
                    const contentDiv = document.createElement('div');
                    contentDiv.className = 'sub-accordion-content';
                    contentDiv.innerHTML = estudiantes.map(est => {
                        const nombreCompleto = `${est.nombre} ${est.apellido_paterno} ${est.apellido_materno || ''}`.trim();
                        return `
                            <div class="estudiante-item">
                                <div>
                                    <strong>${nombreCompleto}</strong><br>
                                    <small>📋 ${est.codigo_unico} | 🆔 ${est.dni || 'Sin DNI'} | 📱 ${est.celular || 'Sin celular'}</small>
                                </div>
                            </div>
                        `;
                    }).join('');
                    
                    subAccordion.appendChild(contentDiv);
                    aniosContainer.appendChild(subAccordion);
                });
            });
            
        } catch (error) {
            console.error('Error cargando estudiantes:', error);
            container.innerHTML = '<p style="color: white;">Error cargando estudiantes</p>';
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
    
    toggleUserDropdown(id) {
        const dropdown = document.getElementById(id);
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }
};
