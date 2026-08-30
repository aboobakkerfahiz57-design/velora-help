/* =========================================================
   VELORA HELP
   GOVERNMENT SERVICES JAVASCRIPT
   Your Problem. Our Direction.
   Powered by VELORA DIGITAL

   IMPORTANT:
   Government schemes, eligibility, dates, documents and
   official links must be verified before publishing.
   This file provides the structure for that information.
   ========================================================= */


/* =========================================================
   GOVERNMENT SERVICE DATA
   ========================================================= */

const VELORA_GOVERNMENT_SERVICES = [

    /*
    Example structure:

    {
        id: "scheme-001",

        title: "Official Scheme Name",

        department:
            "Department Name",

        category:
            "Students",

        state:
            "Karnataka",

        description:
            "Official description.",

        whoCanApply:
            "Eligibility information.",

        documents: [
            "Aadhaar",
            "Income Certificate"
        ],

        whereToApply:
            "Official portal / department office",

        officialWebsite:
            "https://official-government-website.example",

        officialContact:
            "Official department contact",

        applicationStatus:
            "Open",

        lastUpdated:
            "To be verified",

        verified:
            true
    }

    */

];


/* =========================================================
   GOVERNMENT CATEGORIES
   ========================================================= */

const VELORA_GOV_CATEGORIES = [

    "Students",

    "Women & Family",

    "Farmers",

    "Workers",

    "Senior Citizens",

    "Healthcare",

    "Housing",

    "Employment",

    "Business",

    "Citizen Services",

    "Disability Support",

    "Education",

    "Other"

];


/* =========================================================
   APPLICATION STATUS
   ========================================================= */

const VELORA_GOV_STATUS = [

    "Open",

    "Closing Soon",

    "Upcoming",

    "Closed",

    "Check Official Source",

    "Information Pending"

];


/* =========================================================
   INITIALISE GOVERNMENT PAGE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initGovernmentSearch();

        initGovernmentFilters();

        initGovernmentEnquiryButtons();

        initGovernmentCategoryButtons();

        renderGovernmentServices();

    }
);


/* =========================================================
   SEARCH FORM
   ========================================================= */

function initGovernmentSearch() {

    document
        .querySelectorAll(
            'form[data-government-search]'
        )
        .forEach(
            function (form) {

                form.addEventListener(
                    "submit",
                    function (event) {

                        event.preventDefault();

                        searchGovernmentServices(
                            form
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "[data-government-search-button]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        searchGovernmentServices();

                    }
                );

            }
        );

}


/* =========================================================
   SEARCH GOVERNMENT SERVICES
   ========================================================= */

function searchGovernmentServices(
    form = null
) {

    let keyword = "";

    let category = "";

    let audience = "";


    if (form) {

        const data =
            new FormData(form);


        keyword =
            String(
                data.get("keyword") ||
                data.get("search") ||
                ""
            ).trim();


        category =
            String(
                data.get("category") ||
                ""
            ).trim();


        audience =
            String(
                data.get("audience") ||
                ""
            ).trim();

    } else {

        const keywordField =
            document.querySelector(
                "[name='keyword'], [name='search']"
            );


        const categoryField =
            document.querySelector(
                "[name='category']"
            );


        const audienceField =
            document.querySelector(
                "[name='audience']"
            );


        keyword =
            keywordField
                ? keywordField.value.trim()
                : "";


        category =
            categoryField
                ? categoryField.value.trim()
                : "";


        audience =
            audienceField
                ? audienceField.value.trim()
                : "";

    }


    const results =
        filterGovernmentServices({

            keyword,

            category,

            audience

        });


    renderGovernmentServices(
        results
    );


    const resultsSection =
        document.querySelector(
            "[data-government-results]"
        );


    if (resultsSection) {

        resultsSection.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });

    }


    if (
        results.length === 0
    ) {

        showVeloraMessage(

            "No verified government service matched your search. You can send your requirement to VELORA HELP for guidance.",

            "info"

        );

    }

}


/* =========================================================
   FILTER GOVERNMENT SERVICES
   ========================================================= */

function filterGovernmentServices(
    filters = {}
) {

    const keyword =
        String(
            filters.keyword || ""
        )
        .trim()
        .toLowerCase();


    const category =
        String(
            filters.category || ""
        )
        .trim()
        .toLowerCase();


    const audience =
        String(
            filters.audience || ""
        )
        .trim()
        .toLowerCase();


    return VELORA_GOVERNMENT_SERVICES
        .filter(
            function (service) {

                /*
                   Only verified information should
                   appear in the public directory.
                */

                if (
                    service.verified !== true
                ) {

                    return false;

                }


                if (
                    category &&
                    String(
                        service.category || ""
                    )
                    .toLowerCase()
                    !== category
                ) {

                    return false;

                }


                if (
                    audience &&
                    !governmentTextMatch(
                        service,
                        audience
                    )
                ) {

                    return false;

                }


                if (
                    keyword &&
                    !governmentTextMatch(
                        service,
                        keyword
                    )
                ) {

                    return false;

                }


                return true;

            }
        )
        .sort(
            function (a, b) {

                return governmentPriority(
                    b
                )
                -
                governmentPriority(
                    a
                );

            }
        );

}


/* =========================================================
   GOVERNMENT TEXT SEARCH
   ========================================================= */

function governmentTextMatch(
    service,
    keyword
) {

    const documents =
        Array.isArray(
            service.documents
        )
            ? service.documents
            : [];


    const text =
        [

            service.title,

            service.department,

            service.category,

            service.description,

            service.whoCanApply,

            service.whereToApply,

            service.applicationStatus,

            ...documents

        ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();


    return text.includes(
        keyword
    );

}


/* =========================================================
   PRIORITY
   ========================================================= */

function governmentPriority(
    service
) {

    let score = 0;


    if (
        service.verified === true
    ) {

        score += 100;

    }


    const status =
        String(
            service.applicationStatus ||
            ""
        )
        .toLowerCase();


    if (
        status === "open"
    ) {

        score += 30;

    }


    if (
        status.includes(
            "closing"
        )
    ) {

        score += 20;

    }


    return score;

}


/* =========================================================
   FILTER DROPDOWNS
   ========================================================= */

function initGovernmentFilters() {

    /*
       Category selector.
    */

    document
        .querySelectorAll(
            "[data-government-category-options]"
        )
        .forEach(
            function (select) {

                VELORA_GOV_CATEGORIES
                    .forEach(
                        function (category) {

                            addGovernmentOption(

                                select,

                                category,

                                category

                            );

                        }
                    );

            }
        );


    /*
       Status selector.
    */

    document
        .querySelectorAll(
            "[data-government-status-options]"
        )
        .forEach(
            function (select) {

                VELORA_GOV_STATUS
                    .forEach(
                        function (status) {

                            addGovernmentOption(

                                select,

                                status,

                                status

                            );

                        }
                    );

            }
        );

}


/* =========================================================
   ADD SELECT OPTION
   ========================================================= */

function addGovernmentOption(
    select,
    value,
    text
) {

    const exists =
        Array.from(
            select.options
        )
        .some(
            function (option) {

                return option.value ===
                    value;

            }
        );


    if (exists) {

        return;

    }


    const option =
        document.createElement(
            "option"
        );


    option.value =
        value;


    option.textContent =
        text;


    select.appendChild(
        option
    );

}


/* =========================================================
   RENDER GOVERNMENT SERVICES
   ========================================================= */

function renderGovernmentServices(
    services =
        VELORA_GOVERNMENT_SERVICES
            .filter(
                function (service) {

                    return service.verified === true;

                }
            )
) {

    document
        .querySelectorAll(
            "[data-government-results]"
        )
        .forEach(
            function (container) {

                container.innerHTML =
                    "";


                if (
                    services.length === 0
                ) {

                    container.innerHTML =

                        `
                        <div class="empty-state">

                            <div class="empty-icon">
                                🏛️
                            </div>

                            <h3>
                                Government information is being verified
                            </h3>

                            <p>
                                We don't currently have a verified
                                listing matching this search.
                                You can send your requirement to
                                VELORA HELP for guidance.
                            </p>

                            <div
                                class="hero-actions"
                                style="justify-content:center;"
                            >

                                <a
                                    href="contact.html"
                                    class="btn btn-primary"
                                >
                                    Get VELORA Guidance
                                </a>

                            </div>

                        </div>
                        `;


                    return;

                }


                services.forEach(
                    function (service) {

                        container.appendChild(

                            createGovernmentCard(
                                service
                            )

                        );

                    }
                );

            }
        );

}


/* =========================================================
   CREATE GOVERNMENT CARD
   ========================================================= */

function createGovernmentCard(
    service
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "provider-card";


    const documents =
        Array.isArray(
            service.documents
        )
            ? service.documents
            : [];


    const status =
        service.applicationStatus ||
        "Check Official Source";


    const statusLower =
        String(
            status
        )
        .toLowerCase();


    let statusClass =
        "badge-neutral";


    if (
        statusLower ===
        "open"
    ) {

        statusClass =
            "badge-success";

    }


    if (
        statusLower.includes(
            "closing"
        )
    ) {

        statusClass =
            "badge-warning";

    }


    if (
        statusLower ===
        "closed"
    ) {

        statusClass =
            "badge-danger";

    }


    const documentsHTML =
        documents.length

            ?

            `
            <div
                style="
                    margin-top:14px;
                "
            >

                <strong>
                    Documents:
                </strong>

                <ul
                    style="
                        margin-top:8px;
                        padding-left:20px;
                    "
                >

                    ${

                        documents
                            .map(
                                function (
                                    documentName
                                ) {

                                    return `

                                        <li>
                                            ${escapeGovernmentHTML(
                                                documentName
                                            )}
                                        </li>

                                    `;

                                }
                            )
                            .join("")

                    }

                </ul>

            </div>
            `

            :

            "";


    const enquiryMessage =

        [

            "VELORA HELP — GOVERNMENT SERVICE ENQUIRY",

            "",

            `Service: ${
                service.title || ""
            }`,

            `Department: ${
                service.department || ""
            }`,

            `Category: ${
                service.category || ""
            }`,

            "",

            "I need guidance regarding this government service.",

            "Please help me understand eligibility, documents and where to apply."

        ]
        .filter(Boolean)
        .join("\n");


    card.innerHTML =

        `

        <div class="provider-content">

            <div
                style="
                    display:flex;
                    flex-wrap:wrap;
                    gap:7px;
                "
            >

                <span class="badge badge-success">

                    ✓ Verified Information

                </span>


                <span class="badge ${statusClass}">

                    ${escapeGovernmentHTML(
                        status
                    )}

                </span>

            </div>


            <h3
                style="
                    margin-top:12px;
                "
            >

                ${escapeGovernmentHTML(
                    service.title ||
                    "Government Service"
                )}

            </h3>


            ${
                service.department

                    ?

                    `
                    <p
                        class="provider-meta"
                    >

                        🏛️

                        <strong>
                            Department:
                        </strong>

                        ${escapeGovernmentHTML(
                            service.department
                        )}

                    </p>
                    `

                    :

                    ""
            }


            ${
                service.category

                    ?

                    `
                    <p>

                        <strong>
                            Category:
                        </strong>

                        ${escapeGovernmentHTML(
                            service.category
                        )}

                    </p>
                    `

                    :

                    ""
            }


            ${
                service.description

                    ?

                    `
                    <p>

                        ${escapeGovernmentHTML(
                            service.description
                        )}

                    </p>
                    `

                    :

                    ""
            }


            ${
                service.whoCanApply

                    ?

                    `
                    <div
                        style="
                            margin-top:12px;
                        "
                    >

                        <strong>
                            Who can apply?
                        </strong>

                        <p>
                            ${escapeGovernmentHTML(
                                service.whoCanApply
                            )}
                        </p>

                    </div>
                    `

                    :

                    ""
            }


            ${
                service.whereToApply

                    ?

                    `
                    <div
                        style="
                            margin-top:12px;
                        "
                    >

                        <strong>
                            Where to apply?
                        </strong>

                        <p>
                            ${escapeGovernmentHTML(
                                service.whereToApply
                            )}
                        </p>

                    </div>
                    `

                    :

                    ""
            }


            ${documentsHTML}


            ${
                service.lastUpdated

                    ?

                    `
                    <p
                        class="provider-meta"
                        style="
                            margin-top:12px;
                        "
                    >

                        Last verified:
                        ${escapeGovernmentHTML(
                            service.lastUpdated
                        )}

                    </p>
                    `

                    :

                    ""
            }


            <div
                class="provider-actions"
                style="
                    display:flex;
                    flex-wrap:wrap;
                    gap:8px;
                    margin-top:18px;
                "
            >

                <button
                    type="button"
                    class="btn btn-primary btn-small"
                    data-government-enquiry
                >

                    🏛️ Get Guidance

                </button>


                ${
                    service.officialWebsite

                        ?

                        `
                        <a
                            href="${escapeGovernmentHTML(
                                service.officialWebsite
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="btn btn-outline btn-small"
                        >

                            Official Website

                        </a>
                        `

                        :

                        ""
                }


                ${
                    service.officialContact

                        ?

                        `
                        <a
                            href="tel:${escapeGovernmentHTML(
                                service.officialContact
                            )}"
                            class="btn btn-secondary btn-small"
                        >

                            📞 Official Contact

                        </a>
                        `

                        :

                        ""
                }

            </div>

        </div>

        `;


    const enquiryButton =
        card.querySelector(
            "[data-government-enquiry]"
        );


    if (enquiryButton) {

        enquiryButton.addEventListener(
            "click",
            function () {

                sendGovernmentWhatsApp(
                    enquiryMessage
                );

            }
        );

    }


    return card;

}


/* =========================================================
   CATEGORY BUTTONS
   ========================================================= */

function initGovernmentCategoryButtons() {

    document
        .querySelectorAll(
            "[data-government-category]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const category =
                            button.getAttribute(
                                "data-government-category"
                            ) || "";


                        const results =
                            filterGovernmentServices({

                                category

                            });


                        renderGovernmentServices(
                            results
                        );


                        const resultsSection =
                            document.querySelector(
                                "[data-government-results]"
                            );


                        if (
                            resultsSection
                        ) {

                            resultsSection.scrollIntoView({

                                behavior:
                                    "smooth",

                                block:
                                    "start"

                            });

                        }


                        if (
                            results.length === 0
                        ) {

                            showVeloraMessage(

                                "No verified information is currently listed under this category. Send your requirement to VELORA HELP for guidance.",

                                "info"

                            );

                        }

                    }
                );

            }
        );

}


/* =========================================================
   GOVERNMENT ENQUIRY BUTTONS
   ========================================================= */

function initGovernmentEnquiryButtons() {

    document
        .querySelectorAll(
            "[data-government-help]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();


                        const category =
                            button.getAttribute(
                                "data-category"
                            ) || "Government Service";


                        const requirement =
                            button.getAttribute(
                                "data-requirement"
                            ) || "";


                        const message =

                            [

                                "VELORA HELP — GOVERNMENT GUIDANCE",

                                "",

                                `Category: ${category}`,

                                requirement
                                    ? `Requirement: ${requirement}`
                                    : "",

                                "",

                                "Please guide me about the eligibility, documents, application process, official website and official contact."

                            ]
                            .filter(Boolean)
                            .join("\n");


                        sendGovernmentWhatsApp(
                            message
                        );

                    }
                );

            }
        );

}


/* =========================================================
   SEND GOVERNMENT WHATSAPP
   ========================================================= */

function sendGovernmentWhatsApp(
    message
) {

    const phone =

        typeof VELORA_CONFIG !==
        "undefined"

            ?

            VELORA_CONFIG.phone

            :

            "918088590273";


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
   GENERAL GOVERNMENT HELP
   ========================================================= */

function openGovernmentHelp() {

    sendGovernmentWhatsApp(

        [

            "VELORA HELP — GOVERNMENT SERVICES",

            "",

            "Hello VELORA HELP,",

            "",

            "I need help with a government service or scheme.",

            "",

            "Please guide me regarding:",

            "1. Who can apply",

            "2. Documents required",

            "3. Where to apply",

            "4. Official website",

            "5. Official contact",

            "6. Next steps"

        ].join("\n")

    );

}


/* =========================================================
   SCHEME DETAIL HELP
   ========================================================= */

function requestSchemeGuidance(
    scheme
) {

    scheme =
        scheme || {};


    const message =

        [

            "VELORA HELP — SCHEME GUIDANCE",

            "",

            `Scheme: ${
                scheme.title || ""
            }`,

            scheme.category
                ? `Category: ${scheme.category}`
                : "",

            scheme.department
                ? `Department: ${scheme.department}`
                : "",

            "",

            "I need guidance about this scheme.",

            "Please confirm eligibility, documents, application process and official source."

        ]
        .filter(Boolean)
        .join("\n");


    sendGovernmentWhatsApp(
        message
    );

}


/* =========================================================
   GOVERNMENT SERVICE COUNT
   ========================================================= */

function getGovernmentServiceStats() {

    const verified =
        VELORA_GOVERNMENT_SERVICES
            .filter(
                function (service) {

                    return service.verified === true;

                }
            );


    return {

        total:
            verified.length,

        open:
            verified.filter(
                function (service) {

                    return String(
                        service.applicationStatus ||
                        ""
                    )
                    .toLowerCase()
                    ===
                    "open";

                }
            ).length,

        students:
            verified.filter(
                function (service) {

                    return String(
                        service.category ||
                        ""
                    )
                    .toLowerCase()
                    ===
                    "students";

                }
            ).length

    };

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeGovernmentHTML(
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
   PUBLIC FUNCTIONS
   ========================================================= */

window.veloraGovernmentSearch =
    searchGovernmentServices;


window.veloraGovernmentHelp =
    openGovernmentHelp;


window.veloraSchemeGuidance =
    requestSchemeGuidance;


/* =========================================================
   READY
   ========================================================= */

console.log(
    "VELORA HELP government services system loaded successfully."
);
