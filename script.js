document.addEventListener("DOMContentLoaded", function () {

    let currentIndex = 0;
    let slideshowInterval;
    let currentImages = [];

    const allImages = document.querySelectorAll(".gallery img");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const dotsContainer = document.querySelector(".dots");

    // ================= FILTER =================
    window.filterImages = function (category) {
        const cards = document.querySelectorAll(".image-card");

        cards.forEach(card => {
            if (category === "all") {
                card.style.display = "block";
            } else {
                card.style.display =
                    card.classList.contains(category) ? "block" : "none";
            }
        });
    };

    // ================= OPEN LIGHTBOX =================
    window.openLightbox = function (img) {

        currentImages = Array.from(allImages).filter(image =>
            image.parentElement.style.display !== "none"
        );

        currentIndex = currentImages.indexOf(img);

        lightbox.style.display = "flex";
        createDots();
        showImage(0); // initial load
        startSlideshow();
    };

    // ================= CLOSE =================
    window.closeLightbox = function () {
        lightbox.style.display = "none";
        clearInterval(slideshowInterval);
    };

    // ================= SHOW IMAGE WITH FADE + SLIDE =================
    function showImage(direction = 0) {
        const img = lightboxImg;

        if (direction !== 0) {
            // Slide out current image
            img.style.transform = `translateX(${direction * 100}%)`;
            img.style.opacity = 0;

            setTimeout(() => {
                // Change image source
                img.src = currentImages[currentIndex].src;

                // Slide in new image
                img.style.transition = 'none';
                img.style.transform = `translateX(${-direction * 100}%)`;
                img.style.opacity = 1;

                void img.offsetWidth; // trigger reflow

                img.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out';
                img.style.transform = 'translateX(0%)';
            }, 200);
        } else {
            // Initial load
            img.src = currentImages[currentIndex].src;
            img.style.transform = 'translateX(0%)';
            img.style.opacity = 1;
        }

        updateDots();
    }

    // ================= NEXT / PREV =================
    window.changeSlide = function (direction) {
        currentIndex += direction;

        if (currentIndex >= currentImages.length) currentIndex = 0;
        if (currentIndex < 0) currentIndex = currentImages.length - 1;

        showImage(direction);
    };

    // ================= AUTO SLIDESHOW =================
    function startSlideshow() {
        clearInterval(slideshowInterval);
        slideshowInterval = setInterval(function () {
            changeSlide(1);
        }, 2000);
    }

    // ================= DOTS =================
    function createDots() {
        dotsContainer.innerHTML = "";

        currentImages.forEach((_, index) => {
            const dot = document.createElement("span");
            dot.classList.add("dot");

            dot.addEventListener("click", function () {
                const dir = index > currentIndex ? 1 : -1;
                currentIndex = index;
                showImage(dir);
            });

            dotsContainer.appendChild(dot);
        });

        updateDots();
    }

    function updateDots() {
        const dots = document.querySelectorAll(".dot");

        dots.forEach(dot => dot.classList.remove("active"));
        if (dots[currentIndex]) {
            dots[currentIndex].classList.add("active");
        }
    }

});