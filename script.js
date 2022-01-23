//for images `https://cdn2.thecatapi.com/images/${imageID}.jpg`
//for cats `https://api.thecatapi.com/v1/breeds/search?q=${string}`

let searchForm = document.getElementById("search-form");
let searchField = document.getElementById("search-field");
let optionsContainer = document.getElementById("search-options-container");

let catCard = document.getElementById("cat-card");
let catName = document.getElementById("cat-name");
let catImageDiv = document.getElementById("img-div");
let catOrigin = document.getElementById("cat-origin");
let catDescription = document.getElementById("cat-description");
let catTemperamentContainer = document.getElementById("cat-badges");
let catWikiLink = document.getElementById("cat-wiki");

let cats;
let debouncedShowOptions = debounce(showOptions, 400);

searchField.addEventListener("input", debouncedShowOptions);

function showOptions() {
    catCard.style.display = "none";

    let string = searchField.value.trim();

    fetch(`https://api.thecatapi.com/v1/breeds/search?q=${string}`)
        .then(resp => {
            if (resp.ok) {
                return resp.json();
            }
        })
        .then(data => {
            cats = data;

            optionsContainer.innerHTML = "";
            cats.forEach(cat => {
                let li = document.createElement("li");
                li.id = cat.id;
                li.innerText = cat.name;
                li.classList.add("list-group-item");
                li.addEventListener("click", showCat);

                optionsContainer.append(li);
            });
        })
}

function showCat(e) {
    e.currentTarget.classList.add("active");

    //a short click interaction/feedback
    setTimeout(() => {
        optionsContainer.innerHTML = "";
        searchForm.reset();

        let catID = e.target.id;

        let cat = cats.find(element => element.id === catID);
        let imageID = cat.reference_image_id;

        catName.innerText = cat.name;
        if (cat.origin) {
            catOrigin.innerText = cat.origin;
        } else {
            catOrigin.innerText = "Unknown";
        }

        if (cat.description) {
            catDescription.innerText = cat.description;
        } else {
            catDescription.innerText = "Oh oh! It looks like we don't know much about this cat yet. Try to visit the Wikipedia page";
        }
        catWikiLink.href = cat.wikipedia_url;
        if (imageID) {
            catImageDiv.style.backgroundImage = `url(https://cdn2.thecatapi.com/images/${imageID}.jpg)`;
        } else {
            catImageDiv.style.backgroundImage = "url(https://cdn.dribbble.com/users/1900827/screenshots/5354476/icon.png?compress=1&resize=800x600&vertical=top)";
        }

        let catCharacteristics = [];
        if (cat.temperament) {
            catCharacteristics = cat.temperament.split(",").map(e => e.trim());
        }
        catTemperamentContainer.innerHTML = "";
        catCharacteristics.forEach(characteristic => {
            //randomColor is from CSS tricks
            let randomColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;

            let badge = document.createElement("span");
            badge.innerText = characteristic;
            badge.classList.add("badge", "rounded-pill", "me-1");
            badge.style.backgroundColor = randomColor;

            catTemperamentContainer.append(badge);
        });

        catCard.style.display = "block";
    }, 200);
}

function debounce(func, time) {
    let timerID;
    return function (...args) {
        clearTimeout(timerID);
        timerID = setTimeout(func, time, ...args);
    }
}