// Navegación móvil
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll para enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Formulario de cotización
const form = document.querySelector('.form');
const whatsappNumber = '573144707571';

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener datos del formulario
    const formData = new FormData(form);
    const nombre = formData.get('nombre');
    const telefono = formData.get('telefono');
    const email = formData.get('email');
    const evento = formData.get('evento');
    const personas = formData.get('personas');
    const autorizacion = formData.get('autorizacion') ? 'Sí' : 'No';

    // 1) Enviar correo por backend (no bloquea WhatsApp)
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
        } else {
            console.error('Error enviando correo:', data.error);
        }
    })
    .catch(error => {
        console.error('Error de conexión:', error);
    });

    // 2) Crear mensaje para WhatsApp
    const mensaje = `¡Hola! Deseo cotizar productos de Pistacherito.

*Información del cliente:*
• Nombre: ${nombre}
• Teléfono: ${telefono}
• Email: ${email}

*Detalles del evento:*
• Tipo de evento: ${evento}
• Cantidad de personas: ${personas}
• Autorización telefónica: ${autorizacion}

¡Gracias!`;

    // Codificar mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Crear enlace de WhatsApp
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${mensajeCodificado}`;
    
    // Abrir WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Mostrar mensaje de confirmación
    showNotification('¡Mensaje preparado! Se abrirá WhatsApp en una nueva ventana.', 'success');
    
    // Limpiar formulario
    form.reset();
});

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Botones de cotización en productos
document.querySelectorAll('.btn-whatsapp').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Obtener información del producto
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        
        // Crear mensaje para WhatsApp
        const mensaje = `¡Hola! Deseo cotizar el producto: *${productName}*

Por favor, envíame más información sobre:
• Precios
• Disponibilidad
• Opciones de personalización
• Tiempos de entrega

¡Gracias! 🌰`;

        // Codificar mensaje para URL
        const mensajeCodificado = encodeURIComponent(mensaje);
        
        // Crear enlace de WhatsApp
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${mensajeCodificado}`;
        
        // Abrir WhatsApp
        window.open(whatsappURL, '_blank');
        
        // Mostrar notificación
        showNotification(`¡Mensaje preparado para ${productName}!`, 'success');
    });
});

// Animaciones al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animaciones
document.querySelectorAll('.product-card, .featured-card, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Efecto parallax suave en el hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Validación en tiempo real del formulario
const inputs = form.querySelectorAll('input, select');
inputs.forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('input', clearErrors);
});

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remover errores previos
    clearFieldError(field);
    
    // Validaciones específicas
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

// Controlar el evento de whatsapp
document.querySelector('.contact .btn-whatsapp')?.addEventListener('click', (e) => {
    e.preventDefault();
    const numero = '573144707571';
    const mensaje = '¡Hola! Quiero más información por favor.';
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  });

function showFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ff4444;
        font-size: 0.9rem;
        margin-top: 0.5rem;
    `;
    
    field.style.borderColor = '#ff4444';
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.style.borderColor = '';
}

function clearErrors(e) {
    clearFieldError(e.target);
}

// Cargar animación inicial
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Función para mostrar/ocultar botón de scroll to top
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #8B4513;
    color: white;
    border: none;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Funcionalidad de galería de productos
function initProductGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImages = document.querySelectorAll('.detail-main-image');
    
    if (thumbnails.length === 0 || mainImages.length === 0) return;
    
    // Array de imágenes para la galería
    const galleryImages = [
        'matrial_piscaheritos/art.png',
        'matrial_piscaheritos/rayos_de_sol.jpg',
        'matrial_piscaheritos/dulces_momentos.jpg'
    ];
    
    // Crear todas las imágenes principales
    const galleryMain = document.querySelector('.gallery-main');
    if (galleryMain) {
        galleryMain.innerHTML = '';
        galleryImages.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Producto ${index + 1}`;
            img.className = 'detail-main-image';
            if (index === 0) img.classList.add('active');
            galleryMain.appendChild(img);
        });
    }
    
    // Actualizar thumbnails con las imágenes correctas
    thumbnails.forEach((thumb, index) => {
        if (galleryImages[index]) {
            thumb.src = galleryImages[index];
        }
        
        thumb.addEventListener('click', () => {
            // Remover clase active de todas las imágenes y thumbnails
            mainImages.forEach(img => img.classList.remove('active'));
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Añadir clase active a la imagen y thumbnail seleccionados
            if (mainImages[index]) {
                mainImages[index].classList.add('active');
            }
            thumb.classList.add('active');
        });
    });
}

// Inicializar galería cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initProductGallery);