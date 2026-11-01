
// KABELO'S SHISANYAMA GRILL HOUSE
// GALLERY FILTER AND LIGHTBOX FUNCTIONALITY

document.addEventListener("DOMContentLoaded", () => {

    // Gallery elements
    const galleryCards = Array.from(
        document.querySelectorAll(".gallery-card")
    );

    const filterButtons = document.querySelectorAll(
        ".gallery-filters button"
    );

    // Lightbox elements
    const lightbox = document.getElementById("galleryLightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const closeButton = document.getElementById("lightboxClose");
    const previousButton = document.getElementById("lightboxPrev");
    const nextButton = document.getElementById("lightboxNext");

    if (!lightbox || !lightboxImage || !closeButton) {
        console.error("Gallery lightbox elements could not be found.");
        return;
    }

    let currentImages = [];
    let currentIndex = 0;

    // FILTER GALLERY
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {

            const selectedFilter = button.dataset.filter;

            filterButtons.forEach(filterButton => {
                filterButton.classList.remove("active");
            });

            button.classList.add("active");

            galleryCards.forEach(card => {

                const category = card.dataset.category;

                const shouldDisplay =
                    selectedFilter === "all" ||
                    category === selectedFilter;

                card.hidden = !shouldDisplay;
            });

            // Refresh the images available to the lightbox
            updateCurrentImages();
        });
    });

    // GET VISIBLE GALLERY IMAGES
    function updateCurrentImages() {

        currentImages = galleryCards
            .filter(card => !card.hidden)
            .map(card => card.querySelector(".image-container img"))
            .filter(image => image !== null);
    }

    // DISPLAY AN IMAGE IN THE LIGHTBOX
    function showImage(index) {

        if (currentImages.length === 0) return;

        currentIndex =
            (index + currentImages.length) % currentImages.length;

        const selectedImage = currentImages[currentIndex];

        lightboxImage.src = selectedImage.src;
        lightboxImage.alt = selectedImage.alt;

        const card = selectedImage.closest(".gallery-card");
        const title = card.querySelector("h3");

        lightboxCaption.textContent = title
            ? title.textContent
            : selectedImage.alt;
    }

    // OPEN LIGHTBOX
    function openLightbox(index) {

        updateCurrentImages();

        if (currentImages.length === 0) return;

        showImage(index);

        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-open");

        closeButton.focus();
    }

    // CLOSE LIGHTBOX
    function closeLightbox() {

        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-open");

        lightboxImage.src = "";
    }

    // NEXT IMAGE
    function showNextImage() {
        showImage(currentIndex + 1);
    }

    // PREVIOUS IMAGE
    function showPreviousImage() {
        showImage(currentIndex - 1);
    }

    // MAKE GALLERY IMAGES CLICKABLE
    galleryCards.forEach(card => {

        const image = card.querySelector(".image-container img");

        if (!image) return;

        image.style.cursor = "pointer";

        image.addEventListener("click", () => {

            updateCurrentImages();

            const imageIndex = currentImages.indexOf(image);

            if (imageIndex !== -1) {
                openLightbox(imageIndex);
            }
        });
    });

    // BUTTON EVENTS
    closeButton.addEventListener("click", closeLightbox);

    nextButton.addEventListener("click", showNextImage);

    previousButton.addEventListener("click", showPreviousImage);

    // CLOSE WHEN CLICKING THE DARK BACKGROUND
    lightbox.addEventListener("click", event => {

        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    // KEYBOARD CONTROLS
    document.addEventListener("keydown", event => {

        if (!lightbox.classList.contains("active")) return;

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowRight") {
            showNextImage();
        }

        if (event.key === "ArrowLeft") {
            showPreviousImage();
        }
    });

    // INITIALISE GALLERY
    updateCurrentImages();

    console.log("Gallery JavaScript loaded successfully.");

});
