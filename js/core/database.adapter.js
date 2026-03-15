// ========== ADAPTADOR DE BASE DE DATOS (LOCAL O TURSO) ==========
class DatabaseAdapter {
    // Ejecutar query (delega a BD local o Turso)
    static async query(sql, params = []) {
        if (CONFIG.USE_LOCAL_DB) {
            return await LocalDatabase.query(sql, params);
        } else {
            return await TursoDatabase.query(sql, params);
        }
    }
    
    // Métodos helper
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
            data.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
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
    
    // Inicializar BD
    static async initializeData() {
        if (CONFIG.USE_LOCAL_DB) {
            await LocalDatabase.loadTestData();
            console.log('🗄️ Usando base de datos LOCAL (testing)');
        } else {
            await TursoDatabase.initializeData();
            console.log('☁️ Usando base de datos TURSO (producción)');
        }
    }
    
    // Limpiar BD local (solo para testing)
    static clearLocalDB() {
        if (CONFIG.USE_LOCAL_DB) {
            LocalDatabase.clear();
        }
    }
}

// Alias para compatibilidad
const Database = DatabaseAdapter;
