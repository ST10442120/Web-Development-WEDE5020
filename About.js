
// KABELO'S SHISANYAMA GRILL HOUSE
// ABOUT PAGE INTERACTIVE FEATURES

document.addEventListener("DOMContentLoaded", () => {

    // 1. SCROLL REVEAL ANIMATIONS

    const revealElements = document.querySelectorAll(
        ".about-introduction, .value-card, " +
        ".mission-card, .team-member, .stats-section, .about-cta"
    );

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.15
            }
        );

        revealElements.forEach(element => {
            element.classList.add("reveal");
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }


    // 2. TEAM MEMBER INFORMATION

    const teamButtons = document.querySelectorAll(".team-more");

    teamButtons.forEach(button => {

        button.addEventListener("click", () => {

            const extraInfo = button.nextElementSibling;

            if (!extraInfo || !extraInfo.classList.contains("team-extra")) {
                return;
            }

            const isExpanded =
                button.getAttribute("aria-expanded") === "true";

            extraInfo.hidden = isExpanded;

            button.setAttribute(
                "aria-expanded",
                String(!isExpanded)
            );

            button.textContent = isExpanded
                ? "Learn More"
                : "Show Less";

        });

    });


    // 3. ANIMATED STATISTICS

    const counters = document.querySelectorAll(".counter");

    function animateCounter(counter) {

        const target = Number(counter.dataset.target);

        if (!Number.isFinite(target)) return;

        const duration = 1500;
        const startTime = performance.now();

        function updateCounter(currentTime) {

            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            const currentValue = Math.floor(
                target * progress
            );

            counter.textContent =
                currentValue.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent =
                    target.toLocaleString();
            }

        }

        requestAnimationFrame(updateCounter);
    }


    if ("IntersectionObserver" in window) {

        const counterObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        animateCounter(entry.target);

                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.5
            }
        );

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });

    } else {

        counters.forEach(counter => {
            counter.textContent =
                Number(counter.dataset.target).toLocaleString();
        });

    }


    console.log("About Us JavaScript loaded successfully.");

});
