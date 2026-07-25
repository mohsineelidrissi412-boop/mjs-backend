// ======================================
// Messages des encadrants
// ======================================

const announcements = {

    "1": {

        club: "Club Informatique",

        title: "Message de M. Ahmed",

        date: "15 Juin 2026",

        message: `Bonjour à tous,

Le prochain atelier du Club Informatique aura lieu samedi à 14h00.

Merci d'apporter votre ordinateur portable ainsi que votre carnet de notes.

À bientôt !`

    },

    "2": {

        club: "Club Robotique",

        title: "Message de Mme Sara",

        date: "20 Juin 2026",

        message: `Bonjour à tous,

La séance de mercredi est reportée à 15h00.

Nous commencerons un nouveau projet Arduino.

Merci d'être présents à l'heure.

À bientôt !`

    }

};

// ======================================
// Lecture de l'ID dans l'URL
// ======================================

const params = new URLSearchParams(window.location.search);

const announcementId = params.get("id") || "1";

// ======================================
// Vérification
// ======================================

if (!announcements[announcementId]) {

    document.getElementById("club-name").textContent = "Annonce introuvable";

    document.getElementById("announcement-title").textContent = "Erreur";

    document.getElementById("announcement-date").textContent = "";

    document.getElementById("announcement-message").textContent =
    "Cette annonce n'existe pas.";

} else {

    const announcement = announcements[announcementId];

    document.getElementById("club-name").textContent =
    announcement.club;

    document.getElementById("announcement-title").textContent =
    announcement.title;

    document.getElementById("announcement-date").textContent =
    announcement.date;

    document.getElementById("announcement-message").textContent =
    announcement.message;

}