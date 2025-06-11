
function updateFooter() {
    document.getElementById("year").textContent = new Date().getFullYear();
    document.getElementById("last-modified").textContent = document.lastModified;
}


async function loadPartial(selector, url) {
    const response = await fetch(url);
    const content = await response.text();
    document.querySelector(selector).innerHTML = content;
}

export { updateFooter, loadPartial };
