// Sistema Offline
const OfflineService = {
    queue: [],
    syncInProgress: false,
    
    init() {
        this.loadQueue();
    },
    
    loadQueue() {
        try {
            const saved = localStorage.getItem('asistencias_offline');
            this.queue = saved ? JSON.parse(saved) : [];
            console.log(`Cola offline cargada: ${this.queue.length} asistencias pendientes`);
        } catch (error) {
            console.error('Error cargando cola offline:', error);
            this.queue = [];
        }
    },
    
    saveQueue() {
        try {
            localStorage.setItem('asistencias_offline', JSON.stringify(this.queue));
        } catch (error) {
            console.error('Error guardando cola offline:', error);
        }
    },
    
    addToQueue(personaId, eventoId, tipo = 'estudiante') {
        const yaExiste = this.queue.find(a => 
            a.persona_id === personaId && a.evento_id === eventoId && a.tipo === tipo
        );
        
        if (yaExiste) {
            console.log('Asistencia ya existe en cola offline');
            return false;
        }
        
        const asistencia = {
            id: Date.now() + Math.random(),
            persona_id: personaId,
            evento_id: eventoId,
            timestamp: new Date().toISOString(),
            tipo: tipo,
            created_offline: true
        };
        
        this.queue.push(asistencia);
        this.saveQueue();
        console.log('Asistencia agregada a cola offline:', asistencia);
        return true;
    },
    
    async sync() {
        if (this.syncInProgress || this.queue.length === 0) return;
        
        console.log(`🔄 Iniciando sincronización de ${this.queue.length} registros...`);
        this.syncInProgress = true;
        
        try {
            const batch = this.queue.slice(0, 10);
            let syncedCount = 0;
            const syncedIndices = [];
            
            for (let i = 0; i < batch.length; i++) {
                const asistencia = batch[i];
                
                try {
                    const tabla = asistencia.tipo === 'estudiante' ? 'asistencias' : 'asistencias_personal';
                    const campo = asistencia.tipo === 'estudiante' ? 'estudiante_id' : 'personal_id';
                    
                    const result = await Database.query(`
                        INSERT INTO ${tabla} (${campo}, evento_id, timestamp)
                        VALUES (?, ?, ?)
                    `, [asistencia.persona_id, asistencia.evento_id, asistencia.timestamp]);
                    
                    syncedCount++;
                    syncedIndices.push(i);
                } catch (err) {
                    console.error('Error sincronizando:', err);
                }
            }
            
            for (let i = syncedIndices.length - 1; i >= 0; i--) {
                this.queue.splice(syncedIndices[i], 1);
            }
            
            this.saveQueue();
            console.log(`✅ Sincronizados: ${syncedCount}`);
            
        } catch (error) {
            console.error('Error en sincronización:', error);
        } finally {
            this.syncInProgress = false;
        }
    }
};

