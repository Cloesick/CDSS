// js/include.js - The Final Corrected Version

document.addEventListener("DOMContentLoaded", function() {
    // This attribute MUST exist on the <body> tag of every HTML page.
    // It will be either "./" for index.html or "../" for pages in the /pages/ folder.
    const pathPrefix = document.body.dataset.pathPrefix || '';

    const loadComponent = (url, placeholderId) => {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) {
            console.error(`Placeholder with ID "${placeholderId}" not found.`);
            return;
        }

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok for ${url}`);
                }
                return response.text();
            })
            .then(data => {
                placeholder.innerHTML = data;
            })
            .catch(error => {
                console.error(`There was a problem fetching ${url}:`, error);
                placeholder.innerHTML = `<p style="color:red; text-align:center;">Error loading content.</p>`;
            });
    };

    // Load all components using the correct relative path based on the body's data attribute
    loadComponent(`${pathPrefix}header.html`, 'header-placeholder');
    loadComponent(`${pathPrefix}contact.html`, 'contact-placeholder');
    loadComponent(`${pathPrefix}footer.html`, 'footer-placeholder');
});