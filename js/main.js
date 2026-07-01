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

    fetch('/api/sliders')
        .then(response => response.json())
        .then(data => {

            data.forEach((slide, index) => {

                slider.innerHTML += `
                    <div class="slide ${index === 0 ? 'active' : ''}">
                        <img src="${slide.image}" alt="${slide.titre}">
                        <div class="slide-content">
                            <h2>${slide.titre}</h2>
                        </div>
                    </div>
                `;
            });

        })
        .catch(error => {
            console.log(error);
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
      REGISTER
=========================*/

const photoInput =
document.getElementById("photo");

const preview =
document.getElementById("preview");

if(photoInput){

    photoInput.addEventListener("change",function(){

        const file=this.files[0];

        if(file){

            preview.src=URL.createObjectURL(file);

            preview.style.display="block";

        }

    });

}

const registerForm=
document.getElementById("register-form");

const success=
document.getElementById("success-message");

if(registerForm){

    registerForm.addEventListener("submit",function(e){

        e.preventDefault();

        success.style.display="block";

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

}

































