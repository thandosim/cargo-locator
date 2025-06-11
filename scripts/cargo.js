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
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qYW5ya2ZlbGJtb3BibXdhYmdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MzQyODQsImV4cCI6MjA2NTIxMDI4NH0.ddxg0Jm44oiMuvkSwaYmLGHP_eCMRvNxilgWLE0QFJ0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchCargo() {
  const { data, error } = await supabase
    .from('shipments')
    .select('ship_id, ship_name, ship_weight, ship_origin, ship_destination, ship_latitude, ship_longitude, ship_status');
  if (error) {
    console.error('Error fetching cargo:', error);
    return [];
  }
  return data;
}

async function populateCargoTable() {
  const cargoList = await fetchCargo();
  const tbody = document.getElementById('cargo-list');
  tbody.innerHTML = '';

  cargoList.forEach((cargo) => {
    if (cargo.ship_status === 'Pending') {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${cargo.ship_id}</td>
        <td>${cargo.ship_name}</td>
        <td>${cargo.ship_weight} kg</td>
        <td>${cargo.ship_origin}</td>
        <td>${cargo.ship_destination}</td>
      `;
      row.style.cursor = 'pointer';
      row.addEventListener('click', () => {
        window.location.href = `cargo-details.html?id=${cargo.ship_id}`;
      });
      tbody.appendChild(row);
    }
  });
}

populateCargoTable();

function latLonToTile(lat, lon, zoom) {
  const x = Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
  const y = Math.floor(
    (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)
  );
  return { x, y };
}

let currentZoom = 6;
let centerLat = -26.2041;
let centerLon = 28.0473;
const apiKey = "5cc84ca63b5941768dd776f47d3ee5b2";

async function createMap(lat, lon, zoom) {
  const mapContainer = document.getElementById('map');
  mapContainer.innerHTML = '';
  mapContainer.style.position = "relative";
  mapContainer.style.width = "768px";
  mapContainer.style.height = "768px";
  mapContainer.style.overflow = "hidden";

  const tileSize = 256;
  const centerTile = latLonToTile(lat, lon, zoom);
  const startX = centerTile.x - 1;
  const startY = centerTile.y - 1;

  for (let dx = 0; dx < 3; dx++) {
    for (let dy = 0; dy < 3; dy++) {
      const x = startX + dx;
      const y = startY + dy;
      const tileUrl = `https://maps.geoapify.com/v1/tile/carto/${zoom}/${x}/${y}.png?apiKey=${apiKey}`;
      const img = document.createElement('img');
      img.src = tileUrl;
      img.width = tileSize;
      img.height = tileSize;
      img.style.position = "absolute";
      img.style.left = `${dx * tileSize}px`;
      img.style.top = `${dy * tileSize}px`;
      mapContainer.appendChild(img);
    }
  }

  const cargoList = await fetchCargo();
  cargoList.forEach(cargo => {
    if (cargo.ship_status !== 'Pending') return;

    const tile = latLonToTile(cargo.ship_latitude, cargo.ship_longitude, zoom);
    const dx = tile.x - startX;
    const dy = tile.y - startY;

    if (dx >= 0 && dx < 3 && dy >= 0 && dy < 3) {
      const marker = document.createElement('div');
      marker.style.width = '20px';
      marker.style.height = '20px';
      marker.style.borderRadius = '50%';
      marker.style.background = 'blue';
      marker.style.position = 'absolute';
      marker.style.left = `${dx * tileSize + 118}px`;
      marker.style.top = `${dy * tileSize + 118}px`;
      marker.style.cursor = 'pointer';
      marker.title = cargo.ship_name;

      marker.addEventListener('click', () => {
        window.location.href = `cargo-details.html?id=${cargo.ship_id}`;
      });

      mapContainer.appendChild(marker);
    }
  });
}

createMap(centerLat, centerLon, currentZoom);
