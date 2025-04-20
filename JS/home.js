let container = document.querySelector(".slider");
let prevBtn = document.querySelector(".prev");
let nextBtn = document.querySelector(".next");

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

function prevSlide() {
  currentIndex -= 1;
  if (currentIndex <= 0) {
    currentIndex = 3;
  }
  showSlide();
}

let timer = setInterval(nextSlide, 3000);

container.addEventListener(
  "mouseenter",
  () => {
    clearInterval(timer);
  },
  2000
);

container.addEventListener(
  "mouseleave",
  () => (timer = setInterval(nextSlide, 3000))
);

prevBtn.addEventListener("click", () => {
  prevSlide();
  clearInterval(timer);
});

nextBtn.addEventListener("click", () => {
  nextSlide();
  clearInterval(timer);
});
