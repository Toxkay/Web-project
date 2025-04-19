let currentIndex = 1;

function showSlide() {
  for (let i = 1; i <= 3; i++) {
    document.getElementById(i).classList.remove("active");
  }

  document.getElementById(currentIndex).classList.add("active");
}

function nextSlide() {
  currentIndex += 1;
  if (currentIndex > 3) {
    currentIndex = 1;
  }

  showSlide();
}

let timer = setInterval(nextSlide, 3000);
