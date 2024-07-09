
//** fonction qui récupère le tableau des projets **/:

async function getProjects () {
    const response = await  fetch ("http://localhost:5678/api/works");
    return response.json()
   
}
console.log(getProjects());

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

//** */ Fonction login **//

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


//** Suppression de travaux existants **//

async function deleteProject() {
    const allTrash = document.querySelectorAll(".fa-trash-can");
    allTrash.forEach(trash => {
        trash.addEventListener("click", async (e) => {
            e.preventDefault();
            const token = sessionStorage.getItem("token");
            const id = trash.id;
            try {
                const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Accept": "*/*",
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    // On met l'affichage à jour
                    document.querySelector(".projectsModal").innerHTML = "";
                    const projects = await getProjects();
                    displayProjectsModal(projects);
                    displayProjects(projects);
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
// Ouvrir la modale //
    addProject.addEventListener("click", () => {
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

