const slides = document.querySelectorAll("#slides img");
const modelNames = document.querySelectorAll("#slides .modelName");
const intervalId = setInterval(nextSlide, 5000);
let slideIndex = 0;
showSlide();
function showSlide() {
    slides.forEach((slide) => {
        slide.style.display = "none";
    });
    modelNames.forEach((name) => {
        name.style.display = "none";
    });
    modelNames[slideIndex].style.display = "inline";
    slides[slideIndex].style.display = "inline";
}
function prevSlide() {
    if (slideIndex > 0) {
        slideIndex--;
    } else {
        slideIndex += slides.length - 1;
    }
    showSlide();
}
function nextSlide() {
    if (slideIndex < slides.length - 1) {
        slideIndex++;
    } else {
        slideIndex = 0;
    }
    showSlide();
}
document.addEventListener("keydown", (event) => {
    if (event.key == "ArrowRight") {
        nextSlide();
    } else if (event.key == "ArrowLeft") {
        prevSlide();
    }
});
