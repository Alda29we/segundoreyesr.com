/**
 * SEGUNDO REYES - INTERACTIVIDAD Y MICRO-ANIMACIONES
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Año Dinámico en Footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Elementos de la interfaz
    const shareBtn = document.getElementById('shareProfileBtn');
    const qrBtn = document.getElementById('qrModalBtn');
    const qrModal = document.getElementById('qrModal');
    const closeQrModal = document.getElementById('closeQrModal');
    const copyLinkModalBtn = document.getElementById('copyLinkModalBtn');
    const toast = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');
    const qrImage = document.getElementById('qrImage');

    let toastTimeout = null;

    // Función para mostrar notificación Toast
    function showToast(message = '¡Enlace copiado al portapapeles! 🚀') {
        if (toastMessage) toastMessage.textContent = message;
        if (toast) {
            toast.classList.add('show');
            if (toastTimeout) clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    // Copiar URL al portapapeles
    async function copyCurrentUrl() {
        const urlToCopy = window.location.href.startsWith('http') 
            ? window.location.href 
            : 'https://segundoreyes.com';

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(urlToCopy);
                showToast('¡Enlace copiado al portapapeles! 🚀');
            } else {
                // Fallback clásico
                const textArea = document.createElement('textarea');
                textArea.value = urlToCopy;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
                showToast('¡Enlace copiado con éxito! 📋');
            }
        } catch (err) {
            console.error('Error al copiar:', err);
            showToast('No se pudo copiar automáticamente.');
        }
    }

    // 3. Compartir Perfil (Web Share API o Portapapeles)
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const shareData = {
                title: 'Segundo Reyes | Redes Sociales & Perfil Oficial',
                text: '¡Hola! Te comparto el perfil y redes oficiales de Segundo Reyes.',
                url: window.location.href.startsWith('http') ? window.location.href : 'https://segundoreyes.com'
            };

            if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        copyCurrentUrl();
                    }
                }
            } else {
                copyCurrentUrl();
            }
        });
    }

    // 4. Modal de Código QR
    if (qrBtn && qrModal) {
        qrBtn.addEventListener('click', () => {
            const currentUrl = window.location.href.startsWith('http') 
                ? encodeURIComponent(window.location.href) 
                : encodeURIComponent('https://segundoreyes.com');
            
            if (qrImage) {
                qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${currentUrl}&color=0-242-254&bgcolor=8-12-20`;
            }
            qrModal.classList.add('active');
            qrModal.setAttribute('aria-hidden', 'false');
        });
    }

    if (closeQrModal && qrModal) {
        closeQrModal.addEventListener('click', () => {
            qrModal.classList.remove('active');
            qrModal.setAttribute('aria-hidden', 'true');
        });

        // Cerrar al hacer clic en el fondo
        qrModal.addEventListener('click', (e) => {
            if (e.target === qrModal) {
                qrModal.classList.remove('active');
                qrModal.setAttribute('aria-hidden', 'true');
            }
        });
    }

    if (copyLinkModalBtn) {
        copyLinkModalBtn.addEventListener('click', () => {
            copyCurrentUrl();
        });
    }

    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && qrModal && qrModal.classList.contains('active')) {
            qrModal.classList.remove('active');
            qrModal.setAttribute('aria-hidden', 'true');
        }
    });

    // 5. Efecto sutil de inclinación 3D (Tilt) interactivo en las tarjetas de enlace
    const linkCards = document.querySelectorAll('.link-card');
    
    linkCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px) scale(1.012)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
});
