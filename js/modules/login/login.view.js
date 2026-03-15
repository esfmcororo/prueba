// ========== MÓDULO LOGIN - VISTA ==========
const LoginView = {
    // Generar HTML de la vista
    render() {
        return `
            <div class="login-section">
                <div class="login-container">
                    <h1>
                        <span class="title-line1">ESFM "Simón Bolívar"</span>
                        <span class="title-line2">CORORO</span>
                    </h1>
                    <div class="card">
                        <input type="text" id="email" placeholder="Email o CI" autocomplete="username">
                        <input type="password" id="password" placeholder="Contraseña" autocomplete="current-password">
                        <button id="btn-login" class="btn-primary">Ingresar</button>
                        <p id="login-error" class="error"></p>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Obtener elementos del DOM
    getElements() {
        return {
            emailInput: document.getElementById('email'),
            passwordInput: document.getElementById('password'),
            loginBtn: document.getElementById('btn-login'),
            errorMsg: document.getElementById('login-error')
        };
    }
};
