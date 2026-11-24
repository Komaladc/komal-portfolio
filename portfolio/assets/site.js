const header = document.querySelector('.site-header');
if (header) {
    const portfolioRoot = new URL('../', document.currentScript.src);
    const aboutHref = window.location.pathname.endsWith('/aboutme.html')
        ? `${portfolioRoot.href}aboutme.html#about`
        : `${portfolioRoot.href}index.html#about`;
    header.innerHTML = `
        <div class="nav-wrap">
            <a class="brand" href="${portfolioRoot.href}index.html">KOMAL ADHIKARI</a>
            <nav class="nav-links" aria-label="Primary navigation">
                <a href="${portfolioRoot.href}index.html">Home</a>
                <a href="${aboutHref}">About</a>
                <a href="${portfolioRoot.href}experience/index.html">Experience</a>
                <a href="${portfolioRoot.href}projects/index.html">Projects &amp; Initiatives</a>
                <a href="${portfolioRoot.href}contact/index.html">Contact</a>
                <div class="more-menu">
                    <button class="more-toggle" type="button" aria-expanded="false" aria-label="Open More menu">⋯</button>
                    <div class="more-panel">
                        <a href="${portfolioRoot.href}research/index.html">Research</a>
                        <a href="${portfolioRoot.href}gallery/index.html">Gallery</a>
                        <a href="${portfolioRoot.href}blog/index.html">Blog</a>
                        <a href="${portfolioRoot.href}resume/index.html">Resume</a>
                    </div>
                </div>
            </nav>
            <button class="menu-toggle" type="button" aria-expanded="false" aria-label="Toggle navigation">☰</button>
        </div>`;

    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    header.querySelectorAll('.nav-links > a').forEach(link => {
        const linkPath = new URL(link.href).pathname.replace(/\/+$/, '') || '/';
        if (path === linkPath) link.classList.add('active');
    });
    header.querySelectorAll('.more-panel a').forEach(link => {
        const linkPath = new URL(link.href).pathname.replace(/\/+$/, '') || '/';
        if (path === linkPath || (linkPath !== '/' && path.startsWith(linkPath))) {
            link.classList.add('active');
            link.closest('.more-menu')?.querySelector('.more-toggle')?.classList.add('active');
        }
    });
}

document.querySelectorAll('.menu-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const open = toggle.closest('.nav-wrap').querySelector('.nav-links').classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
    });
});

document.querySelectorAll('.more-toggle').forEach(toggle => {
    toggle.addEventListener('click', event => {
        event.stopPropagation();
        const menu = toggle.closest('.more-menu');
        const open = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
    });
});

document.addEventListener('click', event => {
    document.querySelectorAll('.more-menu.open').forEach(menu => {
        if (!menu.contains(event.target)) {
            menu.classList.remove('open');
            menu.querySelector('.more-toggle')?.setAttribute('aria-expanded', 'false');
        }
    });
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        link.closest('.nav-links')?.classList.remove('open');
        document.querySelectorAll('.more-menu.open').forEach(menu => menu.classList.remove('open'));
    });
});

const galleryItems = document.querySelectorAll('.gallery-item');
if (galleryItems.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = '<button class="lightbox-close" type="button" aria-label="Close preview">×</button><div class="lightbox-panel"></div>';
    document.body.appendChild(lightbox);

    const closeLightbox = () => lightbox.classList.remove('open');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            lightbox.querySelector('.lightbox-panel').textContent = item.dataset.caption || item.textContent.trim();
            lightbox.classList.add('open');
        });
    });
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', event => {
        if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeLightbox();
    });
}

if (!document.querySelector('script[src*="assets/admin.js"]')) {
    const adminScript = document.createElement('script');
    adminScript.src = new URL('../assets/admin.js', document.currentScript?.src || window.location.href).href;
    document.body.appendChild(adminScript);
}
