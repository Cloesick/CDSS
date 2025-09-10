document.addEventListener("DOMContentLoaded", () => {
  const carouselImagesContainer = document.getElementById("carouselImages");
  // Removed prevBtn and nextBtn constants as they are no longer used for navigation
  const carouselDotsContainer = document.getElementById("carouselDots");
  let currentImageIndex = 0;
  let imagesData = [];
  let autoSlideInterval; // Variable to hold the interval ID

  // Function to load JSON data
  async function loadImages() {
    try {
      const response = await fetch("../json/WorkSpace.json");
      imagesData = await response.json();
      renderCarousel();
      startAutoSlide(); // Start auto-sliding after images are loaded
    } catch (error) {
      console.error("Error loading WorkSpace.json:", error);
    }
  }

  // Function to render images and dots
  function renderCarousel() {
    carouselImagesContainer.innerHTML = ""; // Clear previous images
    carouselDotsContainer.innerHTML = ""; // Clear previous dots

    imagesData.forEach((imageData, index) => {
      const img = document.createElement("img");
      img.src = imageData.filename.replace(/\\/g, "/"); // Normalize backslashes for web paths
      img.alt = imageData.name;
      img.classList.add("w-full", "h-auto"); // Add responsive classes
      if (index === currentImageIndex) {
        img.classList.add("active");
      }
      carouselImagesContainer.appendChild(img);

      const dot = document.createElement("span");
      dot.classList.add(
        "w-3",
        "h-3",
        "bg-gray-400",
        "rounded-full",
        "cursor-pointer",
      );
      if (index === currentImageIndex) {
        dot.classList.remove("bg-gray-400");
        dot.classList.add("bg-gray-800"); // Active dot color
      }
      dot.addEventListener("click", () => {
        goToSlide(index);
        resetAutoSlide(); // Reset timer when a dot is clicked
      });
      carouselDotsContainer.appendChild(dot);
    });
  }

  // Function to show a specific slide
  function goToSlide(index) {
    currentImageIndex = index;
    if (currentImageIndex < 0) {
      currentImageIndex = imagesData.length - 1;
    } else if (currentImageIndex >= imagesData.length) {
      currentImageIndex = 0;
    }
    renderCarousel(); // Re-render to update active image and dots
  }

  // Function to start auto-sliding
  function startAutoSlide() {
    // Clear any existing interval to prevent multiple intervals running
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      goToSlide(currentImageIndex + 1);
    }, 3000); // Change image every 3 seconds (3000 milliseconds)
  }

  // Function to reset auto-slide (e.g., when a user interacts)
  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }


  // Removed event listeners for navigation buttons (prevBtn, nextBtn)
  // prevBtn.addEventListener("click", () => goToSlide(currentImageIndex - 1));
  // nextBtn.addEventListener("click", () => goToSlide(currentImageIndex + 1));


  // Load images when the DOM is ready
  loadImages();
});