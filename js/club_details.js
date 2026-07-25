// ========================================
// Images du club
// (Plus tard elles seront chargées depuis
// la base de données)
// ========================================

const clubs = {

    1:{

        title:"Club Informatique",

        description:"Le Club Informatique permet aux jeunes de développer leurs compétences dans le développement Web, la programmation, l'intelligence artificielle, les bases de données et la cybersécurité. Les membres participent à des ateliers, réalisent des projets pratiques et prennent part à différentes compétitions.",

        images:[

            "../images/clubs/informatique1.jpg",
            "../images/clubs/informatique2.jpg",
            "../images/clubs/informatique3.jpg"

        ]

    },

    2:{

        title:"Club Robotique",

        description:"Le Club Robotique initie les jeunes à l'électronique, Arduino, la programmation embarquée et la conception de robots. Les activités sont basées sur des projets pratiques et des compétitions.",

        images:[

            "../images/clubs/robotique1.jpg",
            "../images/clubs/robotique2.jpg",
            "../images/clubs/robotique3.jpg"

        ]

    }

};

// ========================================
// Lecture de l'identifiant du club
// ========================================

const params = new URLSearchParams(window.location.search);

const clubId = params.get("id") || 1;

const club = clubs[clubId];

// ========================================
// Remplissage de la page
// ========================================

document.getElementById("club-title").textContent = club.title;

document.getElementById("club-description").textContent = club.description;

// ========================================
// Slider
// ========================================

let currentImage = 0;

const sliderImage = document.getElementById("slider-image");

function showImage(){

    sliderImage.src = club.images[currentImage];

}

document.querySelector(".next").addEventListener("click",()=>{

    currentImage++;

    if(currentImage >= club.images.length){

        currentImage = 0;

    }

    showImage();

});

document.querySelector(".prev").addEventListener("click",()=>{

    currentImage--;

    if(currentImage < 0){

        currentImage = club.images.length-1;

    }

    showImage();

});

// ========================================
// Défilement automatique
// ========================================

setInterval(()=>{

    currentImage++;

    if(currentImage >= club.images.length){

        currentImage = 0;

    }

    showImage();

},4000);

showImage();