// Shared site behavior for every page. Loaded with `defer`, so the DOM is ready.

const WHATSAPP_NUMBER = '573132035072';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Mobile navigation ----------
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

function setMenuOpen(open) {
    if (!hamburger || !navMenu) return;
    hamburger.classList.toggle('active', open);
    navMenu.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        setMenuOpen(!navMenu.classList.contains('active'));
    });

    // Close the menu after choosing a link or pressing Escape
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            setMenuOpen(false);
            hamburger.focus();
        }
    });
}

// ---------- Notifications ----------
function showNotification(message, type = 'info') {
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    else if (type === 'error') icon = 'exclamation-circle';

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', type === 'error' ? 'alert' : 'status');
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${icon}" aria-hidden="true"></i>
            <span></span>
        </div>
    `;
    notification.querySelector('span').textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('is-visible'), 100);

    setTimeout(() => {
        notification.classList.remove('is-visible');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ---------- Advisory form (index only) ----------
const form = document.querySelector('.form');

if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const nombre = formData.get('nombre');
        const telefono = formData.get('telefono');
        const email = formData.get('email');
        const evento = formData.get('evento');
        const personas = formData.get('personas');
        const autorizacion = formData.get('autorizacion') ? 'Sí' : 'No';

        showNotification('Enviando solicitud de asesoría...', 'info');

        fetch('/api/send-advisory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre,
                telefono,
                email,
                evento,
                personas,
                autorizacion
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Correo enviado exitosamente');
                    showNotification('¡Solicitud enviada exitosamente! Te contactaremos pronto por email.', 'success');
                    // Reset only after a successful send
                    form.reset();
                } else {
                    console.error('Error enviando correo:', data.error);
                    showNotification('Error al enviar la solicitud. Por favor intenta nuevamente.', 'error');
                }
            })
            .catch(error => {
                console.error('Error de conexión:', error);
                showNotification('Error de conexión. Verifica tu internet e intenta nuevamente.', 'error');
            });
    });

    // Real-time field validation
    form.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearErrors);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();

    clearFieldError(field);

    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Este campo es obligatorio');
        return false;
    }

    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Ingresa un email válido');
            return false;
        }
    }

    if (field.type === 'tel' && value) {
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Ingresa un teléfono válido');
            return false;
        }
    }

    if (field.type === 'number' && value) {
        if (parseInt(value) < 1) {
            showFieldError(field, 'La cantidad debe ser mayor a 0');
            return false;
        }
    }

    return true;
}

function showFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;

    field.classList.add('is-invalid');
    field.setAttribute('aria-invalid', 'true');
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.classList.remove('is-invalid');
    field.removeAttribute('aria-invalid');
}

function clearErrors(e) {
    clearFieldError(e.target);
}

// ---------- WhatsApp quote buttons on product cards ----------
// Detail pages use plain <a href="https://wa.me/..."> links and are left untouched.
document.querySelectorAll('.product-card .btn-whatsapp').forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();

        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;

        const mensaje = `¡Hola! Deseo cotizar el producto: *${productName}*

Por favor, envíame más información sobre:
• Precios
• Disponibilidad
• Opciones de personalización
• Tiempos de entrega

¡Gracias!`;

        const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;

        window.open(whatsappURL, '_blank');

        showNotification(`¡Mensaje preparado para ${productName}!`, 'success');
    });
});

// ---------- Entrance animations ----------
if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.product-card, .variant').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// ---------- Scroll to top ----------
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.type = 'button';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.setAttribute('aria-label', 'Volver arriba');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    scrollToTopBtn.classList.toggle('is-visible', window.scrollY > 300);
}, { passive: true });

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
});
