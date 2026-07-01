// ================================
// Modifier les informations
// ================================

const editButton = document.getElementById("edit-profile");
const editForm = document.getElementById("edit-form");

const cancelButton = document.getElementById("cancel-profile");
const saveButton = document.getElementById("save-profile");

// Afficher le formulaire

if(editButton){

    editButton.addEventListener("click",()=>{

        document.getElementById("edit-nom").value =
        document.getElementById("nom").textContent.trim();

        document.getElementById("edit-prenom").value =
        document.getElementById("prenom").textContent.trim();

        document.getElementById("edit-age").value =
        parseInt(document.getElementById("age").textContent);

        document.getElementById("edit-sexe").value =
        document.getElementById("sexe").textContent.trim();

        document.getElementById("edit-phone").value =
        document.getElementById("telephone").textContent.trim();

        document.getElementById("edit-email").value =
        document.getElementById("email").textContent.trim();

        editForm.classList.add("show");

        window.scrollTo({

            top:document.body.scrollHeight,

            behavior:"smooth"

        });

    });

}

// Annuler

if(cancelButton){

    cancelButton.addEventListener("click",()=>{

        editForm.classList.remove("show");

    });

}

// Enregistrer

if(saveButton){

    saveButton.addEventListener("click",()=>{

        document.getElementById("nom").textContent =
        document.getElementById("edit-nom").value;

        document.getElementById("prenom").textContent =
        document.getElementById("edit-prenom").value;

        document.getElementById("age").textContent =
        document.getElementById("edit-age").value + " ans";

        document.getElementById("sexe").textContent =
        document.getElementById("edit-sexe").value;

        document.getElementById("telephone").textContent =
        document.getElementById("edit-phone").value;

        document.getElementById("email").textContent =
        document.getElementById("edit-email").value;

        editForm.classList.remove("show");

        alert("Vos informations ont été mises à jour avec succès.");

    });

}

// =====================================
// Changer la photo de profil
// =====================================

const photoInput =
document.getElementById("photo-input");

const profilePhoto =
document.getElementById("profile-photo");

if(photoInput){

    photoInput.addEventListener("change",function(){

        const file = this.files[0];

        if(file){

            const reader = new FileReader();

            reader.onload = function(e){

                profilePhoto.src = e.target.result;

            }

            reader.readAsDataURL(file);

        }

    });

}