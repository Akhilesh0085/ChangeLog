window.lazyResources = window.lazyResources || {
    css: [], // CSS files to lazy load
    scripts: [], // JS files to lazy load
    loaded: false, // Track loading status

    // Add CSS file to lazy load queue
    addCSS: function (url, priority) {
        this.css.push({ url: url, priority: priority || 'low' });
    },

    // Add JS file to lazy load queue
    addScript: function (url, priority) {
        this.scripts.push({ url: url, priority: priority || 'low' });
    },

    // Load all resources
    loadAll: function () {
        if (this.loaded) return;

        // Sort by priority (high first)
        const sortByPriority = (a, b) => (a.priority === 'high' ? -1 : 1);

        // Load CSS files
        this.css.sort(sortByPriority).forEach((item) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = item.url;
            document.head.appendChild(link);
        });

        // Load JS files
        this.scripts.sort(sortByPriority).forEach((item) => {
            const script = document.createElement('script');
            script.src = item.url;
            script.async = true;
            document.body.appendChild(script);
        });

        this.loaded = true;
        this.removeEventListeners();
    },

    // Setup event listeners
    setupListeners: function () {
        window.addEventListener('scroll', this.loadAll.bind(this), { passive: true, once: true });
        window.addEventListener('mousemove', this.loadAll.bind(this), { once: true });
        window.addEventListener('touchstart', this.loadAll.bind(this), { passive: true, once: true });
        window.addEventListener('keydown', this.loadAll.bind(this), { once: true });
    },

    // Clean up event listeners
    removeEventListeners: function () {
        window.removeEventListener('scroll', this.loadAll.bind(this));
        window.removeEventListener('mousemove', this.loadAll.bind(this));
        window.removeEventListener('touchstart', this.loadAll.bind(this));
        window.removeEventListener('keydown', this.loadAll.bind(this));
    },

    // Initialize
    init: function () {
        if (document.readyState === 'complete') {
            this.setupListeners();
        } else {
            window.addEventListener('load', () => this.setupListeners());
        }
    },
};

// Initialize the lazy loader
window.lazyResources.init();