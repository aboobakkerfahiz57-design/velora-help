
/* =========================================================
   VELORA HELP — DIGITAL HELP PROVIDER DIRECTORY
   Supabase provider search and customer enquiry system
   ========================================================= */

(function () {
    "use strict";

    let supabaseClient = null;
    let digitalCategoryId = null;
    let selectedProvider = null;

    const HELP_WHATSAPP = "918088590273";

    // -----------------------------------------------------
    // BASIC HELPERS
    // -----------------------------------------------------

    function getValue(id) {
        const element = document.getElementById(id);
        return element ? element.value.trim() : "";
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function showMessage(element, message, isError) {
        if (!element) return;

        element.textContent = message;
        element.classList.add("show");

        element.style.background = isError
            ? "#fff0ef"
            : "#eaf8ef";

        element.style.color = isError
            ? "#9f2118"
            : "#20633a";
    }

    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }

    function getWhatsAppNumber(provider) {
        return String(
            provider.whatsapp || provider.phone || ""
        ).replace(/\D/g, "");
    }

    function getCustomerLocation(prefix) {
        const district = getValue(prefix + "District");
        const taluk = getValue(prefix + "Taluk");
        const area = getValue(prefix + "Location");

        return {
            district,
            taluk,
            area
        };
    }

    // -----------------------------------------------------
    // WHATSAPP LINK
    // -----------------------------------------------------

    function createWhatsAppLink(phone, message) {
        const link = document.createElement("a");

        link.className = "btn btn-red";
        link.textContent = "WhatsApp";

        link.href =
            "https://wa.me/" +
            phone +
            "?text=" +
            encodeURIComponent(message);

        link.target = "_blank";
        link.rel = "noopener noreferrer";

        return link;
    }

    // -----------------------------------------------------
    // PROVIDER LOCATION MATCHING
    // -----------------------------------------------------

    function providerMatchesLocation(provider, location) {
        const providerDistrict = normalize(provider.district);
        const providerTaluk = normalize(provider.taluk);

        const providerArea = normalize(provider.area);
        const providerAddress = normalize(provider.address);

        const allLocations = [
            providerDistrict,
            providerTaluk,
            providerArea,
            providerAddress
        ].filter(Boolean);

        if (location.district) {
            const searchDistrict = normalize(location.district);

            if (
                providerDistrict &&
                !providerDistrict.includes(searchDistrict)
            ) {
                return false;
            }
        }

        if (location.taluk) {
            const searchTaluk = normalize(location.taluk);

            if (
                providerTaluk &&
                !providerTaluk.includes(searchTaluk)
            ) {
                return false;
            }
        }

        if (location.area) {
            const searchArea = normalize(location.area);

            const areaMatch = allLocations.some(function (value) {
                return value.includes(searchArea);
            });

            if (!areaMatch) {
                return false;
            }
        }

        return true;
    }

    // -----------------------------------------------------
    // DISPLAY PROVIDER CARDS
    // -----------------------------------------------------

    function displayProviders(providers) {
        const container =
            document.getElementById("providerResults");

        if (!container) return;

        container.replaceChildren();

        if (!providers.length) {
            const card = createElement(
                "div",
                "info-card"
            );

            card.appendChild(
                createElement(
                    "h3",
                    "",
                    "No matching provider found"
                )
            );

            card.appendChild(
                createElement(
                    "p",
                    "",
                    "No verified provider is currently listed for this search. You can still send your requirement to VELORA HELP."
                )
            );

            container.appendChild(card);
            return;
        }

        providers.forEach(function (provider) {
            const card = createElement(
                "div",
                "info-card"
            );

            const name = createElement(
                "h3",
                "",
                provider.name
            );

            const verified = createElement(
                "span",
                "",
                "✓ Verified provider"
            );

            verified.style.color = "#18864b";
            verified.style.fontWeight = "700";

            const locationText = [
                provider.area,
                provider.taluk,
                provider.district
            ].filter(Boolean).join(", ");

            const specialty = createElement(
                "p",
                "",
                [
                    provider.specialty,
                    locationText
                ].filter(Boolean).join(" · ")
            );

            const description = createElement(
                "p",
                "",
                provider.description ||
                "Contact this provider for service details."
            );

            card.append(
                name,
                verified,
                specialty,
                description
            );

            if (provider.qualifications) {
                card.appendChild(
                    createElement(
                        "p",
                        "",
                        "Qualifications: " +
                        provider.qualifications
                    )
                );
            }

            if (provider.address) {
                card.appendChild(
                    createElement(
                        "p",
                        "",
                        "Address: " + provider.address
                    )
                );
            }

            if (provider.phone) {
                card.appendChild(
                    createElement(
                        "p",
                        "",
                        "Phone: " + provider.phone
                    )
                );
            }

            const actions = createElement(
                "div",
                ""
            );

            actions.style.display = "flex";
            actions.style.flexWrap = "wrap";
            actions.style.gap = "10px";
            actions.style.marginTop = "15px";

            if (provider.phone) {
                const call = createElement(
                    "a",
                    "btn btn-blue",
                    "Call provider"
                );

                call.href =
                    "tel:" +
                    provider.phone.replace(/[^+0-9]/g, "");

                actions.appendChild(call);
            }

            const whatsappNumber =
                getWhatsAppNumber(provider);

            if (whatsappNumber) {
                const message =
                    "Hello " + provider.name +
                    ", I found your listing on VELORA HELP. " +
                    "I need help with " +
                    getValue("digitalNeed") +
                    ". My location is " +
                    getValue("digitalLocation") + ".";

                actions.appendChild(
                    createWhatsAppLink(
                        whatsappNumber,
                        message
                    )
                );
            }

            const enquiryButton = createElement(
                "button",
                "btn btn-light",
                "Send enquiry"
            );

            enquiryButton.type = "button";

            enquiryButton.addEventListener(
                "click",
                function () {
                    selectedProvider = provider;

                    const need = document.getElementById("need");

                    if (need) {
                        need.value = getValue("digitalNeed");
                    }

                    const location = document.getElementById("location");

                    if (location) {
                        location.value = getValue("digitalLocation");
                    }

                    const district = document.getElementById("district");
                    const taluk = document.getElementById("taluk");

                    if (district) {
                        district.value = getValue("digitalDistrict");
                    }

                    if (taluk) {
                        taluk.value = getValue("digitalTaluk");
                    }

                    const status =
                        document.getElementById("formStatus");

                    showMessage(
                        status,
                        "You selected " +
                        provider.name +
                        ". Complete your details below to submit an enquiry.",
                        false
                    );

                    document
                        .getElementById("digital-form")
                        .scrollIntoView({
                            behavior: "smooth"
                        });
                }
            );

            actions.appendChild(enquiryButton);
            card.appendChild(actions);

            container.appendChild(card);
        });
    }

    // -----------------------------------------------------
    // SEARCH PROVIDERS
    // -----------------------------------------------------

    async function searchDigitalProviders() {
        const location = getCustomerLocation("digital");

        const need = getValue("digitalNeed");

        const resultBox =
            document.getElementById("searchResult");

        const searchButton =
            document.getElementById("digitalSearch");

        if (!need || (
            !location.area &&
            !location.taluk &&
            !location.district
        )) {
            showMessage(
                resultBox,
                "Please select a digital service and enter your location.",
                true
            );

            return;
        }

        if (!supabaseClient || !digitalCategoryId) {
            showMessage(
                resultBox,
                "Digital Help directory is temporarily unavailable. Please try again later.",
                true
            );

            return;
        }

        searchButton.disabled = true;
        searchButton.textContent = "Searching...";

        const container =
            document.getElementById("providerResults");

        container.replaceChildren();

        const result = await supabaseClient
            .from("providers")
            .select(
                "id,category_id,name,specialty,qualifications,phone,whatsapp,email,address,area,taluk,district,description"
            )
            .eq("category_id", digitalCategoryId)
            .eq("verification_status", "verified")
            .eq("is_active", true)
            .limit(200);

        searchButton.disabled = false;
        searchButton.textContent = "Search";

        if (result.error) {
            console.error(
                "Provider search error:",
                result.error
            );

            showMessage(
                resultBox,
                "Unable to load providers. Please try again.",
                true
            );

            return;
        }

        const providers = (result.data || []).filter(
            function (provider) {
                return providerMatchesLocation(
                    provider,
                    location
                );
            }
        );

        displayProviders(providers);

        showMessage(
            resultBox,
            providers.length +
            " matching verified provider(s) found.",
            false
        );
    }

    // -----------------------------------------------------
    // SUBMIT CUSTOMER ENQUIRY
    // -----------------------------------------------------

    async function submitDigitalEnquiry() {
        const name = getValue("name");
        const phone = getValue("phone");
        const location = getCustomerLocation("");

        const need = getValue("need");
        const details = getValue("details");
        const portal = getValue("portal");
        const solution = getValue("solution");

        const button =
            document.getElementById("sendDigital");

        const status =
            document.getElementById("formStatus");

        if (
            !name ||
            !phone ||
            !location.area ||
            !need ||
            !details
        ) {
            alert(
                "Please complete your name, phone number, location, service and requirement."
            );

            return;
        }

        if (phone.replace(/\D/g, "").length < 10) {
            alert("Please enter a valid phone number.");
            return;
        }

        if (!supabaseClient || !digitalCategoryId) {
            alert(
                "The enquiry system is temporarily unavailable. Please try again later."
            );

            return;
        }

        const enquiryMessage = [
            "Digital Help Required: " + need,
            "District: " + (location.district || "Not specified"),
            "Taluk: " + (location.taluk || "Not specified"),
            "Location: " + location.area,
            "Requirement: " + details,
            "Website / Portal: " + (portal || "Not specified"),
            "Additional help: " + (solution || "Not specified")
        ].join("\n");

        const enquiryRecord = {
            customer_name: name,
            customer_phone: phone,
            category_id: digitalCategoryId,
            provider_id: selectedProvider
                ? selectedProvider.id
                : null,
            message: enquiryMessage,
            area: location.area,
            taluk: location.taluk || null,
            status: "new"
        };

        button.disabled = true;
        button.textContent = "Submitting...";

        const result = await supabaseClient
            .from("enquiries")
            .insert(enquiryRecord)
            .select("id")
            .single();

        button.disabled = false;
        button.textContent =
            "💬 Send Digital Help Enquiry";

        if (result.error) {
            console.error(
                "Enquiry submission error:",
                result.error
            );

            alert(
                "Your enquiry could not be submitted. Please try again."
            );

            return;
        }

        const reference = result.data.id;

        showMessage(
            status,
            "Thank you, " +
            name +
            "! Your enquiry has been successfully submitted to VELORA HELP. Reference ID: " +
            reference,
            false
        );

        // Prepare WhatsApp message.
        // Customer must press Send in WhatsApp.

        const recipient = selectedProvider
            ? getWhatsAppNumber(selectedProvider)
            : HELP_WHATSAPP;

        const whatsappMessage = [
            "VELORA HELP — DIGITAL HELP ENQUIRY",
            "Reference: " + reference,
            "Customer: " + name,
            "Phone: " + phone,
            "Service: " + need,
            "Location: " + location.area,
            "Requirement: " + details,
            selectedProvider
                ? "Selected provider: " + selectedProvider.name
                : "Provider: VELORA HELP"
        ].join("\n");

        const whatsappUrl =
            "https://wa.me/" +
            recipient +
            "?text=" +
            encodeURIComponent(whatsappMessage);

        const whatsappLink = createElement(
            "a",
            "btn btn-red",
            selectedProvider
                ? "Continue to provider WhatsApp"
                : "Continue to VELORA HELP WhatsApp"
        );

        whatsappLink.href = whatsappUrl;
        whatsappLink.target = "_blank";
        whatsappLink.rel = "noopener noreferrer";

        status.appendChild(
            document.createElement("br")
        );

        status.appendChild(
            document.createElement("br")
        );

        status.appendChild(whatsappLink);

        // Reset form after successful submission.

        document.getElementById("name").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("details").value = "";
        document.getElementById("portal").value = "";
        document.getElementById("solution").value = "";

        selectedProvider = null;
    }

    // -----------------------------------------------------
    // INITIALISE SUPABASE
    // -----------------------------------------------------

    async function initialiseDigitalHelp() {
        const url = window.VELORA_SUPABASE_URL;

        const key =
            window.VELORA_SUPABASE_PUBLISHABLE_KEY;

        if (
            !window.supabase ||
            !url ||
            !key
        ) {
            console.error(
                "Supabase configuration is missing."
            );

            showMessage(
                document.getElementById("searchResult"),
                "Provider directory connection is unavailable.",
                true
            );

            return;
        }

        supabaseClient =
            window.supabase.createClient(
                url,
                key
            );

        const result = await supabaseClient
            .from("service_categories")
            .select("id,name")
            .eq("is_active", true)
            .ilike("name", "Digital Help")
            .maybeSingle();

        if (result.error || !result.data) {
            console.error(
                "Digital Help category error:",
                result.error
            );

            showMessage(
                document.getElementById("searchResult"),
                "Digital Help category was not found. Please check the service category in Admin.",
                true
            );

            return;
        }

        digitalCategoryId = result.data.id;

        console.log(
            "VELORA HELP Digital Help connected successfully."
        );
    }

    // -----------------------------------------------------
    // PAGE INITIALISATION
    // -----------------------------------------------------

    function initialisePage() {
        const year = document.getElementById("year");

        if (year) {
            year.textContent =
                new Date().getFullYear();
        }

        const menuButton =
            document.getElementById("menuButton");

        const navigation =
            document.getElementById("navigation");

        if (menuButton && navigation) {
            menuButton.addEventListener(
                "click",
                function () {
                    navigation.classList.toggle("active");
                }
            );

            navigation.querySelectorAll("a").forEach(
                function (link) {
                    link.addEventListener(
                        "click",
                        function () {
                            navigation.classList.remove("active");
                        }
                    );
                }
            );
        }

        const searchButton =
            document.getElementById("digitalSearch");

        if (searchButton) {
            searchButton.addEventListener(
                "click",
                searchDigitalProviders
            );
        }

        const submitButton =
            document.getElementById("sendDigital");

        if (submitButton) {
            submitButton.addEventListener(
                "click",
                submitDigitalEnquiry
            );
        }

        document.querySelectorAll("[data-need]").forEach(
            function (button) {
                button.addEventListener(
                    "click",
                    function () {
                        const need =
                            document.getElementById("need");

                        if (need) {
                            need.value =
                                button.getAttribute("data-need");
                        }
                    }
                );
            }
        );

        initialiseDigitalHelp();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initialisePage
        );
    } else {
        initialisePage();
    }

})();
