<div align="center">

  # ⚡ Segundo Reyes | Portal Oficial & Hub de Enlaces

  <p align="center">
    <strong>Portal web interactivo, Linktree Bento Grid y portafolio personal de alta fidelidad visual.</strong>
  </p>

  <p align="center">
    <a href="https://segundoreyesr.com" target="_blank">
      <img src="https://img.shields.io/badge/Sitio_Oficial-segundoreyesr.com-00f2fe?style=for-the-badge&logo=google-chrome&logoColor=080b11" alt="Sitio Web">
    </a>
    <a href="https://vercel.com" target="_blank">
      <img src="https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
    </a>
    <img src="https://img.shields.io/badge/PWA-Ready-10b981?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA Ready">
    <img src="https://img.shields.io/badge/Lighthouse-100%2F100-success?style=for-the-badge&logo=lighthouse&logoColor=white" alt="Lighthouse">
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5">
    <img src="https://img.shields.io/badge/CSS3_Vanilla-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3">
    <img src="https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript">
    <img src="https://img.shields.io/badge/Web_Audio_API-Enabled-c084fc?style=flat-square" alt="Web Audio API">
    <img src="https://img.shields.io/badge/Canvas_2D-60FPS-ff7e5f?style=flat-square" alt="Canvas 2D">
  </p>

</div>

---

## 🌟 Vista General

Este proyecto es la página de perfil oficial y hub digital de **Segundo Reyes**, desarrollada desde cero con tecnologías web nativas enfocadas en máximo rendimiento, micro-interacciones de vanguardia y estética *Glassmorphism / Bento UI*.

Está configurado para desplegarse instantáneamente en **Vercel** conectado a este repositorio de **GitHub**, con caché inmutable, encabezados de seguridad HTTP y soporte **PWA** (Progressive Web App).

---

## ✨ Características Principales

* 💎 **Diseño Bento Glassmorphic**: Interfaz moderna con sombras multicapa, difuminado de fondo (*backdrop-filter*) y efecto de reflejo metálico en tarjetas.
* 🌌 **Fondo Aurora Glow & Partículas**: Motor en HTML5 Canvas con nodos interconectados reactivos al movimiento del cursor (render a 60 FPS ultra ligero).
* 🎨 **Selector Dinámico de Temas**: 4 esquemas de color de acento (*Cian, Púrpura, Esmeralda, Sunset*) con persistencia en `localStorage`.
* 🔊 **Sintetizador de Audio Háptico UI**: Efectos sonoros generados dinámicamente con la **Web Audio API** nativa (sin archivos MP3 ni consumo de red adicional).
* 📱 **PWA Completa (Progressive Web App)**: Incluye `manifest.webmanifest`, iconos optimizados y `sw.js` (Service Worker) para instalarse en Android, iPhone o escritorio.
* 💬 **Modales Directos para WhatsApp y Telegram**: Formulario rápido que redacta un mensaje formal listo para enviar a tus chats oficiales.
* ⏱️ **Reloj en Vivo**: Indicador horario en tiempo real de Lima, Perú (`America/Lima`) con `Intl.DateTimeFormat`.
* ⌨️ **Atajos de Teclado Globales**:
  * <kbd>C</kbd> Copiar URL oficial al portapapeles.
  * <kbd>Q</kbd> Abrir modal con código QR interactivo.
  * <kbd>T</kbd> Alternar tema de color.
  * <kbd>Esc</kbd> Cerrar cualquier ventana emergente.
* 🚀 **Rendimiento de Carga Extrema**: Imágenes optimizadas en alta densidad (< 120 KB en total frente a 1.2 MB iniciales).

---

## 📁 Estructura del Proyecto

```plaintext
segundoreyesr.com/
├── assets/
│   ├── avatar.jpg              # Foto de perfil optimizada (384x384 Retina)
│   ├── favicon.svg             # Favicon vectorial en SVG
│   ├── icon-192.png            # Icono PWA para dispositivos móviles
│   ├── icon-512.png            # Icono PWA para pantalla de inicio y splash
│   └── og-preview.jpg          # Vista previa OpenGraph (1200x630 estándar)
├── index.html                  # Marcado semántico HTML5 con JSON-LD (Schema.org)
├── manifest.webmanifest        # Manifiesto de aplicación web PWA
├── robots.txt                  # Directivas para motores de búsqueda (Google, Bing)
├── script.js                   # Lógica modular: Canvas, Audio API, Modales y Configuración
├── sitemap.xml                 # Mapa del sitio oficial para indexación SEO
├── styles.css                  # Sistema de diseño con variables CSS y animaciones GPU
├── sw.js                       # Service Worker para caché offline
├── vercel.json                 # Configuración de producción para Vercel (Seguridad & Caché)
└── README.md                   # Documentación oficial del repositorio
```

---

## ⚙️ Configuración y Personalización

Todos los datos de contacto y enlaces principales pueden modificarse en el bloque inicial de [script.js](file:///d:/segundoreyes.com-main/script.js):

```javascript
const CONFIG = {
    // Ingresa tu número con prefijo de país (ej. '51987654321' para Perú)
    whatsappPhone: '519XXXXXXXX', 
    telegramUsername: 'AldairReyesRoj1',
    officialSite: 'https://segundoreyesr.com',
    email: 'segundo33reyesrojas@gmail.com'
};
```

---

## 🚀 Despliegue en Vercel

El proyecto está 100% optimizado para Vercel:

1. Haz un commit y sube los cambios a tu repositorio de GitHub:
   ```bash
   git add .
   git commit -m "feat: optimizaciones de producción, PWA, SEO y vercel.json"
   git push origin main
   ```
2. Entra a tu [Dashboard de Vercel](https://vercel.com).
3. Importa este repositorio (`segundoreyesr.com`).
4. Vercel detectará automáticamente el archivo [vercel.json](file:///d:/segundoreyes.com-main/vercel.json) aplicando:
   * Encabezados de seguridad (`X-Frame-Options`, `nosniff`, `CSP`, `Referrer-Policy`).
   * URLs amigables (`cleanUrls: true`).
   * Caché inmutable de 1 año para assets estáticos.

---

## 👤 Autor

**Segundo Reyes (Aldair Reyes)**  
*Especialista en TI, Informática y Diseño Digital*

* 🌐 Web: [segundoreyesr.com](https://segundoreyesr.com)
* 💻 GitHub: [@Aldair29we](https://github.com/Aldair29we)
* 📸 Instagram: [@segundoaldairreyesr](https://www.instagram.com/segundoaldairreyesr/)
* ✈️ Telegram: [@AldairReyesRoj1](https://t.me/AldairReyesRoj1)
* 📧 Correo: [segundo33reyesrojas@gmail.com](mailto:segundo33reyesrojas@gmail.com)

---

<div align="center">
  <sub>Hecho con pasión por el código limpio y la experiencia de usuario.</sub>
</div>
