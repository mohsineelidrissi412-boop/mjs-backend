// ==============================
// Confirmation de déconnexion
// ==============================

const logoutLink = document.querySelector('a[href="../public/login.html"]');

if (logoutLink) {

    logoutLink.addEventListener("click", function (e) {

        const confirmation = confirm("Voulez-vous vraiment vous déconnecter ?");

        if (!confirmation) {

            e.preventDefault();

        }

    });

}

// ==============================
// Animation des cartes
// ==============================

const cards = document.querySelectorAll(".stat-card");

cards.forEach((card, index) => {

    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";

    setTimeout(() => {

        card.style.transition = "0.5s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";

    }, index * 150);

});

// ==============================
// Animation des activités
// ==============================

const activities = document.querySelectorAll(".activity-card");

activities.forEach((activity, index) => {

    activity.style.opacity = "0";
    activity.style.transform = "translateX(-20px)";

    setTimeout(() => {

        activity.style.transition = "0.5s ease";
        activity.style.opacity = "1";
        activity.style.transform = "translateX(0)";

    }, 500 + index * 200);

});

// ==============================
// Animation de la carte événement
// ==============================

const eventCard = document.querySelector(".event-card");

if (eventCard) {

    eventCard.style.opacity = "0";
    eventCard.style.transform = "translateY(30px)";

    setTimeout(() => {

        eventCard.style.transition = "0.6s ease";
        eventCard.style.opacity = "1";
        eventCard.style.transform = "translateY(0)";

    }, 1200);

}





