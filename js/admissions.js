/* =========================================================
   VELORA HELP
   ADMISSIONS JAVASCRIPT
   PUC + DEGREE + PROFESSIONAL COURSES
   Dakshina Kannada Admission Assistance
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initAdmissionSearch();
    initAdmissionFilters();
    initAdmissionEnquiryButtons();
    initAdmissionCards();

});


/* =========================================================
   ADMISSION DATA
   ---------------------------------------------------------
   Add verified college/course information here later.
   Do NOT publish unverified admission dates or fees.
   ========================================================= */

const VELORA_ADMISSIONS = [

    /*
    Example:

    {
        id: "college-001",

        college:
            "College Name",

        location:
            "Mangaluru",

        taluk:
            "Mangaluru",

        type:
            "PUC",

        courses: [
            "Science",
            "Commerce",
            "Arts"
        ],

        admissionStatus:
            "Open",

        lastDate:
            "To be updated",

        officialWebsite:
            "https://example.com",

        officialPhone:
            "+91XXXXXXXXXX",

        verified:
            true
    }
    */

];


/* =========================================================
   COURSE CATEGORIES
   ========================================================= */

const VELORA_ADMISSION_LEVELS = [

    "1st PUC",

    "2nd PUC",

    "1st Year Degree",

    "2nd Year Degree",

    "3rd Year Degree",

    "Professional Course",

    "Diploma",

    "ITI",

    "Other"

];


const VELORA_DEGREE_STREAMS = [

    "BA",

    "BCom",

    "BBA",

    "BCA",

    "BSc",

    "BBM",

    "BSW",

    "B.Voc",

    "BE / BTech",

    "B.Pharm",

    "BPT",

    "B.Ed",

    "LLB",

    "Other"

];


/* =========================================================
   SEARCH
   ========================================================= */

function initAdmissionSearch() {

    document
        .querySelectorAll(
            'form[data-admission-search]'
        )
        .forEach(function (form) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    searchAdmissions(form);

                }
            );

        });


    document
        .querySelectorAll(
            "[data-admission-search-button]"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    searchAdmissions();

                }
            );

        });

}


/* =========================================================
   SEARCH ADMISSIONS
   ========================================================= */

function searchAdmissions(
    form = null
) {

    let level = "";
    let stream = "";
    let course = "";
    let taluk = "";
    let location = "";


    if (form) {

        const data =
            new FormData(form);


        level =
            String(
                data.get("educationLevel") ||
                data.get("level") ||
                ""
            ).trim();


        stream =
            String(
                data.get("stream") ||
                ""
            ).trim();


        course =
            String(
                data.get("course") ||
                ""
            ).trim();


        taluk =
            String(
                data.get("taluk") ||
                ""
            ).trim();


        location =
            String(
                data.get("location") ||
                data.get("area") ||
                ""
            ).trim();

    } else {

        const levelField =
            document.querySelector(
                "[name='educationLevel'], [name='level']"
            );

        const streamField =
            document.querySelector(
                "[name='stream']"
            );

        const courseField =
            document.querySelector(
                "[name='course']"
            );

        const talukField =
            document.querySelector(
                "[name='taluk']"
            );

        const locationField =
            document.querySelector(
                "[name='location'], [name='area']"
            );


        level =
            levelField
                ? levelField.value.trim()
                : "";


        stream =
            streamField
                ? streamField.value.trim()
                : "";


        course =
            courseField
                ? courseField.value.trim()
                : "";


        taluk =
            talukField
                ? talukField.value.trim()
                : "";


        location =
            locationField
                ? locationField.value.trim()
                : "";

    }


    const results =
        filterAdmissions({
            level,
            stream,
            course,
            taluk,
            location
        });


    renderAdmissions(
        results
    );


    const resultsSection =
        document.querySelector(
            "[data-admission-results]"
        );


    if (resultsSection) {

        resultsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    if (
        results.length === 0
    ) {

        showVeloraMessage(
            "No verified admission listing matched your search. You can send your admission requirement to VELORA HELP for guidance.",
            "info"
        );

    }

}


/* =========================================================
   FILTER ADMISSIONS
   ========================================================= */

function filterAdmissions(
    filters = {}
) {

    const level =
        String(
            filters.level || ""
        )
        .trim()
        .toLowerCase();


    const stream =
        String(
            filters.stream || ""
        )
        .trim()
        .toLowerCase();


    const course =
        String(
            filters.course || ""
        )
        .trim()
        .toLowerCase();


    const taluk =
        String(
            filters.taluk || ""
        )
        .trim()
        .toLowerCase();


    const location =
        String(
            filters.location || ""
        )
        .trim()
        .toLowerCase();


    return VELORA_ADMISSIONS
        .filter(function (college) {

            if (
                college.verified !== true
            ) {

                return false;

            }


            if (
                level &&
                !admissionMatchesLevel(
                    college,
                    level
                )
            ) {

                return false;

            }


            if (
                stream &&
                !admissionMatchesText(
                    college,
                    stream
                )
            ) {

                return false;

            }


            if (
                course &&
                !admissionMatchesText(
                    college,
                    course
                )
            ) {

                return false;

            }


            if (
                taluk &&
                String(
                    college.taluk || ""
                )
                .toLowerCase()
                .includes(taluk) === false
            ) {

                return false;

            }


            if (
                location &&
                String(
                    college.location || ""
                )
                .toLowerCase()
                .includes(location) === false
            ) {

                return false;

            }


            return true;

        })
        .sort(function (a, b) {

            /*
               Open admissions first.
            */

            const aOpen =
                String(
                    a.admissionStatus || ""
                ).toLowerCase() === "open";

            const bOpen =
                String(
                    b.admissionStatus || ""
                ).toLowerCase() === "open";


            if (
                aOpen &&
                !bOpen
            ) {
                return -1;
            }


            if (
                !aOpen &&
                bOpen
            ) {
                return 1;
            }


            return 0;

        });

}


/* =========================================================
   LEVEL MATCHING
   ========================================================= */

function admissionMatchesLevel(
    college,
    level
) {

    const collegeType =
        String(
            college.type || ""
        ).toLowerCase();


    const collegeCourses =
        Array.isArray(
            college.courses
        )
            ? college.courses
            : [];


    const allText =
        [
            collegeType,
            ...collegeCourses
        ]
        .join(" ")
        .toLowerCase();


    return allText.includes(
        level
    );

}


/* =========================================================
   GENERAL TEXT MATCHING
   ========================================================= */

function admissionMatchesText(
    college,
    search
) {

    const courses =
        Array.isArray(
            college.courses
        )
            ? college.courses
            : [];


    const text =
        [
            college.college,
            college.location,
            college.taluk,
            college.type,
            ...courses
        ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();


    return text.includes(
        search
    );

}


/* =========================================================
   FILTER OPTIONS
   ========================================================= */

function initAdmissionFilters() {

    /*
       Education levels.
    */

    document
        .querySelectorAll(
            "[data-admission-level-options]"
        )
        .forEach(function (select) {

            VELORA_ADMISSION_LEVELS
                .forEach(function (level) {

                    addSelectOption(
                        select,
                        level,
                        level
                    );

                });

        });


    /*
       Degree streams.
    */

    document
        .querySelectorAll(
            "[data-admission-stream-options]"
        )
        .forEach(function (select) {

            VELORA_DEGREE_STREAMS
                .forEach(function (stream) {

                    addSelectOption(
                        select,
                        stream,
                        stream
                    );

                });

        });


    /*
       Dakshina Kannada taluks from data.js,
       if available.
    */

    document
        .querySelectorAll(
            "[data-admission-taluk-options]"
        )
        .forEach(function (select) {

            if (
                typeof DAKSHINA_KANNADA_TALUKS ===
                "undefined"
            ) {

                return;

            }


            DAKSHINA_KANNADA_TALUKS
                .forEach(function (taluk) {

                    if (
                        typeof taluk ===
                        "string"
                    ) {

                        addSelectOption(
                            select,
                            taluk,
                            taluk
                        );

                    } else {

                        addSelectOption(
                            select,
                            taluk.name,
                            taluk.name
                        );

                    }

                });

        });

}


/* =========================================================
   SELECT OPTION HELPER
   ========================================================= */

function addSelectOption(
    select,
    value,
    text
) {

    /*
       Avoid duplicate options.
    */

    const existing =
        Array.from(
            select.options
        )
        .some(function (option) {

            return option.value ===
                value;

        });


    if (existing) {
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
   RENDER ADMISSIONS
   ========================================================= */

function renderAdmissions(
    results =
        VELORA_ADMISSIONS.filter(
            function (college) {

                return college.verified === true;

            }
        )
) {

    document
        .querySelectorAll(
            "[data-admission-results]"
        )
        .forEach(function (container) {

            container.innerHTML = "";


            if (
                results.length === 0
            ) {

                container.innerHTML =
                    `
                    <div class="empty-state">

                        <div class="empty-icon">
                            🎓
                        </div>

                        <h3>
                            No verified admission listing found
                        </h3>

                        <p>
                            VELORA HELP can receive your
                            admission requirement and guide
                            you toward available information.
                        </p>

                        <div class="hero-actions"
                             style="justify-content:center;">

                            <a
                                href="contact.html"
                                class="btn btn-primary"
                            >
                                Get Admission Guidance
                            </a>

                        </div>

                    </div>
                    `;

                return;

            }


            results.forEach(
                function (college) {

                    container.appendChild(
                        createAdmissionCard(
                            college
                        )
                    );

                }
            );

        });

}


/* =========================================================
   ADMISSION CARD
   ========================================================= */

function createAdmissionCard(
    college
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "provider-card";


    const courses =
        Array.isArray(
            college.courses
        )
            ? college.courses
            : [];


    const courseHTML =
        courses.length

            ? `
                <div
                    style="
                        display:flex;
                        flex-wrap:wrap;
                        gap:6px;
                        margin:10px 0;
                    "
                >

                    ${courses.map(
                        function (course) {

                            return `
                                <span class="badge badge-info">
                                    ${escapeAdmissionHTML(
                                        course
                                    )}
                                </span>
                            `;

                        }
                    ).join("")}

                </div>
              `

            : "";


    const status =
        String(
            college.admissionStatus ||
            "Information pending"
        );


    const statusClass =
        status.toLowerCase()
            .includes("open")

            ? "badge-success"

            : "badge-neutral";


    const enquiryMessage =
        [
            "VELORA HELP — ADMISSION ENQUIRY",
            "",
            `College: ${
                college.college || ""
            }`,
            `Location: ${
                college.location || ""
            }`,
            `Taluk: ${
                college.taluk || ""
            }`,
            `Type: ${
                college.type || ""
            }`,
            `Courses: ${
                courses.join(", ")
            }`,
            "",
            "I want guidance regarding admission."
        ].join("\n");


    card.innerHTML =
        `
        <div class="provider-content">

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    gap:10px;
                    flex-wrap:wrap;
                "
            >

                <span class="badge badge-success">
                    ✓ Verified
                </span>

                <span class="badge ${statusClass}">
                    ${escapeAdmissionHTML(status)}
                </span>

            </div>


            <h3 style="margin-top:12px;">
                ${escapeAdmissionHTML(
                    college.college ||
                    "College"
                )}
            </h3>


            ${
                college.location

                    ? `
                        <p class="provider-meta">
                            📍
                            ${escapeAdmissionHTML(
                                college.location
                            )}
                            ${
                                college.taluk
                                    ? ", " +
                                      escapeAdmissionHTML(
                                          college.taluk
                                      )
                                    : ""
                            }
                        </p>
                      `

                    : ""
            }


            ${
                college.type

                    ? `
                        <p>
                            <strong>
                                Admission:
                            </strong>
                            ${escapeAdmissionHTML(
                                college.type
                            )}
                        </p>
                      `

                    : ""
            }


            ${
                college.lastDate

                    ? `
                        <p>
                            <strong>
                                Last Date:
                            </strong>
                            ${escapeAdmissionHTML(
                                college.lastDate
                            )}
                        </p>
                      `

                    : ""
            }


            ${courseHTML}


            <div
                class="provider-actions"
                style="
                    display:flex;
                    flex-wrap:wrap;
                    gap:8px;
                    margin-top:15px;
                "
            >

                <button
                    type="button"
                    class="btn btn-primary btn-small"
                    data-admission-enquiry
                >
                    🎓 Get Admission Help
                </button>


                ${
                    college.officialWebsite

                        ? `
                            <a
                                href="${escapeAdmissionHTML(
                                    college.officialWebsite
                                )}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="btn btn-outline btn-small"
                            >
                                Official Website
                            </a>
                          `

                        : ""
                }


                ${
                    college.officialPhone

                        ? `
                            <a
                                href="tel:${escapeAdmissionHTML(
                                    college.officialPhone
                                )}"
                                class="btn btn-secondary btn-small"
                            >
                                📞 Official Contact
                            </a>
                          `

                        : ""
                }

            </div>

        </div>
        `;


    const enquiryButton =
        card.querySelector(
            "[data-admission-enquiry]"
        );


    if (enquiryButton) {

        enquiryButton.addEventListener(
            "click",
            function () {

                sendAdmissionWhatsApp(
                    enquiryMessage
                );

            }
        );

    }


    return card;

}


/* =========================================================
   ADMISSION ENQUIRY BUTTONS
   ========================================================= */

function initAdmissionEnquiryButtons() {

    document
        .querySelectorAll(
            "[data-admission-help]"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    const level =
                        button.getAttribute(
                            "data-level"
                        ) || "Admission";


                    const course =
                        button.getAttribute(
                            "data-course"
                        ) || "";


                    const taluk =
                        button.getAttribute(
                            "data-taluk"
                        ) || "";


                    const message =
                        [
                            "VELORA HELP — ADMISSION ASSISTANCE",
                            "",
                            `Admission level: ${level}`,
                            course
                                ? `Course: ${course}`
                                : "",
                            taluk
                                ? `Taluk: ${taluk}`
                                : "",
                            "",
                            "Please guide me about colleges, courses, eligibility and admission procedure."
                        ]
                        .filter(Boolean)
                        .join("\n");


                    sendAdmissionWhatsApp(
                        message
                    );

                }
            );

        });

}


/* =========================================================
   SEND ADMISSION WHATSAPP
   ========================================================= */

function sendAdmissionWhatsApp(
    message
) {

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
   GENERAL ADMISSION REQUEST
   ========================================================= */

function openAdmissionHelp() {

    sendAdmissionWhatsApp(
        [
            "VELORA HELP — ADMISSION REQUEST",
            "",
            "Hello VELORA HELP,",
            "",
            "I need admission assistance.",
            "",
            "Please guide me regarding the suitable course and college."
        ].join("\n")
    );

}


/* =========================================================
   ADMISSION COURSE INFORMATION
   ========================================================= */

function getAdmissionCourseInfo(
    level
) {

    const normalized =
        String(
            level || ""
        )
        .trim()
        .toLowerCase();


    if (
        normalized === "1st puc"
    ) {

        return {

            title:
                "1st PUC Admission",

            description:
                "Assistance for students looking for 1st PUC options and available streams."

        };

    }


    if (
        normalized === "2nd puc"
    ) {

        return {

            title:
                "2nd PUC Admission",

            description:
                "Guidance for students looking for 2nd PUC admission or transfer information."

        };

    }


    if (
        normalized.includes("degree")
    ) {

        return {

            title:
                "Degree Admission",

            description:
                "Guidance for undergraduate degree courses and college options."

        };

    }


    if (
        normalized.includes("professional")
    ) {

        return {

            title:
                "Professional Course Admission",

            description:
                "Guidance for professional and specialised courses."

        };

    }


    return {

        title:
            "Admission Assistance",

        description:
            "VELORA HELP admission guidance."

    };

}


/* =========================================================
   ADMISSION QUICK BUTTONS
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        document
            .querySelectorAll(
                "[data-admission-level]"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const level =
                            button.getAttribute(
                                "data-admission-level"
                            );


                        const info =
                            getAdmissionCourseInfo(
                                level
                            );


                        const message =
                            [
                                "VELORA HELP — ADMISSION ASSISTANCE",
                                "",
                                `Requirement: ${info.title}`,
                                "",
                                info.description,
                                "",
                                "Please guide me regarding available colleges and the admission process."
                            ].join("\n");


                        sendAdmissionWhatsApp(
                            message
                        );

                    }
                );

            });

    }
);


/* =========================================================
   BASIC ADMISSION CARD INITIALISATION
   ========================================================= */

function initAdmissionCards() {

    /*
       Reserved for future database-driven
       admission listings.

       Verified colleges can later be loaded
       from the VELORA HELP backend without
       changing the public page structure.
    */

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeAdmissionHTML(
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
   PUBLIC API
   ========================================================= */

window.veloraAdmissionSearch =
    searchAdmissions;


window.veloraAdmissionHelp =
    openAdmissionHelp;


/* =========================================================
   READY
   ========================================================= */

console.log(
    "VELORA HELP admissions system loaded successfully."
);
