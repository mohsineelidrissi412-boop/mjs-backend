const editBtn = document.getElementById("edit-profile");

editBtn.addEventListener("click", function () {

    const infos = [
        "nom",
        "prenom",
        "age",
        "sexe",
        "telephone",
        "email"
    ];

    if (editBtn.dataset.editing !== "true") {

        infos.forEach(id => {

            const element = document.getElementById(id);

            const input = document.createElement("input");

            input.type = "text";
            input.value = element.textContent.trim();
            input.className = "edit-input";

            element.replaceWith(input);
            input.id = id;

        });

        editBtn.textContent = "Enregistrer";
        editBtn.dataset.editing = "true";

    } else {

        infos.forEach(id => {

            const input = document.getElementById(id);

            const strong = document.createElement("strong");

            strong.id = id;
            strong.textContent = input.value;

            input.replaceWith(strong);

        });

        editBtn.textContent = "Modifier mes informations";
        editBtn.dataset.editing = "false";

        alert("Informations enregistrées avec succès.");

    }

});