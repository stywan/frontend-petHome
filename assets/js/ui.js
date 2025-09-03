/**
 * UI module - Handles user interface interactions and rendering
 */

/**
 * Render services in the grid
 */
function renderServices() {
    const filteredServices = filterServices();
    const servicesGrid = document.getElementById("servicesGrid");
    const serviceCount = document.getElementById("serviceCount");

    if (!servicesGrid) return;

    // Update service count
    if (serviceCount) {
        serviceCount.textContent = `${filteredServices.length} servicios disponibles`;
    }

    // Handle empty state
    if (filteredServices.length === 0) {
        servicesGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No se encontraron servicios</h4>
                <p class="text-muted">Intenta ajustar los filtros de búsqueda</p>
            </div>
        `;
        return;
    }

    // Render service cards
    servicesGrid.innerHTML = filteredServices
        .map(service => createServiceCard(service))
        .join("");
}

/**
 * Create service card HTML
 * @param {Object} service - Service object
 * @returns {string} HTML string for service card
 */
function createServiceCard(service) {
    return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card service-card shadow-sm h-100">
                <img src="${service.image}" class="card-img-top service-image" alt="${service.name}">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title text-primary">${service.name}</h5>
                        <span class="badge price-badge">$${service.price}</span>
                    </div>
                    
                    <p class="card-text text-muted small flex-grow-1">${service.description}</p>
                    
                    <div class="mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge duration-badge">
                                <i class="fas fa-clock me-1"></i>
                                ${service.duration}
                            </span>
                            <span class="badge bg-light text-dark">
                                ${categoryTranslations[service.category]}
                            </span>
                        </div>
                        
                        <div class="animal-tags">
                            ${service.animals
        .map(animal => `<span class="animal-tag">${animalTranslations[animal]}</span>`)
        .join("")}
                        </div>
                    </div>
                    
                    <button class="btn btn-outline-primary w-100" onclick="showServiceDetail('${service.id}')">
                        <i class="fas fa-eye me-2"></i>
                        Ver Detalle
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Update cart UI elements
 */
function updateCartUI() {
    const cartCount = document.getElementById("cartCount");
    const cartItems = document.getElementById("cartItems");
    const cartFooter = document.getElementById("cartFooter");
    const cartTotal = document.getElementById("cartTotal");

    const { totalItems, totalPrice } = getCartTotals();

    // Update cart count badge
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? "inline" : "none";
    }

    // Update cart items display
    if (cartItems) {
        if (isCartEmpty()) {
            cartItems.innerHTML = `
                <div class="text-center text-muted py-5" id="emptyCart">
                    <i class="fas fa-shopping-cart fa-3x mb-3"></i>
                    <h5>Tu carrito está vacío</h5>
                    <p>Agrega servicios para comenzar</p>
                </div>
            `;
            if (cartFooter) cartFooter.style.display = "none";
        } else {
            cartItems.innerHTML = cart.map(item => createCartItemHTML(item)).join("");
            if (cartFooter) cartFooter.style.display = "block";
        }
    }

    // Update total price
    if (cartTotal) {
        cartTotal.textContent = totalPrice;
    }
}

/**
 * Create cart item HTML
 * @param {Object} item - Cart item object
 * @returns {string} HTML string for cart item
 */
function createCartItemHTML(item) {
    const veterinarianDisplay = item.veterinarian
        ? `<p class="text-muted small mb-1">
             <i class="fas fa-user-md me-1"></i>
             ${formatVeterinarianName(item.veterinarian)}
           </p>`
        : "";

    const appointmentDisplay = item.date && item.time
        ? `<p class="text-muted small mb-2">
             <i class="fas fa-calendar me-1"></i>
             ${formatDate(item.date)} a las ${item.time}
           </p>`
        : "";

    return `
        <div class="cart-item">
            <div class="d-flex align-items-start gap-3">
                <img src="${item.image}" alt="${item.name}" class="rounded" 
                     style="width: 60px; height: 60px; object-fit: cover;">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.name}</h6>
                    <p class="text-muted small mb-1">$${item.price} × ${item.duration}</p>
                    ${veterinarianDisplay}
                    ${appointmentDisplay}
                    
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="quantity-controls">
                            <button class="quantity-btn" 
                                    onclick="updateQuantity('${item.id}', ${item.quantity - 1}, '${item.veterinarian}', '${item.date}', '${item.time}')">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="quantity-input" value="${item.quantity}" 
                                   onchange="updateQuantity('${item.id}', parseInt(this.value), '${item.veterinarian}', '${item.date}', '${item.time}')" 
                                   min="1">
                            <button class="quantity-btn" 
                                    onclick="updateQuantity('${item.id}', ${item.quantity + 1}, '${item.veterinarian}', '${item.date}', '${item.time}')">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        
                        <div class="d-flex align-items-center gap-2">
                            <strong>$${item.price * item.quantity}</strong>
                            <button class="btn btn-sm btn-outline-danger" 
                                    onclick="removeFromCart('${item.id}', '${item.veterinarian}', '${item.date}', '${item.time}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Show service detail modal
 * @param {string} serviceId - Service ID to show
 */
function showServiceDetail(serviceId) {
    console.log("[UI] Opening service detail for:", serviceId);

    const service = getServiceById(serviceId);
    if (!service) {
        console.log("[UI] Service not found:", serviceId);
        showToast("Servicio no encontrado", "error");
        return;
    }

    console.log("[UI] Service found:", service.name);

    // Populate modal with service data
    populateServiceModal(service);

    // Set up form
    setupServiceDetailForm(serviceId);

    // Show modal
    const modal = document.getElementById("serviceDetailModal");
    if (modal) {
        if (window.bootstrap && window.bootstrap.Modal) {
            const bsModal = new window.bootstrap.Modal(modal);
            bsModal.show();
        } else {
            // Fallback for manual modal implementation
            modal.style.display = "block";
            modal.classList.add("show");
        }
    }
}

/**
 * Populate service detail modal with service data
 * @param {Object} service - Service object
 */
function populateServiceModal(service) {
    const elements = {
        title: document.getElementById("serviceDetailTitle"),
        image: document.getElementById("serviceDetailImage"),
        name: document.getElementById("serviceDetailName"),
        description: document.getElementById("serviceDetailDescription"),
        category: document.getElementById("serviceDetailCategory"),
        animal: document.getElementById("serviceDetailAnimal"),
        price: document.getElementById("serviceDetailPrice"),
        duration: document.getElementById("serviceDetailDuration")
    };

    if (elements.title) elements.title.textContent = "Detalles del Servicio";
    if (elements.image) {
        elements.image.src = service.image;
        elements.image.alt = service.name;
    }
    if (elements.name) elements.name.textContent = service.name;
    if (elements.description) elements.description.textContent = service.description;
    if (elements.category) elements.category.textContent = categoryTranslations[service.category];
    if (elements.animal) {
        elements.animal.textContent = service.animals
            .map(animal => animalTranslations[animal])
            .join(", ");
    }
    if (elements.price) elements.price.textContent = service.price;
    if (elements.duration) elements.duration.textContent = service.duration;
}

/**
 * Setup service detail form
 * @param {string} serviceId - Service ID
 */
function setupServiceDetailForm(serviceId) {
    // Set minimum date to today
    const appointmentDate = document.getElementById("appointmentDate");
    if (appointmentDate) {
        const today = new Date().toISOString().split("T")[0];
        appointmentDate.min = today;
        appointmentDate.value = "";
    }

    // Clear form fields
    const formFields = [
        "veterinarianSelect",
        "timeSelect",
        "specialNotes"
    ];

    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) field.value = "";
    });

    // Setup add to cart button
    const addToCartBtn = document.getElementById("addToCartBtn");
    if (addToCartBtn) {
        addToCartBtn.onclick = () => handleAddToCartFromModal(serviceId);
    }

    // Populate veterinarian select
    populateVeterinarianSelect();

    // Populate time select
    populateTimeSelect();
}

/**
 * Handle add to cart from modal
 * @param {string} serviceId - Service ID
 */
function handleAddToCartFromModal(serviceId) {
    const veterinarian = document.getElementById("veterinarianSelect")?.value;
    const date = document.getElementById("appointmentDate")?.value;
    const time = document.getElementById("timeSelect")?.value;
    const notes = document.getElementById("specialNotes")?.value;

    const appointmentDetails = {
        veterinarian,
        date,
        time,
        notes
    };

    const success = addServiceToCart(serviceId, appointmentDetails);

    if (success) {
        // Close modal
        const modal = document.getElementById("serviceDetailModal");
        if (modal && window.bootstrap && window.bootstrap.Modal) {
            const bsModal = window.bootstrap.Modal.getInstance(modal);
            if (bsModal) bsModal.hide();
        }
    }
}

/**
 * Populate veterinarian select dropdown
 */
function populateVeterinarianSelect() {
    const select = document.getElementById("veterinarianSelect");
    if (!select) return;

    select.innerHTML = '<option value="">Selecciona un veterinario</option>';

    veterinarians.forEach(vet => {
        const option = document.createElement("option");
        option.value = vet.id;
        option.textContent = `${vet.name} - ${vet.specialty}`;
        select.appendChild(option);
    });
}

/**
 * Populate time select dropdown
 */
function populateTimeSelect() {
    const select = document.getElementById("timeSelect");
    if (!select) return;

    select.innerHTML = '<option value="">Selecciona una hora</option>';

    timeSlots.forEach(time => {
        const option = document.createElement("option");
        option.value = time;
        option.textContent = time;
        select.appendChild(option);
    });
}

/**
 * Show toast notification
 */
function showToast(message, type = "info") {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toastContainer";
        toastContainer.className = "toast-container position-fixed top-0 end-0 p-3";
        toastContainer.style.zIndex = "9999";
        document.body.appendChild(toastContainer);
    }

    const toastId = "toast-" + Date.now();
    const bgClass = getToastBgClass(type);
    const iconClass = getToastIconClass(type);

    const toastHTML = `
        <div id="${toastId}" class="toast ${bgClass} text-white" role="alert">
            <div class="toast-body d-flex align-items-center">
                <i class="fas ${iconClass} me-2"></i>
                ${message}
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML("beforeend", toastHTML);
    const toastElement = document.getElementById(toastId);

    // Show toast using Bootstrap or fallback
    if (window.bootstrap && window.bootstrap.Toast) {
        const toast = new window.bootstrap.Toast(toastElement, { delay: 3000 });
        toast.show();

        toastElement.addEventListener("hidden.bs.toast", () => {
            toastElement.remove();
        });
    } else {
        // Fallback implementation
        toastElement.classList.add("show");
        setTimeout(() => {
            toastElement.style.opacity = "0";
            setTimeout(() => {
                toastElement.remove();
            }, 300);
        }, 3000);
    }
}

/**
 * Get toast background class based on type
 */
function getToastBgClass(type) {
    const classes = {
        success: "bg-success",
        error: "bg-danger",
        warning: "bg-warning",
        info: "bg-info"
    };
    return classes[type] || "bg-info";
}

/**
 * Get toast icon class based on type
 * @param {string} type - Toast type
 * @returns {string} FontAwesome icon class
 */
function getToastIconClass(type) {
    const icons = {
        success: "fa-check-circle",
        error: "fa-exclamation-circle",
        warning: "fa-exclamation-triangle",
        info: "fa-info-circle"
    };
    return icons[type] || "fa-info-circle";
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString + "T00:00:00");
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
    };

    return date.toLocaleDateString('es-ES', options);
}

/**
 * Show loading state
 * @param {string} elementId - Element ID to show loading in
 */
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-2 text-muted">Cargando servicios...</p>
            </div>
        `;
    }
}

/**
 * Show error state
 */
function showError(elementId, message = "Ha ocurrido un error") {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                <h4 class="text-muted">${message}</h4>
                <button class="btn btn-primary mt-3" onclick="location.reload()">
                    Reintentar
                </button>
            </div>
        `;
    }
}

/**
 * Initialize UI components
 */
function initializeUI() {
    // Initialize tooltips if Bootstrap is available
    if (window.bootstrap && window.bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(tooltipTriggerEl => {
            return new window.bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Initialize modals
    initializeModals();

    // Set initial price range value
    const priceRange = document.getElementById("priceRange");
    const priceValue = document.getElementById("priceValue");
    if (priceRange && priceValue) {
        priceValue.textContent = priceRange.value;
    }
}

/**
 * Initialize modal components
 */
function initializeModals() {
    // Service detail modal close handlers
    const serviceModal = document.getElementById("serviceDetailModal");
    if (serviceModal) {
        const closeButtons = serviceModal.querySelectorAll('[data-bs-dismiss="modal"]');
        closeButtons.forEach(button => {
            button.addEventListener("click", () => {
                if (window.bootstrap && window.bootstrap.Modal) {
                    const bsModal = window.bootstrap.Modal.getInstance(serviceModal);
                    if (bsModal) bsModal.hide();
                }
            });
        });
    }
}

/**
 * Scroll to element smoothly
 * @param {string} elementId - Element ID to scroll to
 */
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Toggle visibility of an element
 */
function toggleElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = element.style.display === "none" ? "block" : "none";
    }
}