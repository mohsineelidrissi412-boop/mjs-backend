// =========================
// Navigation active
// =========================

const links = document.querySelectorAll('.nav-links a:not(.join-btn)');

links.forEach(link => {
    link.addEventListener('click', function () {

        links.forEach(item => {
            item.classList.remove('active');
        });

        this.classList.add('active');

    });
});


// =========================
// Slider accueil (si présent)
// =========================

const slider = document.getElementById('slider');

if (slider) {

    fetch('http://localhost:8000/api/v1/settings')
        .then(response => response.json())
        .then(data => {

            const slides = data.slider_images || [];

            slides.forEach((slide, index) => {

                slider.innerHTML += `
                    <div class="slide ${index === 0 ? 'active' : ''}">
                        <img src="http://localhost:8000${slide.image_url}" alt="Slide ${index + 1}">
                    </div>
                `;
            });

        })
        .catch(error => {
            console.log('[slider] Erreur lors du chargement des images:', error);
        });

}


// =========================
// Lire la suite Actualités
// =========================

document.addEventListener('DOMContentLoaded', () => {

    const readMoreBtn = document.querySelector('.read-more');
    const newsList = document.getElementById('news-list');
    const newsDetail = document.getElementById('news-detail');
    const backBtn = document.getElementById('back-btn');

    if (readMoreBtn && newsList && newsDetail) {

        readMoreBtn.addEventListener('click', () => {

            newsList.style.display = 'none';

            newsDetail.style.display = 'block';

            setTimeout(() => {
                newsDetail.classList.add('show');
            }, 10);

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        });

    }

    if (backBtn && newsList && newsDetail) {

        backBtn.addEventListener('click', () => {

            newsDetail.classList.remove('show');

            setTimeout(() => {

                newsDetail.style.display = 'none';

                newsList.style.display = 'block';

            }, 300);

        });

    }

});


// =========================
// Slider Actualité
// =========================

const slides = document.querySelectorAll('.news-slider .slide');
const dotsContainer = document.querySelector('.dots');

if (slides.length > 0 && dotsContainer) {

    let current = 0;

    slides.forEach((slide, index) => {

        const dot = document.createElement('span');

        dot.classList.add('dot');

        if (index === 0) {
            dot.classList.add('active');
        }

        dot.addEventListener('click', () => {
            showSlide(index);
        });

        dotsContainer.appendChild(dot);

    });

    const dots = document.querySelectorAll('.dot');

    function showSlide(index) {

        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        slides[index].classList.add('active');
        dots[index].classList.add('active');

        current = index;
    }

    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');

    if (nextBtn) {

        nextBtn.addEventListener('click', () => {

            current++;

            if (current >= slides.length) {
                current = 0;
            }

            showSlide(current);

        });

    }

    if (prevBtn) {

        prevBtn.addEventListener('click', () => {

            current--;

            if (current < 0) {
                current = slides.length - 1;
            }

            showSlide(current);

        });

    }

}

// =========================
// Événements
// =========================

const readEventBtn =
document.querySelector('.read-event');

const eventsList =
document.getElementById('events-list');

const eventDetail =
document.getElementById('event-detail');

const backEventBtn =
document.getElementById('back-event-btn');

if(readEventBtn){

    readEventBtn.addEventListener('click', ()=>{

        eventsList.style.display = 'none';

        eventDetail.style.display = 'block';

        window.scrollTo({
            top:0,
            behavior:'smooth'
        });

    });

}

if(backEventBtn){

    backEventBtn.addEventListener('click', ()=>{

        eventDetail.style.display = 'none';

        eventsList.style.display = 'block';

    });

}

/* =========================
   CLUBS
========================= */

const readClubBtn = document.querySelector('.read-club');
const clubsList = document.getElementById('clubs-list');
const clubDetail = document.getElementById('club-detail');

const backClubBtn = document.getElementById('back-club-btn');

const joinClubBtn = document.getElementById('join-club-btn');

const clubForm = document.getElementById('club-form');

const backFormBtn = document.getElementById('back-form-btn');

if(readClubBtn){

    readClubBtn.addEventListener('click', ()=>{

        clubsList.style.display = 'none';

        clubDetail.style.display = 'block';

        window.scrollTo({
            top:0,
            behavior:'smooth'
        });

    });

}

if(backClubBtn){

    backClubBtn.addEventListener('click', ()=>{

        clubDetail.style.display = 'none';

        clubsList.style.display = 'block';

    });

}

if(joinClubBtn){

    joinClubBtn.addEventListener('click', ()=>{

        clubDetail.style.display = 'none';

        clubForm.style.display = 'block';

    });

}

if(backFormBtn){

    backFormBtn.addEventListener('click', ()=>{

        clubForm.style.display = 'none';

        clubDetail.style.display = 'block';

    });

}



/* ==========================
   PASSE JEUNES
========================== */

const readServiceBtn =
document.querySelector('.read-service');

const servicesList =
document.getElementById('services-list');

const serviceDetail =
document.getElementById('service-detail');

const backServiceBtn =
document.getElementById('back-service-btn');

if(readServiceBtn){

    readServiceBtn.addEventListener('click', ()=>{

        servicesList.style.display = 'none';

        serviceDetail.style.display = 'block';

        window.scrollTo({
            top:0,
            behavior:'smooth'
        });

    });

}

if(backServiceBtn){

    backServiceBtn.addEventListener('click', ()=>{

        serviceDetail.style.display = 'none';

        servicesList.style.display = 'block';

    });

}

/* Slider */

const serviceSlides =
document.querySelectorAll('.service-slide');

let serviceCurrent = 0;

function showServiceSlide(index){

    serviceSlides.forEach(slide=>{

        slide.classList.remove('active');

    });

    serviceSlides[index]
    .classList.add('active');

}

const serviceNext =
document.querySelector('.service-next');

const servicePrev =
document.querySelector('.service-prev');

if(serviceNext){

    serviceNext.addEventListener('click', ()=>{

        serviceCurrent++;

        if(serviceCurrent >= serviceSlides.length){

            serviceCurrent = 0;

        }

        showServiceSlide(serviceCurrent);

    });

}

if(servicePrev){

    servicePrev.addEventListener('click', ()=>{

        serviceCurrent--;

        if(serviceCurrent < 0){

            serviceCurrent =
            serviceSlides.length - 1;

        }

        showServiceSlide(serviceCurrent);

    });

}



/*=========================
      REGISTER (Moved to register.js)
=========================*/



// ======================================
// Bouton d'accès
// ======================================

const accessBtn = document.getElementById("accessBtn");

if (accessBtn) {

    if (localStorage.getItem("hasAccount") === "true") {

        accessBtn.textContent = "Accéder à mon espace";

        accessBtn.href = "login.html";

    } else {

        accessBtn.textContent = "Nous rejoindre";

        accessBtn.href = "register.html";

    }

}



const accountType = document.getElementById("accountType");
const cvSection = document.getElementById("cvSection");
const clubsSection = document.getElementById("clubsSection");
const clubsTitle = document.getElementById("clubsTitle");

function updateForm() {

    if (!accountType || !cvSection || !clubsSection || !clubsTitle) return;

    cvSection.style.display = "none";
    clubsSection.style.display = "none";

    if (accountType.value === "member") {

        clubsSection.style.display = "block";
        clubsTitle.textContent = "Choisissez les clubs que vous souhaitez rejoindre";

    }

    else if (accountType.value === "trainer") {

        cvSection.style.display = "block";
        clubsSection.style.display = "block";
        clubsTitle.textContent = "Choisissez les clubs que vous souhaitez encadrer";

    }

    else if (accountType.value === "admin") {

        cvSection.style.display = "none";
        clubsSection.style.display = "none";

    }

}

updateForm();

accountType.addEventListener("change", updateForm);