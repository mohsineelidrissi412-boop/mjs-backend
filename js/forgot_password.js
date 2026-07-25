// ======================================
// MOT DE PASSE OUBLIÉ
// ======================================

const forgotForm = document.getElementById("forgotForm");

forgotForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    if (email === "") {

        alert("Veuillez saisir votre adresse e-mail.");

        return;

    }

    // Cette partie sera remplacée plus tard
    // par l'envoi réel d'un e-mail.

    alert("Si cette adresse e-mail existe, un lien de réinitialisation sera envoyé.");

    document.getElementById("email").value = "";

    window.location.href = "login.html";

});