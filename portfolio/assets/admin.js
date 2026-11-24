(function () {
    if (document.getElementById('portfolioAdminPanel')) return;

    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = new URL('./admin.css', document.currentScript?.src || window.location.href).href;
    document.head.appendChild(css);

    const storageKey = 'komalPortfolioAdmin';
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    const pageKey = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\\/g, '/');

    const theme = Object.assign({
        main: '#D62839',
        sub: '#0B5ED7',
        text: '#111111'
    }, saved.theme || {});

    const applyTheme = () => {
        const styleId = 'portfolio-admin-theme';
        let style = document.getElementById(styleId);
        if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            document.head.appendChild(style);
        }
        style.textContent = `
            :root { --main-heading:${theme.main}; --sub-heading:${theme.sub}; --body-text:${theme.text}; --red:${theme.main}; --blue:${theme.sub}; --navy:${theme.sub}; --charcoal:${theme.text}; }
            h1, .section-head h2, .page-heading h1, .home-name, .contact h2,
            .main-heading, .profile-badge { color:${theme.main} !important; }
            h2, h3, h4, .section-head span, .subpage-head h3, .stat-label,
            .sub-heading, .home-hero-title, .about-tagline, .card h3 { color:${theme.sub} !important; }
            body, p, li, span, label, .card p, .text-panel p, .home-quote,
            .hero-mini-grid p, .panel-card p, .experience-card p, .project-card p,
            .contact-item p, .meta, .experience-meta, .project-meta { color:${theme.text} !important; }
        `;
    };

    const elements = [...document.querySelectorAll('h1,h2,h3,h4,p,li,.brand,.eyebrow,.about-tagline,.stat-label,.button,.nav-links a')]
        .filter(el => el.childElementCount === 0 && el.textContent.trim());

    elements.forEach((el, index) => {
        el.dataset.adminKey = `${pageKey}|${el.tagName.toLowerCase()}|${index}`;
        const text = saved.text?.[el.dataset.adminKey];
        if (text !== undefined) el.textContent = text;
    });

    applyTheme();

    const panel = document.createElement('div');
    panel.id = 'portfolioAdminPanel';
    panel.innerHTML = `
        <button class="admin-fab" type="button" aria-label="Open content editor">✎</button>
        <aside class="admin-panel" aria-label="Portfolio admin panel">
            <div class="admin-head"><strong>Admin Panel</strong><button class="admin-close" type="button" aria-label="Close">×</button></div>
            <div class="admin-body">
                <div class="admin-section">
                    <h3>Color theme</h3>
                    <div class="admin-row"><label for="adminMain">Main heading</label><input id="adminMain" type="color" value="${theme.main}"></div>
                    <div class="admin-row"><label for="adminSub">Sub heading</label><input id="adminSub" type="color" value="${theme.sub}"></div>
                    <div class="admin-row"><label for="adminText">Text</label><input id="adminText" type="color" value="${theme.text}"></div>
                </div>
                <div class="admin-section">
                    <h3>Page content</h3>
                    <p class="admin-note">Edit the listed text and choose Save. Changes stay in this browser; Export downloads a backup. To publish for everyone, update the site files and redeploy.</p>
                    <div id="adminFields"></div>
                </div>
                <div class="admin-actions">
                    <button class="primary" id="adminSave" type="button">Save</button>
                    <button id="adminExport" type="button">Export</button>
                    <button id="adminReset" type="button">Reset</button>
                </div>
            </div>
        </aside>`;
    document.body.appendChild(panel);

    const fab = panel.querySelector('.admin-fab');
    const drawer = panel.querySelector('.admin-panel');
    fab.addEventListener('click', () => drawer.classList.toggle('open'));
    panel.querySelector('.admin-close').addEventListener('click', () => drawer.classList.remove('open'));

    const fields = panel.querySelector('#adminFields');
    elements.forEach((el, index) => {
        const row = document.createElement('div');
        row.className = 'admin-row';
        const label = document.createElement('label');
        label.textContent = el.tagName.toLowerCase().toUpperCase();
        label.htmlFor = `adminField${index}`;
        const input = document.createElement(el.tagName === 'P' || el.tagName === 'LI' ? 'textarea' : 'input');
        input.id = `adminField${index}`;
        input.value = el.textContent.trim();
        input.dataset.key = el.dataset.adminKey;
        input.addEventListener('input', () => {
            el.textContent = input.value;
        });
        row.append(label, input);
        fields.appendChild(row);
    });

    const colorInputs = {
        main: panel.querySelector('#adminMain'),
        sub: panel.querySelector('#adminSub'),
        text: panel.querySelector('#adminText')
    };
    Object.entries(colorInputs).forEach(([name, input]) => {
        input.addEventListener('input', () => {
            theme[name] = input.value;
            applyTheme();
        });
    });

    panel.querySelector('#adminSave').addEventListener('click', () => {
        const text = Object.assign({}, saved.text || {});
        fields.querySelectorAll('[data-key]').forEach(input => {
            text[input.dataset.key] = input.value;
        });
        localStorage.setItem(storageKey, JSON.stringify({ theme, text }));
        panel.querySelector('#adminSave').textContent = 'Saved';
        setTimeout(() => panel.querySelector('#adminSave').textContent = 'Save', 900);
    });

    panel.querySelector('#adminExport').addEventListener('click', () => {
        const text = {};
        fields.querySelectorAll('[data-key]').forEach(input => {
            text[input.dataset.key] = input.value;
        });
        const blob = new Blob([JSON.stringify({ theme, text }, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'portfolio-admin-data.json';
        link.click();
        URL.revokeObjectURL(link.href);
    });

    panel.querySelector('#adminReset').addEventListener('click', () => {
        if (!window.confirm('Reset all saved colors and content?')) return;
        localStorage.removeItem(storageKey);
        window.location.reload();
    });
})();
