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
    
    buttons.forEach(button => {
        button.addEventListener ("click", (event) =>{
            btnId = event.target.id;
            gallery.innerHTML = ""; //pour vider la gallery et afficher que la sélection, sinon tous s'affiche en plus de la sélection en bas

            buttons.forEach(btn => btn.classList.remove('selected')); // Retirer la classe "selected" de tous les boutons
            event.target.classList.add('selected'); // Ajouter la classe "selected" au bouton cliqué
            
            if(btnId !== "0"){
                const categoriesSort = categories.filter(project =>{
                    return project.categoryId == btnId
                });
                categoriesSort.forEach(project => {
                    createProjects(project)
                });
            }else{
                displayProjects();
            }
        });
    });
}
filterCategory();

