import { loadPartial, updateFooter } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
    loadPartial("head", "partials/head.html");
    loadPartial("header", "partials/header.html");
    loadPartial("footer", "partials/footer.html").then(() => {
        updateFooter();
    });
});


document.addEventListener("DOMContentLoaded", displayViewedTrucks);

window.addEventListener("load", function () {
    document.getElementById("loader").classList.add("hidden");
});



function displayViewedTrucks() {
    const viewedTrucks = JSON.parse(localStorage.getItem('viewedTrucks')) || [];
    const tbody = document.getElementById('recent-trucks-list');
    tbody.innerHTML = '';

    if (viewedTrucks.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">No recently viewed trucks.</td></tr>`;
        return;
    }

    viewedTrucks.forEach(truck => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${truck.truck_id}</td>
            <td>${truck.truck_name}</td>
            <td>${truck.truck_capacity} kg</td>
            <td>${truck.truck_location}</td>
            <td><a href="views/truck-details.html?id=${truck.truck_id}">View Details</a></td>
        `;
        tbody.appendChild(row);
    });
}

function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}
