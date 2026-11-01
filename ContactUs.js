/* ============================================================
   Kabelo's Shisanyama Grill House - Contact Us Page JavaScript
   File: js/contactus.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    /* ----------------------------------------------------------
       0. SHORTCUTS
    ---------------------------------------------------------- */
    const header = document.querySelector('.site-header');

    /* ----------------------------------------------------------
       1. STICKY HEADER SHADOW ON SCROLL
    ---------------------------------------------------------- */
    if (header) {
        const onScroll = () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ----------------------------------------------------------
       2. SCROLL-REVEAL FOR SECTIONS
       Fades/slides in contact cards, detail items, the location
       card and CTA sections as they enter the viewport.
    ---------------------------------------------------------- */
    const revealTargets = document.querySelectorAll(
        '.contact-card, .detail-item, .location-card, .location-content, ' +
        '.social-links a, .message-section, .cta-section, .intro'
    );

    if ('IntersectionObserver' in window && revealTargets.length) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        revealTargets.forEach((el, i) => {
            el.classList.add('contact-reveal');
            el.style.setProperty('--delay', `${(i % 3) * 0.1}s`);
            revealObserver.observe(el);
        });
    }

    /* ----------------------------------------------------------
       3. COPY-TO-CLIPBOARD ON CONTACT LINKS
       Hovering an email/phone link shows a small "Copy" button.
       Clicking it copies the value and shows a toast.
    ---------------------------------------------------------- */
    const copyableLinks = document.querySelectorAll(
        '.contact-card a[href^="mailto:"], ' +
        '.contact-card a[href^="tel:"], ' +
        '.footer-contact a[href^="mailto:"], ' +
        '.footer-contact a[href^="tel:"]'
    );

    copyableLinks.forEach(link => {
        link.classList.add('copyable-link');

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'copy-btn';
        btn.setAttribute('aria-label', 'Copy to clipboard');
        btn.textContent = 'Copy';

        link.parentNode.insertBefore(btn, link.nextSibling);

        btn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();

            const value = link.textContent.trim();

            copyToClipboard(value).then(() => {
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                showToast(`Copied: ${value}`);

                setTimeout(() => {
                    btn.textContent = 'Copy';
                    btn.classList.remove('copied');
                }, 1800);
            }).catch(() => {
                showToast('Copy failed — please copy manually.');
            });
        });
    });

    /**
     * Copies text using the modern Clipboard API with a
     * fallback for older browsers / insecure contexts.
     */
    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }
        return new Promise((resolve, reject) => {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'absolute';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy') ? resolve() : reject();
            } catch (err) {
                reject(err);
            } finally {
                document.body.removeChild(ta);
            }
        });
    }

    /* ----------------------------------------------------------
       4. TOAST NOTIFICATIONS
    ---------------------------------------------------------- */
    let toastEl = null;
    let toastTimer = null;

    function showToast(message) {
        if (!toastEl) {
            toastEl = document.createElement('div');
            toastEl.className = 'toast';
            document.body.appendChild(toastEl);
        }

        toastEl.textContent = message;
        toastEl.classList.add('show');

        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toastEl.classList.remove('show');
        }, 2500);
    }

    /* ----------------------------------------------------------
       5. LIVE "OPEN / CLOSED" STATUS BADGE
       Uses the working-hours text in the location section to
       figure out if the restaurant is currently open.
       Mon–Thu: 11:00–21:00
       Fri–Sat: 11:00–23:00
       Sun:     12:00–20:00
    ---------------------------------------------------------- */
    const hoursBlock = Array.from(
        document.querySelectorAll('.detail-item')
    ).find(el => {
        const h3 = el.querySelector('h3');
        return h3 && h3.textContent.toLowerCase().includes('working hours');
    });

    if (hoursBlock) {
        const schedule = {
            0: [12, 20], // Sunday
            1: [11, 21], // Monday
            2: [11, 21],
            3: [11, 21],
            4: [11, 21],
            5: [11, 23], // Friday
            6: [11, 23]  // Saturday
        };

        const badge = document.createElement('span');
        badge.className = 'open-status';

        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours() + now.getMinutes() / 60;
        const [openH, closeH] = schedule[day];
        const isOpen = hour >= openH && hour < closeH;

        badge.textContent = isOpen ? '● Open Now' : '● Closed';
        badge.classList.add(isOpen ? 'is-open' : 'is-closed');

        const h3 = hoursBlock.querySelector('h3');
        if (h3) h3.appendChild(badge);
    }

    /* ----------------------------------------------------------
       6. ANIMATED CONTACT ICONS
       Contact-card icons gently bounce when their card is
       hovered.
    ---------------------------------------------------------- */
    document.querySelectorAll('.contact-card').forEach(card => {
        const icon = card.querySelector('.contact-icon');
        if (!icon) return;

        card.addEventListener('mouseenter', () => {
            icon.classList.add('bounce');
        });
        icon.addEventListener('animationend', () => {
            icon.classList.remove('bounce');
        });
    });

    /* ----------------------------------------------------------
       7. SHARE BUTTON (Web Share API with fallback)
       Adds a "Share" button in the social section.
    ---------------------------------------------------------- */
    const socialLinks = document.querySelector('.social-links');

    if (socialLinks) {
        const shareBtn = document.createElement('a');
        shareBtn.href = '#';
        shareBtn.setAttribute('aria-label', 'Share this page');
        shareBtn.className = 'share-link';
        shareBtn.innerHTML = '<span>↗</span> Share';
        socialLinks.appendChild(shareBtn);

        shareBtn.addEventListener('click', e => {
            e.preventDefault();

            const shareData = {
                title: "Kabelo's Shisanyama Grill House",
                text: 'Authentic South African braai in Soweto!',
                url: window.location.href
            };

            if (navigator.share) {
                navigator.share(shareData).catch(() => {
                    /* user cancelled */
                });
            } else {
                copyToClipboard(window.location.href).then(() => {
                    showToast('Page link copied — share it anywhere!');
                }).catch(() => {
                    showToast('Sharing not supported in this browser.');
                });
            }
        });
    }

    /* ----------------------------------------------------------
       8. GOOGLE MAPS BUTTON — add a small pulse animation
       (pure CSS handles most of it; we just ensure the class
       is applied for compatibility.)
    ---------------------------------------------------------- */
    const mapButton = document.querySelector('.map-button');
    if (mapButton) {
        mapButton.classList.add('map-cta');
    }

    /* ----------------------------------------------------------
       9. CTA BUTTON RIPPLE EFFECT
       Adds a ripple animation on click for the CTA buttons.
    ---------------------------------------------------------- */
    document.querySelectorAll('.cta-button, .primary-button').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);

            ripple.className = 'ripple';
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    /* ----------------------------------------------------------
       10. BACK TO TOP BUTTON
    ---------------------------------------------------------- */
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = '&#8593;';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ----------------------------------------------------------
       11. CONSOLE BRANDING
    ---------------------------------------------------------- */
    console.log(
        '%c📞 Kabelo\'s Contact Page Loaded %c\nWe\'d love to hear from you!',
        'background:#c0392b;color:#fff;font-size:14px;padding:5px 9px;border-radius:4px;font-weight:bold;',
        'color:#c0392b;font-weight:bold;'
    );
});