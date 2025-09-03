/**
 * Filters module - Handles all filtering logic for services
 */

// Global filter state
const filters = {
    category: "all",
    animal: "all",
    priceRange: 200000,
    search: ""
};

/**
 * Initialize filter event listeners
 */
function initializeFilters() {
    // Search input
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", handleSearchFilter);
    }

    // Category filters
    const categoryRadios = document.querySelectorAll('input[name="category"]');
    categoryRadios.forEach(radio => {
        radio.addEventListener("change", handleCategoryFilter);
    });

    // Animal filters
    const animalRadios = document.querySelectorAll('input[name="animal"]');
    animalRadios.forEach(radio => {
        radio.addEventListener("change", handleAnimalFilter);
    });

    // Price range
    const priceRange = document.getElementById("priceRange");
    if (priceRange) {
        priceRange.addEventListener("input", handlePriceFilter);
    }
}

/**
 * Handle search filter change
 * @param {Event} e - Input event
 */
function handleSearchFilter(e) {
    filters.search = e.target.value.toLowerCase().trim();
    renderServices();
}

/**
 * Handle category filter change
 * @param {Event} e - Change event
 */
function handleCategoryFilter(e) {
    filters.category = e.target.value;
    renderServices();
}

/**
 * Handle animal filter change
 * @param {Event} e - Change event
 */
function handleAnimalFilter(e) {
    filters.animal = e.target.value;
    renderServices();
}

/**
 * Handle price filter change
 * @param {Event} e - Input event
 */
function handlePriceFilter(e) {
    filters.priceRange = parseInt(e.target.value);
    const priceValue = document.getElementById("priceValue");
    if (priceValue) {
        priceValue.textContent = e.target.value;
    }
    renderServices();
}

/**
 * Filter services based on current filter state
 * @returns {Array} Filtered array of services
 */
function filterServices() {
    return services.filter(service => {
        // Category filter
        if (filters.category !== "all" && service.category !== filters.category) {
            return false;
        }

        // Animal filter
        if (filters.animal !== "all" && !service.animals.includes(filters.animal)) {
            return false;
        }

        // Price filter
        if (service.price > filters.priceRange) {
            return false;
        }

        // Search filter
        if (filters.search) {
            const searchTerm = filters.search;
            const matchesName = service.name.toLowerCase().includes(searchTerm);
            const matchesDescription = service.description.toLowerCase().includes(searchTerm);
            const matchesCategory = categoryTranslations[service.category].toLowerCase().includes(searchTerm);

            if (!matchesName && !matchesDescription && !matchesCategory) {
                return false;
            }
        }

        return true;
    });
}

/**
 * Reset all filters to default values
 */
function resetFilters() {
    filters.category = "all";
    filters.animal = "all";
    filters.priceRange = 200000;
    filters.search = "";

    // Update UI
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = "";

    const priceRange = document.getElementById("priceRange");
    if (priceRange) priceRange.value = 200000;

    const priceValue = document.getElementById("priceValue");
    if (priceValue) priceValue.textContent = "200000";

    // Reset radio buttons
    document.querySelectorAll('input[name="category"]').forEach(radio => {
        radio.checked = radio.value === "all";
    });

    document.querySelectorAll('input[name="animal"]').forEach(radio => {
        radio.checked = radio.value === "all";
    });

    renderServices();
}

/**
 * Get current filter state
 * @returns {Object} Current filter state
 */
function getCurrentFilters() {
    return { ...filters };
}

/**
 * Set filter values programmatically
 * @param {Object} newFilters - Object with filter values to update
 */
function setFilters(newFilters) {
    Object.assign(filters, newFilters);
    renderServices();
}