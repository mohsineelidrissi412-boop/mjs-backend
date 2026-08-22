document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    const successMsg = document.getElementById("success-message");
    const submitBtn = document.getElementById("reg-submit");

    if (registerForm) {
        registerForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            
            const password = document.getElementById("reg-password").value;
            const confirm = document.getElementById("reg-confirm").value;

            if (password !== confirm) {
                alert("Les mots de passe ne correspondent pas !");
                return;
            }

            const userData = {
                first_name: document.getElementById("reg-firstname").value.trim(),
                last_name: document.getElementById("reg-lastname").value.trim(),
                email: document.getElementById("reg-email").value.trim(),
                phone: document.getElementById("reg-phone").value.trim(),
                password: password
            };

            try {
                submitBtn.disabled = true;
                submitBtn.textContent = "Envoi en cours...";

                await window.api.register(userData);
                
                successMsg.style.display = "block";
                registerForm.reset();
                
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

                // Optionnel : rediriger vers login après 3 secondes
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 3000);

            } catch (error) {
                alert("Erreur lors de l'inscription: " + error.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = "Envoyer la demande";
            }
        });
    }
});
