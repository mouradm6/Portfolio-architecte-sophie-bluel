const reponse = await fetch("http://localhost:5678/api/works");
const work = await reponse.json();

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
    iconElement.setAttribute("type", "button");

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

  // creer modal 1
  function createModal() {
    const closeButton = document.createElement("i");
    closeButton.setAttribute("id", "closeButton");
    closeButton.classList.add("fa-solid", "fa-xmark", "fa-xl");
    closeButton.addEventListener("click", closeModal);

    const h3Title = document.createElement("h3");
    h3Title.classList.add("titre");
    h3Title.textContent = "Gallerie photo";








    const divProject = document.createElement("div");
    divProject.setAttribute("id", "project");
    divProject.classList.add("containerProject");
    divProject.addEventListener("click", async function (event) {
      if (event.target.classList.contains("delete-icon")) {
        event.preventDefault();
        //event.stopPropagation(); 
        const idToDelete = event.target.dataset.id;
        try {
          await fetch(`http://localhost:5678/api/works/${idToDelete}`, {
            method: "DELETE",
            headers: {
              Accept: "*/*",
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.error("Error occurred while deleting project:", error);
        }
      }
    });







    const hrLine = document.createElement("hr");
    hrLine.classList.add("line");

    const divBtnPhoto = document.createElement("div");
    divBtnPhoto.classList.add("btn-photo");

    const addButton = document.createElement("button");
    addButton.setAttribute("id", "add-btn");
    addButton.classList.add("add-btn");
    addButton.setAttribute("type", "submit");
    addButton.textContent = "Ajouter une photo";
    addButton.addEventListener("click", createModal2);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.setAttribute("type", "button");
    deleteButton.textContent = "Supprimer la galerie";
    deleteButton.addEventListener("click", () => {
      const allProjectButtons = document.querySelectorAll('.delete-icon');
      const projectIdsToDelete = [];
    
      // Extract the project IDs from the buttons associated with each project
      allProjectButtons.forEach(button => {
        const projectId = button.dataset.id;
        if (projectId) {
          projectIdsToDelete.push(projectId);
        }
      });
    
      // Delete projects one by one
      deleteAllProjects(projectIdsToDelete);
    });
    
    // Function to delete all projects one by one
    function deleteAllProjects(projectIds) {
      const deletePromises = projectIds.map(projectId =>
        fetch(`http://localhost:5678/api/works/${projectId}`, {
          method: "DELETE",
            headers: {
              Accept: "*/*",
              Authorization: `Bearer ${token}`,
          },
        })
      );
    
      // Wait for all delete requests to complete
      Promise.all(deletePromises)
        .then(responses => {
          // Check if all responses were successful
          const allSuccessful = responses.every(response => response.ok);
    
          if (allSuccessful) {
            console.log('All projects were deleted.');
            // Perform any other required UI updates
          } else {
            console.error('Failed to delete all projects.');
          }
        })
        .catch(error => {
          // Handle any network or other errors
          console.error('An error occurred while deleting projects.', error);
        });
    }

    const modal = document.getElementById("modal");
    modal.innerHTML = ""; 
    modal.appendChild(closeButton);
    modal.appendChild(h3Title);
    modal.appendChild(divProject);
    modal.appendChild(hrLine);
    divBtnPhoto.appendChild(addButton);
    divBtnPhoto.appendChild(deleteButton);
    modal.appendChild(divBtnPhoto);

    document.querySelector(".containerProject").innerHTML = "";
    genererCarteTraveauxModal(work);
  }
  
  // ouvrir la modal
  function openModal() {
    modal.style.display = "flex";
    overlay.style.display = "block";
    createModal();
    modal.style.pointerEvents = "auto";
    for (const element of backgroundElements) {
      if (!element.classList.contains("modal")) {
        element.style.pointerEvents = "none";
      }
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
  // creer modal 2
  function createModal2() {
    const backButton = document.createElement("i");
    backButton.setAttribute("id", "backButton");
    backButton.classList.add("fa-solid", "fa-arrow-left", "fa-xl");
    backButton.addEventListener("click", openModal);

    const closeButton = document.createElement("i");
    closeButton.setAttribute("id", "closeButton");
    closeButton.classList.add("fa-solid", "fa-xmark", "fa-xl");
    closeButton.addEventListener("click", closeModal);

    const h3Title = document.createElement("h3");
    h3Title.classList.add("titre");
    h3Title.textContent = "Ajout photo";

    const divAjoutPhoto = document.createElement("div");
    divAjoutPhoto.setAttribute("id", "ajout-photo");
    divAjoutPhoto.classList.add("ajout-photo");

    const image = document.createElement("img");
    image.setAttribute("src", "./assets/icons/picture.svg");
    image.setAttribute("alt", "ajout photo");
    image.classList.add("image1");

    const addPhotoButton = document.createElement("button");
    addPhotoButton.setAttribute("id", "addPhoto");
    addPhotoButton.classList.add("add-photo-btn");
    addPhotoButton.textContent = "+ Ajouter photo";
    addPhotoButton.addEventListener("click", function () {
      fileInput.click();
    });

    const fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("id", "fileInput");
    fileInput.style.display = "none";
    fileInput.addEventListener("change", function (event) {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        const imageURL = URL.createObjectURL(selectedFile);
        const background = document.getElementById("ajout-photo");
        if (background) {
          background.style.backgroundImage = `url(${imageURL})`;
          document.querySelector(".image1").style.display = "none";
          document.querySelector(".add-photo-btn").style.display = "none";
          document.querySelector(".description").style.display = "none";
        }
      }
    });

    const descriptionParagraph = document.createElement("p");
    descriptionParagraph.classList.add("description");
    descriptionParagraph.textContent = "jpg, png : 4mo max";

    const divTitreAjout = document.createElement("div");
    divTitreAjout.classList.add("titre-ajout");

    const titreLabel = document.createElement("label");
    titreLabel.textContent = "Titre";

    const titreInput = document.createElement("input");
    titreInput.setAttribute("type", "text");

    const divCatAjout = document.createElement("div");
    divCatAjout.classList.add("cat-ajout");

    const catLabel = document.createElement("label");
    catLabel.textContent = "Catégorie";

    const selectMenu = document.createElement("select");
    selectMenu.setAttribute("id", "menu");
    selectMenu.setAttribute("name", "menu");

    const option1 = document.createElement("option");
    option1.setAttribute("value", "1");
    option1.textContent = "Objets";

    const option2 = document.createElement("option");
    option2.setAttribute("value", "2");
    option2.textContent = "Appartements";

    const option3 = document.createElement("option");
    option3.setAttribute("value", "3");
    option3.textContent = "Hotels & restaurants";

    const hrLine = document.createElement("hr");
    hrLine.classList.add("line");

    const divBtnPhoto = document.createElement("div");
    divBtnPhoto.classList.add("btn-photo");

    const submitButton = document.createElement("button");
    submitButton.setAttribute("id", "submitButton");
    submitButton.classList.add("add-btn");
    submitButton.setAttribute("type", "submit");
    submitButton.textContent = "Valider";
    submitButton.addEventListener("click", function () {
      const file = fileInput.files[0];
      const title = titreInput.value;
      const category = selectMenu.value;

      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", title);
      formData.append("category", category);

      const headers = new Headers({
        Authorization: `Bearer ${token}`,
      });
      const requestOptions = {
        method: "POST",
        headers: headers,
        body: formData,
      };

      fetch("http://localhost:5678/api/works", requestOptions);
    });

    
    const modal = document.getElementById("modal");
    modal.innerHTML = ""; 
    modal.appendChild(backButton);
    modal.appendChild(closeButton);
    modal.appendChild(h3Title);
    divAjoutPhoto.appendChild(image);
    divAjoutPhoto.appendChild(addPhotoButton);
    divAjoutPhoto.appendChild(fileInput);
    divAjoutPhoto.appendChild(descriptionParagraph);
    modal.appendChild(divAjoutPhoto);
    divTitreAjout.appendChild(titreLabel);
    divTitreAjout.appendChild(titreInput);
    modal.appendChild(divTitreAjout);
    divCatAjout.appendChild(catLabel);
    selectMenu.appendChild(option1);
    selectMenu.appendChild(option2);
    selectMenu.appendChild(option3);
    divCatAjout.appendChild(selectMenu);
    modal.appendChild(divCatAjout);
    modal.appendChild(hrLine);
    divBtnPhoto.appendChild(submitButton);
    modal.appendChild(divBtnPhoto);
  }
}