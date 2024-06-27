
function login() {
    // On récupère les données à envoyer
    const loginForm = document.getElementById("loginForm");
    const error = document.getElementById("error-message")
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const logData = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value
        }
        // On envoie les données
        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(logData)
            })

            // On stocke le token récupéré dans le sessionStorage
            const token = await response.json();
            sessionStorage.setItem("token", JSON.stringify(token));

            // on redirige ou on affiche un message d'erreur
            (response.ok) ? window.location.href = "./index.html" : error.textContent = "Erreur dans l’identifiant ou le mot de passe"

        } catch (error) { alert("problème de connexion au serveur") }
    })
}

login()