import { loadPartial, updateFooter } from "./utils.js";
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

document.addEventListener("DOMContentLoaded", () => {
  loadPartial("head", "../partials/head.html");
  loadPartial("header", "../partials/header.html");
  loadPartial("footer", "../partials/footer.html").then(() => {
    updateFooter();
  });

  loadTruckDetails();
});

const supabaseUrl = 'https://njanrkfelbmopbmwabgd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qYW5ya2ZlbGJtb3BibXdhYmdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MzQyODQsImV4cCI6MjA2NTIxMDI4NH0.ddxg0Jm44oiMuvkSwaYmLGHP_eCMRvNxilgWLE0QFJ0'; // Use your full key
const supabase = createClient(supabaseUrl, supabaseKey);

const urlParams = new URLSearchParams(window.location.search);
const truckId = urlParams.get('id');

async function loadTruckDetails() {
  const truckInfoDiv = document.getElementById('truck-info');
  const reserveBtn = document.getElementById('reserve-btn');

  const { data: truck, error } = await supabase
    .from('trucks')
    .select('*')
    .eq('truck_id', truckId)
    .single();

  if (error || !truck) {
    truckInfoDiv.innerHTML = "<p>Error loading truck details.</p>";
    reserveBtn.disabled = true;
    return;
  }

  truckInfoDiv.innerHTML = `
    <p><strong>ID:</strong> ${truck.truck_id}</p>
    <p><strong>Name:</strong> ${truck.truck_name}</p>
    <p><strong>Capacity:</strong> ${truck.truck_capacity} kg</p>
    <p><strong>Location:</strong> ${truck.truck_location} (${truck.truck_latitude}, ${truck.truck_longitude})</p>
    <p><strong>Availability:</strong> ${truck.truck_availability ? 'Available' : 'Reserved'}</p>
  `;

  reserveBtn.disabled = !truck.truck_availability;

  reserveBtn.addEventListener('click', async () => {
    const { error: reserveError } = await supabase
      .from('trucks')
      .update({ truck_availability: false })
      .eq('truck_id', truckId);

    if (!reserveError) {
      alert('Truck reserved successfully!');
      loadTruckDetails(); // Refresh info
    } else {
      alert('Error reserving truck.');
    }
  });
}
