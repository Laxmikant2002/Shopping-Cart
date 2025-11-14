let email = document.getElementById("email");
let password = document.getElementById("password");
let error = document.getElementById("error");
let loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    error.textContent = "";
    error.className = "error-message";

    if (email.value == "" || password.value == "") {
        error.textContent = "All fields are required.";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    if (users.length === 0) {
        error.textContent = "No users registered. Please sign up first.";
        return;
    }

    let user = users.find((user) => user.email === email.value);
    
    if (!user) {
        error.textContent = "Email not found. Please check your email or sign up.";
        return;
    }

    if (user.password !== password.value) {
        error.textContent = "Incorrect password. Please try again.";
        return;
    }

    // Login successful - Generate token
    const token = generateToken();
    const userWithToken = { ...user, token, lastLogin: new Date().toISOString() };
    
    error.className = "success-message";
    error.textContent = "Login successful! Redirecting...";
    localStorage.setItem("currentUser", JSON.stringify(userWithToken));
    localStorage.setItem("authToken", token);
    
    setTimeout(() => {
        window.location.href = "profile/index.html";
    }, 1000);
});

// Generate authentication token
function generateToken() {
    return 'token_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
}
