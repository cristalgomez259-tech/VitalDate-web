// 1. Importar dependencias de Firebase desde CDN (compatibles con navegador)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 2. Configuración de Firebase con tus credenciales
const firebaseConfig = {
  apiKey: "AIzaSyBdM7ah6BymzBB-eqV7Ydq_Hhdrzd-1saE",
  authDomain: "vitaldate2-d22bd.firebaseapp.com",
  projectId: "vitaldate2-d22bd",
  storageBucket: "vitaldate2-d22bd.firebasestorage.app",
  messagingSenderId: "242966935258",
  appId: "1:242966935258:web:c2276994c307b7a42057e3"
};

// 3. Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 4. Manejo de eventos del DOM
document.addEventListener('DOMContentLoaded', () => {

    // Manejo de envío en el formulario de contacto (contacto.html)
    const contactoForm = document.querySelector('.formulario form');
    if (contactoForm) {
        contactoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('¡Gracias por comunicarte con Vitaldate! Tu mensaje ha sido enviado correctamente.');
            contactoForm.reset();
        });
    }

    // Resaltar la página activa en el menú de navegación
    const navLinks = document.querySelectorAll('nav ul li a');
    const currentUrl = window.location.pathname.split('/').pop();

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentUrl || (currentUrl === '' && linkPath === 'index.html')) {
            link.style.color = 'var(--primary-color)';
            link.style.borderBottom = '2px solid var(--primary-color)';
        }
    });

    // Manejo de Registro en Firebase para (unete.html)
    const registroForm = document.getElementById('registroForm');
    if (registroForm) {
        registroForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre')?.value || '';
            const email = document.getElementById('email')?.value || '';
            const password = document.getElementById('password')?.value || '';

            try {
                // Registrar usuario en Firebase Auth
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Guardar perfil en Firestore
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    nombre: nombre,
                    email: email,
                    fechaRegistro: new Date().toISOString()
                });

                alert('¡Gracias por registrarte! Tu cuenta de Vitaldate ha sido creada correctamente.');
                registroForm.reset();

            } catch (error) {
                let mensajeError = "Error al registrarse: ";
                if (error.code === 'auth/email-already-in-use') {
                    mensajeError += "Este correo ya está registrado.";
                } else if (error.code === 'auth/weak-password') {
                    mensajeError += "La contraseña debe tener al menos 6 caracteres.";
                } else {
                    mensajeError += error.message;
                }
                alert(mensajeError);
            }
        });
    }
});