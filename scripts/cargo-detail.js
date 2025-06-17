import { loadPartial, updateFooter } from "./utils.js";
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

document.addEventListener("DOMContentLoaded", () => {
  loadPartial("head", "../partials/head.html");
  loadPartial("header", "../partials/header.html");
  loadPartial("footer", "../partials/footer.html").then(() => {
    updateFooter();
  });

  loadCargoDetails();
});

window.addEventListener("load", function () {
    setTimeout(function () {
        document.getElementById("loader").classList.add("hidden");
    }, 2000); // 2-second delay
});


const supabaseUrl = 'https://njanrkfelbmopbmwabgd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qYW5ya2ZlbGJtb3BibXdhYmdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MzQyODQsImV4cCI6MjA2NTIxMDI4NH0.ddxg0Jm44oiMuvkSwaYmLGHP_eCMRvNxilgWLE0QFJ0'; // Keep this key in sync
const supabase = createClient(supabaseUrl, supabaseKey);

const urlParams = new URLSearchParams(window.location.search);
const cargoId = urlParams.get('id');

async function loadCargoDetails() {
  const cargoInfoDiv = document.getElementById('cargo-info');
  const assignBtn = document.getElementById('assign-btn');

  const { data: cargo, error } = await supabase
    .from('shipments')
    .select('*')
    .eq('ship_id', cargoId)
    .single();

  if (error || !cargo) {
    cargoInfoDiv.innerHTML = "<p>Error loading cargo details.</p>";
    assignBtn.disabled = true;
    return;
  }

  cargoInfoDiv.innerHTML = `
    <p><strong>ID:</strong> ${cargo.ship_id}</p>
    <p><strong>Name:</strong> ${cargo.ship_name}</p>
    <p><strong>Weight:</strong> ${cargo.ship_weight} kg</p>
    <p><strong>Origin:</strong> ${cargo.ship_origin}</p>
    <p><strong>Destination:</strong> ${cargo.ship_destination}</p>
    <p><strong>Status:</strong> ${cargo.ship_status}</p>
    <p><strong>Client ID:</strong> ${cargo.ship_client_id}</p>
    <p><strong>Assigned Truck:</strong> ${cargo.ship_truck_id ? cargo.ship_truck_id : 'None'}</p>
  `;

  assignBtn.disabled = cargo.ship_status !== 'Pending';

  assignBtn.addEventListener('click', async () => {
    const truckId = prompt("Enter Truck ID to assign:");
    if (!truckId) return;

    const { error: updateError } = await supabase
      .from('shipments')
      .update({ ship_truck_id: parseInt(truckId), ship_status: 'In Transit' })
      .eq('ship_id', cargoId);

    if (!updateError) {
      alert("Cargo assigned to truck successfully!");
      loadCargoDetails();
    } else {
      alert("Failed to assign truck.");
    }
  });
}
