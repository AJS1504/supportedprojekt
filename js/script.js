// ===== LANGUAGE MANAGEMENT =====
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'de';
        this.translations = {
            de: {
                // Navigation
                'Home': 'Home',
                'Leistungen': 'Leistungen',
                'Über mich': 'Über mich',
                'Projektpakete': 'Projektpakete',
                'Kontakt': 'Kontakt',
                
                // Hero Section
                'Technische Projektdienstleistungen': 'Technische Projektdienstleistungen',
                '& Interimsmanagement': '& Interimsmanagement',
                'Professionelle Unterstützung bei technischen Projekten, Turnaround-Situationen und Kapazitätslücken. Schnell, strukturiert, messbar.': 'Professionelle Unterstützung bei technischen Projekten, Turnaround-Situationen und Kapazitätslücken. Schnell, strukturiert, messbar.',
                'Erstberatung vereinbaren': 'Erstberatung vereinbaren',
                'Leistungen entdecken': 'Leistungen entdecken',
                
                // Services
                'Leistungsspektrum': 'Leistungsspektrum',
                'Entlang des gesamten Produkt- und Anlagenlebenszyklus': 'Entlang des gesamten Produkt- und Anlagenlebenszyklus',
                
                // Contact Form
                'Name *': 'Name *',
                'E-Mail *': 'E-Mail *',
                'Unternehmen': 'Unternehmen',
                'Betreff *': 'Betreff *',
                'Nachricht *': 'Nachricht *',
                'Bitte wählen...': 'Bitte wählen...',
                'Nachricht senden': 'Nachricht senden'
            },
            en: {
                // Navigation
                'Home': 'Home',
                'Leistungen': 'Services',
                'Über mich': 'About',
                'Projektpakete': 'Project Packages',
                'Kontakt': 'Contact',
                
                // Hero Section
                'Technische Projektdienstleistungen': 'Technical Project Services',
                '& Interimsmanagement': '& Interim Management',
                'Professionelle Unterstützung bei technischen Projekten, Turnaround-Situationen und Kapazitätslücken. Schnell, strukturiert, messbar.': 'Professional support for technical projects, turnaround situations, and capacity gaps. Fast, structured, measurable.',
                'Erstberatung vereinbaren': 'Schedule Initial Consultation',
                'Leistungen entdecken': 'Discover Services',
                
                // Services
                'Leistungsspektrum': 'Service Portfolio',
                'Entlang des gesamten Produkt- und Anlagenlebenszyklus': 'Throughout the entire product and system lifecycle',
                
                // Contact Form
                'Name *': 'Name *',
                'E-Mail *': 'Email *',
                'Unternehmen': 'Company',
                'Betreff *': 'Subject *',
                'Nachricht *': 'Message *',
                'Bitte wählen...': 'Please select...',
                'Nachricht senden': 'Send Message'
            }
        };
        
        this.init();
    }
    
    init() {
        this.updateLanguage();
        this.bindEvents();
    }
    
    bindEvents() {
        document.getElementById('lang-de').addEventListener('click', () => this.setLanguage('de'));
        document.getElementById('lang-en').addEventListener('click', () => this.setLanguage('en'));
    }
    
    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        document.getElementById('html-root').lang = lang;
        this.updateLanguage();
        this.updateLanguageButtons();
    }
    
    updateLanguage() {
        const elements = document.querySelectorAll('[data-de], [data-en]');
        elements.forEach(element => {
            const key = this.currentLang === 'de' ? element.getAttribute('data-de') : element.getAttribute('data-en');
            if (key) {
                element.textContent = key;
            }
        });
        
        // Update placeholders
        const placeholders = document.querySelectorAll('[placeholder-de], [placeholder-en]');
        placeholders.forEach(element => {
            const key = this.currentLang === 'de' ? element.getAttribute('placeholder-de') : element.getAttribute('placeholder-en');
            if (key) {
                element.placeholder = key;
            }
        });
        
        this.updateLanguageButtons();
    }
    
    updateLanguageButtons() {
        document.getElementById('lang-de').classList.toggle('active', this.currentLang === 'de');
        document.getElementById('lang-en').classList.toggle('active', this.currentLang === 'en');
    }
}

// ===== NAVIGATION MANAGER =====
class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.handleScroll();
    }
    
    bindEvents() {
        // Mobile menu toggle
        this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Scroll events
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.updateActiveLink();
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
    }
    
    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
    }
    
    handleScroll() {
        const scrolled = window.scrollY > 50;
        this.navbar.classList.toggle('scrolled', scrolled);
    }
    
    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ===== PARALLAX MANAGER =====
class ParallaxManager {
    constructor() {
        this.parallaxElements = document.querySelectorAll('.parallax-layer');
        this.init();
    }
    
    init() {
        if (this.parallaxElements.length > 0) {
            window.addEventListener('scroll', () => this.handleParallax());
            // Initial call
            this.handleParallax();
        }
    }
    
    handleParallax() {
        const scrollTop = window.pageYOffset;
        
        this.parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-speed')) || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }
}

// ===== ANIMATION MANAGER =====
class AnimationManager {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }
    
    init() {
        this.initScrollAnimations();
        this.initAOS();
    }
    
    initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-aos]');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('aos-animate');
                    }
                });
            }, this.observerOptions);
            
            animatedElements.forEach(element => {
                observer.observe(element);
            });
        }
    }
    
    initAOS() {
        // Initialize AOS if available
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100
            });
        }
    }
}

// ===== SMOOTH SCROLL MANAGER =====
class SmoothScrollManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Handle smooth scrolling for anchor links
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a[href^="#"]');
            if (target) {
                e.preventDefault();
                const targetId = target.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
}

// ===== CONTACT FORM MANAGER =====
class ContactFormManager {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.bindEvents();
        }
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add input validation feedback
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearErrors(input));
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (this.validateForm()) {
            this.showSuccessMessage();
            this.form.reset();
        }
    }
    
    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        // Remove previous error states
        this.clearErrors(field);
        
        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'Dieses Feld ist erforderlich');
            isValid = false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Bitte geben Sie eine gültige E-Mail-Adresse ein');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#dc2626';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorDiv);
    }
    
    clearErrors(field) {
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    showSuccessMessage() {
        // Create and show success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
            ">
                <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
                Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// ===== PERFORMANCE OPTIMIZER =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.optimizeImages();
        this.addLoadingStates();
        this.preloadCriticalResources();
    }
    
    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Add loading="lazy" for performance
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add error handling
            img.addEventListener('error', () => {
                img.style.display = 'none';
            });
        });
    }
    
    addLoadingStates() {
        // Add loading class to body initially
        document.body.classList.add('loading');
        
        // Remove loading class when page is fully loaded
        window.addEventListener('load', () => {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
        });
    }
    
    preloadCriticalResources() {
        // Preload critical fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
        fontLink.as = 'style';
        fontLink.onload = function() {
            this.onload = null;
            this.rel = 'stylesheet';
        };
        document.head.appendChild(fontLink);
    }
}

// ===== ACCESSIBILITY MANAGER =====
class AccessibilityManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupScreenReaderSupport();
    }
    
    setupKeyboardNavigation() {
        // ESC key to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const navMenu = document.getElementById('nav-menu');
                if (navMenu.classList.contains('active')) {
                    document.dispatchEvent(new Event('click'));
                }
            }
        });
    }
    
    setupFocusManagement() {
        // Trap focus in mobile menu when open
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        navToggle.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                // Focus first menu item when menu opens
                const firstMenuItem = navMenu.querySelector('a');
                if (firstMenuItem) {
                    setTimeout(() => firstMenuItem.focus(), 100);
                }
            }
        });
    }
    
    setupScreenReaderSupport() {
        // Add ARIA labels for better screen reader support
        const navToggle = document.getElementById('nav-toggle');
        if (navToggle) {
            navToggle.setAttribute('aria-label', 'Navigation umschalten');
            navToggle.setAttribute('aria-expanded', 'false');
            
            navToggle.addEventListener('click', () => {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
            });
        }
    }
}

// ===== UTILITY FUNCTIONS =====
class Utils {
    static debounce(func, wait) {
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
    
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// ===== APP INITIALIZATION =====
class App {
    constructor() {
        this.managers = {};
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeManagers());
        } else {
            this.initializeManagers();
        }
    }
    
    initializeManagers() {
        try {
            // Initialize all managers
            this.managers.language = new LanguageManager();
            this.managers.navigation = new NavigationManager();
            this.managers.parallax = new ParallaxManager();
            this.managers.animation = new AnimationManager();
            this.managers.smoothScroll = new SmoothScrollManager();
            this.managers.contactForm = new ContactFormManager();
            this.managers.performance = new PerformanceOptimizer();
            this.managers.accessibility = new AccessibilityManager();
            
            console.log('SupportedProject website initialized successfully');
        } catch (error) {
            console.error('Error initializing website:', error);
        }
    }
}

// ===== ADD CUSTOM CSS ANIMATIONS =====
const customCSS = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .error {
        border-color: #dc2626 !important;
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
    }
    
    .loading .hero-content {
        opacity: 0;
    }
    
    .loaded .hero-content {
        opacity: 1;
        transition: opacity 1s ease-out;
    }
`;

// Inject custom CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = customCSS;
document.head.appendChild(styleSheet);

// ===== START THE APPLICATION =====
const app = new App();