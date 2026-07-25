// ======================================
// TABLEAU DE BORD ENCADRANT
// ======================================

// Informations de l'encadrant

const trainer = {

    name: "Ahmed",

    clubs: 2,

    events: 4,

    announcements: 6

};

// Derniers événements

const recentEvents = [

    {

        title: "Atelier Intelligence Artificielle",

        date: "20 Juin 2026"

    },

    {

        title: "Formation Arduino",

        date: "05 Juillet 2026"

    },

    {

        title: "Concours Robotique",

        date: "10 Juillet 2026"

    }

];

// Dernières annonces

const recentAnnouncements = [

    {

        title: "Séance reportée",

        date: "15 Juin 2026"

    },

    {

        title: "Nouveau matériel disponible",

        date: "10 Juin 2026"

    },

    {

        title: "Préparation du concours national",

        date: "08 Juin 2026"

    }

];

// ======================================

document.addEventListener("DOMContentLoaded", () => {

    // Nom

    document.querySelector(".member-card h3").textContent = trainer.name;

    document.querySelector(".welcome-card h1").textContent =
    "Bonjour " + trainer.name;

    // Statistiques

    const stats = document.querySelectorAll(".stat-card h2");

    stats[0].textContent = trainer.clubs;

    stats[1].textContent = trainer.events;

    stats[2].textContent = trainer.announcements;

});