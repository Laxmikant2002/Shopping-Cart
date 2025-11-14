let fname = document.getElementById("fname");
let lname = document.getElementById("lname");
let email = document.getElementById("email");
let password = document.getElementById("password");
let confirmPassword = document.getElementById("confirmPassword");
let signupForm = document.getElementById("signupForm");
let error = document.getElementById("error");
let success = document.getElementById("success");

signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    error.textContent = "";
    success.textContent = "";

    if (fname.value == "" || lname.value == "" || email.value == "" || password.value == "" || confirmPassword.value == "") {
        error.textContent = "All fields are required.";
        return;
    }

    if (password.value !== confirmPassword.value) {
        error.textContent = "Passwords do not match.";
        return;
    }

    if (password.value.length < 4) {
        error.textContent = "Password must be at least 4 characters long.";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let existingUser = users.find((user) => user.email === email.value);
    
    if (existingUser) {
        error.textContent = "Email is already registered. Please login.";
        return;
    }

    users.push({
        email: email.value,
        password: password.value,
        fname: fname.value,
        lname: lname.value,
        createdAt: new Date().toISOString(),
    });

    localStorage.setItem("users", JSON.stringify(users));
    
    success.textContent = "Signup successful! Redirecting to login...";
    fname.value = "";
    lname.value = "";
    email.value = "";
    password.value = "";
    confirmPassword.value = "";

    setTimeout(() => {
        window.location.href = "login.html";
    }, 2000);
});
