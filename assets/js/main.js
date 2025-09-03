/**
 * Main module - Application initialization and coordination
 */

/**
 * Initialize the entire application
 */
function initializeApp() {
    console.log("[App] Initializing application...");

    try {
        // Initialize all modules
        initializeFilters();
        initializeCart();
        initializeUI();

        // Initial render
        renderServices();
        updateCartUI();

        console.log("[App] Application initialized successfully");
    } catch (error) {
        console.error("[App] Error initializing application:", error);
        showError("servicesGrid", "Error al cargar la aplicación");
    }
}

/**
 * Bootstrap compatibility layer
 */
function initializeBootstrap() {
    // Check if Bootstrap is loaded
    if (!window.bootstrap) {
        console.warn("[App] Bootstrap not detected, using fallback implementations");

        // Create fallback Bootstrap object
        window.bootstrap = {
            Modal: class {
                constructor(element) {
                    this.element = element;
                }
                show() {
                    if (this.element) {
                        this.element.style.display = "block";
                        this.element.classList.add("show");
                    }
                }
                hide() {
                    if (this.element) {
                        this.element.style.display = "none";
                        this.element.classList.remove("show");
                    }
                }
                static getInstance(element) {
                    return element._bsModal || new this(element);
                }
            },
            Offcanvas: class {
                constructor(element) {
                    this.element = element;
                }
                show() {
                    if (this.element) {
                        this.element.classList.add("show");
                    }
                }
                hide() {
                    if (this.element) {
                        this.element.classList.remove("show");
                    }
                }
            },
            Toast: class {
                constructor(element, options = {}) {
                    this.element = element;
                    this.options = options;
                }
                show() {
                    if (this.element) {
                        this.element.classList.add("show");

                        if (this.options.delay) {
                            setTimeout(() => {
                                this.hide();
                            }, this.options.delay);
                        }
                    }
                }
                hide() {
                    if (this.element) {
                        this.element.style.opacity = "0";
                        setTimeout(() => {
                            this.element.remove();
                        }, 300);
                    }
                }
            }
        };
    }
}

/**
 * Handle page-specific initialization
 */
function handlePageSpecificInit() {
    const currentPage = getCurrentPage();

    switch (currentPage) {
        case 'index':
            initializeHomePage();
            break;
        case 'servicios':
            initializeServicesPage();
            break;
        default:
            console.log("[App] Unknown page, using default initialization");
    }
}

/**
 * Get current page name from URL
 * @returns {string} Current page name
 */
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().split('.')[0];
    return page || 'index';
}

/**
 * Initialize home page specific functionality
 */
function initializeHomePage() {
    console.log("[App] Initializing home page");

    // Setup hero section interactions
    setupHeroSection();

    // Setup featured services
    setupFeaturedServices();
}

/**
 * Initialize services page specific functionality
 */
function initializeServicesPage() {
    console.log("[App] Initializing services page");

    // Services page already handled by main initialization
    // Additional services page specific code can go here
}

/**
 * Setup hero section interactions
 */
function setupHeroSection() {
    const ctaButton = document.querySelector('.hero-cta');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            scrollToElement('servicesGrid');
        });
    }
}

/**
 * Setup featured services section
 */
function setupFeaturedServices() {
    const featuredContainer = document.getElementById('featuredServices');
    if (featuredContainer) {
        // Show top 3 most popular services
        const featuredServices = services.slice(0, 3);
        featuredContainer.innerHTML = featuredServices
            .map(service => createServiceCard(service))
            .join('');
    }
}

/**
 * Handle errors globally
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 */
function handleError(error, context = "Unknown") {
    console.error(`[App] Error in ${context}:`, error);

    // Show user-friendly error message
    showToast("Ha ocurrido un error. Por favor, inténtalo de nuevo.", "error");

    // In production, you might want to send error to logging service
    // logErrorToService(error, context);
}

/**
 * Utility function to debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Add loading states to buttons
 * @param {HTMLElement} button - Button element
 * @param {boolean} loading - Loading state
 */
function setButtonLoading(button, loading) {
    if (!button) return;

    if (loading) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Cargando...';
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || button.innerHTML;
    }
}

// Global error handler
window.addEventListener('error', (event) => {
    handleError(event.error, 'Global');
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    handleError(event.reason, 'Promise Rejection');
});

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    console.log("[App] DOM loaded, starting initialization...");

    // Initialize Bootstrap compatibility
    initializeBootstrap();

    // Handle page-specific initialization
    handlePageSpecificInit();

    // Initialize main app
    initializeApp();
});

// Initialize when window is fully loaded (for images, etc.)
window.addEventListener("load", () => {
    console.log("[App] Window fully loaded");

    // Any additional initialization that requires full page load
    // For example, image lazy loading, analytics, etc.
});