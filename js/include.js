// js/include.js - The Definitive GitHub Pages Version

document.addEventListener("DOMContentLoaded", function() {
    // The name of your repository. This is the base path for all assets.
    const repoName = 'CDSS';

    const loadComponent = (componentName, placeholderId) => {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) return;

        // Construct the correct, absolute path from the domain root.
        // This will always be /CDSS/header.html, /CDSS/footer.html, etc.
        const url = `/${repoName}/${componentName}`;

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`File not found at ${url}`);
                return response.text();
            })
            .then(data => {
                placeholder.innerHTML = data;
            })
            .catch(error => {
                console.error("Error loading component:", error);
            });
    };

    // Load components using just their file names
    loadComponent('header.html', 'header-placeholder');
    loadComponent('contact.html', 'contact-placeholder');
    loadComponent('footer.html', 'footer-placeholder');
});