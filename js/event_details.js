// ========================================
// Données des événements
// (Plus tard elles seront chargées depuis
// la base de données)
// ========================================

const events = {

    1: {

        title: "Hackathon IA",

        description: "Le Hackathon IA est un événement destiné aux jeunes passionnés par la programmation, l'intelligence artificielle et l'innovation. Les participants travaillent en équipe afin de réaliser des projets, relever différents défis et développer leurs compétences dans un environnement collaboratif.",

        images: [

            "../images/events/event1.jpg",
            "../images/events/event2.jpg",
            "../images/events/event3.jpg"

        ]

    },

    2: {

        title: "Formation Robotique",

        description: "La Formation Robotique permet aux jeunes de découvrir Arduino, les capteurs, l'électronique et la programmation embarquée grâce à des ateliers pratiques et des démonstrations.",

        images: [

            "../images/events/robot1.jpg",
            "../images/events/robot2.jpg",
            "../images/events/robot3.jpg"

        ]

    }

};

// ========================================
// Lecture de l'identifiant
// ========================================

const params = new URLSearchParams(window.location.search);

const eventId = params.get("id") || 1;

const event = events[eventId];

// ========================================
// Affichage des informations
// ========================================

document.getElementById("event-title").textContent = event.title;

document.getElementById("event-description").textContent = event.description;

// ========================================
// Slider
// ========================================

let currentImage = 0;

const sliderImage = document.getElementById("slider-image");

function showImage(){

    sliderImage.src = event.images[currentImage];

}

document.querySelector(".next").addEventListener("click", () => {

    currentImage++;

    if(currentImage >= event.images.length){

        currentImage = 0;

    }

    showImage();

});

document.querySelector(".prev").addEventListener("click", () => {

    currentImage--;

    if(currentImage < 0){

        currentImage = event.images.length - 1;

    }

    showImage();

});

// ========================================
// Défilement automatique
// ========================================

setInterval(() => {

    currentImage++;

    if(currentImage >= event.images.length){

        currentImage = 0;

    }

    showImage();

}, 4000);

// Première image

showImage();