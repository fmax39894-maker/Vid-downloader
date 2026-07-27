// Search models
const search = document.getElementById("search");
const cards = document.querySelectorAll(".card");

search.addEventListener("input", () => {

    const value = search.value.toLowerCase();

    cards.forEach(card => {

        const name = card.dataset.name.toLowerCase();

        if (name.includes(value)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });

});

// Open model
function openModel(model) {

    window.location.href =
        "viewer.html?model=" +
        encodeURIComponent(model);

}