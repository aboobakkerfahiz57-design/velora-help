/* =========================================================
   VELORA HELP
   FORM & ENQUIRY SYSTEM
   Your Problem. Our Direction.
   Powered by VELORA DIGITAL
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initVeloraForms();
    initProblemForm();
    initHealthcareEnquiry();
    initAdmissionEnquiry();
    initPropertyEnquiry();
    initProviderEnquiry();

});


/* =========================================================
   COMMON FORM INITIALISATION
   ========================================================= */

function initVeloraForms() {

    document
        .querySelectorAll("form[data-velora-enquiry]")
        .forEach(function (form) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    processVeloraForm(form);

                }
            );

        });

}


/* =========================================================
   COMMON FORM PROCESSOR
   ========================================================= */

function processVeloraForm(form) {

    if (!validateVeloraForm(form)) {
        return;
    }


    const formData =
        new FormData(form);

    const enquiry = {};


    formData.forEach(function (value, key) {

        if (
            typeof value === "string"
        ) {

            enquiry[key] =
                value.trim();

        } else {

            enquiry[key] =
                value;

        }

    });


    enquiry.formType =
        form.getAttribute(
            "data-velora-enquiry"
        ) || "General Enquiry";


    enquiry.submittedAt =
        new Date().toISOString();


    /*
       Temporary FREE MVP storage.

       Later this will be replaced with:
       PHP + database + admin dashboard.
    */

    let savedRecord = null;

    if (
        typeof saveVeloraEnquiry ===
        "function"
    ) {

        savedRecord =
            saveVeloraEnquiry(
                enquiry
            );

    }


    const enquiryId =
        savedRecord &&
        savedRecord.id

            ? savedRecord.id

            : generateTemporaryId();


    showEnquirySuccess(
        form,
        enquiryId
    );


    /*
       Prepare WhatsApp enquiry.

       The user still needs to tap
       Send in WhatsApp.
    */

    setTimeout(function () {

        sendVeloraFormToWhatsApp(
            enquiry,
            enquiryId
        );

    }, 700);

}


/* =========================================================
   FORM VALIDATION
   ========================================================= */

function validateVeloraForm(form) {

    const requiredFields =
        form.querySelectorAll(
            "[required]"
        );


    let valid = true;

    let firstInvalid = null;


    requiredFields.forEach(
        function (field) {

            const value =
                String(
                    field.value || ""
                ).trim();


            if (!value) {

                valid = false;

                field.classList.add(
                    "velora-invalid"
                );

                field.style.borderColor =
                    "#b42318";


                if (!firstInvalid) {
                    firstInvalid = field;
                }

            } else {

                field.classList.remove(
                    "velora-invalid"
                );

                field.style.borderColor =
                    "";

            }

        }
    );


    /*
       Phone validation.
    */

    const phoneFields =
        form.querySelectorAll(
            'input[type="tel"]'
        );


    phoneFields.forEach(
        function (field) {

            const phone =
                field.value
                    .replace(/\D/g, "");


            if (
                phone.length > 0 &&
                phone.length < 10
            ) {

                valid = false;

                field.style.borderColor =
                    "#b42318";


                if (!firstInvalid) {
                    firstInvalid = field;
                }


                showVeloraMessage(
                    "Please enter a valid phone number.",
                    "error"
                );

            }

        }
    );


    if (!valid) {

        showVeloraMessage(
            "Please complete the required fields.",
            "error"
        );


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
   TEMPORARY ENQUIRY ID
   ========================================================= */

function generateTemporaryId() {

    const date =
        new Date();

    const year =
        date.getFullYear();


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
   SUCCESS MESSAGE
   ========================================================= */

function showEnquirySuccess(
    form,
    enquiryId
) {

    let successBox =
        form.querySelector(
            ".velora-form-success"
        );


    if (!successBox) {

        successBox =
            document.createElement(
                "div"
            );

        successBox.className =
            "velora-form-success alert alert-success";


        form.prepend(
            successBox
        );

    }


    successBox.innerHTML =
        `
        <strong>Enquiry received ✓</strong><br>
        Your VELORA HELP enquiry ID is
        <strong>${escapeFormHTML(enquiryId)}</strong>.
        <br><br>
        We'll use the information you provided
        to guide you.
        `;


    successBox.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =========================================================
   WHATSAPP FORM MESSAGE
   ========================================================= */

function sendVeloraFormToWhatsApp(
    enquiry,
    enquiryId
) {

    const lines = [

        "VELORA HELP — NEW ENQUIRY",

        "==========================",

        `Enquiry ID: ${enquiryId}`,

        enquiry.formType
            ? `Type: ${enquiry.formType}`
            : "",

        enquiry.name
            ? `Name: ${enquiry.name}`
            : "",

        enquiry.firstName
            ? `First Name: ${enquiry.firstName}`
            : "",

        enquiry.lastName
            ? `Last Name: ${enquiry.lastName}`
            : "",

        enquiry.phone
            ? `Phone: ${enquiry.phone}`
            : "",

        enquiry.email
            ? `Email: ${enquiry.email}`
            : "",

        enquiry.taluk
            ? `Taluk: ${enquiry.taluk}`
            : "",

        enquiry.area
            ? `Area: ${enquiry.area}`
            : "",

        enquiry.location
            ? `Location: ${enquiry.location}`
            : "",

        enquiry.category
            ? `Category: ${enquiry.category}`
            : "",

        enquiry.service
            ? `Service: ${enquiry.service}`
            : "",

        enquiry.problem
            ? `Problem: ${enquiry.problem}`
            : "",

        enquiry.reason
            ? `Reason: ${enquiry.reason}`
            : "",

        enquiry.course
            ? `Course: ${enquiry.course}`
            : "",

        enquiry.college
            ? `College: ${enquiry.college}`
            : "",

        enquiry.educationLevel
            ? `Education Level: ${enquiry.educationLevel}`
            : "",

        enquiry.propertyType
            ? `Property Type: ${enquiry.propertyType}`
            : "",

        enquiry.budget
            ? `Budget: ${enquiry.budget}`
            : "",

        enquiry.description
            ? `Description: ${enquiry.description}`
            : "",

        enquiry.details
            ? `Details: ${enquiry.details}`
            : "",

        enquiry.impact
            ? `Impact: ${enquiry.impact}`
            : "",

        enquiry.frequency
            ? `Frequency: ${enquiry.frequency}`
            : "",

        enquiry.solution
            ? `Requested Solution: ${enquiry.solution}`
            : "",

        "",

        "Please review this enquiry and provide guidance."

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
   PROBLEM REPORT FORM
   ========================================================= */

function initProblemForm() {

    const forms =
        document.querySelectorAll(
            'form[data-form-type="problem"]'
        );


    forms.forEach(function (form) {

        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                if (
                    !validateVeloraForm(form)
                ) {
                    return;
                }


                const formData =
                    new FormData(form);


                const enquiry = {

                    formType:
                        "Public Problem Report",

                    name:
                        getFormValue(
                            formData,
                            "name"
                        ),

                    phone:
                        getFormValue(
                            formData,
                            "phone"
                        ),

                    taluk:
                        getFormValue(
                            formData,
                            "taluk"
                        ),

                    area:
                        getFormValue(
                            formData,
                            "area"
                        ),

                    category:
                        getFormValue(
                            formData,
                            "category"
                        ),

                    problem:
                        getFormValue(
                            formData,
                            "problem"
                        ),

                    frequency:
                        getFormValue(
                            formData,
                            "frequency"
                        ),

                    impact:
                        getFormValue(
                            formData,
                            "impact"
                        ),

                    solution:
                        getFormValue(
                            formData,
                            "solution"
                        ),

                    description:
                        getFormValue(
                            formData,
                            "description"
                        )

                };


                let record = null;


                if (
                    typeof saveVeloraEnquiry ===
                    "function"
                ) {

                    record =
                        saveVeloraEnquiry(
                            enquiry
                        );

                }


                const id =
                    record &&
                    record.id

                        ? record.id

                        : generateTemporaryId();


                showProblemSuccess(
                    form,
                    id
                );


                setTimeout(
                    function () {

                        sendVeloraFormToWhatsApp(
                            enquiry,
                            id
                        );

                    },
                    700
                );

            }
        );

    });

}


/* =========================================================
   PROBLEM SUCCESS
   ========================================================= */

function showProblemSuccess(
    form,
    id
) {

    let box =
        form.querySelector(
            ".velora-form-success"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );

        box.className =
            "velora-form-success alert alert-success";

        form.prepend(
            box
        );

    }


    box.innerHTML =
        `
        <strong>Problem report submitted ✓</strong><br>
        Your reference number is
        <strong>${escapeFormHTML(id)}</strong>.
        <br><br>
        Please keep this number for future reference.
        `;

}


/* =========================================================
   HEALTHCARE ENQUIRY
   ========================================================= */

function initHealthcareEnquiry() {

    document
        .querySelectorAll(
            'form[data-form-type="healthcare"]'
        )
        .forEach(function (form) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    if (
                        !validateVeloraForm(form)
                    ) {
                        return;
                    }


                    const data =
                        collectFormData(
                            form
                        );


                    data.formType =
                        "Healthcare Assistance";


                    submitSpecialisedEnquiry(
                        form,
                        data
                    );

                }
            );

        });

}


/* =========================================================
   ADMISSION ENQUIRY
   ========================================================= */

function initAdmissionEnquiry() {

    document
        .querySelectorAll(
            'form[data-form-type="admission"]'
        )
        .forEach(function (form) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    if (
                        !validateVeloraForm(form)
                    ) {
                        return;
                    }


                    const data =
                        collectFormData(
                            form
                        );


                    data.formType =
                        "College Admission Assistance";


                    submitSpecialisedEnquiry(
                        form,
                        data
                    );

                }
            );

        });

}


/* =========================================================
   PROPERTY ENQUIRY
   ========================================================= */

function initPropertyEnquiry() {

    document
        .querySelectorAll(
            'form[data-form-type="property"]'
        )
        .forEach(function (form) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    if (
                        !validateVeloraForm(form)
                    ) {
                        return;
                    }


                    const data =
                        collectFormData(
                            form
                        );


                    data.formType =
                        "Property Assistance";


                    submitSpecialisedEnquiry(
                        form,
                        data
                    );

                }
            );

        });

}


/* =========================================================
   PROVIDER ENQUIRY
   ========================================================= */

function initProviderEnquiry() {

    document
        .querySelectorAll(
            'form[data-form-type="provider"]'
        )
        .forEach(function (form) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    if (
                        !validateVeloraForm(form)
                    ) {
                        return;
                    }


                    const data =
                        collectFormData(
                            form
                        );


                    data.formType =
                        "Provider Registration Enquiry";


                    submitSpecialisedEnquiry(
                        form,
                        data
                    );

                }
            );

        });

}


/* =========================================================
   SPECIALISED ENQUIRY
   ========================================================= */

function submitSpecialisedEnquiry(
    form,
    data
) {

    let record = null;


    if (
        typeof saveVeloraEnquiry ===
        "function"
    ) {

        record =
            saveVeloraEnquiry(
                data
            );

    }


    const id =
        record &&
        record.id

            ? record.id

            : generateTemporaryId();


    showEnquirySuccess(
        form,
        id
    );


    setTimeout(
        function () {

            sendVeloraFormToWhatsApp(
                data,
                id
            );

        },
        700
    );

}


/* =========================================================
   COLLECT FORM DATA
   ========================================================= */

function collectFormData(
    form
) {

    const formData =
        new FormData(form);

    const data = {};


    formData.forEach(
        function (value, key) {

            if (
                typeof value ===
                "string"
            ) {

                data[key] =
                    value.trim();

            } else {

                data[key] =
                    value;

            }

        }
    );


    return data;

}


/* =========================================================
   GET FORM VALUE
   ========================================================= */

function getFormValue(
    formData,
    key
) {

    const value =
        formData.get(key);


    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value).trim();

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeFormHTML(
    value
) {

    return String(
        value || ""
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
   RESET FORM
   ========================================================= */

function resetVeloraForm(
    form
) {

    if (!form) {
        return;
    }


    form.reset();


    form.querySelectorAll(
        "input, select, textarea"
    ).forEach(
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
            ".velora-form-success"
        );


    if (success) {

        success.remove();

    }

}


/* =========================================================
   CHARACTER COUNTER
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        document
            .querySelectorAll(
                "textarea[data-max-counter]"
            )
            .forEach(function (textarea) {

                const max =
                    parseInt(
                        textarea.getAttribute(
                            "maxlength"
                        ) ||
                        textarea.getAttribute(
                            "data-max-counter"
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


                textarea.parentElement.appendChild(
                    counter
                );


                function updateCounter() {

                    counter.textContent =
                        textarea.value.length +
                        " / " +
                        max +
                        " characters";

                }


                textarea.addEventListener(
                    "input",
                    updateCounter
                );


                updateCounter();

            });

    }
);


/* =========================================================
   PHONE NUMBER CLEANUP
   ========================================================= */

document.addEventListener(
    "input",
    function (event) {

        const target =
            event.target;


        if (
            !target.matches(
                'input[type="tel"]'
            )
        ) {
            return;
        }


        /*
           Allow digits, spaces, +, -, brackets.
        */

        target.value =
            target.value.replace(
                /[^0-9+\-()\s]/g,
                ""
            );

    }
);


/* =========================================================
   AUTO-SET LOCATION FROM SAVED LOCATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const latitude =
            localStorage.getItem(
                "velora_user_latitude"
            );

        const longitude =
            localStorage.getItem(
                "velora_user_longitude"
            );


        if (
            !latitude ||
            !longitude
        ) {
            return;
        }


        document
            .querySelectorAll(
                "[data-location-status]"
            )
            .forEach(
                function (element) {

                    element.textContent =
                        "Location available for this session ✓";

                }
            );

    }
);


/* =========================================================
   PRE-FILL QUERY FROM URL
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const query =
            params.get(
                "query"
            );


        if (!query) {
            return;
        }


        const fields =
            document.querySelectorAll(
                '[name="problem"], [name="description"], [name="details"]'
            );


        fields.forEach(
            function (field) {

                if (
                    !field.value
                ) {

                    field.value =
                        query;

                }

            }
        );

    }
);


/* =========================================================
   FORM DRAFT SAVING
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        document
            .querySelectorAll(
                "form[data-save-draft]"
            )
            .forEach(function (form) {

                const draftKey =
                    "velora_draft_" +
                    (
                        form.id ||
                        Math.random()
                            .toString(36)
                            .substring(2)
                    );


                /*
                   Restore previous draft.
                */

                try {

                    const saved =
                        localStorage.getItem(
                            draftKey
                        );


                    if (saved) {

                        const data =
                            JSON.parse(
                                saved
                            );


                        Object.keys(
                            data
                        ).forEach(
                            function (name) {

                                const field =
                                    form.elements[name];


                                if (
                                    field &&
                                    !field.value
                                ) {

                                    field.value =
                                        data[name];

                                }

                            }
                        );

                    }

                } catch (error) {

                    console.warn(
                        "VELORA draft restore failed."
                    );

                }


                /*
                   Save draft as the user types.
                */

                form.addEventListener(
                    "input",
                    function () {

                        const data = {};


                        Array.from(
                            form.elements
                        ).forEach(
                            function (field) {

                                if (
                                    field.name &&
                                    field.type !==
                                    "submit" &&
                                    field.type !==
                                    "button" &&
                                    field.type !==
                                    "file"
                                ) {

                                    data[field.name] =
                                        field.value;

                                }

                            }
                        );


                        try {

                            localStorage.setItem(
                                draftKey,
                                JSON.stringify(
                                    data
                                )
                            );

                        } catch (error) {

                            console.warn(
                                "VELORA draft save failed."
                            );

                        }

                    }
                );


                /*
                   Remove draft after successful
                   submission.
                */

                form.addEventListener(
                    "submit",
                    function () {

                        setTimeout(
                            function () {

                                try {

                                    localStorage.removeItem(
                                        draftKey
                                    );

                                } catch (error) {}

                            },
                            1500
                        );

                    }
                );

            });

    }
);


/* =========================================================
   GENERAL CONTACT BUTTON
   ========================================================= */

function openVeloraGeneralEnquiry() {

    const message =
        [
            "VELORA HELP — GENERAL ENQUIRY",
            "",
            "Hello VELORA HELP,",
            "I need help regarding a problem.",
            "",
            "Please guide me."
        ].join("\n");


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


/* =========================================================
   VELORA HELP FORM READY
   ========================================================= */

console.log(
    "VELORA HELP forms system loaded successfully."
);
