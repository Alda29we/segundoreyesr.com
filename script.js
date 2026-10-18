/**
 * ==========================================================================
 * SEGUNDO REYES - INTERACTIVIDAD Y EXPERIENCIA DE USUARIO AVANZADA
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
     * 1. AÑO DINÁMICO
     * -------------------------------------------------------------------------- */
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /* --------------------------------------------------------------------------
     * 2. SINTETIZADOR DE EFECTOS DE SONIDO UI (Web Audio API)
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
                // Sonido pop sutil y agradable
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            } else if (type === 'toggle') {
                // Sonido chime suave
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
            } else if (type === 'success') {
                // Sonido de éxito
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

    // Toggle de Sonido
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
     * 3. SELECTOR DE TEMAS DE COLOR DE ACENTO
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

        // Actualizar color del código QR si existe
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
     * 4. NOTIFICACIÓN TOAST FLOTANTE
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
     * 5. COPIAR ENLACE AL PORTAPAPELES
     * -------------------------------------------------------------------------- */
    async function copyCurrentUrl() {
        const urlToCopy = window.location.href.startsWith('http') 
            ? window.location.href 
            : 'https://segundoreyes.com';

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(urlToCopy);
                playSound('success');
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
                showToast('¡Enlace copiado al portapapeles! 📋');
            }
        } catch (err) {
            showToast('No se pudo copiar automáticamente.');
        }
    }

    /* --------------------------------------------------------------------------
     * 6. COMPARTIR PERFIL (Web Share API)
     * -------------------------------------------------------------------------- */
    const shareBtn = document.getElementById('shareProfileBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            playSound('click');
            const shareData = {
                title: 'Segundo Reyes | Redes Sociales & Perfil Oficial',
                text: '¡Hola! Te comparto el portal oficial y redes de Segundo Reyes.',
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

    /* --------------------------------------------------------------------------
     * 7. MODAL DE CÓDIGO QR
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
     * 8. COPIAR CORREO ELECTRÓNICO DIRECTO
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
                showToast(`¡Correo copiado: ${email}! ✉️`);
            } catch (err) {
                window.location.href = `mailto:${email}`;
            }
        });
    }

    /* --------------------------------------------------------------------------
     * 9. FILTRADO DE PESTAÑAS (TABS BENTO)
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
     * 10. SPOTLIGHT Y 3D TILT AL MOVER EL RATÓN
     * -------------------------------------------------------------------------- */
    const container = document.getElementById('mainContainer');

    if (container) {
        window.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            container.style.setProperty('--mouse-x', `${x}px`);
            container.style.setProperty('--mouse-y', `${y}px`);
        });
    }

    const linkCards = document.querySelectorAll('.link-card');
    linkCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px) scale(1.012)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });

        card.addEventListener('click', () => {
            playSound('click');
        });
    });

    /* --------------------------------------------------------------------------
     * 11. ATAJOS DE TECLADO GLOBALES
     * -------------------------------------------------------------------------- */
    const themesList = ['cyan', 'purple', 'emerald', 'sunset'];
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

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
        // ESC -> Cerrar modal
        else if (e.key === 'Escape' && qrModal && qrModal.classList.contains('active')) {
            qrModal.classList.remove('active');
            qrModal.setAttribute('aria-hidden', 'true');
            playSound('click');
        }
    });

    /* --------------------------------------------------------------------------
     * 12. MOTOR DE PARTÍCULAS INTERACTIVAS EN CANVAS (60FPS Ligero)
     * -------------------------------------------------------------------------- */
    const canvas = document.getElementById('bgCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const mouse = { x: null, y: null, radius: 120 };

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 0.8;
                this.baseX = this.x;
                this.baseY = this.y;
                this.vx = (Math.random() - 0.5) * 0.45;
                this.vy = (Math.random() - 0.5) * 0.45;
                this.alpha = Math.random() * 0.5 + 0.2;
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

                // Interacción suave con el cursor
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        const directionX = (dx / dist) * force * 2.5;
                        const directionY = (dy / dist) * force * 2.5;
                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }
            }
        }

        function initParticles() {
            particles = [];
            // Densidad adaptada al tamaño de pantalla
            const count = Math.floor((width * height) / 16000);
            const total = Math.min(Math.max(count, 35), 85);
            for (let i = 0; i < total; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            const maxDistance = 100;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDistance) {
                        const opacity = (1 - dist / maxDistance) * 0.15;
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                        ctx.lineWidth = 0.8;
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
            requestAnimationFrame(animate);
        }

        initParticles();
        animate();
    }
});
