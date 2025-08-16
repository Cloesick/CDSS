// js/include.js - The Universal Version (Works Locally & on GitHub Pages)

document.addEventListener("DOMContentLoaded", function() {
    // This logic automatically determines the correct base path
    let basePath = '';
    const repoName = 'CDSS'; // Your repository name

    // Check if the site is running on the GitHub Pages server
    if (window.location.hostname.includes('github.io')) {
        // If yes, set the base path to include the repository name
        basePath = `/${repoName}/`;
    }
    // If no, basePath remains empty (''), which works for your local server

    const loadComponent = (componentName, placeholderId) => {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) return;

        // Construct the final, correct URL for the component
        const url = `${basePath}${componentName}`;

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

    // Load components using just their simple file names
    loadComponent('header.html', 'header-placeholder');
    loadComponent('contact.html', 'contact-placeholder');
    loadComponent('footer.html', 'footer-placeholder');
});