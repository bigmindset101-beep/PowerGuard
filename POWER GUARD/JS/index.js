// ==============================
// 1. SELECT ELEMENTS
// ==============================

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const createLink = document.getElementById("createLink");
const promptText = document.getElementById("promptText");
const promptAction = document.getElementById("promptAction");

let mode = "login";


// ==============================
// 2. SWITCH BETWEEN LOGIN AND SIGNUP
// ==============================

function showLogin() {
    mode = "login";

    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");

    loginTab.classList.add("active");
    signupTab.classList.remove("active");

    promptText.textContent = "Don't have an account?";
    promptAction.textContent = "Create Account";
}

function showSignup() {
    mode = "signup";

    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

    signupTab.classList.add("active");
    loginTab.classList.remove("active");

    promptText.textContent = "Already have an account?";
    promptAction.textContent = "Log In";
}

loginTab.addEventListener("click", showLogin);
signupTab.addEventListener("click", showSignup);

// One button, one listener: it flips whichever mode is active
createLink.addEventListener("click", () => {
    mode === "login" ? showSignup() : showLogin();
});


// ==============================
// 3. SHOW / HIDE PASSWORD
// ==============================

document.querySelectorAll(".toggle-password").forEach(button => {

    button.addEventListener("click", () => {

        const input = document.getElementById(button.dataset.target);
        const iconUse = button.querySelector("use");
        const showing = input.type === "text";

        input.type = showing ? "password" : "text";
        iconUse.setAttribute("href", showing ? "#i-eye" : "#i-eye-off");
        button.setAttribute(
            "aria-label",
            showing ? "Show password" : "Hide password"
        );

    });

});


// ==============================
// 4. LOGIN FORM SUBMISSION
// ==============================

document.getElementById("login").addEventListener("submit", function (event) {

    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("Please complete all fields.");
        return;
    }

    // Backend authentication will be connected here.
    alert("Login interface working! Connect backend authentication next.");

});


// ==============================
// 5. SIGNUP FORM SUBMISSION
// ==============================

document.getElementById("signup").addEventListener("submit", function (event) {

    event.preventDefault();

    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password.length < 8) {
        alert("Password must contain at least 8 characters.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();

    // TEMPORARY (no backend yet): remember who signed up so the next pages
    // can show their name. Never store the password here.
    // When the backend is ready, replace this with the real signup call.
    localStorage.setItem(
        "powerguardUser",
        JSON.stringify({ fullName: fullName, email: email })
    );

    alert("Registration interface working! Connect backend next.");

});


// ==============================
// 6. GOOGLE SIGN-IN
// ==============================

document.getElementById("googleLogin").addEventListener("click", function () {
    alert("Google Sign-In will be activated after Firebase Authentication setup.");
});


// ==============================
// 7. FORGOT PASSWORD
// ==============================

document.getElementById("forgotPassword").addEventListener("click", function (event) {

    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();

    if (!email) {
        alert("Please enter your email address first.");
    } else {
        alert("Password reset will be connected to the backend.");
    }

});