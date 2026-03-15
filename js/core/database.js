// ========== ADAPTADOR DE BASE DE DATOS ==========
class Database {
    static dbUrl = CONFIG.DB_URL;
    static authToken = CONFIG.DB_TOKEN;
    
    // Ejecutar query SQL
    static async query(sql, params = []) {
        try {
            const response = await fetch(`${this.dbUrl}/v2/pipeline`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requests: [{
                        type: 'execute',
                        stmt: {
                            sql: sql,
                            args: params.map(p => ({ type: 'text', value: String(p) }))
                        }
                    }]
                })
            });
            
            const data = await response.json();
            
            if (data.results && data.results[0] && data.results[0].response) {
                const result = data.results[0].response.result;
                return {
                    rows: result.rows?.map(row => {
                        const obj = {};
                        result.cols.forEach((col, i) => {
                            obj[col.name] = row[i]?.value || row[i];
                        });
                        return obj;
                    }) || [],
                    error: null
                };
            }
            
            return { rows: [], error: null };
        } catch (error) {
            console.error('❌ Error en query:', error);
            return { rows: [], error };
        }
    }
    
    // Métodos helper para operaciones comunes
    static async select(table, fields = '*', where = '', params = []) {
        const sql = `SELECT ${fields} FROM ${table}${where ? ' WHERE ' + where : ''}`;
        return await this.query(sql, params);
    }
    
    static async insert(table, data) {
        const fields = Object.keys(data);
        const values = Object.values(data);
        const placeholders = fields.map(() => '?').join(', ');
        
        // Agregar ID y timestamp si no existen
        if (!data.id && table !== 'usuarios') {
            data.id = Date.now().toString();
        }
        if (!data.created_at) {
            data.created_at = new Date().toISOString();
        }
        
        const insertFields = Object.keys(data);
        const insertValues = Object.values(data);
        const insertPlaceholders = insertFields.map(() => '?').join(', ');
        
        const sql = `INSERT INTO ${table} (${insertFields.join(', ')}) VALUES (${insertPlaceholders})`;
        return await this.query(sql, insertValues);
    }
    
    static async update(table, data, where, whereParams = []) {
        const fields = Object.keys(data);
        const values = Object.values(data);
        const setClause = fields.map(f => `${f} = ?`).join(', ');
        
        const sql = `UPDATE ${table} SET ${setClause} WHERE ${where}`;
        return await this.query(sql, [...values, ...whereParams]);
    }
    
    static async delete(table, where, params = []) {
        const sql = `DELETE FROM ${table} WHERE ${where}`;
        return await this.query(sql, params);
    }
    
    // Inicializar estructura de BD
    static async initializeData() {
        // Verificar si existe admin
        const adminExists = await this.query('SELECT id FROM usuarios WHERE email = ?', ['admin@escuela.com']);
        if (!adminExists.rows || adminExists.rows.length === 0) {
            await this.query(`
                INSERT INTO usuarios (ci, nombre, apellido_paterno, apellido_materno, email, password, especialidad, codigo_unico, rol) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, ['79310777', 'Admin', 'Sistema', 'Principal', 'admin@escuela.com', 'Admin123!', 'ADMINISTRACIÓN', 'ADM001', 'admin']);
        }
        
        // Crear tablas si no existen
        await this.createTablesIfNotExist();
    }
    
    static async createTablesIfNotExist() {
        // Tabla estudiantes
        await this.query(`
            CREATE TABLE IF NOT EXISTS estudiantes (
                id TEXT PRIMARY KEY,
                codigo_unico TEXT UNIQUE NOT NULL,
                dni TEXT NOT NULL,
                nombre TEXT NOT NULL,
                apellido_paterno TEXT NOT NULL,
                apellido_materno TEXT,
                especialidad TEXT NOT NULL,
                anio_formacion TEXT NOT NULL,
                celular TEXT,
                email TEXT,
                password TEXT NOT NULL DEFAULT 'estudiante123',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Tabla administrativos
        await this.query(`
            CREATE TABLE IF NOT EXISTS administrativos (
                id TEXT PRIMARY KEY,
                codigo_unico TEXT UNIQUE NOT NULL,
                dni TEXT NOT NULL,
                nombre TEXT NOT NULL,
                apellido_paterno TEXT NOT NULL,
                apellido_materno TEXT,
                personal TEXT NOT NULL,
                cargo TEXT NOT NULL,
                celular TEXT,
                email TEXT,
                password TEXT NOT NULL DEFAULT 'personal123',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Tabla eventos
        await this.query(`
            CREATE TABLE IF NOT EXISTS eventos (
                id TEXT PRIMARY KEY,
                nombre TEXT NOT NULL,
                fecha_inicio TEXT NOT NULL,
                fecha_fin TEXT NOT NULL,
                hora_inicio TEXT NOT NULL,
                hora_fin TEXT NOT NULL,
                imagen_url TEXT,
                usuario_id TEXT NOT NULL,
                activo INTEGER DEFAULT 1,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Tabla asistencias
        await this.query(`
            CREATE TABLE IF NOT EXISTS asistencias (
                id TEXT PRIMARY KEY,
                estudiante_id TEXT NOT NULL,
                evento_id TEXT NOT NULL,
                timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Tabla asistencias_personal
        await this.query(`
            CREATE TABLE IF NOT EXISTS asistencias_personal (
                id TEXT PRIMARY KEY,
                personal_id TEXT NOT NULL,
                evento_id TEXT NOT NULL,
                timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }
}

// Inicializar BD al cargar
Database.initializeData();
