import { loadPartial, updateFooter } from "./utils.js";
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

document.addEventListener("DOMContentLoaded", () => {
    loadPartial("head", "../partials/head.html");
    loadPartial("header", "../partials/header.html");
    loadPartial("footer", "../partials/footer.html").then(() => {
        updateFooter();
    });
});

const supabaseUrl = 'https://njanrkfelbmopbmwabgd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qYW5ya2ZlbGJtb3BibXdhYmdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MzQyODQsImV4cCI6MjA2NTIxMDI4NH0.ddxg0Jm44oiMuvkSwaYmLGHP_eCMRvNxilgWLE0QFJ0'; //this key is save to use in frontend
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchTrucks() {
  const { data, error } = await supabase
    .from('trucks')
    .select('truck_id, truck_name, truck_capacity, truck_location, truck_latitude, truck_longitude, truck_availability');
  if (error) {
    console.error('Error fetching trucks:', error);
    return;
  }

  return data;
}

const truckData = fetchTrucks();
console.log(truckData);

async function populateTrucksTable() {
  const trucks = await fetchTrucks();
  const tbody = document.getElementById('trucks-list');

  tbody.innerHTML = ''; // Clear previous entries

  trucks.forEach((truck) => {
    // Only show available trucks
    if (truck.truck_availability) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${truck.truck_id}</td>
        <td>${truck.truck_name}</td>
        <td>${truck.truck_capacity} kg</td>
        <td>${truck.truck_location} (${truck.truck_latitude}, ${truck.truck_longitude})</td>
      `;
      tbody.appendChild(row);
    }
  });
}

// Call function to populate table on page load
populateTrucksTable();


function latLonToTile(lat, lon, zoom) {
  const x = Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
  const y = Math.floor(
    (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)
  );
  return { x, y };
}



function createMap(lat, lon, zoom ) {
  const mapContainer = document.getElementById('map');
  
      // Moderate zoom level to see southern Africa
    const { x, y } = latLonToTile(lat, lon, zoom);

    const apiKey = "5cc84ca63b5941768dd776f47d3ee5b2";

    const tileUrl = `https://maps.geoapify.com/v1/tile/carto/${zoom}/${x}/${y}.png?apiKey=${apiKey}`;

  const iframe = document.createElement('iframe');
  iframe.src = tileUrl;
  iframe.width = 600;
  iframe.height = 400;

  // Clear previous map and append the new image
  mapContainer.innerHTML = ''; 
  mapContainer.appendChild(iframe);
}

// Example usage
const lat = -26.2041;  // Johannesburg
const lon = 28.0473;
const zoom = 6;
createMap(lat, lon, zoom);
