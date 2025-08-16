document.addEventListener('DOMContentLoaded', () => {

    // --- Initialize AOS (Animate on Scroll) Library ---
    AOS.init({
        duration: 800, // Animation duration in milliseconds
        once: true,    // Whether animation should happen only once - while scrolling down
        offset: 50,    // Offset (in px) from the original trigger point
    });

    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- Hero Slideshow Functionality (with Intro Animation) ---
    const slideshowContainer = document.getElementById('hero-slideshow');
    
    if (slideshowContainer) {
        const slides = slideshowContainer.querySelectorAll('.slide');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        let currentSlide = 0;
        let slideInterval; // This will hold the normal 7-second interval

        function showSlide(n) {
            if (slides.length === 0) return;
            slides[currentSlide].classList.add('hidden');
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].classList.remove('hidden');
        }

        function next() {
            showSlide(currentSlide + 1);
        }

        function prev() {
            showSlide(currentSlide - 1);
        }

        // --- New Slideshow Sequence ---

        function stopNormalSlideshow() {
            clearInterval(slideInterval);
        }

        function startNormalSlideshow() {
            // Re-enable buttons and hover functionality
            prevBtn.disabled = false;
            nextBtn.disabled = false;
            prevBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            slideshowContainer.addEventListener('mouseenter', stopNormalSlideshow);
            slideshowContainer.addEventListener('mouseleave', startNormalSlideshow);

            // Start the normal 7-second interval
            slideInterval = setInterval(next, 7000);
        }

        function runIntroAnimation() {
            // Disable buttons and hover during the intro
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            prevBtn.classList.add('opacity-50', 'cursor-not-allowed');
            nextBtn.classList.add('opacity-50', 'cursor-not-allowed');

            const rapidSpeed = 3500; // Time in ms for each rapid slide change

            // Loop through each slide quickly one time
            slides.forEach((slide, index) => {
                setTimeout(() => {
                    showSlide(index);
                }, index * rapidSpeed);
            });

            // After the rapid cycle finishes, start the normal slideshow
            setTimeout(() => {
                next(); // Go to the first slide to begin the loop
                startNormalSlideshow(); // Start the 7-second loop
            }, slides.length * rapidSpeed);
        }

        // Event listeners for manual navigation (will only work after intro)
        nextBtn.addEventListener('click', () => {
            stopNormalSlideshow();
            next();
            startNormalSlideshow();
        });

        prevBtn.addEventListener('click', () => {
            stopNormalSlideshow();
            prev();
            startNormalSlideshow();
        });

        // Start the entire sequence
        runIntroAnimation();
    }
    
    // --- Dynamic Copyright Year ---
    const copyrightYearSpan = document.getElementById('copyright-year');
    if (copyrightYearSpan) {
        const currentYear = new Date().getFullYear();
        copyrightYearSpan.textContent = currentYear;
    }

});