
//** fonction qui récupère le tableau des projets **/:

async function getProjects () {
    const response = await  fetch ("http://localhost:5678/api/works");
    return response.json()
   
}

//** Affichage des projets dans le DOM **/
const gallery = document.querySelector(".gallery");

function createProjects(project){
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    img.src = project.imageUrl;
    figcaption.innerText = project.title;
    figure.dataset.id = project.categoryId; // Ajoute l'ID de la catégorie en tant que dataset pour lier les figures à leurs catégories respectives.
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
}

async function displayProjects() {
    const projects = await getProjects ()
    projects.forEach(project => {
        createProjects(project)
    });
}

//*** Affichage des boutons par catégories ***//

// récupérer le tableau des catégories //

async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    return response.json();
}

// Afficher le tableau des catégories //

const filters = document.querySelector(".filters");

function createButton (category){
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.id = category.id;
    filters.appendChild(btn);

    if (category.id === 0) {
        btn.classList.add("selected"); // Ajouter la classe "selected" au bouton 'Tous'
    }
}

async function displayCategoriesButtons(){
    const categories = await getCategories();
    categories.unshift({ id: 0, name: "Tous" }); // Ajoute une catégorie "Tous" pour permettre l'affichage de tous les travaux.
    categories.forEach(createButton);
    filterCategory();
}

//*** Filtrer par catégorie au clic ***//

async function filterCategory() {
    const buttons = document.querySelectorAll(".filters button");
    const figures = gallery.querySelectorAll('figure');
 
    buttons.forEach(button => {
        button.addEventListener("click", (event) => {
            const btnId = event.target.id;

            // Retirer la classe "selected" de tous les boutons
            buttons.forEach(btn => btn.classList.remove('selected'));
            // Ajouter la classe "selected" au bouton cliqué
            event.target.classList.add('selected');

            if (btnId !== "0") {
                // Afficher/masquer les figures en fonction de l'ID de la catégorie
                figures.forEach(figure => {
                    if (figure.dataset.id === btnId) {
                        figure.style.display = "block"; // Afficher les figures correspondantes
                    } else {
                        figure.style.display = "none"; // Masquer les autres figures
                    }
                });
            } else {
                // Afficher toutes les figures si la catégorie "Tous" est sélectionnée
                figures.forEach(figure => {
                    figure.style.display = "block";
                });
            }
        });
    });
}

async function initialize() {
    await displayProjects();
    await displayCategoriesButtons();
}

initialize()

                        //******************* Gestion page d'acueille ***********//

//** fonction de modification de l'affichage en Mode Edition **//

function setModification(classModif, textHtml) {
    // on récupère et on crée les éléments à modifier
    const Element = document.querySelector(classModif);
    const icone = document.createElement("i");
    const text = document.createElement("p");

    icone.classList.add("fa-regular", "fa-pen-to-square");
    text.innerText = textHtml;

    Element.appendChild(icone);
    Element.appendChild(text);

    // on personnalise l'élément à modifier
    if (classModif == ".mode-edition") {
        Element.classList.add("mode-edition-style");
    }
    else if (classModif == ".projects") {
        text.classList.add("modalLink")
    }
}

//** Fonction login **//

function checkLoginStatus() {
    // On récupère le token
    const loginLink = document.getElementById("login-button");
    let token = sessionStorage.getItem("token");
    const isLogged = token ? true : false;
    // On modifie l'affichage et la redirection du lien login
    if (isLogged) {
        loginLink.innerHTML = "Logout";
        loginLink.href = "./index.html";
        loginLink.addEventListener("click", logout);
    } else {
        loginLink.innerHTML = "Login";
        loginLink.href = "./login.html";
        loginLink.removeEventListener("click", logout); 
    }
    // On modifie l'affichage du mode édition
    if (isLogged) {
        setModification(".mode-edition", "Mode édition")
        setModification(".modif", "modifier")
        setModification(".projects", "modifier")

        const buttonContainerEdition = document.querySelector(".filters");
        buttonContainerEdition.classList.add("filter-buttons-hide");
    }
}
 
// logout() elle va s'occuper de la déconnection, vider le local storage
function logout() {
    sessionStorage.removeItem("token");
    window.location.href = "./index.html"; // Rediriger vers la page de login après la déconnexion
}
checkLoginStatus();


                            /*************** GALERIE - MODALES ***************/

//** fonction pour gérer la modale **//

const modal = document.querySelector(".modal")
const modalLink = document.querySelector(".modalLink");
const faXmark = document.querySelector(".modal-wrapper .fa-xmark")

function manageDisplayModal() {
// Ouvrir la modale //
    modalLink.addEventListener("click", () => {
        modal.style.display = "flex";
    })
 // Fermer la modale au clique sur le croix //
    faXmark.addEventListener("click", () => {
        modal.style.display = "none";
    })
// Fermer la modale au clique en dehors de la modale //
    modal.addEventListener("click", (e) => {
        if (e.target.className == "modal") {
            modal.style.display = "none"; 
        }
    })
}
manageDisplayModal();

//** Affichage des projets dans la galerie **//

async function displayProjectsModal () {
    const projectsModal = document.querySelector(".projetcsModal");
    projectsModal.innerHTML ="";
    const works = await getProjects()
    works.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const trash = document.createElement("i");
        img.src = work.imageUrl;
        trash.classList.add("fa-solid", "fa-trash-can");
        trash.id = work.id;
        figure.appendChild(trash);
        figure.appendChild(img);
        projectsModal.appendChild(figure)
    });
    deleteProject();
}
displayProjectsModal ()

//** fonction de suppression de travaux existants **//

async function deleteProject() {
    const allTrash = document.querySelectorAll(".fa-trash-can");
    allTrash.forEach(trash => {
        trash.addEventListener("click", async (event) => {
            event.preventDefault();
            const token = JSON.parse(sessionStorage.getItem("token"));
            const id = trash.id;
            try {
                const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Accept": "*/*",
                        "Authorization": `Bearer ${token.token}`
                    }
                });
                if (response.ok) {
                    // Supprimer l'élément de l'interface utilisateur
                    trash.closest("figure").remove();
                } else {
                    alert("Échec de la suppression du projet.");
                }
            } catch (error) {
                alert("Problème de connexion au serveur.");
            }
        });
    });
}

//** fonction pour gérer la 2eme modale **//

const addProject = document.querySelector(".add-project");
const faXmarkII = document.querySelector(".modalAddProject .fa-xmark");
const modalWrapper = document.querySelector(".modal-wrapper")
const modalAddProject = document.querySelector(".modalAddProject");
const arrowLeft = document.querySelector(".fa-arrow-left")

function displayModalAddProject() {
    const form = document.querySelector(".modalAddProject form");
// Ouvrir la modale //
    addProject.addEventListener("click", () => {
        initForm(); //reinitialiser le formulaire
        modalAddProject.style.display = "flex";
        modalWrapper.style.display = "none"
    })
     // Retour à la modale principal //
     arrowLeft.addEventListener("click", () => {
        modalAddProject.style.display = "none";
        modalWrapper.style.display = "flex"
    })
     // Fermer la modale au clique sur le croix //
     faXmarkII.addEventListener("click", () => {
        modal.style.display = "none";
        //pour fermer la 2eme modale et afficher que la 1ere modale une fois que re-clique sur "modifier"
        modalAddProject.style.display = "none"; 
        modalWrapper.style.display = "flex";
    })
        // fermer et réintialiser les modales au clique en dehors //
      modal.addEventListener("click", (e) => {
        if (e.target.className == "modal") {
            modalAddProject.style.display = "none";
            modalWrapper.style.display = "flex"; 
        }
    })  
}
displayModalAddProject();

//** Prévisualiser les photos à envoyer **//
const previewImg = document.querySelector(".containerFile img");
const inputFile = document.querySelector(".containerFile input");
const labelFile = document.querySelector(".containerFile label");
const iconFile = document.querySelector(".containerFile .fa-image");
const paragrapheFile = document.querySelector(".containerFile p");

inputFile.addEventListener("change", (e) => {
    const file = e.target.files[0];
    previewImg.src = URL.createObjectURL(file);
    previewImg.style.display = "block";
    labelFile.style.display = "none";
    iconFile.style.display = "none";
    paragrapheFile.style.display = "none";
})

// fonction pour réinitialiser la formulaire  //

function initForm() {
        previewImg.src = ""; 
        previewImg.style.display = "none";
        labelFile.style.display = "flex";
        iconFile.style.display = "flex";
        paragrapheFile.style.display = "flex";
        inputFile.value = ""; // réinitialiser la valeur du champ de fichier
        document.getElementById("title").value = "";  //vider le champs du titre
        document.getElementById("category").value = ""; //remettre "choisissez une catégorie" par defaut
}
initForm();

//** créer une liste de catégories dans l'input **//

async function displayCategoriesInput() {   
    const categorySelect = document.querySelector("#category");
    const categories = await getCategories();
    // Ajoute une option par défaut
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Choisissez une catégorie";
    categorySelect.appendChild(defaultOption);
    // Ajoute les catégories au sélecteur
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}
displayCategoriesInput();

            //** Envoyer le projet **//

// vérification que tous les champs sont remplis //

document.addEventListener("change", () => {
    const titleInput = document.getElementById("title");
    const categorySelect = document.getElementById("category");
    const fileInput = document.getElementById("file");
    const submitButton = document.getElementById("submitButton");
  
    function updateButtonState() {
        if (titleInput.value.trim() !== "" && categorySelect.value !== "" && fileInput.files.length > 0) {
          submitButton.style.backgroundColor = "#1d6154";
        } else {
          submitButton.style.backgroundColor = "#a7a7a7";
        }
    }
    updateButtonState();
});

// Envoi du projet //

async function sendProject() {
    const form = document.querySelector(".modalAddProject form");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const token = JSON.parse(sessionStorage.getItem("token"));
        const formData = new FormData(form);
        try {
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "Authorization": `Bearer ${token.token}`    
                },
                body: formData
            });
            if (response.ok) {
                modalAddProject.display = "none";
                modalWrapper.display = "block";
            } else {
                alert("Veuillez remplir tous les champs.");
            }
        } catch (error) {
            alert("Problème de connexion au serveur.");
        }
    });
}
sendProject(); 

  
