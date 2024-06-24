// ****** Variables ******//

const gallery = document.querySelector(".gallery")


//** function qui retourne le tableau des works **/:

async function getWorks () {
    const response = await  fetch ("http://localhost:5678/api/works");
    return await response.json()
   
}
getWorks();

//** Affichage des works dans le dom **/

async function affichageWorks() {
    const arrayWorks = await getWorks ()
    arrayWorks.forEach(element => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");
        img.src = element.imageUrl;
        figcaption.innerText = element.title;
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}
affichageWorks();