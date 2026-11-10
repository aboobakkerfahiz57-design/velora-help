/*
 * VELORA HELP — Healthcare Directory
 * Supabase-backed public directory.
 *
 * Public visibility is restricted twice:
 * 1. Supabase RLS allows public reads only for active, verified providers.
 * 2. This file also filters for is_active=true and verification_status='verified'.
 *
 * Provider images are stored in the private provider-media bucket.
 * The get-provider-media Edge Function returns short-lived signed URLs.
 */

(function () {
    "use strict";

    const CONFIG = {
        whatsappNumber: "918088590273",
        mediaFunctionName: "get-provider-media",
        mediaCacheDurationMs: 50 * 60 * 1000
    };

    let supabaseClient = null;
    let healthcareCategoryId = null;
    let allHealthcareProviders = [];
    const mediaCache = new Map();

    const TYPE_TERMS = {
        "general doctor": [
            "general", "general physician", "general medicine",
            "family medicine", "internal medicine"
        ],
        "hospital": ["hospital"],
        "dental": ["dental", "dentist", "dentistry", "orthodont"],
        "child specialist": ["child", "paediatric", "pediatric"],
        "women & child": [
            "women", "obstetric", "gynecology", "gynaecology",
            "maternity", "child", "paediatric", "pediatric"
        ],
        "skin": ["skin", "dermatology", "dermatologist"],
        "orthopaedic": ["orthopaedic", "orthopedic", "bone", "joint"],
        "ent": ["ent", "ear", "nose", "throat", "otolaryngology"],
        "eye": ["eye", "ophthalmology", "ophthalmologist"],
        "other specialist": ["specialist"]
    };

    document.addEventListener("DOMContentLoaded", initialiseHealthcarePage);

    async function initialiseHealthcarePage() {
        bindSearchForm();
        bindCategoryCards();
        bindProviderActions();
        bindEnquiryForm();

        const status = document.getElementById("healthcareProviderStatus");
        const count = document.getElementById("healthcareProviderCount");

        try {
            supabaseClient = createSupabaseClient();

            if (!supabaseClient) {
                throw new Error(
                    "The Supabase browser client or shared configuration did not load."
                );
            }

            if (status) {
                status.textContent = "Loading the verified healthcare directory…";
            }

            await loadHealthcareCategory();
            await loadHealthcareProviders();

            if (count) {
                count.textContent = allHealthcareProviders.length +
                    (allHealthcareProviders.length === 1 ? " provider" : " providers");
            }

            renderProviderDirectory(allHealthcareProviders);

            if (status) status.hidden = true;
        } catch (error) {
            console.error("VELORA HELP healthcare initialisation:", error);

            if (status) {
                status.className = "directory-error";
                status.textContent =
                    "We couldn't load the healthcare directory right now. Please try again later or send your requirement to VELORA HELP.";
                status.hidden = false;
            }

            if (count) count.textContent = "Directory unavailable";
        }
    }

    function createSupabaseClient() {
        const library = window.supabase;
        const projectUrl = window.VELORA_SUPABASE_URL;
        const publishableKey = window.VELORA_SUPABASE_PUBLISHABLE_KEY;

        if (!library || typeof library.createClient !== "function") {
            return null;
        }

        if (!projectUrl || !publishableKey) {
            return null;
        }

        return library.createClient(projectUrl, publishableKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false
            }
        });
    }

    async function loadHealthcareCategory() {
        const { data, error } = await supabaseClient
            .from("service_categories")
            .select("id, name, is_active")
            .eq("name", "Healthcare")
            .eq("is_active", true)
            .limit(1)
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            throw new Error("The active Healthcare service category was not found.");
        }

        healthcareCategoryId = data.id;
    }

    async function loadHealthcareProviders() {
        const { data, error } = await supabaseClient
            .from("providers")
            .select([
                "id",
                "name",
                "category_id",
                "specialty",
                "qualifications",
                "phone",
                "whatsapp",
                "email",
                "address",
                "area",
                "taluk",
                "district",
                "description",
                "verification_status",
                "is_active",
                "profile_photo_url",
                "organization_name",
                "organization_type",
                "organization_logo_url",
                "gallery_photos",
                "profile_slug"
            ].join(","))
            .eq("category_id", healthcareCategoryId)
            .eq("is_active", true)
            .eq("verification_status", "verified")
            .order("name", { ascending: true });

        if (error) throw error;

        allHealthcareProviders = (data || []).filter(function (provider) {
            return provider &&
                provider.is_active === true &&
                String(provider.verification_status || "").toLowerCase() === "verified" &&
                provider.category_id === healthcareCategoryId;
        });

        await Promise.all(allHealthcareProviders.map(loadProviderMedia));
    }

    async function loadProviderMedia(provider) {
        if (!provider || !provider.id) return provider;

        const cached = mediaCache.get(provider.id);

        if (cached && Date.now() - cached.loadedAt < CONFIG.mediaCacheDurationMs) {
            provider._media = cached.media;
            return provider;
        }

        try {
            const endpoint = String(window.VELORA_SUPABASE_URL).replace(/\/+$/, "") +
                "/functions/v1/" + CONFIG.mediaFunctionName;

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": window.VELORA_SUPABASE_PUBLISHABLE_KEY,
                    "Authorization": "Bearer " + window.VELORA_SUPABASE_PUBLISHABLE_KEY
                },
                body: JSON.stringify({ provider_id: provider.id })
            });

            if (!response.ok) {
                throw new Error("Media request failed (" + response.status + ").");
            }

            const media = await response.json();

            provider._media = {
                profile: safeHttpUrl(media.profile_photo_url),
                logo: safeHttpUrl(media.organization_logo_url),
                gallery: Array.isArray(media.gallery_photos)
                    ? media.gallery_photos.map(safeHttpUrl).filter(Boolean)
                    : []
            };

            mediaCache.set(provider.id, {
                media: provider._media,
                loadedAt: Date.now()
            });
        } catch (error) {
            console.warn("Could not load provider media:", provider.id, error);
            provider._media = { profile: "", logo: "", gallery: [] };
        }

        return provider;
    }

    function safeHttpUrl(value) {
        if (typeof value !== "string" || !value.trim()) return "";

        try {
            const url = new URL(value, window.location.href);

            return url.protocol === "https:" || url.protocol === "http:"
                ? url.href
                : "";
        } catch (_) {
            return "";
        }
    }

    function bindSearchForm() {
        const form = document.getElementById("healthcareSearchForm");
        if (!form) return;

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const search = valueOf("healthSearch").toLowerCase();
            const taluk = valueOf("healthTaluk").toLowerCase();
            const type = valueOf("healthType").toLowerCase();

            const filtered = allHealthcareProviders.filter(function (provider) {
                const searchable = [
                    provider.name,
                    provider.specialty,
                    provider.qualifications,
                    provider.organization_name,
                    provider.organization_type,
                    provider.address,
                    provider.area,
                    provider.taluk,
                    provider.district,
                    provider.description
                ].join(" ").toLowerCase();

                if (search && !searchable.includes(search)) return false;

                if (taluk && String(provider.taluk || "").toLowerCase() !== taluk) {
                    return false;
                }

                if (type && !providerMatchesType(provider, type)) return false;

                return true;
            });

            const results = document.getElementById("healthResults");
            const content = document.getElementById("healthResultContent");

            if (results && content) {
                results.classList.add("active");

                if (filtered.length) {
                    content.innerHTML =
                        '<p><strong>' + filtered.length +
                        '</strong> verified provider(s) match your search. See the provider cards below.</p>';
                } else {
                    content.innerHTML =
                        '<p>No verified provider currently matches those filters. You can send your requirement to VELORA HELP below.</p>' +
                        '<p><a class="btn btn-red" href="#enquiry">Send Healthcare Enquiry</a></p>';
                }

                results.scrollIntoView({ behavior: "smooth", block: "center" });
            }

            renderProviderDirectory(filtered);
        });
    }

    function providerMatchesType(provider, selectedType) {
        const terms = TYPE_TERMS[selectedType] || [selectedType];

        const text = [
            provider.name,
            provider.specialty,
            provider.organization_name,
            provider.organization_type,
            provider.description
        ].join(" ").toLowerCase();

        return terms.some(function (term) {
            return text.includes(term);
        });
    }

    function bindCategoryCards() {
        document.querySelectorAll("[data-health-category]").forEach(function (card) {
            card.addEventListener("click", function () {
                const category = card.getAttribute("data-health-category") || "";
                const select = document.getElementById("consultation");

                if (select) {
                    const option = Array.from(select.options).find(function (item) {
                        return item.value === category || item.text === category;
                    });

                    if (option) select.value = option.value;
                }

                const type = document.getElementById("healthType");

                if (type) {
                    const option = Array.from(type.options).find(function (item) {
                        return item.value === category || item.text === category;
                    });

                    if (option) type.value = option.value;
                }
            });
        });
    }

    function bindProviderActions() {
        const grid = document.getElementById("healthcareProviderGrid");
        if (!grid) return;

        grid.addEventListener("click", function (event) {
            const button = event.target.closest("[data-enquire-provider]");
            if (!button) return;

            const providerId = button.getAttribute("data-enquire-provider");

            const provider = allHealthcareProviders.find(function (item) {
                return item.id === providerId;
            });

            if (!provider) return;

            const form = document.getElementById("healthEnquiryForm");
            if (!form) return;

            let providerField = form.querySelector('[name="provider_id"]');

            if (!providerField) {
                providerField = document.createElement("input");
                providerField.type = "hidden";
                providerField.name = "provider_id";
                form.appendChild(providerField);
            }

            providerField.value = provider.id;

            const preferred = document.getElementById("preferred");

            if (preferred) {
                preferred.value = provider.organization_name || provider.name;
            }

            const consultation = document.getElementById("consultation");

            if (consultation && provider.specialty) {
                const matchingOption = Array.from(consultation.options).find(function (option) {
                    return option.value.toLowerCase() === provider.specialty.toLowerCase() ||
                        option.text.toLowerCase() === provider.specialty.toLowerCase();
                });

                if (matchingOption) consultation.value = matchingOption.value;
            }

            const enquiry = document.getElementById("enquiry");

            if (enquiry) {
                enquiry.scrollIntoView({ behavior: "smooth", block: "start" });
            }

            const name = document.getElementById("name");

            if (name) {
                name.focus({ preventScroll: true });
            }
        });
    }

    function bindEnquiryForm() {
        const form = document.getElementById("healthEnquiryForm");
        if (!form) return;

        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            if (!supabaseClient || !healthcareCategoryId) {
                showHealthcareMessage(
                    "The enquiry service is temporarily unavailable. Please try again later.",
                    true
                );
                return;
            }

            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton ? submitButton.textContent : "";

            const customerName = valueOf("name").trim();
            const customerPhone = valueOf("phone").trim();
            const taluk = valueOf("taluk").trim();
            const area = valueOf("area").trim();
            const consultation = valueOf("consultation").trim();
            const preferred = valueOf("preferred").trim();
            const problem = valueOf("healthProblem").trim();

            const providerField = form.querySelector('[name="provider_id"]');
            const providerId = providerField && providerField.value
                ? providerField.value
                : null;

            if (!customerName || !customerPhone || !taluk || !consultation || !problem) {
                showHealthcareMessage("Please complete all required fields.", true);
                return;
            }

            if (
                customerName.length > 120 ||
                customerPhone.length < 7 ||
                customerPhone.length > 20
            ) {
                showHealthcareMessage(
                    "Please enter a valid name and phone number.",
                    true
                );
                return;
            }

            const messageParts = [
                "Healthcare requirement: " + consultation,
                "Preferred location: " + (preferred || "Not specified"),
                "Requirement details: " + problem
            ];

            if (providerId) {
                const selectedProvider = allHealthcareProviders.find(function (item) {
                    return item.id === providerId;
                });

                if (selectedProvider) {
                    messageParts.unshift(
                        "Requested provider: " +
                        (selectedProvider.organization_name || selectedProvider.name)
                    );
                }
            }

            const payload = {
                customer_name: customerName,
                customer_phone: customerPhone,
                category_id: healthcareCategoryId,
                provider_id: providerId,
                message: messageParts.join("\n"),
                area: area || null,
                taluk: taluk,
                status: "new"
            };

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Submitting…";
            }

            try {
                const { error } = await supabaseClient
                    .from("enquiries")
                    .insert(payload);

                if (error) throw error;

                const whatsappMessage = [
                    "Hello VELORA HELP,",
                    "",
                    "A healthcare enquiry has been submitted on the VELORA HELP website.",
                    "",
                    "Name: " + customerName,
                    "Phone: " + customerPhone,
                    "Taluk: " + taluk,
                    "Area: " + (area || "Not provided"),
                    "Requirement: " + consultation,
                    "Preferred location: " + (preferred || "Not specified"),
                    "",
                    problem,
                    "",
                    "Please guide me regarding the appropriate next step."
                ].join("\n");

                showHealthcareMessage(
                    "Your healthcare enquiry has been submitted successfully. Opening WhatsApp so you can also contact VELORA HELP."
                );

                const whatsappUrl = "https://wa.me/" + CONFIG.whatsappNumber +
                    "?text=" + encodeURIComponent(whatsappMessage);

                window.open(whatsappUrl, "_blank", "noopener,noreferrer");

                form.reset();

                if (providerField) providerField.value = "";
            } catch (error) {
                console.error("Healthcare enquiry submission failed:", error);

                showHealthcareMessage(
                    "We couldn't save your enquiry. Please check your connection and try again.",
                    true
                );
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            }
        });
    }

    function renderProviderDirectory(providers) {
        const grid = document.getElementById("healthcareProviderGrid");
        const count = document.getElementById("healthcareProviderCount");

        if (!grid) return;

        const list = Array.isArray(providers) ? providers : [];

        if (count) {
            count.textContent = list.length +
                (list.length === 1 ? " provider" : " providers");
        }

        if (!list.length) {
            grid.innerHTML =
                '<div class="directory-empty" style="grid-column:1/-1;">' +
                    '<h4>No verified healthcare providers listed yet</h4>' +
                    '<p>There are currently no active, verified healthcare providers matching this view. Once a genuine provider is added, verified and activated by the VELORA HELP team, their profile will appear here automatically.</p>' +
                    '<p>You can still submit a healthcare requirement using the enquiry form below.</p>' +
                '</div>';

            return;
        }

        grid.innerHTML = "";

        list.forEach(function (provider) {
            grid.appendChild(createProviderCard(provider));
        });
    }

    function createProviderCard(provider) {
        const article = document.createElement("article");
        article.className = "provider-card";

        const media = provider._media || {
            profile: "",
            logo: "",
            gallery: []
        };

        const displayName =
            provider.organization_name ||
            provider.name ||
            "Healthcare Provider";

        const profilePhoto = media.profile
            ? '<img class="provider-photo" src="' + escapeHTML(media.profile) +
                '" alt="' + escapeHTML(provider.name || displayName) +
                '" loading="lazy">'
            : '<div class="provider-photo provider-photo-placeholder" aria-hidden="true">🩺</div>';

        const specialty = provider.specialty
            ? '<p>' + escapeHTML(provider.specialty) + '</p>'
            : '<p>Healthcare provider</p>';

        const locationParts = [
            provider.area,
            provider.taluk,
            provider.district
        ].filter(Boolean);

        const location = locationParts.length
            ? '<p>📍 ' + escapeHTML(locationParts.join(", ")) + '</p>'
            : "";

        const address = provider.address
            ? '<p>' + escapeHTML(provider.address) + '</p>'
            : "";

        const qualifications = provider.qualifications
            ? '<p><strong>Qualifications:</strong> ' +
                escapeHTML(provider.qualifications) + '</p>'
            : "";

        const description = provider.description
            ? '<p>' + escapeHTML(provider.description) + '</p>'
            : "";

        const logo = media.logo
            ? '<div class="provider-logo-row"><img class="provider-logo" src="' +
                escapeHTML(media.logo) + '" alt="' +
                escapeHTML(displayName + " logo") +
                '" loading="lazy"><span>' +
                escapeHTML(provider.organization_type || "Organisation") +
                '</span></div>'
            : "";

        const gallery = media.gallery.length
            ? '<div class="provider-gallery" aria-label="Provider gallery">' +
                media.gallery.map(function (url, index) {
                    return '<img src="' + escapeHTML(url) +
                        '" alt="' + escapeHTML(displayName + " photo " + (index + 1)) +
                        '" loading="lazy">';
                }).join("") +
                '</div>'
            : "";

        const phone = normalisePhone(provider.phone);
        const whatsapp = normalisePhone(provider.whatsapp || provider.phone);

        const callButton = phone
            ? '<a class="btn btn-blue" href="tel:' +
                escapeHTML(phone) + '">📞 Call</a>'
            : "";

        const whatsappButton = whatsapp
            ? '<a class="btn btn-outline" href="https://wa.me/' +
                escapeHTML(whatsapp.replace(/^\+/, "")) +
                '" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>'
            : "";

        const mapQuery = provider.address || locationParts.join(", ");

        const directionsButton = mapQuery
            ? '<a class="btn btn-outline" href="https://www.google.com/maps/search/?api=1&query=' +
                encodeURIComponent(mapQuery) +
                '" target="_blank" rel="noopener noreferrer">📍 Directions</a>'
            : "";

        article.innerHTML =
            '<div class="provider-card-top">' +
                profilePhoto +
                '<div class="provider-title">' +
                    '<h4>' + escapeHTML(displayName) + '</h4>' +
                    specialty +
                    '<div class="provider-badges"><span class="provider-badge">✓ Verified by VELORA HELP</span></div>' +
                '</div>' +
            '</div>' +
            logo +
            '<div class="provider-details">' +
                location + address + qualifications + description +
            '</div>' +
            gallery +
            '<div class="provider-actions">' +
                callButton + whatsappButton + directionsButton +
                '<button type="button" class="btn btn-red" data-enquire-provider="' +
                    escapeHTML(provider.id) + '">Ask about this provider</button>' +
            '</div>';

        return article;
    }

    function normalisePhone(value) {
        if (!value) return "";
        return String(value).replace(/[^\d+]/g, "");
    }

    function valueOf(id) {
        const field = document.getElementById(id);
        return field ? String(field.value || "") : "";
    }

    function escapeHTML(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function showHealthcareMessage(message, isError) {
        const box = document.getElementById("message");

        if (!box) {
            window.alert(message);
            return;
        }

        box.textContent = message;
        box.style.display = "block";
        box.style.borderLeftColor = isError ? "#b42318" : "#067647";

        window.clearTimeout(showHealthcareMessage.timer);

        showHealthcareMessage.timer = window.setTimeout(function () {
            box.style.display = "none";
        }, 5500);
    }

    // Small public helpers for browser debugging; no sensitive credentials are exposed.
    window.veloraHealthcare = {
        refresh: async function () {
            if (!supabaseClient || !healthcareCategoryId) {
                throw new Error("Healthcare directory is not initialised.");
            }

            await loadHealthcareProviders();
            renderProviderDirectory(allHealthcareProviders);

            return allHealthcareProviders.length;
        },

        getVisibleProviderCount: function () {
            return allHealthcareProviders.length;
        }
    };
})();
