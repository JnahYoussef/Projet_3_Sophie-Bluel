// ****** Variables ******//

const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");


//** fonction qui récupère le tableau des projets **/:

async function getProjects () {
    const response = await  fetch ("http://localhost:5678/api/works");
    return await response.json()
   
}
getProjects();

//** Affichage des projets dans le DOM **/

function createProjects(project){
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    img.src = project.imageUrl;
    figcaption.innerText = project.title;
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
displayProjects();


//*** Affichage des boutons par catégories ***//

//récupérer le tableau des catégories 

async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    return await response.json();
}

//Afficher le tableau des catégories
async function displayCategoriesButtons(){
    const categories = await getCategories();
    categories.unshift({ id: 0, name: "Tous" }); // Ajoute une catégorie "Tous" pour permettre l'affichage de tous les travaux.
    categories.forEach(category => {
        const btn = document.createElement("button");
        btn.textContent = category.name;
        btn.id = category.id;
        filters.appendChild(btn);

        if (category.id === 0) {
            btn.classList.add("selected"); // Ajouter la classe "selected" au bouton 'Tous'
        }
    });
}
displayCategoriesButtons();


//*** Filtrer par catégorie au clic ***//

async function filterCategory () {
    const categories = await getProjects();
    const buttons = document.querySelectorAll(".filters button");
    const figures = gallery.querySelectorAll('figure');

    buttons.forEach(button => {
        button.addEventListener ("click", (event) =>{
            btnId = event.target.id;
            gallery.innerHTML = ""; //pour vider la gallery et afficher que la sélection, sinon tous s'affiche en plus de la sélection en bas

            buttons.forEach(btn => btn.classList.remove('selected')); // Retirer la classe "selected" de tous les boutons

            event.target.classList.add('selected'); // Ajouter la classe "selected" au bouton cliqué

            if(btnId !== "0"){
                // au lieux de refaire une appel api avec la methode createProjects, on display none les figure qui on un dataset-id équivalent au boutton sur lequel on as click
                // regarder toutes les figure, et voir sir leur data-it == btnId, dans ce cas on les display none. Autrement display block.
                // dataset.id = id de la figure

                for (let i = 0; i < figures.length; i++) {
                    console.log(figures[i].dataset.id);
                }

                const categoriesSort = categories.filter(project => {
                    return project.categoryId == btnId
                });

                categoriesSort.forEach(project => {
                    createProjects(project)
                });
            } else {
                displayProjects();
            }
        });
    });
}
filterCategory();


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
}
displayProjectsModal ()


