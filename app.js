// Search models
const search = document.getElementById("search");
const cards = document.querySelectorAll(".card");

search.addEventListener("keyup", () => {

    const value = search.value.toLowerCase();

    cards.forEach(card => {

        const name = card.querySelector("h3").textContent.toLowerCase();

        if (name.includes(value)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });

});

// Open selected model
function openModel(modelName) {
    window.location.href = `viewer.html?model=${encodeURIComponent(modelName)}`;
}