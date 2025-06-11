// utils.js - Utility functions for Cargo Locator

/**
 * Updates footer elements dynamically
 */
function updateFooter() {
    document.getElementById("year").textContent = new Date().getFullYear();
    document.getElementById("last-modified").textContent = document.lastModified;
}

/**
 * Dynamically loads HTML partials
 * @param {string} selector - The element to inject content into
 * @param {string} url - The path to the partial file
 */
async function loadPartial(selector, url) {
    const response = await fetch(url);
    const content = await response.text();
    document.querySelector(selector).innerHTML = content;
}

export { updateFooter, loadPartial };
