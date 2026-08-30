/* =========================================================
   VELORA HELP
   PUBLIC PROBLEM REPORTING SYSTEM
   Your Problem. Our Direction.
   Powered by VELORA DIGITAL
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initProblemReporting();
    initProblemCategoryOptions();
    initProblemTalukOptions();
    initProblemCounters();
    renderMonthlyProblems();

});


/* =========================================================
   PROBLEM REPORTING CATEGORIES
   ========================================================= */

const VELORA_PROBLEM_TYPES = [
    "Healthcare",
    "Housing",
    "Education",
    "Jobs",
    "Transport",
    "Waste / Garbage",
    "Water",
    "Roads",
    "Public Safety",
    "Government Services",
    "Digital Services",
    "Cost of Living",
    "Elderly Support",
    "Local Business",
    "Other"
];


/* =========================================================
   PROBLEM REPORTING FORM
   ========================================================= */

function initProblemReporting() {

    document
        .querySelectorAll(
            'form[data-problem-report]'
        )
        .forEach(function (form) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    submitProblemReport(form);

                }
            );

        });

}


/* =========================================================
   SUBMIT PROBLEM REPORT
   ========================================================= */

function submitProblemReport(form) {

    if (
        !validateProblemReport(form)
    ) {

        return;

    }


    const data =
        new FormData(form);


    const problem = {

        formType:
            "Public Problem Report",

        name:
            getProblemValue(
                data,
                "name"
            ),

        phone:
            getProblemValue(
                data,
                "phone"
            ),

        email:
            getProblemValue(
                data,
                "email"
            ),

        category:
            getProblemValue(
                data,
                "category"
            ),

        problem:
            getProblemValue(
                data,
                "problem"
            ),

        location:
            getProblemValue(
                data,
                "location"
            ),

        taluk:
            getProblemValue(
                data,
                "taluk"
            ),

        area:
            getProblemValue(
                data,
                "area"
            ),

        frequency:
            getProblemValue(
                data,
                "frequency"
            ),

        impact:
            getProblemValue(
                data,
                "impact"
            ),

        solution:
            getProblemValue(
                data,
                "solution"
            ),

        description:
            getProblemValue(
                data,
                "description"
            ),

        date:
            getProblemValue(
                data,
                "date"
            )

    };


    /*
       Generate a VELORA reference number.
    */

    let referenceId;


    if (
        typeof generateVeloraProblemId ===
        "function"
    ) {

        referenceId =
            generateVeloraProblemId();

    } else {

        referenceId =
            generateLocalProblemId();

    }


    problem.referenceId =
        referenceId;


    problem.status =
        "Submitted";


    problem.createdAt =
        new Date().toISOString();


    /*
       Save locally for the FREE MVP.
       Later this will be replaced by PHP/database.
    */

    saveProblemReport(
        problem
    );


    /*
       Update local monthly statistics.
    */

    updateProblemStatistics(
        problem.category
    );


    showProblemReportSuccess(
        form,
        referenceId
    );


    /*
       Prepare WhatsApp message for
       VELORA HELP number.
    */

    setTimeout(
        function () {

            sendProblemToWhatsApp(
                problem
            );

        },
        800
    );

}


/* =========================================================
   VALIDATE PROBLEM FORM
   ========================================================= */

function validateProblemReport(
    form
) {

    let valid = true;

    let firstInvalid = null;


    const required =
        form.querySelectorAll(
            "[required]"
        );


    required.forEach(
        function (field) {

            const value =
                String(
                    field.value || ""
                ).trim();


            if (!value) {

                valid = false;

                field.style.borderColor =
                    "#b42318";


                field.classList.add(
                    "velora-invalid"
                );


                if (!firstInvalid) {

                    firstInvalid =
                        field;

                }

            } else {

                field.style.borderColor =
                    "";

                field.classList.remove(
                    "velora-invalid"
                );

            }

        }
    );


    /*
       Phone validation.
    */

    const phone =
        form.querySelector(
            'input[type="tel"]'
        );


    if (phone) {

        const digits =
            phone.value.replace(
                /\D/g,
                ""
            );


        if (
            digits.length < 10
        ) {

            valid = false;

            phone.style.borderColor =
                "#b42318";


            if (!firstInvalid) {

                firstInvalid =
                    phone;

            }


            showVeloraMessage(
                "Please enter a valid phone number.",
                "error"
            );

        }

    }


    if (!valid) {

        if (
            typeof showVeloraMessage ===
            "function"
        ) {

            showVeloraMessage(
                "Please complete all required fields.",
                "error"
            );

        }


        if (firstInvalid) {

            firstInvalid.focus();

            firstInvalid.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

    }


    return valid;

}


/* =========================================================
   GET FORM VALUE
   ========================================================= */

function getProblemValue(
    data,
    key
) {

    const value =
        data.get(key);


    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(
        value
    ).trim();

}


/* =========================================================
   GENERATE LOCAL PROBLEM ID
   ========================================================= */

function generateLocalProblemId() {

    const year =
        new Date()
            .getFullYear();


    const random =
        Math.floor(
            10000 +
            Math.random() * 90000
        );


    return (
        "VH-DK-" +
        year +
        "-" +
        random
    );

}


/* =========================================================
   SAVE PROBLEM REPORT
   ========================================================= */

function saveProblemReport(
    problem
) {

    const key =
        "velora_problem_reports";


    let reports = [];


    try {

        const stored =
            localStorage.getItem(
                key
            );


        if (stored) {

            reports =
                JSON.parse(
                    stored
                );


            if (
                !Array.isArray(
                    reports
                )
            ) {

                reports = [];

            }

        }

    } catch (error) {

        reports = [];

    }


    reports.push(
        problem
    );


    /*
       Keep the FREE MVP lightweight.
       Store the latest 500 reports locally.
    */

    if (
        reports.length > 500
    ) {

        reports =
            reports.slice(
                -500
            );

    }


    try {

        localStorage.setItem(
            key,
            JSON.stringify(
                reports
            )
        );


        return true;

    } catch (error) {

        console.error(
            "VELORA problem storage error:",
            error
        );


        return false;

    }

}


/* =========================================================
   GET SAVED REPORTS
   ========================================================= */

function getProblemReports() {

    try {

        const stored =
            localStorage.getItem(
                "velora_problem_reports"
            );


        if (!stored) {

            return [];

        }


        const reports =
            JSON.parse(
                stored
            );


        return Array.isArray(
            reports
        )
            ? reports
            : [];

    } catch (error) {

        return [];

    }

}


/* =========================================================
   SHOW SUCCESS
   ========================================================= */

function showProblemReportSuccess(
    form,
    referenceId
) {

    let box =
        form.querySelector(
            ".problem-success"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );


        box.className =
            "problem-success alert alert-success";


        form.prepend(
            box
        );

    }


    box.innerHTML =
        `
        <strong>
            Problem report received ✓
        </strong>

        <br><br>

        Your VELORA HELP reference number:

        <strong>
            ${escapeProblemHTML(
                referenceId
            )}
        </strong>

        <br><br>

        Please keep this reference number
        for future follow-up.

        <br><br>

        Your enquiry is being prepared
        for VELORA HELP guidance.
        `;


    box.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =========================================================
   SEND PROBLEM TO WHATSAPP
   ========================================================= */

function sendProblemToWhatsApp(
    problem
) {

    const message =

        [

            "VELORA HELP — NEW PUBLIC PROBLEM",

            "================================",

            `Reference ID: ${
                problem.referenceId || ""
            }`,

            `Name: ${
                problem.name || ""
            }`,

            `Phone: ${
                problem.phone || ""
            }`,

            problem.email
                ? `Email: ${problem.email}`
                : "",

            `Category: ${
                problem.category || ""
            }`,

            `Problem: ${
                problem.problem || ""
            }`,

            `Taluk: ${
                problem.taluk || ""
            }`,

            `Area: ${
                problem.area || ""
            }`,

            `Location: ${
                problem.location || ""
            }`,

            `Frequency: ${
                problem.frequency || ""
            }`,

            `Impact: ${
                problem.impact || ""
            }`,

            `Requested Solution: ${
                problem.solution || ""
            }`,

            `Description: ${
                problem.description || ""
            }`,

            "",

            "Status: Submitted",

            "",

            "Please review this problem and guide us regarding the appropriate next step."

        ]
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
   PROBLEM CATEGORY OPTIONS
   ========================================================= */

function initProblemCategoryOptions() {

    document
        .querySelectorAll(
            "[data-problem-category-options]"
        )
        .forEach(
            function (select) {

                VELORA_PROBLEM_TYPES
                    .forEach(
                        function (category) {

                            addProblemOption(
                                select,
                                category,
                                category
                            );

                        }
                    );

            }
        );


    /*
       Also support normal selects that
       use data-problem-category.
    */

    document
        .querySelectorAll(
            "select[data-problem-category]"
        )
        .forEach(
            function (select) {

                VELORA_PROBLEM_TYPES
                    .forEach(
                        function (category) {

                            addProblemOption(
                                select,
                                category,
                                category
                            );

                        }
                    );

            }
        );

}


/* =========================================================
   TALUK OPTIONS
   ========================================================= */

function initProblemTalukOptions() {

    document
        .querySelectorAll(
            "[data-problem-taluk-options]"
        )
        .forEach(
            function (select) {

                if (
                    typeof DAKSHINA_KANNADA_TALUKS ===
                    "undefined"
                ) {

                    return;

                }


                DAKSHINA_KANNADA_TALUKS
                    .forEach(
                        function (taluk) {

                            if (
                                typeof taluk ===
                                "string"
                            ) {

                                addProblemOption(
                                    select,
                                    taluk,
                                    taluk
                                );

                            } else {

                                addProblemOption(
                                    select,
                                    taluk.name,
                                    taluk.name
                                );

                            }

                        }
                    );

            }
        );

}


/* =========================================================
   ADD OPTION
   ========================================================= */

function addProblemOption(
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
   MONTHLY STATISTICS
   ========================================================= */

function updateProblemStatistics(
    category
) {

    if (!category) {

        return;

    }


    const key =
        "velora_monthly_problem_stats";


    let stats = {};


    try {

        const stored =
            localStorage.getItem(
                key
            );


        if (stored) {

            stats =
                JSON.parse(
                    stored
                );

        }

    } catch (error) {

        stats = {};

    }


    const monthKey =
        new Date()
            .toISOString()
            .slice(
                0,
                7
            );


    if (
        !stats[monthKey]
    ) {

        stats[monthKey] = {};

    }


    if (
        !stats[monthKey][category]
    ) {

        stats[monthKey][category] =
            0;

    }


    stats[monthKey][category]++;


    try {

        localStorage.setItem(
            key,
            JSON.stringify(
                stats
            )
        );

    } catch (error) {

        console.warn(
            "VELORA monthly statistics could not be saved."
        );

    }

}


/* =========================================================
   GET MONTHLY STATISTICS
   ========================================================= */

function getMonthlyProblemStatistics() {

    const key =
        "velora_monthly_problem_stats";


    let stats = {};


    try {

        const stored =
            localStorage.getItem(
                key
            );


        if (stored) {

            stats =
                JSON.parse(
                    stored
                );

        }

    } catch (error) {

        stats = {};

    }


    const monthKey =
        new Date()
            .toISOString()
            .slice(
                0,
                7
            );


    return (
        stats[monthKey] ||
        {}
    );

}


/* =========================================================
   RENDER TOP PROBLEMS
   ========================================================= */

function renderMonthlyProblems() {

    const containers =
        document.querySelectorAll(
            "[data-top-problems]"
        );


    if (
        containers.length === 0
    ) {

        return;

    }


    const statistics =
        getMonthlyProblemStatistics();


    containers.forEach(
        function (container) {

            container.innerHTML =
                "";


            const entries =
                Object.entries(
                    statistics
                )
                .sort(
                    function (a, b) {

                        return b[1] -
                            a[1];

                    }
                );


            if (
                entries.length === 0
            ) {

                container.innerHTML =

                    `
                    <div class="empty-state">

                        <div class="empty-icon">
                            📊
                        </div>

                        <h3>
                            Top problems reported this month
                        </h3>

                        <p>
                            No public problem reports have
                            been recorded on this browser
                            this month yet.
                        </p>

                    </div>
                    `;

                return;

            }


            entries
                .slice(
                    0,
                    10
                )
                .forEach(
                    function (
                        entry,
                        index
                    ) {

                        const row =
                            document.createElement(
                                "div"
                            );


                        row.className =
                            "problem-stat-row";


                        row.innerHTML =

                            `
                            <div
                                style="
                                    display:flex;
                                    align-items:center;
                                    gap:12px;
                                "
                            >

                                <strong>
                                    ${index + 1}
                                </strong>

                                <span>
                                    ${escapeProblemHTML(
                                        entry[0]
                                    )}
                                </span>

                            </div>

                            <strong>
                                ${entry[1]}
                            </strong>
                            `;


                        container.appendChild(
                            row
                        );

                    }
                );

        }
    );

}


/* =========================================================
   CHARACTER COUNTERS
   ========================================================= */

function initProblemCounters() {

    document
        .querySelectorAll(
            "textarea[data-problem-counter]"
        )
        .forEach(
            function (textarea) {

                const max =
                    parseInt(
                        textarea.getAttribute(
                            "maxlength"
                        ) ||
                        textarea.getAttribute(
                            "data-problem-counter"
                        ),
                        10
                    );


                if (!max) {

                    return;

                }


                const counter =
                    document.createElement(
                        "small"
                    );


                counter.className =
                    "form-help";


                textarea.parentElement
                    .appendChild(
                        counter
                    );


                function update() {

                    counter.textContent =

                        textarea.value.length +
                        " / " +
                        max +
                        " characters";

                }


                textarea.addEventListener(
                    "input",
                    update
                );


                update();

            }
        );

}


/* =========================================================
   PROBLEM STATUS LOOKUP
   ========================================================= */

function getProblemByReference(
    referenceId
) {

    const reports =
        getProblemReports();


    return reports.find(
        function (report) {

            return report.referenceId ===
                referenceId;

        }
    ) || null;

}


/* =========================================================
   SHOW STATUS
   ========================================================= */

function showProblemStatus(
    referenceId
) {

    const result =
        getProblemByReference(
            referenceId
        );


    if (!result) {

        showVeloraMessage(

            "We couldn't find this reference number on this device.",

            "error"

        );

        return;

    }


    showVeloraMessage(

        `Reference ${referenceId}: ${
            result.status || "Submitted"
        }`,

        "success"

    );

}


/* =========================================================
   CLEAR FORM
   ========================================================= */

function clearProblemForm(
    form
) {

    if (!form) {

        return;

    }


    form.reset();


    form.querySelectorAll(
        "input, select, textarea"
    )
    .forEach(
        function (field) {

            field.style.borderColor =
                "";

            field.classList.remove(
                "velora-invalid"
            );

        }
    );


    const success =
        form.querySelector(
            ".problem-success"
        );


    if (success) {

        success.remove();

    }

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeProblemHTML(
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

window.veloraSubmitProblem =
    submitProblemReport;


window.veloraGetProblemReports =
    getProblemReports;


window.veloraGetProblemByReference =
    getProblemByReference;


window.veloraShowProblemStatus =
    showProblemStatus;


window.veloraMonthlyProblems =
    getMonthlyProblemStatistics;


/* =========================================================
   READY
   ========================================================= */

console.log(
    "VELORA HELP problem reporting system loaded successfully."
);
