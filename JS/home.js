let container = document.querySelector(".slider");
let slidesContainer = document.querySelector(".slides");
let prevBtn = document.querySelector(".prev");
let nextBtn = document.querySelector(".next");

let currentIndex = 1;
let totalSlides = 3;

function showSlide() {
  for (let i = 1; i <= totalSlides; i++) {
    document.getElementById(i).classList.remove("active");
  }

  let activeSlide = document.getElementById(currentIndex);
  activeSlide.classList.add("active");

  activeSlide.scrollIntoView({
    behavior: "smooth",
    inline: "center",
    block: "nearest",
  });
}

function nextSlide() {
  currentIndex += 1;
  if (currentIndex > totalSlides) {
    currentIndex = 1;
  }
  showSlide();
}

function prevSlide() {
  currentIndex -= 1;
  if (currentIndex <= 0) {
    currentIndex = totalSlides;
  }
  showSlide();
}

let timer = setInterval(nextSlide, 3000);

container.addEventListener("mouseenter", () => {
  clearInterval(timer);
});

container.addEventListener("mouseleave", () => {
  timer = setInterval(nextSlide, 3000);
});

prevBtn.addEventListener("click", () => {
  prevSlide();
  clearInterval(timer);
});

nextBtn.addEventListener("click", () => {
  nextSlide();
  clearInterval(timer);
});

// Initial slide setup
showSlide();
