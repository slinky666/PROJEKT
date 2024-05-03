function redirectToLogin() {
    window.location.href = "login.html";
}

function redirectToSignup() {
    window.location.href = "signup.html";
}

function signup() {
    var newUsername = document.getElementById('newUsername').value;
    var newPassword = document.getElementById('newPassword').value;

    localStorage.setItem('username', newUsername);
    localStorage.setItem('password', newPassword);

    alert("Konto skapat!");
    window.location.href = "login.html";
    return false;
}

function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    
    var savedUsername = localStorage.getItem('username');
    var savedPassword = localStorage.getItem('password');
    
    if (username === savedUsername && password === savedPassword) {
        alert("Inloggning lyckades!");
        return true;
    } else {
        alert("Fel användarnamn eller lösenord!");
        return false;
    }
}