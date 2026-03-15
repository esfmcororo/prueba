// Utilidades Compartidas
const UtilsService = {
    formatearNombreCompleto(nombre, apellidoP, apellidoM) {
        const apellidoMaternoFormateado = (apellidoM && apellidoM !== 'SIN DATO') ? apellidoM : '';
        return `${nombre} ${apellidoP}${apellidoMaternoFormateado ? ' ' + apellidoMaternoFormateado : ''}`;
    },
    
    formatearCampoOpcional(valor, valorPorDefecto = '') {
        if (!valor || valor === 'SIN DATO') return valorPorDefecto;
        return valor;
    },
    
    showMessage(text, type) {
        const msgEl = document.getElementById('mensaje');
        if (!msgEl) return;
        msgEl.textContent = text;
        msgEl.className = type;
        setTimeout(() => {
            msgEl.textContent = '';
            msgEl.className = '';
        }, 3000);
    },
    
    showBigAlert(nombre, tipo, mensaje) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); z-index: 9999;
            display: flex; align-items: center; justify-content: center;
        `;
        
        const alertBox = document.createElement('div');
        const bgColor = tipo === 'success' ? '#28a745' : tipo === 'warning' ? '#ffc107' : '#dc3545';
        const textColor = tipo === 'warning' ? '#000' : '#fff';
        
        alertBox.style.cssText = `
            background: ${bgColor}; color: ${textColor};
            padding: 40px; border-radius: 20px; text-align: center;
            max-width: 90%; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        `;
        
        const icon = tipo === 'success' ? '✅' : tipo === 'warning' ? '⚠️' : '❌';
        
        alertBox.innerHTML = `
            <div style="font-size: 4rem; margin-bottom: 20px;">${icon}</div>
            <h2 style="font-size: 2rem; margin-bottom: 15px; font-weight: bold;">${nombre}</h2>
            <p style="font-size: 1.5rem; margin: 0;">${mensaje}</p>
        `;
        
        overlay.appendChild(alertBox);
        document.body.appendChild(overlay);
        
        setTimeout(() => document.body.removeChild(overlay), 3000);
        overlay.addEventListener('click', () => document.body.removeChild(overlay));
    },
    
    hideAllSections() {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    },
    
    updateAllUserDropdowns() {
        const user = Auth.getCurrentUser();
        if (user) {
            document.querySelectorAll('.user-display-name').forEach(el => {
                el.textContent = user.nombre;
            });
            document.querySelectorAll('.dropdown-rol').forEach(el => {
                el.textContent = user.rol.toUpperCase();
            });
        }
    },
    
    toggleUserDropdown(dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        if (dropdown) dropdown.classList.toggle('active');
    }
};

// Cerrar dropdown al hacer clic fuera
document.addEventListener('click', function(event) {
    const dropdowns = document.querySelectorAll('.user-dropdown');
    dropdowns.forEach(dropdown => {
        if (dropdown && !dropdown.contains(event.target)) {
            dropdown.classList.remove('active');
        }
    });
});

