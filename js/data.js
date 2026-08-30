/* =========================================================
   VELORA HELP
   DATA FILE
   Your Problem. Our Direction.
   Powered by VELORA DIGITAL
   ========================================================= */

const VELORA_CONFIG = {
    brandName: "VELORA HELP",
    poweredBy: "VELORA DIGITAL",

    tagline: "Your Problem. Our Direction.",

    phone: "+918088590273",
    displayPhone: "+91 8088590273",

    email: "veloradigital.co.in@gmail.com",

    whatsappMessage:
        "Hello VELORA HELP, I need assistance. Please guide me.",

    location: {
        state: "Karnataka",
        district: "Dakshina Kannada"
    }
};


/* =========================================================
   DAKSHINA KANNADA TALUKS
   ========================================================= */

const DAKSHINA_KANNADA_TALUKS = [
    {
        name: "Mangaluru",
        slug: "mangaluru",
        description: "Mangaluru and surrounding areas"
    },
    {
        name: "Bantwal",
        slug: "bantwal",
        description: "Bantwal and surrounding areas"
    },
    {
        name: "Belthangady",
        slug: "belthangady",
        description: "Belthangady and surrounding areas"
    },
    {
        name: "Kadaba",
        slug: "kadaba",
        description: "Kadaba and surrounding areas"
    },
    {
        name: "Moodabidri",
        slug: "moodabidri",
        description: "Moodabidri and surrounding areas"
    },
    {
        name: "Mulki",
        slug: "mulki",
        description: "Mulki and surrounding areas"
    },
    {
        name: "Puttur",
        slug: "puttur",
        description: "Puttur and surrounding areas"
    },
    {
        name: "Sullia",
        slug: "sullia",
        description: "Sullia and surrounding areas"
    },
    {
        name: "Ullal",
        slug: "ullal",
        description: "Ullal and surrounding areas"
    }
];


/* =========================================================
   MAIN HELP CATEGORIES
   ========================================================= */

const VELORA_CATEGORIES = [
    {
        id: "healthcare",
        name: "Healthcare",
        icon: "🩺",
        page: "healthcare.html",
        description: "Find hospitals, clinics and healthcare guidance."
    },

    {
        id: "emergency",
        name: "Emergency Help",
        icon: "🚨",
        page: "emergency.html",
        description: "Get urgent guidance and official emergency contacts."
    },

    {
        id: "local-services",
        name: "Local Services",
        icon: "🔧",
        page: "local-services.html",
        description: "Find plumbers, electricians, mechanics and more."
    },

    {
        id: "property",
        name: "Rent & Property",
        icon: "🏠",
        page: "property.html",
        description: "Find rental and property assistance."
    },

    {
        id: "students",
        name: "Students",
        icon: "🎓",
        page: "students.html",
        description: "Find opportunities, guidance and student support."
    },

    {
        id: "admissions",
        name: "Admissions",
        icon: "🏫",
        page: "admissions.html",
        description: "PUC, degree and other course admission guidance."
    },

    {
        id: "jobs",
        name: "Jobs",
        icon: "💼",
        page: "jobs.html",
        description: "Find jobs, apprenticeships and career opportunities."
    },

    {
        id: "scholarships",
        name: "Scholarships",
        icon: "📚",
        page: "scholarships.html",
        description: "Find scholarships and application guidance."
    },

    {
        id: "government",
        name: "Government Services",
        icon: "🏛️",
        page: "government.html",
        description: "Find government services, schemes and official information."
    },

    {
        id: "transport",
        name: "Transport",
        icon: "🚌",
        page: "transport.html",
        description: "Find transport-related information and assistance."
    },

    {
        id: "civic",
        name: "Civic Problems",
        icon: "🏙️",
        page: "civic.html",
        description: "Report roads, waste, water and public issues."
    },

    {
        id: "elderly",
        name: "Elderly Help",
        icon: "👴",
        page: "elderly.html",
        description: "Support and guidance for senior citizens."
    },

    {
        id: "businesses",
        name: "Local Businesses",
        icon: "🏪",
        page: "businesses.html",
        description: "Discover local businesses and services."
    },

    {
        id: "digital-help",
        name: "Digital Help",
        icon: "💻",
        page: "digital-help.html",
        description: "Get help with digital services and online processes."
    },

    {
        id: "community",
        name: "Community Help",
        icon: "🤝",
        page: "community.html",
        description: "Community support and local assistance."
    },

    {
        id: "other",
        name: "Other Problems",
        icon: "💡",
        page: "contact.html",
        description: "Tell VELORA HELP about any other problem."
    }
];


/* =========================================================
   PROBLEM CATEGORIES
   ========================================================= */

const PROBLEM_CATEGORIES = [
    {
        id: "healthcare",
        name: "Healthcare",
        icon: "🩺"
    },

    {
        id: "housing",
        name: "Housing",
        icon: "🏠"
    },

    {
        id: "education",
        name: "Education",
        icon: "🎓"
    },

    {
        id: "jobs",
        name: "Jobs",
        icon: "💼"
    },

    {
        id: "transport",
        name: "Transport",
        icon: "🚌"
    },

    {
        id: "waste",
        name: "Waste / Garbage",
        icon: "🗑️"
    },

    {
        id: "water",
        name: "Water",
        icon: "💧"
    },

    {
        id: "roads",
        name: "Roads",
        icon: "🛣️"
    },

    {
        id: "public-safety",
        name: "Public Safety",
        icon: "🛡️"
    },

    {
        id: "government",
        name: "Government Services",
        icon: "🏛️"
    },

    {
        id: "digital",
        name: "Digital Services",
        icon: "💻"
    },

    {
        id: "cost-of-living",
        name: "Cost of Living",
        icon: "💰"
    },

    {
        id: "elderly",
        name: "Elderly Support",
        icon: "👴"
    },

    {
        id: "local-business",
        name: "Local Business",
        icon: "🏪"
    },

    {
        id: "other",
        name: "Other",
        icon: "💡"
    }
];


/* =========================================================
   ADMISSION CATEGORIES
   ========================================================= */

const ADMISSION_LEVELS = [
    {
        id: "puc",
        name: "PUC Admissions",
        icon: "📘",
        description: "1st PUC and 2nd PUC admission guidance."
    },

    {
        id: "degree",
        name: "Degree Admissions",
        icon: "🎓",
        description: "Undergraduate degree admission guidance."
    },

    {
        id: "professional",
        name: "Professional Courses",
        icon: "🏛️",
        description: "Professional and specialized course guidance."
    },

    {
        id: "diploma",
        name: "Diploma",
        icon: "📜",
        description: "Diploma and technical education."
    },

    {
        id: "iti",
        name: "ITI",
        icon: "🛠️",
        description: "Industrial Training Institute opportunities."
    },

    {
        id: "other",
        name: "Other Courses",
        icon: "📚",
        description: "Other education and training programmes."
    }
];


/* =========================================================
   DEGREE COURSES
   ========================================================= */

const DEGREE_COURSES = [
    "BA",
    "BCom",
    "BBA",
    "BCA",
    "BSc",
    "BBM",
    "BSW",
    "B.Voc",
    "Other Degree"
];


/* =========================================================
   PUC STREAMS
   ========================================================= */

const PUC_STREAMS = [
    "Science",
    "Commerce",
    "Arts"
];


/* =========================================================
   PROFESSIONAL COURSE CATEGORIES
   ========================================================= */

const PROFESSIONAL_COURSES = [
    "Engineering",
    "Medical",
    "Dental",
    "Pharmacy",
    "Nursing",
    "Allied Health",
    "Law",
    "Management",
    "Computer / IT",
    "Paramedical",
    "Other Professional Course"
];


/* =========================================================
   LOCAL SERVICE TYPES
   ========================================================= */

const LOCAL_SERVICE_TYPES = [
    "Plumber",
    "Electrician",
    "AC Technician",
    "Refrigerator Repair",
    "Washing Machine Repair",
    "TV Repair",
    "Mobile Repair",
    "Computer Repair",
    "Car Mechanic",
    "Bike Mechanic",
    "Carpenter",
    "Painter",
    "Mason",
    "Cleaning Service",
    "Pest Control",
    "Packers & Movers",
    "Photographer",
    "Makeup Artist",
    "Tailor",
    "Other Service"
];


/* =========================================================
   PROPERTY TYPES
   ========================================================= */

const PROPERTY_TYPES = [
    "House for Rent",
    "Apartment for Rent",
    "PG",
    "Hostel",
    "Commercial Property",
    "House for Sale",
    "Apartment for Sale",
    "Land",
    "Other Property"
];


/* =========================================================
   HEALTHCARE SPECIALTIES
   ========================================================= */

const HEALTHCARE_SPECIALTIES = [
    "General Medicine",
    "Pediatrics",
    "Cardiology",
    "Dermatology",
    "Orthopedics",
    "Gynecology",
    "ENT",
    "Ophthalmology",
    "Dentistry",
    "Neurology",
    "Psychiatry",
    "Pulmonology",
    "Gastroenterology",
    "Urology",
    "General Surgery",
    "Other Specialty"
];


/* =========================================================
   HEALTHCARE SEARCH PURPOSES
   ========================================================= */

const HEALTHCARE_PURPOSES = [
    "Fever",
    "Cold / Cough",
    "Stomach Problem",
    "Skin Problem",
    "Bone / Joint Problem",
    "Child Healthcare",
    "Women's Healthcare",
    "Dental Problem",
    "Eye Problem",
    "Ear / Nose / Throat",
    "Heart Related Concern",
    "Breathing Problem",
    "General Consultation",
    "Other"
];


/* =========================================================
   GOVERNMENT SERVICE CATEGORIES
   ========================================================= */

const GOVERNMENT_CATEGORIES = [
    {
        id: "citizen",
        name: "Citizen Services",
        icon: "🪪"
    },

    {
        id: "students",
        name: "Students",
        icon: "🎓"
    },

    {
        id: "women-family",
        name: "Women & Family",
        icon: "👨‍👩‍👧"
    },

    {
        id: "farmers",
        name: "Farmers",
        icon: "🌾"
    },

    {
        id: "workers",
        name: "Workers",
        icon: "👷"
    },

    {
        id: "senior-citizens",
        name: "Senior Citizens",
        icon: "👴"
    },

    {
        id: "health",
        name: "Healthcare",
        icon: "🩺"
    },

    {
        id: "housing",
        name: "Housing",
        icon: "🏠"
    },

    {
        id: "employment",
        name: "Employment",
        icon: "💼"
    },

    {
        id: "business",
        name: "Business",
        icon: "🏪"
    },

    {
        id: "disability",
        name: "Disability Support",
        icon: "♿"
    },

    {
        id: "other",
        name: "Other Government Services",
        icon: "🏛️"
    }
];


/* =========================================================
   PROBLEM STATUS
   ========================================================= */

const PROBLEM_STATUS = [
    {
        id: "submitted",
        name: "Submitted"
    },

    {
        id: "under-review",
        name: "Under Review"
    },

    {
        id: "forwarded",
        name: "Forwarded"
    },

    {
        id: "follow-up",
        name: "Follow-up"
    },

    {
        id: "resolved",
        name: "Resolved"
    },

    {
        id: "closed",
        name: "Closed"
    }
];


/* =========================================================
   ADMISSION STATUS
   ========================================================= */

const ADMISSION_STATUS = [
    {
        id: "open",
        name: "Admissions Open",
        className: "badge-success"
    },

    {
        id: "closing",
        name: "Closing Soon",
        className: "badge-warning"
    },

    {
        id: "upcoming",
        name: "Opening Soon",
        className: "badge-info"
    },

    {
        id: "closed",
        name: "Admissions Closed",
        className: "badge-danger"
    },

    {
        id: "unknown",
        name: "Check Official Source",
        className: "badge-neutral"
    }
];


/* =========================================================
   SAMPLE MONTHLY PROBLEM DATA
   ---------------------------------------------------------
   These are placeholder values for the FREE MVP.
   Later the real backend/database will automatically
   calculate these numbers.
   ========================================================= */

const MONTHLY_PROBLEM_DATA = [
    {
        category: "Waste / Garbage",
        count: 0
    },

    {
        category: "Roads",
        count: 0
    },

    {
        category: "Water",
        count: 0
    },

    {
        category: "Healthcare",
        count: 0
    },

    {
        category: "Government Services",
        count: 0
    },

    {
        category: "Education",
        count: 0
    },

    {
        category: "Transport",
        count: 0
    },

    {
        category: "Housing",
        count: 0
    },

    {
        category: "Other",
        count: 0
    }
];


/* =========================================================
   WEBSITE NAVIGATION
   ========================================================= */

const VELORA_NAVIGATION = [
    {
        name: "Home",
        page: "index.html"
    },

    {
        name: "Services",
        page: "services.html"
    },

    {
        name: "Healthcare",
        page: "healthcare.html"
    },

    {
        name: "Admissions",
        page: "admissions.html"
    },

    {
        name: "Government",
        page: "government.html"
    },

    {
        name: "Report Problem",
        page: "report-problem.html"
    },

    {
        name: "About",
        page: "about.html"
    },

    {
        name: "Contact",
        page: "contact.html"
    }
];


/* =========================================================
   WHATSAPP HELPER
   ========================================================= */

function veloraWhatsAppUrl(message = VELORA_CONFIG.whatsappMessage) {

    const encodedMessage = encodeURIComponent(message);

    return `https://wa.me/${VELORA_CONFIG.phone}?text=${encodedMessage}`;
}


/* =========================================================
   CALL HELPER
   ========================================================= */

function veloraCallUrl() {

    return `tel:${VELORA_CONFIG.phone}`;
}


/* =========================================================
   EMAIL HELPER
   ========================================================= */

function veloraEmailUrl(
    subject = "VELORA HELP Enquiry",
    body = "Hello VELORA HELP, I need assistance."
) {

    return `mailto:${VELORA_CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}


/* =========================================================
   PROBLEM ID GENERATOR
   ========================================================= */

function generateVeloraProblemId() {

    const now = new Date();

    const year = now.getFullYear();

    const random = Math.floor(
        10000 + Math.random() * 90000
    );

    return `VH-DK-${year}-${random}`;
}


/* =========================================================
   LOCAL STORAGE HELPERS
   ========================================================= */

function veloraSave(key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {

        console.error(
            "VELORA HELP storage error:",
            error
        );

        return false;
    }
}


function veloraLoad(key, fallback = null) {

    try {

        const stored =
            localStorage.getItem(key);

        if (!stored) {
            return fallback;
        }

        return JSON.parse(stored);

    } catch (error) {

        console.error(
            "VELORA HELP storage read error:",
            error
        );

        return fallback;
    }
}


/* =========================================================
   GET CURRENT DATE
   ========================================================= */

function getVeloraCurrentDate() {

    return new Date().toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );
}


/* =========================================================
   SAFE TEXT HELPER
   ========================================================= */

function veloraEscapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   FIND TALUK
   ========================================================= */

function getTalukBySlug(slug) {

    return DAKSHINA_KANNADA_TALUKS.find(
        taluk => taluk.slug === slug
    );
}


/* =========================================================
   FIND CATEGORY
   ========================================================= */

function getVeloraCategory(id) {

    return VELORA_CATEGORIES.find(
        category => category.id === id
    );
}


/* =========================================================
   VELORA HELP READY MESSAGE
   ========================================================= */

console.log(
    "VELORA HELP data loaded successfully."
);

console.log(
    `${VELORA_CONFIG.brandName} — ${VELORA_CONFIG.tagline}`
);
