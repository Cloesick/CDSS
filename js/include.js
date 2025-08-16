document.addEventListener("DOMContentLoaded", function() {

    // A reusable function to fetch and place HTML content
    const loadComponent = (url, placeholderId) => {
        // Check if the placeholder element actually exists on the page
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) {
            // If it doesn't exist, don't even bother trying to fetch the file
            return; 
        }

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    // Make the error message more specific
                    throw new Error(`Network response was not ok for ${url}`);
                }
                return response.text();
            })
            .then(data => {
                placeholder.innerHTML = data;
            })
            .catch(error => {
                console.error(`There was a problem fetching ${url}:`, error);
                // Optionally display an error message in the placeholder
                placeholder.innerHTML = `<p class="text-red-500 text-center">Error loading content from ${url}.</p>`;
            });
    };

    // Load all the components
    loadComponent('/header.html', 'header-placeholder');
    loadComponent('/contact.html', 'contact-placeholder');
    loadComponent('/footer.html', 'footer-placeholder');

});