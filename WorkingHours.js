/* ============================================================
   Kabelo's Shisanyama Grill House - Working Hours Page JS
   File: js/workinghours.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    /* ----------------------------------------------------------
       0. BUSINESS HOURS CONFIG
       Each day = [openHour, closeHour] in 24h decimal form.
       Update this single object if the schedule ever changes.
    ---------------------------------------------------------- */
    const REGULAR_HOURS = {
        0: [12, 20], // Sunday
        1: [11, 21], // Monday
        2: [11, 21], // Tuesday
        3: [11, 21], // Wednesday
        4: [11, 21], // Thursday
        5: [11, 23], // Friday
        6: [11, 23]  // Saturday
    };

    const DAY_NAMES = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'
    ];

    /* Special holiday overrides (month is 0-indexed!) */
    const SPECIAL_HOURS = [
        { name: 'Christmas Day',      month: 11, day: 25, hours: null },
        { name: "New Year's Day",     month: 0,  day: 1,  hours: null },
        { name: 'Good Friday',        month: 3,  day: 7,  hours: [12, 20] },
        { name: 'Easter Sunday',      month: 3,  day: 9,  hours: [12, 20] },
        { name: 'Heritage Day',       month: 8,  day: 24, hours: [11, 22] }
    ];

    /* ----------------------------------------------------------
       1. DATE HELPERS
    ---------------------------------------------------------- */
    const now = new Date();
    const todayIndex = now.getDay(); // 0 = Sunday
    const currentHour = now.getHours() + now.getMinutes() / 60;

    /**
     * Returns the hours that apply today, checking
     * any matching special holiday first.
     */
    function getTodayHours() {
        const special = SPECIAL_HOURS.find(
            h => h.month === now.getMonth() && h.day === now.getDate()
        );
        if (special) return special.hours; // null = closed
        return REGULAR_HOURS[todayIndex];
    }

    /**
     * Returns true/false for whether the restaurant is open
     * right now.
     */
    function isOpenNow() {
        const hours = getTodayHours();
        if (!hours) return false;
        return currentHour >= hours[0] && currentHour < hours[1];
    }

    /**
     * Formats a decimal hour into "11:00 AM" style text.
     */
    function formatHour(decimalHour) {
        const h = Math.floor(decimalHour);
        const m = Math.round((decimalHour - h) * 60);
        const suffix = h >= 12 ? 'PM' : 'AM';
        let displayH = h % 12;
        if (displayH === 0) displayH = 12;
        const displayM = m.toString().padStart(2, '0');
        return `${displayH}:${displayM} ${suffix}`;
    }

    /* ----------------------------------------------------------
       2. HEADER SCROLL SHADOW
    ---------------------------------------------------------- */
    const header = document.querySelector('.site-header');
    if (header) {
        const onScroll = () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ----------------------------------------------------------
       3. HIGHLIGHT TODAY'S ROW IN THE HOURS TABLE
       Adds .current-day to today's row and clears any
       hardcoded current-day from the HTML.
    ---------------------------------------------------------- */
    const rows = Array.from(document.querySelectorAll('.hours-table tbody tr'));

    // Clear any hardcoded "current-day" first
    rows.forEach(r => r.classList.remove('current-day'));

    const todayRow = rows[todayIndex];
    if (todayRow) {
        todayRow.classList.add('current-day');

        // Update the status cell for today's row
        const statusCell = todayRow.querySelector('.status, .open-now');
        if (statusCell) {
            const open = isOpenNow();
            statusCell.textContent = open ? 'Open Now' : 'Closed Now';
            statusCell.className = open ? 'open-now' : 'closed-now';
        }
    }

    // Grey out rows for days before today (already-passed this week)
    rows.forEach((row, i) => {
        if (i !== todayIndex) {
            row.classList.remove('closed-now', 'open-now');
        }
    });

    /* ----------------------------------------------------------
       4. UPDATE THE HERO OPEN BADGE
       The "● Open Today" badge in the section heading is
       replaced with real live status.
    ---------------------------------------------------------- */
    const openBadge = document.querySelector('.open-badge');
    if (openBadge) {
        const open = isOpenNow();
        openBadge.textContent = open ? '● Open Now' : '● Closed Now';
        openBadge.classList.add(open ? 'is-open' : 'is-closed');

        // If a special holiday today, show its name
        const special = SPECIAL_HOURS.find(
            h => h.month === now.getMonth() && h.day === now.getDate()
        );
        if (special) {
            openBadge.textContent += ` — ${special.name}`;
        }
    }

    /* ----------------------------------------------------------
       5. DYNAMIC "NEXT OPENING" MESSAGE
       If the restaurant is closed, show when it will open next.
    ---------------------------------------------------------- */
    if (!isOpenNow()) {
        const nextOpen = findNextOpening();
        if (nextOpen) {
            const banner = document.createElement('div');
            banner.className = 'next-open-banner';
            banner.innerHTML =
                `<span class="banner-icon">⏰</span>` +
                `<span>We reopen <strong>${nextOpen}</strong></span>`;

            const hoursSection = document.querySelector('.hours-section');
            if (hoursSection) {
                hoursSection.insertBefore(
                    banner,
                    hoursSection.querySelector('.hours-table-wrapper')
                );
            }
        }
    }

    /**
     * Scans the next 7 days to find the next opening time.
     * Returns a human-readable string like
     * "today at 11:00 AM" or "tomorrow (Friday) at 11:00 AM".
     */
    function findNextOpening() {
        // Check today first — maybe it opens later today
        const todayHours = getTodayHours();
        if (todayHours && currentHour < todayHours[0]) {
            return `today at ${formatHour(todayHours[0])}`;
        }

        // Search forward
        for (let offset = 1; offset <= 7; offset++) {
            const futureDate = new Date(now);
            futureDate.setDate(now.getDate() + offset);
            const futureDay = futureDate.getDay();

            // Skip if a closed holiday
            const special = SPECIAL_HOURS.find(
                h =>
                    h.month === futureDate.getMonth() &&
                    h.day === futureDate.getDate()
            );
            if (special && !special.hours) continue;

            const hours = special ? special.hours : REGULAR_HOURS[futureDay];
            if (!hours) continue;

            const dayName = DAY_NAMES[futureDay];
            const timeStr = formatHour(hours[0]);

            if (offset === 1) {
                return `tomorrow (${dayName}) at ${timeStr}`;
            }
            return `on ${dayName} at ${timeStr}`;
        }
        return null;
    }

    /* ----------------------------------------------------------
       6. HIGHLIGHT TODAY'S HOLIDAY ITEM
       If today matches a special holiday entry, highlight it.
    ---------------------------------------------------------- */
    document.querySelectorAll('.holiday-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        const special = SPECIAL_HOURS.find(h =>
            text.includes(h.name.toLowerCase())
        );
        if (special &&
            special.month === now.getMonth() &&
            special.day === now.getDate()) {
            item.classList.add('is-today');
        }
    });

    /* ----------------------------------------------------------
       7. SCROLL REVEAL FOR SECTIONS
    ---------------------------------------------------------- */
    const revealTargets = document.querySelectorAll(
        '.info-card, .holiday-item, .notice, .cta-section, ' +
        '.intro-section, .hours-section, .special-hours'
    );

    if ('IntersectionObserver' in window && revealTargets.length) {
        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        revealTargets.forEach((el, i) => {
            el.classList.add('hours-reveal');
            el.style.setProperty('--delay', `${(i % 3) * 0.08}s`);
            observer.observe(el);
        });
    }

    /* ----------------------------------------------------------
       8. "ADD TO CALENDAR" BUTTON
       Generates a downloadable .ics file for this week's
       opening hours. Appended near the CTA section.
    ---------------------------------------------------------- */
    const ctaButtons = document.querySelector('.cta-buttons');
    if (ctaButtons) {
        const calBtn = document.createElement('a');
        calBtn.href = '#';
        calBtn.className = 'btn btn-outline';
        calBtn.textContent = '📅 Add to Calendar';
        calBtn.addEventListener('click', e => {
            e.preventDefault();
            downloadICS();
            showToast('Opening hours downloaded (.ics file).');
        });
        ctaButtons.appendChild(calBtn);
    }

    function downloadICS() {
        const pad = n => String(n).padStart(2, '0');
        const fmt = d =>
            `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}` +
            `${pad(d.getUTCDate())}T${pad(d.getUTCHours())}` +
            `${pad(d.getUTCMinutes())}00Z`;

        // Generate recurring weekly event
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + (7 - startDate.getDay()) % 7);
        startDate.setHours(11, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setHours(23, 0, 0, 0);

        const ics = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Kabelos Shisanyama//Hours//EN',
            'BEGIN:VEVENT',
            `UID:${Date.now()}@kabelosshisanyama`,
            `DTSTAMP:${fmt(new Date())}`,
            `DTSTART:${fmt(startDate)}`,
            `DTEND:${fmt(endDate)}`,
            'RRULE:FREQ=WEEKLY;BYDAY=SA',
            "SUMMARY:Kabelo's Shisanyama — Saturday Hours",
            'LOCATION:Corner of Vilakazi & Mkhize Street, Soweto',
            'DESCRIPTION:Regular Saturday hours 11:00 AM – 11:00 PM',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([ics], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "kabelos-saturday.ics";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /* ----------------------------------------------------------
       9. TOAST NOTIFICATIONS
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
       11. AUTO-REFRESH OPEN STATUS EVERY 60 SECONDS
       So the badge updates without a page reload.
    ---------------------------------------------------------- */
    setInterval(() => {
        if (!openBadge) return;
        const open = isOpenNow();
        const prev = openBadge.classList.contains('is-open');
        if (open !== prev) {
            openBadge.textContent = open ? '● Open Now' : '● Closed Now';
            openBadge.classList.toggle('is-open', open);
            openBadge.classList.toggle('is-closed', !open);
        }
    }, 60000);

    /* ----------------------------------------------------------
       12. CONSOLE BRANDING
    ---------------------------------------------------------- */
    console.log(
        `%c🕒 Kabelo's Hours Page Loaded %c\nToday is ${DAY_NAMES[todayIndex]}. Currently ${isOpenNow() ? 'OPEN' : 'CLOSED'}.`,
        'background:#c0392b;color:#fff;font-size:14px;padding:5px 9px;border-radius:4px;font-weight:bold;',
        'color:#c0392b;font-weight:bold;'
    );
});