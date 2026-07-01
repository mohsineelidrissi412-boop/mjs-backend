// ==============================
// Navigation du menu latéral
// ==============================

const menuItems = document.querySelectorAll(".sidebar ul li");
const sections = document.querySelectorAll(".section");

menuItems.forEach(item => {

    item.addEventListener("click", () => {

        // Retirer la classe active du menu
        menuItems.forEach(li => li.classList.remove("active"));

        // Activer le menu sélectionné
        item.classList.add("active");

        // Masquer toutes les sections
        sections.forEach(section => {
            section.classList.remove("active");
        });

        // Afficher la section sélectionnée
        const target = item.getAttribute("data-section");

        const selectedSection = document.getElementById(target);

        if(selectedSection){
            selectedSection.classList.add("active");
        }

    });

});


// ==============================
// Bouton Modifier le profil
// ==============================
const editButton =
document.getElementById("edit-profile");

const editForm =
document.getElementById("edit-form");

const cancelButton =
document.getElementById("cancel-edit");

const saveButton =
document.getElementById("save-profile");

if(editButton){

    editButton.onclick = ()=>{

        document.getElementById("edit-nom").value =
        document.getElementById("nom").textContent;

        document.getElementById("edit-prenom").value =
        document.getElementById("prenom").textContent;

        document.getElementById("edit-age").value =
        parseInt(document.getElementById("age").textContent);

        document.getElementById("edit-sexe").value =
        document.getElementById("sexe").textContent;

        document.getElementById("edit-tel").value =
        document.getElementById("telephone").textContent;

        document.getElementById("edit-email").value =
        document.getElementById("email").textContent;

        editForm.classList.add("show");

        window.scrollTo({

            top:document.body.scrollHeight,

            behavior:"smooth"

        });

    }

}

if(cancelButton){

    cancelButton.onclick=()=>{

        editForm.classList.remove("show");

    }

}

if(saveButton){

    saveButton.onclick=()=>{

        document.getElementById("nom").textContent =
        document.getElementById("edit-nom").value;

        document.getElementById("prenom").textContent =
        document.getElementById("edit-prenom").value;

        document.getElementById("age").textContent =
        document.getElementById("edit-age").value + " ans";

        document.getElementById("sexe").textContent =
        document.getElementById("edit-sexe").value;

        document.getElementById("telephone").textContent =
        document.getElementById("edit-tel").value;

        document.getElementById("email").textContent =
        document.getElementById("edit-email").value;

        editForm.classList.remove("show");

        alert("Informations mises à jour avec succès.");

    }

}


const clubButtons =
document.querySelectorAll(".view-club");

const clubsSection =
document.getElementById("clubs");

const detailsSection =
document.getElementById("club-details");

const backClub =
document.getElementById("back-clubs");

clubButtons.forEach(button=>{

    button.onclick=()=>{

        clubsSection.classList.remove("active");

        detailsSection.classList.add("active");

    }

});

backClub.onclick=()=>{

    detailsSection.classList.remove("active");

    clubsSection.classList.add("active");

};

const passwordForm =
document.getElementById("password-form");

if(passwordForm){

    passwordForm.addEventListener("submit",(e)=>{

        e.preventDefault();

        const oldPassword =
        document.getElementById("old-password").value;

        const newPassword =
        document.getElementById("new-password").value;

        const confirmPassword =
        document.getElementById("confirm-password").value;

        if(newPassword !== confirmPassword){

            alert("Les mots de passe ne correspondent pas.");

            return;

        }

        alert("Mot de passe modifié avec succès.");

        passwordForm.reset();

    });

}


const logout =
document.getElementById("logout");

if(logout){

    logout.onclick=()=>{

        if(confirm("Voulez-vous vraiment vous déconnecter ?")){

            window.location.href="../login.html";

        }

    }

}


// ==============================
// Prévisualisation de la photo
// ==============================

const photoInput =
document.getElementById("edit-photo");

const previewPhoto =
document.getElementById("preview-photo");

const memberPhoto =
document.getElementById("member-photo");

if(photoInput){

    photoInput.addEventListener("change",function(){

        const file = this.files[0];

        if(file){

            const reader = new FileReader();

            reader.onload = function(e){

                previewPhoto.src = e.target.result;

                memberPhoto.src = e.target.result;

            }

            reader.readAsDataURL(file);

        }

    });

}