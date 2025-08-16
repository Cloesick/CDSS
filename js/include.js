// js/include.js - The Final Version for GitHub Pages

document.addEventListener("DOMContentLoaded", function() {
    // This is the name of your repository. It's the "subdirectory" on GitHub Pages.
    const repoName = 'CDSS'; 
    const basePath = `/${repoName}/`;

    const loadComponent = (url, placeholderId) => {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) return;

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`File not found: ${url}`);
                return response.text();
            })
            .then(data => {
                placeholder.innerHTML = data;
            })
            .catch(error => {
                console.error(`Error loading component: ${error}`);
            });
    };

    // Load all components using the correct, absolute path from the domain root
    loadComponent(`${basePath}header.html`, 'header-placeholder');
    loadComponent(`${basePath}contact.html`, 'contact-placeholder');
    loadComponent(`${basePath}footer.html`, 'footer-placeholder');
});