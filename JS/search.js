document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("inputSearch");
  const cards = document.querySelectorAll(".cards_item");
  const filterCards = () => {
    const inputQuery = input.value.toLowerCase();
    console.log(inputQuery);
    cards.forEach((card) => {
      const cardTitle = card
        .querySelector(".card_title")
        .textContent.toLowerCase();
      card.classList.toggle("hidden", !cardTitle.includes(inputQuery));
    });
  };

  // Filter cards on form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    filterCards();
  });

  // Filter cards live as the user types
  input.addEventListener("input", filterCards);
});
