const loginForm = document.getElementById("loginForm");
const submitBtn = loginForm.querySelector("button[type='submit']");

loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = "Connexion...";

        // Call our new API wrapper
        const user = await window.api.login(email, password);

        // Redirect based on role
        if (user.role === 'ADMIN') {
            window.location.href = "../admin/dashboard.html";
        } else if (user.role === 'ENCADRANT') {
            window.location.href = "../trainer/dashboard.html";
        } else {
            window.location.href = "../member/dashboard.html";
        }

    } catch (error) {
        alert("Erreur de connexion: " + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Se connecter";
    }
});