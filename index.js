
// ==========================================
// KABELO'S SHISANYAMA GRILL HOUSE
// HOMEPAGE JAVASCRIPT FUNCTIONALITY
// ==========================================


// 1. MOBILE NAVIGATION
// ==========================================

const menuToggle = document.getElementById("menuToggle");
const navbar = document.getElementById("mainNavigation");

if (menuToggle && navbar) {

    menuToggle.addEventListener("click", function () {

        const isOpen = navbar.classList.toggle("active");

        menuToggle.setAttribute("aria-expanded", isOpen);

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        menuToggle.textContent = isOpen ? "✕" : "☰";

    });

    // Close menu after clicking a navigation link

    navbar.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", function () {

            navbar.classList.remove("active");

            menuToggle.setAttribute("aria-expanded", "false");

            menuToggle.textContent = "☰";

        });

    });

}


// 2. IMAGE LIGHTBOX
// ==========================================

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");

const closeLightbox = document.getElementById("lightboxClose");
const previousImage = document.getElementById("lightboxPrev");
const nextImage = document.getElementById("lightboxNext");

const galleryImages = Array.from(
    document.querySelectorAll(
        ".food-image img, .braai-image img"
    )
);

let currentImageIndex = 0;
let previousFocusedElement = null;


// Open selected image

function openLightbox(index) {

    if (!galleryImages.length) return;

    currentImageIndex = index;

    previousFocusedElement = document.activeElement;

    updateLightbox();

    lightbox.classList.add("active");

    lightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    closeLightbox.focus();

}


// Update displayed image

function updateLightbox() {

    const selectedImage = galleryImages[currentImageIndex];

    lightboxImage.src = selectedImage.src;

    lightboxImage.alt = selectedImage.alt;

    lightboxCaption.textContent = selectedImage.alt;

}


// Add click events to gallery images

galleryImages.forEach((image, index) => {

    image.style.cursor = "pointer";

    image.setAttribute("tabindex", "0");

    image.setAttribute("role", "button");

    image.setAttribute(
        "aria-label",
        `View larger image: ${image.alt}`
    );

    image.addEventListener("click", () => {

        openLightbox(index);

    });

    image.addEventListener("keydown", event => {

        if (event.key === "Enter" || event.key === " ") {

            event.preventDefault();

            openLightbox(index);

        }

    });

});


// Close lightbox

function hideLightbox() {

    lightbox.classList.remove("active");

    lightbox.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    if (previousFocusedElement) {
        previousFocusedElement.focus();
    }

}


// Previous image

if (previousImage) {

    previousImage.addEventListener("click", function () {

        currentImageIndex =
            (currentImageIndex - 1 + galleryImages.length)
            % galleryImages.length;

        updateLightbox();

    });

}


// Next image

if (nextImage) {

    nextImage.addEventListener("click", function () {

        currentImageIndex =
            (currentImageIndex + 1) % galleryImages.length;

        updateLightbox();

    });

}


// Close button

if (closeLightbox) {

    closeLightbox.addEventListener("click", hideLightbox);

}


// Close when clicking outside the image

if (lightbox) {

    lightbox.addEventListener("click", function (event) {

        if (event.target === lightbox) {

            hideLightbox();

        }

    });

}


// Keyboard controls

document.addEventListener("keydown", function (event) {

    if (!lightbox || !lightbox.classList.contains("active")) {
        return;
    }

    if (event.key === "Escape") {

        hideLightbox();

    }

    if (event.key === "ArrowRight" && galleryImages.length > 1) {

        currentImageIndex =
            (currentImageIndex + 1) % galleryImages.length;

        updateLightbox();

    }

    if (event.key === "ArrowLeft" && galleryImages.length > 1) {

        currentImageIndex =
            (currentImageIndex - 1 + galleryImages.length)
            % galleryImages.length;

        updateLightbox();

    }

});


// 3. BACK TO TOP BUTTON
// ==========================================

const backToTop = document.getElementById("backToTop");

if (backToTop) {

    window.addEventListener("scroll", function () {

        if (window.scrollY > 400) {

            backToTop.classList.add("visible");

        } else {

            backToTop.classList.remove("visible");

        }

    });

    backToTop.addEventListener("click", function () {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}


// 4. SCROLL REVEAL ANIMATIONS
// ==========================================

const revealSections = document.querySelectorAll(
    "main section, .food-card, .special-card, .testimonial"
);

if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("revealed");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.15
        }
    );

    revealSections.forEach(section => {

        section.classList.add("reveal");

        observer.observe(section);

    });

} else {

    revealSections.forEach(section => {

        section.classList.add("revealed");

    });

}


// 5. FOOD CARD INTERACTION
// ==========================================

const foodCards = document.querySelectorAll(".food-card");

foodCards.forEach(card => {

    card.addEventListener("mouseenter", function () {

        card.classList.add("card-hover");

    });

    card.addEventListener("mouseleave", function () {

        card.classList.remove("card-hover");

    });

});


// 6. DYNAMIC FOOTER YEAR
// ==========================================

const footerText = document.querySelector(".footer-bottom p");

if (footerText) {

    const currentYear = new Date().getFullYear();

    footerText.innerHTML = footerText.innerHTML.replace(
        /©\s*\d{4}/,
        `© ${currentYear}`
    );

}


// 7. SMOOTH INTERNAL NAVIGATION
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (event) {

        const href = this.getAttribute("href");

        if (!href || href === "#") return;

        const target = document.querySelector(href);

        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});

console.log("Kabelo's Shisanyama homepage JavaScript loaded successfully.");
