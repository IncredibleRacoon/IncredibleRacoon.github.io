document.addEventListener('DOMContentLoaded', () => {
    // === Icons (SVG Strings) ===
    const icons = {
        light: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
        dark: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
        system: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>'
    };

    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Get stored setting or default to 'system'
    let currentSetting = localStorage.getItem('theme') || 'system';

    // Function to apply theme based on setting
    const applyTheme = (setting) => {
        let effectiveTheme = setting;
        
        if (setting === 'system') {
            effectiveTheme = prefersDarkScheme.matches ? 'dark' : 'light';
            themeToggle.setAttribute('title', `System (${effectiveTheme})`);
        } else {
            themeToggle.setAttribute('title', setting.charAt(0).toUpperCase() + setting.slice(1) + ' Mode');
        }

        document.documentElement.setAttribute('data-theme', effectiveTheme);
        themeToggle.innerHTML = icons[setting];
    };

    // Apply initial state (JS takes over from inline script)
    if (themeToggle) {
        applyTheme(currentSetting);

        // Click Handler: Cycle System -> Light -> Dark
        themeToggle.addEventListener('click', () => {
            if (currentSetting === 'system') {
                currentSetting = 'light';
            } else if (currentSetting === 'light') {
                currentSetting = 'dark';
            } else {
                currentSetting = 'system';
            }
            
            localStorage.setItem('theme', currentSetting);
            applyTheme(currentSetting);
        });
    }

    // Listen for system changes if in system mode
    prefersDarkScheme.addEventListener('change', (e) => {
        if (currentSetting === 'system') {
            applyTheme('system');
        }
    });

    // === Mobile Navigation ===
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('open');
            }
        });
    }

    // === Checklist Logic ===
    const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    if (checklistItems.length > 0) {
        checklistItems.forEach(item => {
            const id = item.id;
            const savedState = localStorage.getItem(id);
            if (savedState === 'checked') {
                item.checked = true;
                item.parentElement.classList.add('checked-item');
            }
            
            item.addEventListener('change', () => {
                if (item.checked) {
                    localStorage.setItem(id, 'checked');
                    item.parentElement.classList.add('checked-item');
                } else {
                    localStorage.removeItem(id);
                    item.parentElement.classList.remove('checked-item');
                }
            });
        });
    }
});
