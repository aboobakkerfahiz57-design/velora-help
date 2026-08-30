/* =========================================================
   VELORA HELP
   MAIN JAVASCRIPT
   Your Problem. Our Direction.
   Powered by VELORA DIGITAL
   ========================================================= */


/* =========================================================
   WAIT FOR PAGE
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initMobileMenu();
    initActiveNavigation();
    initWhatsAppButtons();
    initCallButtons();
    initEmailButtons();
    initBackToTop();
    initRevealAnimations();
    initCurrentYear();
    initSearch();
    initLocationButton();
    initModalSystem();
    initUniversalLinks();
    initFormEnhancements();

});


/* =========================================================
   MOBILE MENU
   ========================================================= */

function initMobileMenu() {

    const menuToggle =
        document.querySelector(
            ".menu-toggle"
        );

    const nav =
        document.querySelector(
            ".nav-links"
        );

    if (!menuToggle || !nav) {
        return;
    }

    menuToggle.addEventListener(
        "click",
        function () {

            nav.classList.toggle("open");

            const isOpen =
                nav.classList.contains("open");

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );
        }
    );


    /* Close menu when a navigation link is clicked */

    nav.querySelectorAll("a").forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    nav.classList.remove(
                        "open"
                    );

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }
            );

        }
    );


    /* Close menu when clicking outside */

    document.addEventListener(
        "click",
        function (event) {

            if (
                !nav.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {

                nav.classList.remove(
                    "open"
                );

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

        }
    );

}


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

function initActiveNavigation() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase() || "index.html";

    document
        .querySelectorAll(".nav-links a")
        .forEach(function (link) {

            const href =
                link.getAttribute("href");

            if (!href) {
                return;
            }

            const linkPage =
                href.split("#")[0]
                    .split("?")[0]
                    .split("/")
                    .pop()
                    .toLowerCase();

            if (
                linkPage === currentPage
            ) {

                link.classList.add(
                    "active"
                );

                link.setAttribute(
                    "aria-current",
                    "page"
                );
            }

        });

}


/* =========================================================
   WHATSAPP
   ========================================================= */

function initWhatsAppButtons() {

    document
        .querySelectorAll(
            "[data-whatsapp]"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    let message =
                        button.getAttribute(
                            "data-whatsapp"
                        );

                    if (
                        !message ||
                        message.trim() === ""
                    ) {

                        message =
                            "Hello VELORA HELP, I need assistance. Please guide me.";

                    }

                    const phone =
                        typeof VELORA_CONFIG !==
                        "undefined"
                            ? VELORA_CONFIG.phone
                            : "918088590273";

                    const url =
                        "https://wa.me/" +
                        phone +
                        "?text=" +
                        encodeURIComponent(
                            message
                        );

                    window.open(
                        url,
                        "_blank",
                        "noopener,noreferrer"
                    );

                }
            );

        });


    /*
       Automatically support links/buttons
       with class "whatsapp-button".
    */

    document
        .querySelectorAll(
            ".whatsapp-button"
        )
        .forEach(function (button) {

            if (
                button.hasAttribute(
                    "data-whatsapp"
                )
            ) {
                return;
            }

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const message =
                        "Hello VELORA HELP, I need assistance. Please guide me.";

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
   CALL BUTTONS
   ========================================================= */

function initCallButtons() {

    document
        .querySelectorAll(
            "[data-call], .call-button"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    /*
                       Only prevent default for
                       non-link/button elements.
                    */

                    if (
                        button.tagName !== "A"
                    ) {
                        event.preventDefault();
                    }

                    const phone =
                        typeof VELORA_CONFIG !==
                        "undefined"
                            ? VELORA_CONFIG.phone
                            : "918088590273";

                    window.location.href =
                        "tel:+" + phone;

                }
            );

        });

}


/* =========================================================
   EMAIL BUTTONS
   ========================================================= */

function initEmailButtons() {

    document
        .querySelectorAll(
            "[data-email], .email-button"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    if (
                        button.tagName !== "A"
                    ) {
                        event.preventDefault();
                    }

                    const email =
                        typeof VELORA_CONFIG !==
                        "undefined"
                            ? VELORA_CONFIG.email
                            : "veloradigital.co.in@gmail.com";

                    window.location.href =
                        "mailto:" + email;

                }
            );

        });

}


/* =========================================================
   FLOATING WHATSAPP BUTTON
   ========================================================= */

function createFloatingWhatsApp() {

    if (
        document.querySelector(
            ".whatsapp-float"
        )
    ) {
        return;
    }

    const button =
        document.createElement("a");

    button.className =
        "whatsapp-float";

    button.href =
        "https://wa.me/918088590273?text=" +
        encodeURIComponent(
            "Hello VELORA HELP, I need assistance. Please guide me."
        );

    button.target = "_blank";

    button.rel =
        "noopener noreferrer";

    button.setAttribute(
        "aria-label",
        "Contact VELORA HELP on WhatsApp"
    );

    button.innerHTML = "💬";

    document.body.appendChild(
        button
    );

}


/* =========================================================
   BACK TO TOP
   ========================================================= */

function initBackToTop() {

    let button =
        document.querySelector(
            ".back-to-top"
        );

    if (!button) {

        button =
            document.createElement(
                "button"
            );

        button.className =
            "back-to-top";

        button.type = "button";

        button.setAttribute(
            "aria-label",
            "Back to top"
        );

        button.innerHTML = "↑";

        document.body.appendChild(
            button
        );
    }


    window.addEventListener(
        "scroll",
        function () {

            if (
                window.scrollY > 450
            ) {

                button.classList.add(
                    "show"
                );

            } else {

                button.classList.remove(
                    "show"
                );

            }

        }
    );


    button.addEventListener(
        "click",
        function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

function initRevealAnimations() {

    const elements =
        document.querySelectorAll(
            ".reveal"
        );

    if (
        elements.length === 0
    ) {
        return;
    }


    /*
       If browser doesn't support
       IntersectionObserver, simply
       display everything.
    */

    if (
        !("IntersectionObserver" in window)
    ) {

        elements.forEach(
            function (element) {

                element.classList.add(
                    "visible"
                );

            }
        );

        return;
    }


    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );
                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(
        function (element) {

            observer.observe(
                element
            );

        }
    );

}


/* =========================================================
   CURRENT YEAR
   ========================================================= */

function initCurrentYear() {

    const year =
        new Date().getFullYear();

    document
        .querySelectorAll(
            "[data-current-year]"
        )
        .forEach(function (element) {

            element.textContent =
                year;

        });

}


/* =========================================================
   SEARCH
   ========================================================= */

function initSearch() {

    const searchInputs =
        document.querySelectorAll(
            "[data-velora-search]"
        );

    searchInputs.forEach(
        function (input) {

            input.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        performVeloraSearch(
                            input.value
                        );

                    }

                }
            );

        }
    );


    document
        .querySelectorAll(
            "[data-search-button]"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const targetId =
                        button.getAttribute(
                            "data-search-button"
                        );

                    let input;

                    if (targetId) {

                        input =
                            document.getElementById(
                                targetId
                            );

                    }

                    if (!input) {

                        input =
                            document.querySelector(
                                "[data-velora-search]"
                            );

                    }

                    if (input) {

                        performVeloraSearch(
                            input.value
                        );

                    }

                }
            );

        });

}


function performVeloraSearch(
    query
) {

    const cleanQuery =
        String(query || "")
            .trim();


    if (!cleanQuery) {

        showVeloraMessage(
            "Please enter what you need help with."
        );

        return;
    }


    /*
       Send the user to the most
       relevant section when possible.
    */

    const lower =
        cleanQuery.toLowerCase();


    if (
        lower.includes("doctor") ||
        lower.includes("hospital") ||
        lower.includes("fever") ||
        lower.includes("health")
    ) {

        window.location.href =
            "healthcare.html";

        return;
    }


    if (
        lower.includes("admission") ||
        lower.includes("college") ||
        lower.includes("puc") ||
        lower.includes("degree")
    ) {

        window.location.href =
            "admissions.html";

        return;
    }


    if (
        lower.includes("scholarship") ||
        lower.includes("student")
    ) {

        window.location.href =
            "scholarships.html";

        return;
    }


    if (
        lower.includes("job") ||
        lower.includes("work") ||
        lower.includes("employment")
    ) {

        window.location.href =
            "jobs.html";

        return;
    }


    if (
        lower.includes("house") ||
        lower.includes("rent") ||
        lower.includes("property")
    ) {

        window.location.href =
            "property.html";

        return;
    }


    if (
        lower.includes("government") ||
        lower.includes("scheme") ||
        lower.includes("certificate")
    ) {

        window.location.href =
            "government.html";

        return;
    }


    if (
        lower.includes("plumber") ||
        lower.includes("electrician") ||
        lower.includes("mechanic") ||
        lower.includes("repair")
    ) {

        window.location.href =
            "local-services.html";

        return;
    }


    /*
       If the search doesn't match
       a known category, open the
       general contact page.
    */

    window.location.href =
        "contact.html?query=" +
        encodeURIComponent(
            cleanQuery
        );

}


/* =========================================================
   LOCATION
   ========================================================= */

function initLocationButton() {

    document
        .querySelectorAll(
            "[data-use-location]"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    if (
                        !navigator.geolocation
                    ) {

                        showVeloraMessage(
                            "Location services are not supported by this browser."
                        );

                        return;
                    }


                    button.disabled = true;

                    const originalText =
                        button.textContent;

                    button.textContent =
                        "Finding location...";


                    navigator.geolocation.getCurrentPosition(

                        function (position) {

                            const latitude =
                                position.coords.latitude;

                            const longitude =
                                position.coords.longitude;


                            localStorage.setItem(
                                "velora_user_latitude",
                                latitude
                            );

                            localStorage.setItem(
                                "velora_user_longitude",
                                longitude
                            );


                            button.disabled =
                                false;

                            button.textContent =
                                "Location found ✓";


                            showVeloraMessage(
                                "Your location was detected. VELORA HELP can use it for location-based guidance."
                            );

                        },

                        function () {

                            button.disabled =
                                false;

                            button.textContent =
                                originalText;

                            showVeloraMessage(
                                "We couldn't access your location. Please allow location permission and try again."
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
   MODAL SYSTEM
   ========================================================= */

function initModalSystem() {

    document
        .querySelectorAll(
            "[data-modal-open]"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const id =
                        button.getAttribute(
                            "data-modal-open"
                        );

                    const modal =
                        document.getElementById(
                            id
                        );

                    if (modal) {

                        modal.classList.add(
                            "show"
                        );

                        document.body.style.overflow =
                            "hidden";

                    }

                }
            );

        });


    document
        .querySelectorAll(
            "[data-modal-close]"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    closeVeloraModal(
                        button.closest(
                            ".modal"
                        )
                    );

                }
            );

        });


    document
        .querySelectorAll(
            ".modal"
        )
        .forEach(function (modal) {

            modal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target === modal
                    ) {

                        closeVeloraModal(
                            modal
                        );

                    }

                }
            );

        });


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !== "Escape"
            ) {
                return;
            }

            document
                .querySelectorAll(
                    ".modal.show"
                )
                .forEach(function (modal) {

                    closeVeloraModal(
                        modal
                    );

                });

        }
    );

}


function closeVeloraModal(
    modal
) {

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "show"
    );

    document.body.style.overflow =
        "";

}


/* =========================================================
   UNIVERSAL INTERNAL LINK HANDLING
   ========================================================= */

function initUniversalLinks() {

    document
        .querySelectorAll(
            "[data-page]"
        )
        .forEach(function (element) {

            element.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const page =
                        element.getAttribute(
                            "data-page"
                        );

                    if (page) {

                        window.location.href =
                            page;

                    }

                }
            );

        });

}


/* =========================================================
   FORM ENHANCEMENTS
   ========================================================= */

function initFormEnhancements() {

    /*
       Add basic HTML5 validation behaviour
       to forms that use novalidate.
    */

    document
        .querySelectorAll(
            "form[data-velora-form]"
        )
        .forEach(function (form) {

            form.addEventListener(
                "submit",
                function (event) {

                    const requiredFields =
                        form.querySelectorAll(
                            "[required]"
                        );

                    let valid = true;


                    requiredFields.forEach(
                        function (field) {

                            if (
                                !field.value.trim()
                            ) {

                                valid = false;

                                field.focus();

                                field.style.borderColor =
                                    "#b42318";

                            } else {

                                field.style.borderColor =
                                    "";

                            }

                        }
                    );


                    if (!valid) {

                        event.preventDefault();

                        showVeloraMessage(
                            "Please complete all required fields."
                        );

                    }

                }
            );

        });

}


/* =========================================================
   MESSAGE SYSTEM
   ========================================================= */

function showVeloraMessage(
    message,
    type = "info"
) {

    let box =
        document.querySelector(
            ".velora-toast"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );

        box.className =
            "velora-toast";

        box.setAttribute(
            "role",
            "status"
        );

        document.body.appendChild(
            box
        );


        /*
           Toast styling is included here
           so it works even before the
           stylesheet is updated.
        */

        Object.assign(
            box.style,
            {
                position: "fixed",
                left: "50%",
                bottom: "25px",
                transform:
                    "translateX(-50%) translateY(20px)",
                zIndex: "5000",
                maxWidth: "min(90%, 600px)",
                padding:
                    "13px 18px",
                borderRadius:
                    "10px",
                background:
                    "#0b2a4a",
                color:
                    "#ffffff",
                boxShadow:
                    "0 12px 30px rgba(0,0,0,.2)",
                opacity: "0",
                transition:
                    "all .25s ease",
                fontSize:
                    ".9rem",
                fontWeight:
                    "600",
                textAlign:
                    "center"
            }
        );

    }


    if (type === "success") {

        box.style.background =
            "#16834b";

    } else if (
        type === "error"
    ) {

        box.style.background =
            "#b42318";

    } else {

        box.style.background =
            "#0b2a4a";

    }


    box.textContent =
        message;


    requestAnimationFrame(
        function () {

            box.style.opacity =
                "1";

            box.style.transform =
                "translateX(-50%) translateY(0)";

        }
    );


    clearTimeout(
        box._veloraTimer
    );


    box._veloraTimer =
        setTimeout(
            function () {

                box.style.opacity =
                    "0";

                box.style.transform =
                    "translateX(-50%) translateY(20px)";

            },
            4500
        );

}


/* =========================================================
   SAVE ENQUIRY LOCALLY
   ---------------------------------------------------------
   Temporary FREE MVP storage.
   Later PHP/database will replace this.
   ========================================================= */

function saveVeloraEnquiry(
    enquiry
) {

    if (!enquiry) {
        return false;
    }


    const key =
        "velora_enquiries";


    let enquiries = [];


    try {

        const stored =
            localStorage.getItem(
                key
            );

        if (stored) {

            enquiries =
                JSON.parse(
                    stored
                );

            if (
                !Array.isArray(
                    enquiries
                )
            ) {

                enquiries = [];

            }

        }

    } catch (error) {

        enquiries = [];

    }


    const record = {

        id:
            typeof generateVeloraProblemId ===
            "function"

                ? generateVeloraProblemId()

                : "VH-" +
                  Date.now(),

        createdAt:
            new Date().toISOString(),

        ...enquiry

    };


    enquiries.push(
        record
    );


    try {

        localStorage.setItem(
            key,
            JSON.stringify(
                enquiries
            )
        );

        return record;

    } catch (error) {

        console.error(
            "Unable to save VELORA enquiry:",
            error
        );

        return false;
    }

}


/* =========================================================
   GET SAVED ENQUIRIES
   ========================================================= */

function getVeloraEnquiries() {

    try {

        const stored =
            localStorage.getItem(
                "velora_enquiries"
            );

        if (!stored) {
            return [];
        }

        const enquiries =
            JSON.parse(
                stored
            );

        return Array.isArray(
            enquiries
        )
            ? enquiries
            : [];

    } catch (error) {

        return [];

    }

}


/* =========================================================
   WHATSAPP ENQUIRY BUILDER
   ========================================================= */

function sendVeloraEnquiryToWhatsApp(
    enquiry
) {

    enquiry =
        enquiry || {};


    const lines = [

        "VELORA HELP ENQUIRY",

        "-------------------------",

        enquiry.name
            ? `Name: ${enquiry.name}`
            : "",

        enquiry.phone
            ? `Phone: ${enquiry.phone}`
            : "",

        enquiry.location
            ? `Location: ${enquiry.location}`
            : "",

        enquiry.taluk
            ? `Taluk: ${enquiry.taluk}`
            : "",

        enquiry.category
            ? `Category: ${enquiry.category}`
            : "",

        enquiry.subject
            ? `Subject: ${enquiry.subject}`
            : "",

        enquiry.problem
            ? `Problem: ${enquiry.problem}`
            : "",

        enquiry.description
            ? `Description: ${enquiry.description}`
            : "",

        enquiry.details
            ? `Details: ${enquiry.details}`
            : "",

        "",

        "Please guide me regarding this enquiry."

    ];


    const message =
        lines
            .filter(Boolean)
            .join("\n");


    const phone =
        typeof VELORA_CONFIG !==
        "undefined"

            ? VELORA_CONFIG.phone

            : "918088590273";


    const url =
        "https://wa.me/" +
        phone +
        "?text=" +
        encodeURIComponent(
            message
        );


    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
   GENERAL PAGE HELPER
   ========================================================= */

function goToVeloraPage(
    page
) {

    if (!page) {
        return;
    }

    window.location.href =
        page;

}


/* =========================================================
   SCROLL TO ELEMENT
   ========================================================= */

function scrollToVeloraElement(
    selector
) {

    const element =
        document.querySelector(
            selector
        );

    if (!element) {
        return;
    }

    element.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================================
   INITIALISE FLOATING WHATSAPP
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        createFloatingWhatsApp();

    }
);


/* =========================================================
   CONSOLE INFORMATION
   ========================================================= */

console.log(
    "%cVELORA HELP",
    "font-size:24px;font-weight:900;color:#0b2a4a;"
);

console.log(
    "Your Problem. Our Direction."
);

console.log(
    "Powered by VELORA DIGITAL"
);

console.log(
    "Main JavaScript loaded successfully."
);
