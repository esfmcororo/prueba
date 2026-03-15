// Controlador para editar evento
const EditarEventoController = {
    eventoId: null,
    
    async init(params = {}) {
        this.eventoId = params.eventoId;
        if (!this.eventoId) {
            alert('ID de evento no especificado');
            router.navigate('/asistencia');
            return;
        }
        
        await this.cargarEvento();
        this.setupTimeInputs();
    },
    
    async cargarEvento() {
        try {
            const result = await Database.query('SELECT * FROM eventos WHERE id = ?', [this.eventoId]);
            
            if (!result.rows || result.rows.length === 0) {
                alert('Evento no encontrado');
                router.navigate('/asistencia');
                return;
            }
            
            const evento = result.rows[0];
            document.getElementById('edit-evento-id').value = evento.id;
            document.getElementById('edit-evento-nombre').value = evento.nombre;
            document.getElementById('edit-evento-fecha').value = evento.fecha_inicio.split('T')[0];
            document.getElementById('edit-evento-hora-inicio').value = evento.hora_inicio;
            document.getElementById('edit-evento-hora-fin').value = evento.hora_fin;
        } catch (error) {
            console.error('Error cargando evento:', error);
            alert('Error al cargar el evento');
        }
    },
    
    setupTimeInputs() {
        const horaInputs = ['edit-evento-hora-inicio', 'edit-evento-hora-fin'];
        
        horaInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/[^0-9]/g, '');
                    if (value.length >= 2) {
                        value = value.substring(0, 2) + ':' + value.substring(2, 4);
                    }
                    e.target.value = value;
                });
                
                input.addEventListener('blur', function(e) {
                    let value = e.target.value;
                    const match = value.match(/^(\d{1,2}):(\d{1,2})$/);
                    
                    if (match) {
                        let hours = parseInt(match[1]);
                        let minutes = parseInt(match[2]);
                        
                        if (hours > 23) hours = 23;
                        if (minutes > 59) minutes = 59;
                        
                        e.target.value = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
                    } else {
                        e.target.value = '08:00';
                    }
                });
            }
        });
    },
    
    async actualizarEvento() {
        const id = document.getElementById('edit-evento-id').value;
        const nombre = document.getElementById('edit-evento-nombre').value.trim();
        const fecha = document.getElementById('edit-evento-fecha').value;
        const horaInicio = document.getElementById('edit-evento-hora-inicio').value;
        const horaFin = document.getElementById('edit-evento-hora-fin').value;
        
        if (!nombre || !fecha || !horaInicio || !horaFin) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        const horaInicioMatch = horaInicio.match(/^(\d{2}):(\d{2})$/);
        const horaFinMatch = horaFin.match(/^(\d{2}):(\d{2})$/);
        
        if (!horaInicioMatch || !horaFinMatch) {
            alert('Formato de hora inválido. Usa HH:MM (ej: 17:00)');
            return;
        }
        
        const horaInicioNum = parseInt(horaInicioMatch[1]) * 60 + parseInt(horaInicioMatch[2]);
        const horaFinNum = parseInt(horaFinMatch[1]) * 60 + parseInt(horaFinMatch[2]);
        
        if (horaFinNum <= horaInicioNum) {
            alert('La hora de fin debe ser posterior a la hora de inicio');
            return;
        }
        
        try {
            const fechaInicio = `${fecha}T${horaInicio}:00`;
            const fechaFin = `${fecha}T${horaFin}:00`;
            
            await Database.query(`
                UPDATE eventos 
                SET nombre = ?, fecha_inicio = ?, fecha_fin = ?, hora_inicio = ?, hora_fin = ?
                WHERE id = ?
            `, [nombre, fechaInicio, fechaFin, horaInicio, horaFin, id]);
            
            alert('Evento actualizado exitosamente');
            router.navigate('/asistencia');
        } catch (error) {
            console.error('Error actualizando evento:', error);
            alert('Error al actualizar el evento');
        }
    },
    
    toggleUserDropdown(id) {
        const dropdown = document.getElementById(id);
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }
};
