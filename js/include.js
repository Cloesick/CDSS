// js/include.js - The Final, Path-Correcting Version

document.addEventListener("DOMContentLoaded", function() {
    // Check if the current page is a sub-page (e.g., in the /pages/ directory)
    const isSubPage = window.location.pathname.includes('/pages/');
    // Determine the correct relative path to get back to the project root
    const basePath = isSubPage ? '../' : '';

    const loadComponent = (componentUrl, placeholderId) => {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) return;

        // Fetch the component HTML from its location in the root directory
        fetch(basePath + componentUrl)
            .then(response => {
                if (!response.ok) throw new Error(`Could not load ${componentUrl}`);
                return response.text();
            })
            .then(html => {
                let processedHtml = html;
                // If we are on a sub-page, we need to fix the paths inside the loaded HTML
                if (isSubPage) {
                    // This powerful line finds all relative src="" and href="" paths
                    // and automatically prepends "../" to them. It's smart enough
                    // to ignore absolute paths (like https://...) and anchor links (like #...).
                    processedHtml = html.replace(/(href|src)="(?!https?:\/\/|#)([^"]*)"/g, '$1="' + basePath + '$2"');
                }
                // Inject the final, corrected HTML into the page
                placeholder.innerHTML = processedHtml;
            })
            .catch(error => {
                console.error(`Failed to load component from ${componentUrl}:`, error);
            });
    };

    // Load all components using their simple root filenames
    loadComponent('header.html', 'header-placeholder');
    loadComponent('contact.html', 'contact-placeholder');
    loadComponent('footer.html', 'footer-placeholder');
});