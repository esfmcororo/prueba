// Controlador para crear evento
const CrearEventoController = {
    async init() {
        this.setupTimeInputs();
    },
    
    setupTimeInputs() {
        const horaInputs = ['evento-hora-inicio', 'evento-hora-fin'];
        
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
    
    async crearEvento() {
        const nombre = document.getElementById('evento-nombre').value.trim();
        const fecha = document.getElementById('evento-fecha').value;
        const horaInicio = document.getElementById('evento-hora-inicio').value;
        const horaFin = document.getElementById('evento-hora-fin').value;
        
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
            const eventoId = 'EVT-' + Date.now();
            const fechaInicio = `${fecha}T${horaInicio}:00`;
            const fechaFin = `${fecha}T${horaFin}:00`;
            
            await Database.query(`
                INSERT INTO eventos (id, nombre, fecha_inicio, fecha_fin, hora_inicio, hora_fin, activo, created_at)
                VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'))
            `, [eventoId, nombre, fechaInicio, fechaFin, horaInicio, horaFin]);
            
            alert('Evento creado exitosamente');
            router.navigate('/asistencia');
        } catch (error) {
            console.error('Error creando evento:', error);
            alert('Error al crear el evento');
        }
    },
    
    toggleUserDropdown(id) {
        const dropdown = document.getElementById(id);
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }
};
