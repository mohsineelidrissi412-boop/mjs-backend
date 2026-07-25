const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value.trim();

    // Vérifier les champs

    if (email === "" || password === "") {

        alert("Veuillez remplir tous les champs.");

        return;

    }

    // ================================
    // Simulation de connexion
    // ================================

    // Plus tard, cette partie sera remplacée
    // par la vérification dans la base de données.

    localStorage.setItem("hasAccount", "true");

    localStorage.setItem("memberEmail", email);

    alert("Connexion réussie.");

    window.location.href = "../member/dashboard.html";

});