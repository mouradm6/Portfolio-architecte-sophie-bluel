//import { loginTest } from "./login.js";
const reponse = await fetch("http://localhost:5678/api/works");
const work = await reponse.json();
//loginTest();
// generer toutes les cartes
function genererCarteTraveaux(work) {
  for (let i = 0; i < work.length; i++) {
    const carte = work[i];
    const gallery = document.querySelector(".gallery");
    const carteElement = document.createElement("figure");

    const imageElement = document.createElement("img");
    imageElement.src = carte.imageUrl;
    imageElement.alt = carte.title;

    const titleElement = document.createElement("figcaption");
    titleElement.textContent = carte.title;

    gallery.appendChild(carteElement);

    carteElement.appendChild(imageElement);
    carteElement.appendChild(titleElement);
  }
}
genererCarteTraveaux(work);

//generer les projet dans la modal
function genererCarteTraveauxModal(work) {
  for (let i = 0; i < work.length; i++) {
    const carte = work[i];
    const gallery = document.querySelector(".containerProject");
    const carteElement = document.createElement("figure");
    carteElement.className = "figure";

    const imageDiv = document.createElement("div");
    imageDiv.className = "photo-container";

    const imageElement = document.createElement("img");
    imageElement.src = carte.imageUrl;
    imageElement.alt = carte.title;

    const iconElement = document.createElement("i");
    iconElement.className = "fa-solid fa-trash-can fa-2xs delete-icon";
    iconElement.setAttribute("data-id", carte.id);

    const titleElement = document.createElement("figcaption");
    titleElement.textContent = "éditer";
    titleElement.className = "edit-btn";

    gallery.appendChild(carteElement);

    imageDiv.appendChild(imageElement);
    imageDiv.appendChild(iconElement);
    carteElement.appendChild(imageDiv);
    carteElement.appendChild(titleElement);
  }
}

// bouton tous
const boutonTous = document.querySelector(".buttonTous");
boutonTous.addEventListener("click", function () {
  document.querySelector(".gallery").innerHTML = "";
  genererCarteTraveaux(work);
});
// boutton1
const bouton1 = document.querySelector(".button1");

bouton1.addEventListener("click", function () {
  const work1 = work.filter(function (work) {
    return work.categoryId == 1;
  });
  document.querySelector(".gallery").innerHTML = "";
  genererCarteTraveaux(work1);
});
// bouton2
const bouton2 = document.querySelector(".button2");

bouton2.addEventListener("click", function () {
  const work2 = work.filter(function (work) {
    return work.categoryId == 2;
  });
  document.querySelector(".gallery").innerHTML = "";
  genererCarteTraveaux(work2);
});

// bouton3
const bouton3 = document.querySelector(".button3");

bouton3.addEventListener("click", function () {
  const work3 = work.filter(function (work) {
    return work.categoryId == 3;
  });
  document.querySelector(".gallery").innerHTML = "";
  genererCarteTraveaux(work3);
});
const publishButton = document.querySelector(".buttonPublish");
publishButton.addEventListener("click", function () {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});

//login access
//localStorage.removeItem('token');
const token = localStorage.getItem("token");
const editButton = document.getElementById("editButton");
const editButton2 = document.getElementById("editButton2");
const filters = document.getElementById("filters");
const editMode = document.getElementById("editMode");
if (token) {
  //afficher et suprimer les buttons
  editButton.style.display = "block";
  editButton2.style.display = "block";
  filters.style.display = "none";
  editMode.style.display = "flex";

  const modal = document.getElementById("modal");
  const backgroundElements = document.querySelectorAll("body > *:not(.modal)");
  const overlay = document.getElementById("overlay");
  // ouvrir la modal
  function openModal() {
    modal.style.display = "flex";
    overlay.style.display = "block";
    modal.innerHTML = `
         <i id="closeButton" class="fa-solid fa-xmark fa-xl"></i>
         <h3 class="titre">Gallerie photo</h3>
         <div id="project" class="containerProject">
 
         </div>
         <hr class="line">
         <div class="btn-photo">
             <button id="add-btn" class="add-btn" type="submit">Ajouter une photo</button>
             <button class="delete-btn" type="button">Supprimer la galerie</button>
         </div>
    `;
    document.querySelector(".containerProject").innerHTML = "";
    genererCarteTraveauxModal(work);
    for (const element of backgroundElements) {
      element.style.pointerEvents = "none";
    }
    const closeButton = document.getElementById("closeButton");
    if (closeButton) {
      closeButton.addEventListener("click", closeModal);
    }
    const addButton = document.getElementById("add-btn");
    if (addButton) {
      addButton.addEventListener("click", genererModal2);
    }

     // suprimer un projet
    const projectsContainer = document.getElementById("project");
    if(projectsContainer){
        projectsContainer.addEventListener("click", function (event) {
            if (event.target.classList.contains("delete-icon")) {
              event.preventDefault();
              const idToDelete = event.target.dataset.id;
              fetch(`http://localhost:5678/api/works/${idToDelete}`, {
                method: "DELETE",
                headers: {
                  Accept: "*/*",
                  Authorization: `Bearer ${token}`,
                },
              });
            }
          });
    }
  }
  editButton2.addEventListener("click", openModal);





  //fermer la modal
  function closeModal() {
    modal.style.display = "none";
    overlay.style.display = "none";
    for (const element of backgroundElements) {
      element.style.pointerEvents = "auto";
    }
  }

  // aller a la deuxieme modal

  function genererModal2() {
    modal.innerHTML = `
        <i id="backButton" class="fa-solid fa-arrow-left fa-xl"></i>
        <i id="closeButton" class="fa-solid fa-xmark fa-xl"></i>
        <h3 class="titre">Ajout photo</h3>
        <div id="ajout-photo" class="ajout-photo">
          <img src="./assets/icons/picture.svg" alt="ajout photo" class="image1">
          <button id="addPhoto" class="add-photo-btn ">+ Ajouter photo</button>
          <input type="file" id="fileInput" style="display: none;">
          <p class="description">jpg, png : 4mo max</p>
        </div>
        <div class="titre-ajout">
          <label>Titre</label>
          <input type="text">
        </div>
        <div class="cat-ajout">
          <label>Catégorie</label>
          <select id="menu" name="menu">
            <option value="" disabled selected hidden></option>
            <option value="1">Objets</option>
            <option value="2">Appartements</option>
            <option value="3">Hotels & restaurants</option>
          </select>
        </div>
        <hr class="line">
        <div class="btn-photo">
            <button id="submitButton" class="add-btn" type="submit">Valider</button>
        </div>
        `;
        // close modal
    const closeButton2 = document.getElementById("closeButton");
    if (closeButton2) {
      closeButton2.addEventListener("click", closeModal);
    }
// back to modal 1 
    const backButton = document.getElementById("backButton");
    if (backButton) {
      backButton.addEventListener("click", openModal);
    }

    // add photo 
    const addPhoto = document.getElementById("addPhoto");
    const fileInput = document.getElementById('fileInput');
    if (addPhoto) {
      addPhoto.addEventListener("click", function() {
        fileInput.click();
      });
    }
    if(fileInput){
        fileInput.addEventListener('change', function(event) {
            const selectedFile = event.target.files[0];
            if (selectedFile) {
                const imageURL = URL.createObjectURL(selectedFile);
                const background = document.getElementById("ajout-photo");
                if(background){
                    background.style.backgroundImage = `url(${imageURL})`;
                    document.querySelector('.image1').style.display="none";
                    document.querySelector('.add-photo-btn').style.display="none";
                    document.querySelector('.description').style.display="none";
                }
                console.log('Selected image URL:', imageURL);
            }
          });
    }
// button valider

    const submitButton = document.getElementById("submitButton");
    if (submitButton) {
      submitButton.addEventListener("click", submitData);
    }
  }

  function submitData() {
    const imageUrl = document.querySelector('#fileInput').value;
    const titre = document.querySelector(".titre-ajout input").value;
    const menu = document.getElementById("menu").value;

    const form ={
        title: titre,
        imageUrl: imageUrl,
        categoryId : menu,
    };
    const chargeUtile = JSON.stringify(form);
    console.log(chargeUtile);
    fetch('http://localhost:5678/api/works', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: chargeUtile
})
  }

  // revenir a la premiere modal
}
