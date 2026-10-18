/**
 * ==========================================================================
 * SEGUNDO REYES - INTERACTIVIDAD Y EXPERIENCIA DE USUARIO AVANZADA
 * - Reloj Dinámico en Vivo (Hora Local de Lima, Perú)
 * - Motor de Confeti Celebratorio en Canvas
 * - Modal Interactivo de WhatsApp con Formulario Rápido
 * - Motor de Partículas Interactivas en Canvas
 * - Spotlight Dinámico y Efecto 3D Tilt
 * - Sintetizador de Sonido Háptico UI (Web Audio API)
 * - Selector de Temas Dinámicos con Persistencia
 * - Filtrado de Categorías (Bento Tabs)
 * - Atajos de Teclado Globales
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------------
     * 0. CONFIGURACIÓN CENTRALIZADA DEL PERFIL (Personalizable)
     * -------------------------------------------------------------------------- */
    const CONFIG = {
        // Ingresa tu número de WhatsApp con código de país (ejemplo: '51987654321')
        // Si se deja vacío (''), abrirá WhatsApp para que la persona elija el chat
        whatsappPhone: '',
        telegramUsername: 'AldairReyesRoj1',
        officialSite: 'https://segundoreyesr.com',
        email: 'segundo33reyesrojas@gmail.com'
    };

    /* --------------------------------------------------------------------------
     * 1. AÑO DINÁMICO & RELOJ EN VIVO (LIMA, PERÚ)
     * -------------------------------------------------------------------------- */
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    const timeElement = document.getElementById('localTimeText');
    function updatePeruTime() {
        if (!timeElement) return;
        try {
            const formatter = new Intl.DateTimeFormat('es-PE', {
                timeZone: 'America/Lima',
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
            timeElement.textContent = `Lima • ${formatter.format(new Date())}`;
        } catch (e) {
            timeElement.textContent = 'Lima, Perú';
        }
    }
    updatePeruTime();
    setInterval(updatePeruTime, 1000);

    /* --------------------------------------------------------------------------
     * 2. MOTOR DE CONFETI CELEBRATORIO EN CANVAS
     * -------------------------------------------------------------------------- */
    const confettiCanvas = document.getElementById('confettiCanvas');
    let confettiPieces = [];
    let confettiAnimationId = null;

    if (confettiCanvas) {
        const cCtx = confettiCanvas.getContext('2d');
        function resizeConfetti() {
            confettiCanvas.width = window.innerWidth;
            confettiCanvas.height = window.innerHeight;
        }
        resizeConfetti();
        window.addEventListener('resize', resizeConfetti);

        window.fireConfetti = function(x = window.innerWidth / 2, y = window.innerHeight * 0.4) {
            const colors = ['#00f2fe', '#4facfe', '#c084fc', '#ff007f', '#10b981', '#fbbf24', '#ff7e5f'];
            for (let i = 0; i < 75; i++) {
                const angle = Math.random() * Math.PI * 2;
                const velocity = Math.random() * 9 + 4;
                confettiPieces.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * velocity,
                    vy: Math.sin(angle) * velocity - 4,
                    size: Math.random() * 8 + 4,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    rotation: Math.random() * 360,
                    rotationSpeed: (Math.random() - 0.5) * 14,
                    alpha: 1,
                    gravity: 0.22,
                    decay: Math.random() * 0.015 + 0.009
                });
            }
            if (!confettiAnimationId) {
                animateConfetti();
            }
        };

        function animateConfetti() {
            cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            confettiPieces = confettiPieces.filter(p => p.alpha > 0.01);

            for (let i = 0; i < confettiPieces.length; i++) {
                const p = confettiPieces[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.rotation += p.rotationSpeed;
                p.alpha -= p.decay;

                cCtx.save();
                cCtx.translate(p.x, p.y);
                cCtx.rotate((p.rotation * Math.PI) / 180);
                cCtx.fillStyle = p.color;
                cCtx.globalAlpha = Math.max(p.alpha, 0);
                cCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                cCtx.restore();
            }

            if (confettiPieces.length > 0) {
                confettiAnimationId = requestAnimationFrame(animateConfetti);
            } else {
                confettiAnimationId = null;
                cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            }
        }
    }

    /* --------------------------------------------------------------------------
     * 3. SINTETIZADOR DE EFECTOS DE SONIDO UI (Web Audio API)
     * -------------------------------------------------------------------------- */
    let audioCtx = null;
    let isSoundMuted = localStorage.getItem('sr_sound_muted') === 'true';

    function initAudio() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
    }

    function playSound(type = 'click') {
        if (isSoundMuted) return;
        try {
            initAudio();
            if (!audioCtx) return;
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            const now = audioCtx.currentTime;

            if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            } else if (type === 'toggle') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
            } else if (type === 'success') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, now);
                osc.frequency.setValueAtTime(659.25, now + 0.08);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
            }
        } catch (e) {
            // Audio no soportado o bloqueado
        }
    }

    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const soundIcon = document.getElementById('soundIcon');

    function updateSoundUI() {
        if (soundIcon) {
            if (isSoundMuted) {
                soundIcon.className = 'fa-solid fa-volume-xmark';
                soundToggleBtn.title = 'Activar efectos de sonido';
            } else {
                soundIcon.className = 'fa-solid fa-volume-high';
                soundToggleBtn.title = 'Silenciar efectos de sonido';
            }
        }
    }
    updateSoundUI();

    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            isSoundMuted = !isSoundMuted;
            localStorage.setItem('sr_sound_muted', isSoundMuted);
            updateSoundUI();
            if (!isSoundMuted) {
                playSound('success');
                showToast('¡Efectos de sonido activados! 🔊');
            } else {
                showToast('Efectos de sonido silenciados 🔇');
            }
        });
    }

    /* --------------------------------------------------------------------------
     * 4. SELECTOR DE TEMAS DE COLOR DE ACENTO
     * -------------------------------------------------------------------------- */
    const accentButtons = document.querySelectorAll('.accent-dot-btn');
    const htmlElement = document.documentElement;
    const qrImage = document.getElementById('qrImage');

    const qrThemeColors = {
        cyan: '0-242-254',
        purple: '192-132-252',
        emerald: '16-185-129',
        sunset: '255-126-95'
    };

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('sr_accent_theme', theme);

        accentButtons.forEach(btn => {
            if (btn.getAttribute('data-color') === theme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (qrImage) {
            const colorCode = qrThemeColors[theme] || '0-242-254';
            const currentUrl = window.location.href.startsWith('http') 
                ? encodeURIComponent(window.location.href) 
                : encodeURIComponent('https://segundoreyes.com');
            qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${currentUrl}&color=${colorCode}&bgcolor=8-12-20`;
        }
    }

    const savedTheme = localStorage.getItem('sr_accent_theme') || 'cyan';
    setTheme(savedTheme);

    accentButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.getAttribute('data-color');
            setTheme(color);
            playSound('toggle');
        });
    });

    /* --------------------------------------------------------------------------
     * 5. NOTIFICACIÓN TOAST FLOTANTE
     * -------------------------------------------------------------------------- */
    const toast = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');
    let toastTimeout = null;

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

    /* --------------------------------------------------------------------------
     * 6. COPIAR ENLACE AL PORTAPAPELES
     * -------------------------------------------------------------------------- */
    async function copyCurrentUrl() {
        const urlToCopy = window.location.href.startsWith('http') 
            ? window.location.href 
            : CONFIG.officialSite;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(urlToCopy);
                playSound('success');
                if (window.fireConfetti) window.fireConfetti();
                showToast('¡Enlace copiado al portapapeles! 🚀');
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = urlToCopy;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
                playSound('success');
                if (window.fireConfetti) window.fireConfetti();
                showToast('¡Enlace copiado al portapapeles! 📋');
            }
        } catch (err) {
            showToast('No se pudo copiar automáticamente.');
        }
    }

    /* --------------------------------------------------------------------------
     * 7. COMPARTIR PERFIL (Web Share API)
     * -------------------------------------------------------------------------- */
    const shareBtn = document.getElementById('shareProfileBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            playSound('click');
            const shareData = {
                title: 'Segundo Reyes | Redes Sociales & Perfil Oficial',
                text: '¡Hola! Te comparto el portal oficial y redes de Segundo Reyes.',
                url: window.location.href.startsWith('http') ? window.location.href : CONFIG.officialSite
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

    /* --------------------------------------------------------------------------
     * 8. MODAL DE CÓDIGO QR
     * -------------------------------------------------------------------------- */
    const qrBtn = document.getElementById('qrModalBtn');
    const qrModal = document.getElementById('qrModal');
    const closeQrModal = document.getElementById('closeQrModal');
    const copyLinkModalBtn = document.getElementById('copyLinkModalBtn');

    if (qrBtn && qrModal) {
        qrBtn.addEventListener('click', () => {
            playSound('click');
            qrModal.classList.add('active');
            qrModal.setAttribute('aria-hidden', 'false');
        });
    }

    if (closeQrModal && qrModal) {
        closeQrModal.addEventListener('click', () => {
            playSound('click');
            qrModal.classList.remove('active');
            qrModal.setAttribute('aria-hidden', 'true');
        });

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

    /* --------------------------------------------------------------------------
     * 9. MODAL DE MENSAJE RÁPIDO A WHATSAPP & SERVICIOS TI
     * -------------------------------------------------------------------------- */
    const waCardBtn = document.getElementById('btn-whatsapp');
    const waModal = document.getElementById('whatsappModal');
    const closeWaModal = document.getElementById('closeWhatsAppModal');
    const waForm = document.getElementById('whatsappForm');
    const servicesBtn = document.getElementById('btn-services');

    if (waCardBtn && waModal) {
        waCardBtn.addEventListener('click', (e) => {
            e.preventDefault();
            playSound('click');
            waModal.classList.add('active');
            waModal.setAttribute('aria-hidden', 'false');
        });
    }

    // Tarjeta Servicios & Soporte TI: abre el formulario con asunto preseleccionado
    if (servicesBtn && waModal) {
        const handleServicesClick = (e) => {
            if (e) e.preventDefault();
            playSound('click');
            const waTopic = document.getElementById('waTopic');
            if (waTopic) {
                waTopic.value = 'Consulta sobre TI o Diseño';
            }
            const waMessage = document.getElementById('waMessage');
            if (waMessage && !waMessage.value) {
                waMessage.placeholder = 'Hola Segundo, me interesa cotizar soporte técnico / desarrollo web...';
            }
            waModal.classList.add('active');
            waModal.setAttribute('aria-hidden', 'false');
            setTimeout(() => {
                const nameInput = document.getElementById('waName');
                if (nameInput) nameInput.focus();
            }, 150);
        };

        servicesBtn.addEventListener('click', handleServicesClick);
        servicesBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleServicesClick();
            }
        });
    }

    if (closeWaModal && waModal) {
        closeWaModal.addEventListener('click', () => {
            playSound('click');
            waModal.classList.remove('active');
            waModal.setAttribute('aria-hidden', 'true');
        });

        waModal.addEventListener('click', (e) => {
            if (e.target === waModal) {
                waModal.classList.remove('active');
                waModal.setAttribute('aria-hidden', 'true');
            }
        });
    }

    if (waForm) {
        waForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('waName').value.trim();
            const topic = document.getElementById('waTopic').value;
            const message = document.getElementById('waMessage').value.trim();

            const fullText = `¡Hola Segundo! 👋\n\n👤 Mi nombre: ${name}\n📌 Asunto: ${topic}\n💬 Mensaje: ${message}\n\n(Enviado desde tu perfil web ${CONFIG.officialSite})`;
            
            const cleanPhone = CONFIG.whatsappPhone ? CONFIG.whatsappPhone.replace(/[^0-9]/g, '') : '';
            const waUrl = cleanPhone 
                ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(fullText)}`
                : `https://wa.me/?text=${encodeURIComponent(fullText)}`;

            playSound('success');
            if (window.fireConfetti) window.fireConfetti();
            showToast('¡Abriendo WhatsApp con tu mensaje! 🚀');

            setTimeout(() => {
                window.open(waUrl, '_blank', 'noopener,noreferrer');
                waModal.classList.remove('active');
                waModal.setAttribute('aria-hidden', 'true');
                waForm.reset();
            }, 350);
        });
    }

    /* --------------------------------------------------------------------------
     * 10. MODAL DE MENSAJE RÁPIDO A TELEGRAM
     * -------------------------------------------------------------------------- */
    const tgCardBtn = document.getElementById('btn-telegram');
    const tgModal = document.getElementById('telegramModal');
    const closeTgModal = document.getElementById('closeTelegramModal');
    const tgForm = document.getElementById('telegramForm');

    if (tgCardBtn && tgModal) {
        tgCardBtn.addEventListener('click', (e) => {
            e.preventDefault();
            playSound('click');
            tgModal.classList.add('active');
            tgModal.setAttribute('aria-hidden', 'false');
        });
    }

    if (closeTgModal && tgModal) {
        closeTgModal.addEventListener('click', () => {
            playSound('click');
            tgModal.classList.remove('active');
            tgModal.setAttribute('aria-hidden', 'true');
        });

        tgModal.addEventListener('click', (e) => {
            if (e.target === tgModal) {
                tgModal.classList.remove('active');
                tgModal.setAttribute('aria-hidden', 'true');
            }
        });
    }

    if (tgForm) {
        tgForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('tgName').value.trim();
            const topic = document.getElementById('tgTopic').value;
            const message = document.getElementById('tgMessage').value.trim();

            const fullText = `¡Hola Segundo! 👋\n\n👤 Mi nombre: ${name}\n📌 Asunto: ${topic}\n💬 Mensaje: ${message}\n\n(Enviado desde tu perfil web)`;
            
            try {
                if (navigator.clipboard) {
                    await navigator.clipboard.writeText(fullText);
                }
            } catch (err) {}

            playSound('success');
            if (window.fireConfetti) window.fireConfetti();
            showToast('¡Mensaje copiado! Pégalo en el chat de Telegram ✈️');

            setTimeout(() => {
                const tgUrl = `https://t.me/${CONFIG.telegramUsername}`;
                window.open(tgUrl, '_blank', 'noopener,noreferrer');
                tgModal.classList.remove('active');
                tgModal.setAttribute('aria-hidden', 'true');
                tgForm.reset();
            }, 350);
        });
    }

    /* --------------------------------------------------------------------------
     * 10. COPIAR CORREO ELECTRÓNICO DIRECTO
     * -------------------------------------------------------------------------- */
    const copyEmailBtn = document.getElementById('btn-copy-email');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async () => {
            playSound('click');
            const email = 'segundo33reyesrojas@gmail.com';
            try {
                if (navigator.clipboard) {
                    await navigator.clipboard.writeText(email);
                }
                playSound('success');
                if (window.fireConfetti) window.fireConfetti();
                showToast(`¡Correo copiado: ${email}! ✉️`);
            } catch (err) {
                window.location.href = `mailto:${email}`;
            }
        });
    }

    /* --------------------------------------------------------------------------
     * 11. FILTRADO DE PESTAÑAS (TABS BENTO)
     * -------------------------------------------------------------------------- */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const filterableCards = document.querySelectorAll('[data-category]');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('toggle');
            tabButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            const filter = btn.getAttribute('data-filter');

            filterableCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    /* --------------------------------------------------------------------------
     * 12. SPOTLIGHT SUAVE AL MOVER EL RATÓN (Optimizado con rAF)
     * -------------------------------------------------------------------------- */
    const container = document.getElementById('mainContainer');

    if (container) {
        let containerRect = null;
        const updateRect = () => { containerRect = container.getBoundingClientRect(); };
        updateRect();
        window.addEventListener('resize', updateRect, { passive: true });
        window.addEventListener('scroll', updateRect, { passive: true });

        let ticking = false;
        let mouseX = 0, mouseY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!ticking) {
                ticking = true;
                requestAnimationFrame(() => {
                    if (containerRect) {
                        const x = mouseX - containerRect.left;
                        const y = mouseY - containerRect.top;
                        container.style.setProperty('--mouse-x', `${x}px`);
                        container.style.setProperty('--mouse-y', `${y}px`);
                    }
                    ticking = false;
                });
            }
        }, { passive: true });
    }

    const linkCards = document.querySelectorAll('.link-card');
    linkCards.forEach(card => {
        card.addEventListener('click', () => {
            playSound('click');
        });
    });

    /* --------------------------------------------------------------------------
     * 13. ATAJOS DE TECLADO GLOBALES
     * -------------------------------------------------------------------------- */
    const themesList = ['cyan', 'purple', 'emerald', 'sunset'];
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

        const key = e.key.toLowerCase();

        // C -> Copiar enlace
        if (key === 'c' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            copyCurrentUrl();
        }
        // Q -> Modal QR
        else if (key === 'q' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            if (qrModal) {
                qrModal.classList.toggle('active');
                playSound('toggle');
            }
        }
        // T -> Alternar color de tema
        else if (key === 't' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            const currentTheme = htmlElement.getAttribute('data-theme') || 'cyan';
            const nextIndex = (themesList.indexOf(currentTheme) + 1) % themesList.length;
            setTheme(themesList[nextIndex]);
            playSound('toggle');
            showToast(`Tema: ${themesList[nextIndex].toUpperCase()} ✨`);
        }
        // ESC -> Cerrar cualquier modal
        else if (e.key === 'Escape') {
            if (qrModal && qrModal.classList.contains('active')) {
                qrModal.classList.remove('active');
                qrModal.setAttribute('aria-hidden', 'true');
                playSound('click');
            }
            if (waModal && waModal.classList.contains('active')) {
                waModal.classList.remove('active');
                waModal.setAttribute('aria-hidden', 'true');
                playSound('click');
            }
            if (tgModal && tgModal.classList.contains('active')) {
                tgModal.classList.remove('active');
                tgModal.setAttribute('aria-hidden', 'true');
                playSound('click');
            }
        }
    });

    /* --------------------------------------------------------------------------
     * 14. MOTOR DE PARTÍCULAS INTERACTIVAS EN CANVAS (Optimizado 60FPS)
     * -------------------------------------------------------------------------- */
    const canvas = document.getElementById('bgCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d', { alpha: true });
        let particles = [];
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let animationFrameId = null;

        const mouse = { x: null, y: null, radius: 100 };

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        }, { passive: true });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }, { passive: true });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        }, { passive: true });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.8 + 0.6;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.alpha = Math.random() * 0.4 + 0.15;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
                ctx.fill();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < 10000) { // 100^2
                        const dist = Math.sqrt(distSq);
                        const force = (100 - dist) / 100;
                        this.x -= (dx / dist) * force * 2;
                        this.y -= (dy / dist) * force * 2;
                    }
                }
            }
        }

        function initParticles() {
            particles = [];
            // Densidad balanceada para alto rendimiento (máximo 40 partículas)
            const count = Math.floor((width * height) / 28000);
            const total = Math.min(Math.max(count, 20), 40);
            for (let i = 0; i < total; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            const maxDistanceSq = 8100; // 90^2
            ctx.lineWidth = 0.7;

            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < maxDistanceSq) {
                        const dist = Math.sqrt(distSq);
                        const opacity = (1 - dist / 90) * 0.12;
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].draw();
                particles[i].update();
            }
            connectParticles();
            animationFrameId = requestAnimationFrame(animate);
        }

        // Pausar renderizado cuando la pestaña está oculta para ahorrar CPU/Batería
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
            } else {
                animate();
            }
        });

        initParticles();
        animate();
    }

    /* --------------------------------------------------------------------------
     * 15. REGISTRO DE SERVICE WORKER PARA PWA (OFFLINE & INSTALACIÓN)
     * -------------------------------------------------------------------------- */
    if ('serviceWorker' in navigator && (window.location.protocol.startsWith('http') || window.location.protocol.startsWith('https'))) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => {
                    console.log('PWA Service Worker registrado con éxito:', reg.scope);
                })
                .catch(err => {
                    console.warn('Registro de Service Worker PWA no completado:', err);
                });
        });
    }
});
