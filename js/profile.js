// ==============================
// Sélection des éléments
// ==============================

const editBtn = document.getElementById("edit-profile");
const profileCard = document.querySelector(".profile-card");

// ==============================
// Création du formulaire
// ==============================

const form = document.createElement("div");

form.className = "edit-form";

form.innerHTML = `

<h2>Modifier mes informations</h2>

<input
type="text"
id="edit-nom"
placeholder="Nom">

<input
type="text"
id="edit-prenom"
placeholder="Prénom">

<input
type="number"
id="edit-age"
placeholder="Âge">

<select id="edit-sexe">

    <option>Masculin</option>

    <option>Féminin</option>

</select>

<input
type="text"
id="edit-telephone"
placeholder="Téléphone">

<input
type="email"
id="edit-email"
placeholder="Adresse Email">

<div class="form-buttons">

<button
class="save-btn"
id="save-profile">

Enregistrer

</button>

<button
class="cancel-btn"
id="cancel-profile">

Annuler

</button>

</div>

`;

profileCard.appendChild(form);

// ==============================
// Ouvrir le formulaire
// ==============================

editBtn.addEventListener("click", () => {

    document.getElementById("edit-nom").value =
    document.getElementById("nom").textContent;

    document.getElementById("edit-prenom").value =
    document.getElementById("prenom").textContent;

    document.getElementById("edit-age").value =
    document.getElementById("age").textContent.replace(" ans","");

    document.getElementById("edit-sexe").value =
    document.getElementById("sexe").textContent;

    document.getElementById("edit-telephone").value =
    document.getElementById("telephone").textContent;

    document.getElementById("edit-email").value =
    document.getElementById("email").textContent;

    form.classList.add("show");

});

// ==============================
// Enregistrer
// ==============================

document.addEventListener("click",(e)=>{

if(e.target.id==="save-profile"){

document.getElementById("nom").textContent =
document.getElementById("edit-nom").value;

document.getElementById("prenom").textContent =
document.getElementById("edit-prenom").value;

document.getElementById("age").textContent =
document.getElementById("edit-age").value+" ans";

document.getElementById("sexe").textContent =
document.getElementById("edit-sexe").value;

document.getElementById("telephone").textContent =
document.getElementById("edit-telephone").value;

document.getElementById("email").textContent =
document.getElementById("edit-email").value;

alert("Les informations ont été mises à jour.");

form.classList.remove("show");

}

});

// ==============================
// Annuler
// ==============================

document.addEventListener("click",(e)=>{

if(e.target.id==="cancel-profile"){

form.classList.remove("show");

}

});

// ==============================
// Changement de photo
// ==============================

const inputPhoto =
document.getElementById("photo-input");

const photo =
document.getElementById("profile-photo");

inputPhoto.addEventListener("change",function(){

const file=this.files[0];

if(file){

const reader=new FileReader();

reader.onload=function(e){

photo.src=e.target.result;

}

reader.readAsDataURL(file);

}

});


/* ==========================
   CV ENCADRANT
========================== */

.cv-actions{

    display:flex;
    gap:15px;
    margin-top:20px;

}

.blue-btn,
.green-btn{

    display:inline-block;
    padding:12px 20px;
    border-radius:8px;
    text-decoration:none;
    cursor:pointer;
    font-weight:bold;
    color:white;

}

.blue-btn{

    background:#0066cc;

}

.green-btn{

    background:#28a745;

}

.blue-btn:hover{

    background:#0052a3;

}

.green-btn:hover{

    background:#218838;

}