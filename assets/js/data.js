/**
 * Data module - Contains all service data and translations
 */


// Services data
const services = [
    {
        id: "1",
        name: "Consulta Veterinaria General",
        description: "Examen completo de salud, diagnóstico y recomendaciones para tu mascota en la comodidad de tu hogar.",
        price: 80.000,
        duration: "45 min",
        category: "consultation",
        animals: ["dog", "cat", "rabbit"],
        image: "img/1-serv.png"
    },
    {
        id: "2",
        name: "Vacunación Completa",
        description: "Aplicación de vacunas esenciales según el calendario de vacunación de tu mascota.",
        price: 120,
        duration: "30 min",
        category: "vaccination",
        animals: ["dog", "cat"],
        image: "img/3-serv.png"
    },
    {
        id: "3",
        name: "Peluquería y Aseo",
        description: "Baño, corte de pelo, limpieza de oídos y corte de uñas para mantener a tu mascota limpia y saludable.",
        price: 60,
        duration: "60 min",
        category: "grooming",
        animals: ["dog", "cat", "rabbit"],
        image: "img/4-serv.png"
    },
    {
        id: "4",
        name: "Atención de Emergencia",
        description: "Servicio de urgencia veterinaria disponible 24/7 para situaciones críticas de tu mascota.",
        price: 200,
        duration: "60 min",
        category: "emergency",
        animals: ["dog", "cat", "bird", "rabbit", "other"],
        image: "img/2-serv.png"
    },
    {
        id: "5",
        name: "Cirugía Menor",
        description: "Procedimientos quirúrgicos menores como extracción de tumores pequeños, suturas y curaciones.",
        price: 300,
        duration: "90 min",
        category: "surgery",
        animals: ["dog", "cat"],
        image: "img/1-serv.png"
    },
    {
        id: "6",
        name: "Consulta para Aves",
        description: "Examen especializado para aves domésticas, incluyendo revisión de plumaje, pico y comportamiento.",
        price: 90,
        duration: "40 min",
        category: "consultation",
        animals: ["bird"],
        image: "img/3-serv.png"
    },
    {
        id: "7",
        name: "Desparasitación",
        description: "Tratamiento completo contra parásitos internos y externos, incluyendo medicación preventiva.",
        price: 50,
        duration: "25 min",
        category: "consultation",
        animals: ["dog", "cat", "rabbit"],
        image: "img/2-serv.png"
    },
    {
        id: "8",
        name: "Control de Peso y Nutrición",
        description: "Evaluación nutricional y plan de alimentación personalizado para mantener el peso ideal de tu mascota.",
        price: 70,
        duration: "35 min",
        category: "consultation",
        animals: ["dog", "cat", "rabbit"],
        image: "img/4-serv.png"
    },
    {
        id: "9",
        name: "Limpieza Dental",
        description: "Limpieza profesional de dientes y encías para prevenir enfermedades periodontales.",
        price: 150,
        duration: "50 min",
        category: "grooming",
        animals: ["dog", "cat"],
        image: "img/1-serv.png"
    },
    {
        id: "10",
        name: "Microchip de Identificación",
        description: "Implantación de microchip para identificación permanente y seguridad de tu mascota.",
        price: 40,
        duration: "15 min",
        category: "consultation",
        animals: ["dog", "cat", "rabbit"],
        image: "img/2-serv.png"
    },
    {
        id: "11",
        name: "Eutanasia Humanitaria",
        description: "Servicio compasivo para mascotas en estado terminal, realizado con dignidad en su hogar.",
        price: 250,
        duration: "60 min",
        category: "emergency",
        animals: ["dog", "cat", "bird", "rabbit", "other"],
        image: "img/3-serv.png"
    },
    {
        id: "12",
        name: "Terapia de Rehabilitación",
        description: "Fisioterapia y ejercicios de rehabilitación para mascotas en recuperación post-operatoria.",
        price: 100,
        duration: "45 min",
        category: "consultation",
        animals: ["dog", "cat"],
        image: "img/4-serv.png"
    }
];

// Animal type translations
const animalTranslations = {
    dog: "Perro",
    cat: "Gato",
    bird: "Ave",
    rabbit: "Conejo",
    other: "Otro"
};

// Category translations
const categoryTranslations = {
    consultation: "Consulta",
    vaccination: "Vacunación",
    grooming: "Peluquería",
    emergency: "Emergencia",
    surgery: "Cirugía"
};

// Veterinarians data
const veterinarians = [
    { id: "dr-rodriguez", name: "Dr. Rodriguez", specialty: "Medicina General" },
    { id: "dra-martinez", name: "Dra. Martinez", specialty: "Cirugía" },
    { id: "dr-gonzalez", name: "Dr. González", specialty: "Aves Exóticas" },
    { id: "dra-lopez", name: "Dra. López", specialty: "Emergencias" }
];

// Available time slots
const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00"
];

/**
 * Get service by ID
 * @param {string} serviceId - The service ID
 * @returns {Object|undefined} Service object or undefined if not found
 */
function getServiceById(serviceId) {
    return services.find(service => service.id === serviceId);
}

/**
 * Get all services
 * @returns {Array} Array of all services
 */
function getAllServices() {
    return [...services];
}

/**
 * Get services by category
 * @param {string} category - The category to filter by
 * @returns {Array} Array of services in the specified category
 */
function getServicesByCategory(category) {
    return services.filter(service => service.category === category);
}

/**
 * Get services by animal type
 * @param {string} animal - The animal type to filter by
 * @returns {Array} Array of services for the specified animal type
 */
function getServicesByAnimal(animal) {
    return services.filter(service => service.animals.includes(animal));
}