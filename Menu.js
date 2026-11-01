
// ==========================================
// KABELO'S SHISANYAMA GRILL HOUSE
// MENU SEARCH, FILTER AND SORT FUNCTIONALITY
// ==========================================


// 1. SELECT HTML ELEMENTS
// ==========================================

const menuSearch = document.getElementById("menuSearch");

const sortMenu = document.getElementById("sortMenu");

const menuGrid = document.getElementById("menuGrid");

const menuResults = document.getElementById("menuResults");

const noResults = document.getElementById("noResults");

const categoryButtons = document.querySelectorAll(
    ".menu-categories button"
);

const menuItems = Array.from(
    document.querySelectorAll(".menu-item")
);


// 2. STORE CURRENT FILTER
// ==========================================

let selectedCategory = "All";


// 3. DISPLAY MENU ITEMS
// ==========================================

function displayMenu() {

    const searchValue = menuSearch.value.trim().toLowerCase();

    let visibleItems = menuItems.filter(item => {

        const itemName = item.querySelector("h3")
            .textContent.toLowerCase();

        const itemDescription = item.querySelector(".menu-content p")
            .textContent.toLowerCase();

        const itemCategory = item.querySelector(".menu-category")
            .textContent.trim();

        const matchesSearch =
            itemName.includes(searchValue) ||
            itemDescription.includes(searchValue);

        const matchesCategory =
            selectedCategory === "All" ||
            itemCategory === selectedCategory;

        return matchesSearch && matchesCategory;

    });


    // 4. SORT PRODUCTS BY PRICE
    // ==========================================

    const sortValue = sortMenu.value;

    if (sortValue === "low-high") {

        visibleItems.sort((a, b) => {

            const priceA = parseFloat(
                a.querySelector(".menu-price").textContent.replace("R", "")
            );

            const priceB = parseFloat(
                b.querySelector(".menu-price").textContent.replace("R", "")
            );

            return priceA - priceB;

        });

    } else if (sortValue === "high-low") {

        visibleItems.sort((a, b) => {

            const priceA = parseFloat(
                a.querySelector(".menu-price").textContent.replace("R", "")
            );

            const priceB = parseFloat(
                b.querySelector(".menu-price").textContent.replace("R", "")
            );

            return priceB - priceA;

        });

    }


    // 5. UPDATE MENU DISPLAY
    // ==========================================

    menuItems.forEach(item => {

        item.style.display = "none";

    });

    visibleItems.forEach(item => {

        item.style.display = "";

        menuGrid.appendChild(item);

    });


    // 6. UPDATE RESULTS COUNTER
    // ==========================================

    menuResults.textContent =
        `Showing ${visibleItems.length} of ${menuItems.length} menu items`;


    // 7. HANDLE NO RESULTS
    // ==========================================

    noResults.hidden = visibleItems.length !== 0;

}


// 8. SEARCH EVENT
// ==========================================

menuSearch.addEventListener("input", function () {

    displayMenu();

});


// 9. CATEGORY FILTERING
// ==========================================

categoryButtons.forEach(button => {

    button.addEventListener("click", function () {

        selectedCategory = this.dataset.category;

        // Remove active class from all buttons

        categoryButtons.forEach(categoryButton => {

            categoryButton.classList.remove("active");

        });

        // Activate selected category

        this.classList.add("active");

        displayMenu();

    });

});


// 10. PRICE SORTING
// ==========================================

sortMenu.addEventListener("change", function () {

    displayMenu();

});


// 11. INITIALISE MENU
// ==========================================

displayMenu();


console.log(
    "Kabelo's Shisanyama menu search, filtering and sorting loaded successfully."
);
