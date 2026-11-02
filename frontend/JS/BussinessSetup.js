// ==========================================
// POWERGUARD - BUSINESS SETUP JAVASCRIPT
// ==========================================


// 1. SELECT HTML ELEMENTS

const powerOptions = document.querySelectorAll(".power-option");
const form = document.getElementById("businessSetup");
const toast = document.getElementById("toast");
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

const profileName = document.getElementById("profileName");
const profileAvatar = document.getElementById("profileAvatar");
const profileBusiness = document.getElementById("profileBusiness");
const businessNameInput = document.getElementById("businessName");


// ==========================================
// 2. USER PROFILE (name + initials)
// ==========================================

// Single place that provides the logged-in user.
// TODAY: reads what the login page saved in the browser.
// LATER (backend/Firebase): replace the body of this function with
//   the real call, e.g.  return await fetch("/api/me").then(r => r.json());
// and keep the rest of the page exactly as it is.
function getCurrentUser() {

    try {

        const saved = localStorage.getItem("powerguardUser");

        return saved ? JSON.parse(saved) : null;

    } catch (error) {

        return null;

    }

}


// "john doe"        -> "JD"
// "Victory Okoro"   -> "VO"
// "Mary Ann Smith"  -> "MS"  (first + last name)
// "Victory"         -> "V"   (only one name)
function getInitials(fullName) {

    const parts = fullName.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {

        return "U";

    }

    const first = parts[0][0];

    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";

    return (first + last).toUpperCase();

}


function renderProfile() {

    const user = getCurrentUser();

    if (user && user.fullName) {

        profileName.textContent = user.fullName;

        profileAvatar.textContent = getInitials(user.fullName);

    }

    // Business name shown under the user's name
    const savedSetup = JSON.parse(
        sessionStorage.getItem("powerguardBusinessSetup") || "null"
    );

    if (savedSetup && savedSetup.businessName) {

        profileBusiness.textContent = savedSetup.businessName;

    }

}

renderProfile();


// Update the business name under the profile while the user types it

businessNameInput.addEventListener("input", () => {

    const typed = businessNameInput.value.trim();

    profileBusiness.textContent = typed || "Set up your business";

});


// ==========================================
// 3. STORE SELECTED POWER SOURCES
// ==========================================

const selectedSources = new Set();

powerOptions.forEach((option) => {

    option.addEventListener("click", () => {

        const source = option.dataset.source;

        if (selectedSources.has(source)) {

            selectedSources.delete(source);

            option.classList.remove("selected");

            option.setAttribute("aria-pressed", "false");

        } else {

            selectedSources.add(source);

            option.classList.add("selected");

            option.setAttribute("aria-pressed", "true");

        }

        document.getElementById("powerError").textContent = "";

    });

});


// ==========================================
// 4. NOTIFICATION MESSAGE
// ==========================================

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    window.setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


// ==========================================
// 5. CLEAR FORM ERRORS
// ==========================================

function clearErrors() {

    document.getElementById("businessNameError").textContent = "";

    document.getElementById("businessCategoryError").textContent = "";

    document.getElementById("powerError").textContent = "";

}


// ==========================================
// 6. HANDLE FORM SUBMISSION
// ==========================================

form.addEventListener("submit", (event) => {

    event.preventDefault();

    clearErrors();

    const businessName = businessNameInput.value.trim();

    const businessCategory = document
        .getElementById("businessCategory")
        .value;

    const location = document
        .getElementById("location")
        .value.trim();

    let valid = true;

    if (!businessName) {

        document.getElementById("businessNameError").textContent =
            "Please enter your business name.";

        valid = false;

    }

    if (!businessCategory) {

        document.getElementById("businessCategoryError").textContent =
            "Please select a business category.";

        valid = false;

    }

    if (selectedSources.size === 0) {

        document.getElementById("powerError").textContent =
            "Select at least one power source to continue.";

        valid = false;

    }

    if (!valid) {

        return;

    }

    // Collect business information

    const setupData = {

        businessName: businessName,

        businessCategory: businessCategory,

        location: location,

        powerSources: [...selectedSources]

    };

    // Save temporarily in the browser (backend will replace this)

    sessionStorage.setItem(
        "powerguardBusinessSetup",
        JSON.stringify(setupData)
    );

    profileBusiness.textContent = businessName;

    showToast("Business details saved! Ready for the next step.");

    console.log("PowerGuard Business Setup:", setupData);

});


// ==========================================
// 7. BACK BUTTON
// ==========================================

document.getElementById("backButton").addEventListener("click", () => {

    showToast("Back navigation will be connected to the previous page.");

});


// ==========================================
// 8. MOBILE SIDEBAR MENU
// ==========================================

menuToggle.addEventListener("click", () => {

    sidebar.classList.toggle("open");

});

document.addEventListener("click", (event) => {

    if (

        window.innerWidth <= 820 &&

        sidebar.classList.contains("open") &&

        !sidebar.contains(event.target) &&

        !menuToggle.contains(event.target)

    ) {

        sidebar.classList.remove("open");

    }

});


// ==========================================
// 9. INITIALIZE LUCIDE ICONS
// ==========================================

if (window.lucide) {

    lucide.createIcons();

}


// ==========================================
// END OF POWERGUARD BUSINESS SETUP JAVASCRIPT
// ==========================================