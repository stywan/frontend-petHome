/**
 * Cart module - Handles shopping cart functionality
 */


// Global cart state
let cart = [];

/**
 * Initialize cart event listeners
 */
function initializeCart() {
    const cartToggle = document.getElementById("cartToggle");
    if (cartToggle) {
        cartToggle.addEventListener("click", toggleCart);
    }
}

/**
 * Add service to cart with appointment details
 * @param {string} serviceId - Service ID to add
 * @param {Object} appointmentDetails - Appointment details object
 */
function addServiceToCart(serviceId, appointmentDetails = {}) {
    console.log("[Cart] Adding service to cart:", serviceId);

    const { veterinarian, date, time, notes } = appointmentDetails;

    // 🔴 Validación: todos los campos obligatorios
    if (!veterinarian || !date || !time) {
        showToast("Por favor completa veterinario, fecha y hora", "error");
        return false;
    }

    const service = getServiceById(serviceId);
    if (!service) {
        showToast("Servicio no encontrado", "error");
        return false;
    }

    const existingItem = cart.find(item =>
        item.id === serviceId &&
        item.veterinarian === veterinarian &&
        item.date === date &&
        item.time === time
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...service,
            veterinarian,
            date,
            time,
            notes: notes || "",
            quantity: 1
        });
    }

    updateCartUI();
    showToast("Servicio agregado al carrito", "success");
    return true;
}
/**
 * Remove item from cart
 * @param {string} serviceId - Service ID
 * @param {string} veterinarian - Veterinarian ID
 * @param {string} date - Appointment date
 * @param {string} time - Appointment time
 */
function removeFromCart(serviceId, veterinarian = "", date = "", time = "") {
    const initialLength = cart.length;
    cart = cart.filter(item =>
        !(item.id === serviceId &&
            item.veterinarian === veterinarian &&
            item.date === date &&
            item.time === time)
    );

    if (cart.length < initialLength) {
        updateCartUI();
        showToast("Servicio eliminado del carrito", "info");
    }
}

/**
 * Update quantity of item in cart
 * @param {string} serviceId - Service ID
 * @param {number} newQuantity - New quantity
 * @param {string} veterinarian - Veterinarian ID
 * @param {string} date - Appointment date
 * @param {string} time - Appointment time
 */
function updateQuantity(serviceId, newQuantity, veterinarian = "", date = "", time = "") {
    if (newQuantity <= 0) {
        removeFromCart(serviceId, veterinarian, date, time);
        return;
    }

    const item = cart.find(item =>
        item.id === serviceId &&
        item.veterinarian === veterinarian &&
        item.date === date &&
        item.time === time
    );

    if (item) {
        item.quantity = newQuantity;
        updateCartUI();
    }
}

/**
 * Clear entire cart
 */
function clearCart() {
    cart = [];
    updateCartUI();
    showToast("Carrito vaciado", "info");
}

/**
 * Get cart totals
 * @returns {Object} Object with totalItems and totalPrice
 */
function getCartTotals() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return { totalItems, totalPrice };
}

/**
 * Get cart contents
 * @returns {Array} Cart array
 */
function getCartContents() {
    return [...cart];
}

/**
 * Check if cart is empty
 * @returns {boolean} True if cart is empty
 */
function isCartEmpty() {
    return cart.length === 0;
}

/**
 * Toggle cart offcanvas
 */
function toggleCart() {
    const cartOffcanvas = document.getElementById("cartOffcanvas");
    if (cartOffcanvas) {
        // Use Bootstrap's Offcanvas if available, otherwise fallback
        if (window.bootstrap && window.bootstrap.Offcanvas) {
            const bsOffcanvas = new window.bootstrap.Offcanvas(cartOffcanvas);
            bsOffcanvas.show();
        } else {
            // Fallback for manual implementation
            cartOffcanvas.classList.add("show");
        }
    }
}

/**
 * Format veterinarian name for display
 * @param {string} veterinarianId - Veterinarian ID
 * @returns {string} Formatted veterinarian name
 */
function formatVeterinarianName(veterinarianId) {
    if (!veterinarianId) return "";
    return veterinarianId.replace("dr-", "Dr. ").replace("dra-", "Dra. ");
}

/**
 * Validate cart before checkout
 * @returns {Object} Validation result with isValid and errors
 */
function validateCart() {
    const errors = [];

    if (isCartEmpty()) {
        errors.push("El carrito está vacío");
    }

    // Check for items without appointment details
    const incompleteItems = cart.filter(item =>
        !item.veterinarian || !item.date || !item.time
    );

    if (incompleteItems.length > 0) {
        errors.push("Algunos servicios no tienen cita programada");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}