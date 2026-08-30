/* =========================================================
   VELORA HELP
   HEALTHCARE JAVASCRIPT
   Your Problem. Our Direction.
   Powered by VELORA DIGITAL

   NOTE:
   This file does NOT diagnose medical conditions or claim
   that one doctor is medically "the best". It helps users
   find relevant healthcare options from the verified data
   available on the platform.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initHealthcareSearch();
    initHealthcareFilters();
    initHealthcareEnquiryButtons();
    initHealthcareLocation();
    renderHealthcareProviders();

});


/* =========================================================
   HEALTHCARE DATA
   ---------------------------------------------------------
   Initially empty.

   When real hospitals/doctors are verified, add their
   information here or later load it from the backend.
   ========================================================= */

const VELORA_HEALTHCARE_PROVIDERS = [

    /*
    Example structure:

    {
        id: "doctor-001",
        type: "doctor",

        firstName: "Doctor",
        lastName: "Name",

        fullName: "Dr. Doctor Name",

        specialty: "General Medicine",

        purposes: [
            "Fever",
            "Cold / Cough",
            "General Consultation"
        ],

        hospital: "Hospital Name",

        taluk: "Mangaluru",

        area: "Area",

        address: "Full address",

        consultation: "General consultation",

        timings: "10:00 AM - 1:00 PM",

        phone: "+91XXXXXXXXXX",

        appointmentPhone: "+91XXXXXXXXXX",

        image: "",

        verified: true,

        licenseVerified: true,

        certificateVerified: true,

        emergency: false,

        status: "Open"
    }

    */

];


/* =========================================================
   SEARCH INITIALISATION
   ========================================================= */

function initHealthcareSearch() {

    const forms =
        document.querySelectorAll(
            'form[data-healthcare-search]'
        );


    forms.forEach(function (form) {

        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                performHealthcareSearch(form);

            }
        );

    });


    /*
       Also support a simple search input
       without a form.
    */

    document
        .querySelectorAll(
            "[data-healthcare-search-button]"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    performHealthcareSearch();

                }
            );

        });

}


/* =========================================================
   HEALTHCARE SEARCH
   ========================================================= */

function performHealthcareSearch(
    form = null
) {

    let purpose = "";
    let specialty = "";
    let taluk = "";
    let area = "";


    if (form) {

        const data =
            new FormData(form);


        purpose =
            String(
                data.get("purpose") || ""
            ).trim();


        specialty =
            String(
                data.get("specialty") || ""
            ).trim();


        taluk =
            String(
                data.get("taluk") || ""
            ).trim();


        area =
            String(
                data.get("area") || ""
            ).trim();

    } else {

        const purposeField =
            document.querySelector(
                "[name='purpose']"
            );

        const specialtyField =
            document.querySelector(
                "[name='specialty']"
            );

        const talukField =
            document.querySelector(
                "[name='taluk']"
            );

        const areaField =
            document.querySelector(
                "[name='area']"
            );


        purpose =
            purposeField
                ? purposeField.value.trim()
                : "";


        specialty =
            specialtyField
                ? specialtyField.value.trim()
                : "";


        taluk =
            talukField
                ? talukField.value.trim()
                : "";


        area =
            areaField
                ? areaField.value.trim()
                : "";

    }


    const results =
        filterHealthcareProviders({
            purpose,
            specialty,
            taluk,
            area
        });


    renderHealthcareProviders(
        results
    );


    const resultsSection =
        document.querySelector(
            "[data-healthcare-results]"
        );


    if (resultsSection) {

        resultsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    /*
       If there are no providers yet,
       guide the person to VELORA HELP.
    */

    if (
        results.length === 0
    ) {

        showVeloraMessage(
            "No matching verified healthcare provider is currently listed. You can send your requirement to VELORA HELP for guidance.",
            "info"
        );

    }

}


/* =========================================================
   FILTER PROVIDERS
   ========================================================= */

function filterHealthcareProviders(
    filters = {}
) {

    const purpose =
        String(
            filters.purpose || ""
        )
        .trim()
        .toLowerCase();


    const specialty =
        String(
            filters.specialty || ""
        )
        .trim()
        .toLowerCase();


    const taluk =
        String(
            filters.taluk || ""
        )
        .trim()
        .toLowerCase();


    const area =
        String(
            filters.area || ""
        )
        .trim()
        .toLowerCase();


    return VELORA_HEALTHCARE_PROVIDERS
        .filter(function (provider) {

            /*
               Only providers marked verified
               should appear in the verified
               healthcare results.
            */

            if (
                provider.verified !== true
            ) {

                return false;

            }


            if (
                purpose &&
                !providerMatchesPurpose(
                    provider,
                    purpose
                )
            ) {

                return false;

            }


            if (
                specialty &&
                String(
                    provider.specialty || ""
                )
                .toLowerCase()
                !== specialty
            ) {

                return false;

            }


            if (
                taluk &&
                String(
                    provider.taluk || ""
                )
                .toLowerCase()
                .includes(taluk) === false
            ) {

                return false;

            }


            if (
                area &&
                String(
                    provider.area || ""
                )
                .toLowerCase()
                .includes(area) === false
            ) {

                return false;

            }


            return true;

        })
        .sort(function (a, b) {

            /*
               Verified providers with verified
               credentials are prioritised.
            */

            const scoreA =
                healthcareProviderScore(a);

            const scoreB =
                healthcareProviderScore(b);

            return scoreB - scoreA;

        });

}


/* =========================================================
   PURPOSE MATCHING
   ========================================================= */

function providerMatchesPurpose(
    provider,
    purpose
) {

    const purposes =
        Array.isArray(
            provider.purposes
        )
            ? provider.purposes
            : [];


    const matched =
        purposes.some(
            function (item) {

                return String(item)
                    .toLowerCase()
                    .includes(purpose);

            }
        );


    if (matched) {
        return true;
    }


    /*
       Also allow specialty-based matching
       for common searches.
    */

    const specialty =
        String(
            provider.specialty || ""
        ).toLowerCase();


    const purposeMap = {

        "fever":
            [
                "general medicine",
                "internal medicine",
                "general physician"
            ],

        "cold / cough":
            [
                "general medicine",
                "pulmonology",
                "internal medicine"
            ],

        "child healthcare":
            [
                "pediatrics"
            ],

        "skin problem":
            [
                "dermatology"
            ],

        "bone / joint problem":
            [
                "orthopedics"
            ],

        "dental problem":
            [
                "dentistry"
            ],

        "eye problem":
            [
                "ophthalmology"
            ],

        "ear / nose / throat":
            [
                "ent"
            ],

        "women's healthcare":
            [
                "gynecology"
            ]

    };


    const matchingSpecialties =
        purposeMap[purpose] || [];


    return matchingSpecialties.some(
        function (item) {

            return specialty.includes(
                item
            );

        }
    );

}


/* =========================================================
   PROVIDER SCORE
   ========================================================= */

function healthcareProviderScore(
    provider
) {

    let score = 0;


    if (
        provider.verified === true
    ) {

        score += 50;

    }


    if (
        provider.licenseVerified === true
    ) {

        score += 25;

    }


    if (
        provider.certificateVerified === true
    ) {

        score += 25;

    }


    if (
        provider.status === "Open"
    ) {

        score += 10;

    }


    return score;

}


/* =========================================================
   RENDER PROVIDERS
   ========================================================= */

function renderHealthcareProviders(
    providers =
        VELORA_HEALTHCARE_PROVIDERS.filter(
            function (provider) {

                return provider.verified === true;

            }
        )
) {

    const containers =
        document.querySelectorAll(
            "[data-healthcare-results]"
        );


    if (
        containers.length === 0
    ) {

        return;

    }


    containers.forEach(
        function (container) {

            container.innerHTML = "";


            if (
                providers.length === 0
            ) {

                container.innerHTML =
                    `
                    <div class="empty-state">

                        <div class="empty-icon">
                            🩺
                        </div>

                        <h3>
                            No verified healthcare provider found
                        </h3>

                        <p>
                            We don't currently have a matching
                            verified provider in our directory.
                            Send your requirement to VELORA HELP
                            and we'll guide you with the information
                            available to us.
                        </p>

                        <div class="hero-actions"
                             style="justify-content:center;">

                            <a
                                href="contact.html"
                                class="btn btn-primary"
                            >
                                Get VELORA Guidance
                            </a>

                            <a
                                href="emergency.html"
                                class="btn btn-outline"
                            >
                                Emergency Help
                            </a>

                        </div>

                    </div>
                    `;

                return;

            }


            providers.forEach(
                function (provider) {

                    container.appendChild(
                        createHealthcareCard(
                            provider
                        )
                    );

                }
            );

        }
    );

}


/* =========================================================
   CREATE PROVIDER CARD
   ========================================================= */

function createHealthcareCard(
    provider
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "provider-card";


    const image =
        provider.image
            ? provider.image
            : "";


    const imageHTML =
        image

            ? `
                <img
                    src="${escapeHealthcareHTML(image)}"
                    alt="${escapeHealthcareHTML(
                        provider.fullName ||
                        "Healthcare provider"
                    )}"
                    class="provider-image"
                    loading="lazy"
                >
              `

            : `
                <div
                    class="provider-image"
                    style="
                        display:grid;
                        place-items:center;
                        font-size:3rem;
                    "
                    aria-hidden="true"
                >
                    🩺
                </div>
              `;


    const verificationHTML =
        provider.verified === true

            ? `
                <span class="badge badge-success">
                    ✓ Verified
                </span>
              `

            : `
                <span class="badge badge-neutral">
                    Verification pending
                </span>
              `;


    const licenseHTML =
        provider.licenseVerified === true

            ? `
                <span class="badge badge-info">
                    License checked
                </span>
              `

            : "";


    const phone =
        provider.appointmentPhone ||
        provider.phone ||
        "";


    const callButton =
        phone

            ? `
                <a
                    class="btn btn-secondary btn-small"
                    href="tel:${escapeHealthcareHTML(phone)}"
                >
                    📞 Call
                </a>
              `

            : "";


    const whatsappMessage =
        [
            "Hello VELORA HELP,",
            "",
            "I am interested in this healthcare provider.",
            "",
            `Doctor: ${provider.fullName || ""}`,
            `Speciality: ${provider.specialty || ""}`,
            `Hospital/Clinic: ${provider.hospital || ""}`,
            `Area: ${provider.area || ""}`,
            "",
            "Please guide me regarding an appointment."
        ].join("\n");


    const whatsappButton =
        `
        <button
            type="button"
            class="btn btn-outline btn-small"
            data-whatsapp="${escapeHealthcareHTML(
                whatsappMessage
            )}"
        >
            💬 Appointment Help
        </button>
        `;


    article.innerHTML =
        `
        ${imageHTML}

        <div class="provider-content">

            <div
                style="
                    display:flex;
                    flex-wrap:wrap;
                    gap:6px;
                    margin-bottom:10px;
                "
            >
                ${verificationHTML}
                ${licenseHTML}
            </div>

            <h3>
                ${escapeHealthcareHTML(
                    provider.fullName ||
                    "Healthcare Provider"
                )}
            </h3>

            <div class="provider-meta">

                ${
                    provider.specialty
                        ? escapeHealthcareHTML(
                            provider.specialty
                        )
                        : "Healthcare"
                }

                ${
                    provider.hospital
                        ? " • " +
                          escapeHealthcareHTML(
                              provider.hospital
                          )
                        : ""
                }

            </div>

            ${
                provider.area ||
                provider.taluk

                    ? `
                        <p class="provider-meta">
                            📍
                            ${escapeHealthcareHTML(
                                provider.area || ""
                            )}
                            ${
                                provider.taluk
                                    ? ", " +
                                      escapeHealthcareHTML(
                                          provider.taluk
                                      )
                                    : ""
                            }
                        </p>
                      `

                    : ""
            }


            ${
                provider.consultation

                    ? `
                        <p>
                            <strong>
                                Consultation:
                            </strong>
                            ${escapeHealthcareHTML(
                                provider.consultation
                            )}
                        </p>
                      `

                    : ""
            }


            ${
                provider.timings

                    ? `
                        <p>
                            <strong>
                                Timings:
                            </strong>
                            ${escapeHealthcareHTML(
                                provider.timings
                            )}
                        </p>
                      `

                    : ""
            }


            ${
                provider.status

                    ? `
                        <p style="margin-top:8px;">
                            <span class="badge ${
                                provider.status === "Open"
                                    ? "badge-success"
                                    : "badge-neutral"
                            }">
                                ${escapeHealthcareHTML(
                                    provider.status
                                )}
                            </span>
                        </p>
                      `

                    : ""
            }


            <div class="provider-actions">

                ${callButton}

                ${whatsappButton}

                ${
                    provider.address

                        ? `
                            <a
                                class="btn btn-outline btn-small"
                                href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    provider.address
                                )}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                📍 Directions
                            </a>
                          `

                        : ""
                }

            </div>

        </div>
        `;


    /*
       Activate WhatsApp button created
       dynamically.
    */

    const whatsapp =
        article.querySelector(
            "[data-whatsapp]"
        );


    if (whatsapp) {

        whatsapp.addEventListener(
            "click",
            function () {

                const message =
                    whatsapp.getAttribute(
                        "data-whatsapp"
                    );


                const phone =
                    typeof VELORA_CONFIG !==
                    "undefined"

                        ? VELORA_CONFIG.phone

                        : "918088590273";


                window.open(
                    "https://wa.me/" +
                    phone +
                    "?text=" +
                    encodeURIComponent(
                        message
                    ),
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

    }


    return article;

}


/* =========================================================
   FILTER UI
   ========================================================= */

function initHealthcareFilters() {

    const purposeSelects =
        document.querySelectorAll(
            '[data-healthcare-purpose-options]'
        );


    purposeSelects.forEach(
        function (select) {

            if (
                typeof HEALTHCARE_PURPOSES ===
                "undefined"
            ) {

                return;

            }


            HEALTHCARE_PURPOSES.forEach(
                function (purpose) {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        purpose;

                    option.textContent =
                        purpose;

                    select.appendChild(
                        option
                    );

                }
            );

        }
    );


    const specialtySelects =
        document.querySelectorAll(
            '[data-healthcare-specialty-options]'
        );


    specialtySelects.forEach(
        function (select) {

            if (
                typeof HEALTHCARE_SPECIALTIES ===
                "undefined"
            ) {

                return;

            }


            HEALTHCARE_SPECIALTIES.forEach(
                function (specialty) {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        specialty;

                    option.textContent =
                        specialty;

                    select.appendChild(
                        option
                    );

                }
            );

        }
    );


    const talukSelects =
        document.querySelectorAll(
            '[data-healthcare-taluk-options]'
        );


    talukSelects.forEach(
        function (select) {

            if (
                typeof DAKSHINA_KANNADA_TALUKS ===
                "undefined"
            ) {

                return;

            }


            DAKSHINA_KANNADA_TALUKS.forEach(
                function (taluk) {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        taluk.name;

                    option.textContent =
                        taluk.name;

                    select.appendChild(
                        option
                    );

                }
            );

        }
    );

}


/* =========================================================
   HEALTHCARE ENQUIRY BUTTONS
   ========================================================= */

function initHealthcareEnquiryButtons() {

    document
        .querySelectorAll(
            "[data-healthcare-enquiry]"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    const purpose =
                        button.getAttribute(
                            "data-purpose"
                        ) || "";


                    const taluk =
                        button.getAttribute(
                            "data-taluk"
                        ) || "";


                    const message =
                        [
                            "VELORA HELP — HEALTHCARE REQUEST",
                            "",
                            `Healthcare requirement: ${
                                purpose || "General consultation"
                            }`,
                            taluk
                                ? `Taluk: ${taluk}`
                                : "",
                            "",
                            "Please guide me regarding the suitable healthcare option."
                        ]
                        .filter(Boolean)
                        .join("\n");


                    const phone =
                        typeof VELORA_CONFIG !==
                        "undefined"

                            ? VELORA_CONFIG.phone

                            : "918088590273";


                    window.open(
                        "https://wa.me/" +
                        phone +
                        "?text=" +
                        encodeURIComponent(
                            message
                        ),
                        "_blank",
                        "noopener,noreferrer"
                    );

                }
            );

        });

}


/* =========================================================
   HEALTHCARE LOCATION
   ========================================================= */

function initHealthcareLocation() {

    document
        .querySelectorAll(
            "[data-healthcare-use-location]"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    if (
                        !navigator.geolocation
                    ) {

                        showVeloraMessage(
                            "Location services are not available on this browser.",
                            "error"
                        );

                        return;

                    }


                    const original =
                        button.textContent;


                    button.disabled =
                        true;

                    button.textContent =
                        "Finding you...";


                    navigator.geolocation.getCurrentPosition(

                        function (position) {

                            localStorage.setItem(
                                "velora_user_latitude",
                                position.coords.latitude
                            );

                            localStorage.setItem(
                                "velora_user_longitude",
                                position.coords.longitude
                            );


                            button.disabled =
                                false;

                            button.textContent =
                                "Location detected ✓";


                            showVeloraMessage(
                                "Your location has been detected. Please select your area/taluk for more precise healthcare guidance.",
                                "success"
                            );

                        },

                        function () {

                            button.disabled =
                                false;

                            button.textContent =
                                original;


                            showVeloraMessage(
                                "Location permission was not available. You can select your taluk manually.",
                                "error"
                            );

                        },

                        {
                            enableHighAccuracy:
                                true,

                            timeout:
                                10000,

                            maximumAge:
                                300000
                        }

                    );

                }
            );

        });

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHealthcareHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   HEALTHCARE DIRECTORY STATUS
   ========================================================= */

function getHealthcareDirectoryStatus() {

    const verifiedProviders =
        VELORA_HEALTHCARE_PROVIDERS
            .filter(
                function (provider) {

                    return provider.verified === true;

                }
            );


    return {

        total:
            verifiedProviders.length,

        doctors:
            verifiedProviders.filter(
                function (provider) {

                    return provider.type === "doctor";

                }
            ).length,

        hospitals:
            verifiedProviders.filter(
                function (provider) {

                    return provider.type === "hospital";

                }
            ).length

    };

}


/* =========================================================
   EXPOSE SEARCH FUNCTION
   ========================================================= */

window.veloraHealthcareSearch =
    performHealthcareSearch;


/* =========================================================
   READY
   ========================================================= */

console.log(
    "VELORA HELP healthcare system loaded successfully."
);
