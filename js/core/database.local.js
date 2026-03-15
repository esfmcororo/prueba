// ========== BASE DE DATOS LOCAL (SIMULADA CON LOCALSTORAGE) ==========
class LocalDatabase {
    static dbKey = CONFIG.STORAGE_KEYS.LOCAL_DB;
    
    // Inicializar BD local
    static init() {
        let db = this.getDB();
        if (!db) {
            db = {
                usuarios: [],
                estudiantes: [],
                administrativos: [],
                eventos: [],
                asistencias: [],
                asistencias_personal: []
            };
            this.saveDB(db);
            console.log('🗄️ Base de datos local inicializada');
        }
    }
    
    // Obtener BD completa
    static getDB() {
        const data = localStorage.getItem(this.dbKey);
        return data ? JSON.parse(data) : null;
    }
    
    // Guardar BD completa
    static saveDB(db) {
        localStorage.setItem(this.dbKey, JSON.stringify(db));
    }
    
    // Ejecutar query SQL simulado
    static async query(sql, params = []) {
        try {
            const db = this.getDB();
            const sqlLower = sql.toLowerCase().trim();
            
            // SELECT
            if (sqlLower.startsWith('select')) {
                return this.handleSelect(sql, params, db);
            }
            
            // INSERT
            if (sqlLower.startsWith('insert')) {
                return this.handleInsert(sql, params, db);
            }
            
            // UPDATE
            if (sqlLower.startsWith('update')) {
                return this.handleUpdate(sql, params, db);
            }
            
            // DELETE
            if (sqlLower.startsWith('delete')) {
                return this.handleDelete(sql, params, db);
            }
            
            // CREATE TABLE (ignorar, ya están creadas)
            if (sqlLower.startsWith('create table')) {
                return { rows: [], error: null };
            }
            
            console.warn('Query no soportado:', sql);
            return { rows: [], error: null };
            
        } catch (error) {
            console.error('❌ Error en query local:', error);
            return { rows: [], error };
        }
    }
    
    // Manejar SELECT
    static handleSelect(sql, params, db) {
        // Extraer tabla
        const tableMatch = sql.match(/from\s+(\w+)/i);
        if (!tableMatch) return { rows: [], error: null };
        
        const table = tableMatch[1];
        let rows = db[table] || [];
        
        // Aplicar WHERE si existe
        const whereMatch = sql.match(/where\s+(.+?)(?:order|limit|$)/i);
        if (whereMatch && params.length > 0) {
            const whereClause = whereMatch[1];
            rows = rows.filter(row => {
                // Parsear condición simple (campo = ?)
                const condMatch = whereClause.match(/(\w+)\s*=\s*\?/);
                if (condMatch) {
                    const field = condMatch[1];
                    return String(row[field]) === String(params[0]);
                }
                
                // Condición con OR (email = ? OR ci = ?)
                const orMatch = whereClause.match(/\((\w+)\s*=\s*\?\s+or\s+(\w+)\s*=\s*\?\)/i);
                if (orMatch) {
                    const field1 = orMatch[1];
                    const field2 = orMatch[2];
                    return String(row[field1]) === String(params[0]) || 
                           String(row[field2]) === String(params[0]);
                }
                
                // Condición con AND
                const andMatch = whereClause.match(/(\w+)\s*=\s*\?\s+and\s+(\w+)\s*=\s*\?/i);
                if (andMatch) {
                    const field1 = andMatch[1];
                    const field2 = andMatch[2];
                    return String(row[field1]) === String(params[0]) && 
                           String(row[field2]) === String(params[1]);
                }
                
                return true;
            });
        }
        
        // LIMIT
        const limitMatch = sql.match(/limit\s+(\d+)/i);
        if (limitMatch) {
            rows = rows.slice(0, parseInt(limitMatch[1]));
        }
        
        // ORDER BY
        const orderMatch = sql.match(/order\s+by\s+(\w+)\s*(asc|desc)?/i);
        if (orderMatch) {
            const field = orderMatch[1];
            const direction = orderMatch[2]?.toLowerCase() || 'asc';
            rows.sort((a, b) => {
                if (direction === 'asc') {
                    return a[field] > b[field] ? 1 : -1;
                } else {
                    return a[field] < b[field] ? 1 : -1;
                }
            });
        }
        
        return { rows, error: null };
    }
    
    // Manejar INSERT
    static handleInsert(sql, params, db) {
        // Extraer tabla
        const tableMatch = sql.match(/into\s+(\w+)/i);
        if (!tableMatch) return { rows: [], error: null };
        
        const table = tableMatch[1];
        
        // Extraer campos
        const fieldsMatch = sql.match(/\(([^)]+)\)/);
        if (!fieldsMatch) return { rows: [], error: null };
        
        const fields = fieldsMatch[1].split(',').map(f => f.trim());
        
        // Crear objeto
        const newRow = {};
        fields.forEach((field, i) => {
            newRow[field] = params[i];
        });
        
        // Agregar timestamp si no existe
        if (!newRow.created_at) {
            newRow.created_at = new Date().toISOString();
        }
        
        // Agregar ID si no existe (excepto usuarios que usa AUTOINCREMENT)
        if (!newRow.id && table !== 'usuarios') {
            newRow.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        }
        
        // Para usuarios, generar ID autoincremental
        if (table === 'usuarios' && !newRow.id) {
            const maxId = db.usuarios.reduce((max, u) => Math.max(max, parseInt(u.id) || 0), 0);
            newRow.id = (maxId + 1).toString();
        }
        
        // Agregar a la tabla
        db[table].push(newRow);
        this.saveDB(db);
        
        console.log(`✅ INSERT en ${table}:`, newRow);
        return { rows: [newRow], error: null };
    }
    
    // Manejar UPDATE
    static handleUpdate(sql, params, db) {
        // Extraer tabla
        const tableMatch = sql.match(/update\s+(\w+)/i);
        if (!tableMatch) return { rows: [], error: null };
        
        const table = tableMatch[1];
        
        // Extraer SET
        const setMatch = sql.match(/set\s+(.+?)\s+where/i);
        if (!setMatch) return { rows: [], error: null };
        
        const setClause = setMatch[1];
        const setFields = setClause.split(',').map(s => s.trim().split('=')[0].trim());
        
        // Extraer WHERE
        const whereMatch = sql.match(/where\s+(.+)$/i);
        if (!whereMatch) return { rows: [], error: null };
        
        const whereClause = whereMatch[1];
        const whereField = whereClause.match(/(\w+)\s*=/)?.[1];
        const whereValue = params[params.length - 1]; // Último parámetro es el WHERE
        
        // Actualizar registros
        let updated = 0;
        db[table] = db[table].map(row => {
            if (String(row[whereField]) === String(whereValue)) {
                setFields.forEach((field, i) => {
                    row[field] = params[i];
                });
                updated++;
            }
            return row;
        });
        
        this.saveDB(db);
        console.log(`✅ UPDATE en ${table}: ${updated} registros`);
        return { rows: [], error: null };
    }
    
    // Manejar DELETE
    static handleDelete(sql, params, db) {
        // Extraer tabla
        const tableMatch = sql.match(/from\s+(\w+)/i);
        if (!tableMatch) return { rows: [], error: null };
        
        const table = tableMatch[1];
        
        // Extraer WHERE
        const whereMatch = sql.match(/where\s+(.+)$/i);
        if (!whereMatch) {
            // DELETE sin WHERE - eliminar todo
            db[table] = [];
        } else {
            const whereClause = whereMatch[1];
            const whereField = whereClause.match(/(\w+)\s*=/)?.[1];
            
            if (whereField && params.length > 0) {
                const beforeCount = db[table].length;
                db[table] = db[table].filter(row => String(row[whereField]) !== String(params[0]));
                const deleted = beforeCount - db[table].length;
                console.log(`✅ DELETE en ${table}: ${deleted} registros`);
            }
        }
        
        this.saveDB(db);
        return { rows: [], error: null };
    }
    
    // Limpiar BD local
    static clear() {
        localStorage.removeItem(this.dbKey);
        this.init();
        console.log('🗑️ Base de datos local limpiada');
    }
    
    // Cargar datos de prueba
    static async loadTestData() {
        const db = this.getDB();
        
        // Usuario admin
        if (db.usuarios.length === 0) {
            await this.query(`
                INSERT INTO usuarios (ci, nombre, apellido_paterno, apellido_materno, email, password, especialidad, codigo_unico, rol) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, ['79310777', 'Admin', 'Sistema', 'Principal', 'admin@escuela.com', 'Admin123!', 'ADMINISTRACIÓN', 'ADM001', 'admin']);
        }
        
        // Estudiantes de prueba
        if (db.estudiantes.length === 0) {
            const estudiantes = [
                ['EST001', '12345678', 'JUAN', 'PEREZ', 'LOPEZ', 'MATEMÁTICA', 'PRIMERO', '70000001', 'juan@test.com', 'estudiante123'],
                ['EST002', '87654321', 'MARIA', 'GARCIA', 'SILVA', 'MATEMÁTICA', 'PRIMERO', '70000002', 'maria@test.com', 'estudiante123'],
                ['EST003', '11111111', 'PEDRO', 'RODRIGUEZ', 'MAMANI', 'ARTES PLÁSTICAS Y VISUALES', 'SEGUNDO', '70000003', 'pedro@test.com', 'estudiante123']
            ];
            
            for (const est of estudiantes) {
                await this.query(`
                    INSERT INTO estudiantes (codigo_unico, dni, nombre, apellido_paterno, apellido_materno, especialidad, anio_formacion, celular, email, password)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, est);
            }
        }
        
        // Evento de prueba
        if (db.eventos.length === 0) {
            const hoy = new Date().toISOString().split('T')[0];
            await this.query(`
                INSERT INTO eventos (nombre, fecha_inicio, fecha_fin, hora_inicio, hora_fin, usuario_id, activo)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, ['Evento de Prueba', hoy, hoy, '08:00', '18:00', '1', 1]);
        }
        
        console.log('✅ Datos de prueba cargados');
    }
}

// Inicializar BD local
LocalDatabase.init();
