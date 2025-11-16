/**
 * DSGVO-konformer Cookie-Banner für SupportedProject
 * Unterstützt Google Analytics 4 und mehrsprachige Texte
 */

class CookieConsent {
    constructor() {
        this.cookieName = 'sp_cookie_consent';
        this.cookieExpiry = 365; // Tage
        this.consentData = this.loadConsent();
        this.currentLanguage = 'de';
        
        this.texts = {
            de: {
                title: 'Cookie-Einstellungen',
                description: 'Wir verwenden Cookies, um Ihnen die bestmögliche Nutzererfahrung zu bieten. Einige sind erforderlich, andere helfen uns, die Website zu verbessern.',
                essential: 'Erforderliche Cookies',
                essentialDesc: 'Diese Cookies sind für die Grundfunktionen der Website notwendig.',
                analytics: 'Analytics Cookies',
                analyticsDesc: 'Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren.',
                acceptAll: 'Alle akzeptieren',
                acceptSelected: 'Auswahl akzeptieren',
                settings: 'Einstellungen',
                reject: 'Alle ablehnen'
            },
            en: {
                title: 'Cookie Settings',
                description: 'We use cookies to provide you with the best possible user experience. Some are required, others help us improve the website.',
                essential: 'Essential Cookies',
                essentialDesc: 'These cookies are necessary for basic website functionality.',
                analytics: 'Analytics Cookies',
                analyticsDesc: 'These cookies help us understand how visitors interact with the website.',
                acceptAll: 'Accept All',
                acceptSelected: 'Accept Selected',
                settings: 'Settings',
                reject: 'Reject All'
            }
        };
        
        this.init();
    }

    init() {
        // Sprache aus aktuellem Button ermitteln
        const activeLangBtn = document.querySelector('.lang-btn.active');
        if (activeLangBtn) {
            this.currentLanguage = activeLangBtn.id === 'lang-en' ? 'en' : 'de';
        }

        // Consent prüfen und Banner anzeigen wenn nötig
        if (!this.consentData.hasConsent) {
            // Verzögerung: Desktop nach Hero-Animation, Mobile sofort
            const isMobile = window.innerWidth <= 768;
            const delay = isMobile ? 1000 : 5500; // Mobile: 1s, Desktop: 5.5s
            
            setTimeout(() => {
                this.showBanner();
            }, delay);
        } else if (this.consentData.analytics) {
            this.enableAnalytics();
        }

        this.addEventListeners();
    }

    loadConsent() {
        const cookie = this.getCookie(this.cookieName);
        if (cookie) {
            try {
                return JSON.parse(cookie);
            } catch (e) {
                return { hasConsent: false, essential: true, analytics: false };
            }
        }
        return { hasConsent: false, essential: true, analytics: false };
    }

    saveConsent(consent) {
        this.consentData = { ...this.consentData, ...consent, hasConsent: true };
        this.setCookie(this.cookieName, JSON.stringify(this.consentData), this.cookieExpiry);
    }

    showBanner() {
        const banner = this.createBanner();
        document.body.appendChild(banner);
        
        // Animation
        setTimeout(() => {
            banner.style.transform = 'translateY(0)';
            banner.style.opacity = '1';
        }, 100);
    }

    createBanner() {
        const t = this.texts[this.currentLanguage];
        
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-banner-content">
                <div class="cookie-banner-text">
                    <h3>${t.title}</h3>
                    <p>${t.description}</p>
                </div>
                <div class="cookie-banner-actions">
                    <button class="btn btn-secondary cookie-settings-btn">${t.settings}</button>
                    <button class="btn btn-outline cookie-reject-btn">${t.reject}</button>
                    <button class="btn btn-primary cookie-accept-btn">${t.acceptAll}</button>
                </div>
            </div>
        `;

        // Event Listeners
        banner.querySelector('.cookie-accept-btn').onclick = () => this.acceptAll(banner);
        banner.querySelector('.cookie-reject-btn').onclick = () => this.rejectAll(banner);
        banner.querySelector('.cookie-settings-btn').onclick = () => this.showSettings(banner);

        return banner;
    }

    createSettings() {
        const t = this.texts[this.currentLanguage];
        
        const modal = document.createElement('div');
        modal.className = 'cookie-modal';
        modal.innerHTML = `
            <div class="cookie-modal-content">
                <h3>${t.title}</h3>
                <p>${t.description}</p>
                
                <div class="cookie-category">
                    <label class="cookie-category-header">
                        <input type="checkbox" checked disabled>
                        <span>${t.essential}</span>
                    </label>
                    <p class="cookie-category-desc">${t.essentialDesc}</p>
                </div>
                
                <div class="cookie-category">
                    <label class="cookie-category-header">
                        <input type="checkbox" id="analytics-toggle" ${this.consentData.analytics ? 'checked' : ''}>
                        <span>${t.analytics}</span>
                    </label>
                    <p class="cookie-category-desc">${t.analyticsDesc}</p>
                </div>
                
                <div class="cookie-modal-actions">
                    <button class="btn btn-secondary cookie-modal-close">${t.reject}</button>
                    <button class="btn btn-primary cookie-modal-save">${t.acceptSelected}</button>
                </div>
            </div>
        `;

        // Event Listeners
        modal.querySelector('.cookie-modal-close').onclick = () => this.closeModal(modal);
        modal.querySelector('.cookie-modal-save').onclick = () => this.saveSettings(modal);
        modal.onclick = (e) => {
            if (e.target === modal) this.closeModal(modal);
        };

        return modal;
    }

    acceptAll(banner) {
        this.saveConsent({ essential: true, analytics: true });
        this.enableAnalytics();
        this.closeBanner(banner);
    }

    rejectAll(banner) {
        this.saveConsent({ essential: true, analytics: false });
        this.closeBanner(banner);
    }

    showSettings(banner = null) {
        // Entferne existierende Modals und Banner
        const existingModal = document.querySelector('.cookie-modal');
        if (existingModal) {
            console.log('🗑️ Entferne altes Modal');
            existingModal.remove();
        }
        const existingBanner = document.querySelector('.cookie-banner');
        if (existingBanner) {
            console.log('🗑️ Entferne Banner');
            existingBanner.remove();
        }
        
        // Erstelle und zeige Modal
        console.log('📝 Erstelle Modal...');
        const modal = this.createSettings();
        console.log('✅ Modal erstellt:', modal);
        
        document.body.appendChild(modal);
        console.log('✅ Modal an body angehängt');
        
        setTimeout(() => {
            modal.style.display = 'flex';
            modal.style.opacity = '1';
            console.log('✅ Modal sollte jetzt sichtbar sein!');
        }, 50);
    }

    saveSettings(modal) {
        const analyticsToggle = modal.querySelector('#analytics-toggle');
        const consent = {
            essential: true,
            analytics: analyticsToggle.checked
        };
        
        this.saveConsent(consent);
        
        if (consent.analytics) {
            this.enableAnalytics();
        }
        
        this.closeModal(modal);
        
        // Banner schließen falls vorhanden
        const banner = document.querySelector('.cookie-banner');
        if (banner) {
            this.closeBanner(banner);
        }
    }

    closeBanner(banner) {
        banner.style.transform = 'translateY(100%)';
        banner.style.opacity = '0';
        setTimeout(() => banner.remove(), 300);
    }

    closeModal(modal) {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    }
    


    enableAnalytics() {
        // Google Consent Mode v2 über dataLayer (GTM)
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        
        gtag('consent', 'update', {
            'analytics_storage': 'granted',
            'ad_storage': 'denied',  // Werbung erstmal denied
            'ad_user_data': 'denied',
            'ad_personalization': 'denied'
        });
        
        console.log('Analytics enabled via GTM Consent Mode v2');
    }

    addEventListeners() {
        // Sprachenwechsel berücksichtigen
        document.addEventListener('languageChanged', (e) => {
            this.currentLanguage = e.detail.language;
        });
    }

    // Utility functions
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }
}

// CSS Styles für Cookie Banner
const cookieStyles = `
<style>
.cookie-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    border-top: 1px solid #e5e5e5;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    transform: translateY(100%);
    opacity: 0;
    transition: all 0.3s ease;
}

.cookie-banner-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
}

.cookie-banner-text {
    flex: 1;
    min-width: 300px;
}

.cookie-banner-text h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    color: #1a1a1a;
}

.cookie-banner-text p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
    line-height: 1.4;
}

.cookie-banner-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.cookie-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10001;
    display: none;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.cookie-modal-content {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    max-width: 500px;
    margin: 1rem;
    max-height: 80vh;
    overflow-y: auto;
}

.cookie-category {
    margin: 1.5rem 0;
    padding: 1rem;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
}

.cookie-category-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 0.5rem;
}

.cookie-category-desc {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
}

.cookie-modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
}

.btn-outline {
    background: transparent;
    color: #666;
    border: 1px solid #ddd;
}

.btn-outline:hover {
    background: #f5f5f5;
    color: #333;
}

/* Cookie Settings Button wird in css/style.css definiert */

@media (max-width: 768px) {
    .cookie-banner-content {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
    }
    
    .cookie-banner-actions {
        justify-content: center;
    }
    
    .cookie-modal-content {
        margin: 0.5rem;
        padding: 1.5rem;
    }
    
    .cookie-modal-actions {
        flex-direction: column;
    }
}
</style>
`;

// Styles einfügen
document.head.insertAdjacentHTML('beforeend', cookieStyles);

// Cookie Consent initialisieren wenn DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.cookieConsent = new CookieConsent();
        
        // Cookie Settings Button Event Listener (Button ist bereits im HTML)
        const settingsBtn = document.getElementById('cookie-settings-btn');
        if (settingsBtn) {
            console.log('✅ Cookie Settings Button gefunden:', settingsBtn);
            settingsBtn.addEventListener('click', (e) => {
                console.log('🔵 Button geklickt!', e);
                e.preventDefault();
                e.stopPropagation();
                if (window.cookieConsent) {
                    console.log('✅ cookieConsent existiert, rufe showSettings() auf');
                    window.cookieConsent.showSettings();
                } else {
                    console.error('❌ window.cookieConsent nicht gefunden!');
                }
            });
        } else {
            console.error('❌ Cookie Settings Button NICHT gefunden!');
        }
    });
} else {
    window.cookieConsent = new CookieConsent();
    
    // Cookie Settings Button Event Listener (Button ist bereits im HTML)
    const settingsBtn = document.getElementById('cookie-settings-btn');
    if (settingsBtn) {
        console.log('✅ Cookie Settings Button gefunden:', settingsBtn);
        settingsBtn.addEventListener('click', (e) => {
            console.log('🔵 Button geklickt!', e);
            e.preventDefault();
            e.stopPropagation();
            if (window.cookieConsent) {
                console.log('✅ cookieConsent existiert, rufe showSettings() auf');
                window.cookieConsent.showSettings();
            } else {
                console.error('❌ window.cookieConsent nicht gefunden!');
            }
        });
    } else {
        console.error('❌ Cookie Settings Button NICHT gefunden!');
    }
}