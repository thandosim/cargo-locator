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

window.addEventListener("load", function () {
    setTimeout(function () {
        document.getElementById("loader").classList.add("hidden");
    }, 2000); // 2-second delay
});


const supabaseUrl = 'https://njanrkfelbmopbmwabgd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qYW5ya2ZlbGJtb3BibXdhYmdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MzQyODQsImV4cCI6MjA2NTIxMDI4NH0.ddxg0Jm44oiMuvkSwaYmLGHP_eCMRvNxilgWLE0QFJ0'; 
const supabase = createClient(supabaseUrl, supabaseKey);

const apiKey = "5cc84ca63b5941768dd776f47d3ee5b2"; // Geoapify API Key
const urlParams = new URLSearchParams(window.location.search);
const truckId = urlParams.get('id');

async function loadTruckDetails() {
  const truckInfoDiv = document.getElementById('truck-info');
  const reserveBtn = document.getElementById('reserve-btn');
  const routeContainer = document.getElementById('route');
  const distanceSpan = document.getElementById("distance");
  const dieselPriceSpan = document.getElementById("diesel-price");
  const fuelCostSpan = document.getElementById("estimated-fuel-cost");

  // Fetch truck details from Supabase
  const { data: truck, error } = await supabase
    .from('trucks')
    .select('truck_id, truck_name, truck_capacity, truck_location, truck_latitude, truck_longitude, truck_availability, truck_mpg_capacity')
    .eq('truck_id', truckId)
    .single();

  if (error || !truck) {
    truckInfoDiv.innerHTML = "<p>Error loading truck details.</p>";
    reserveBtn.disabled = true;
    return;
  }

  // Save the viewd truck in local storage
  saveViewedTruck(truck);

  truckInfoDiv.innerHTML = `
    <p><strong>ID:</strong> ${truck.truck_id}</p>
    <p><strong>Name:</strong> ${truck.truck_name}</p>
    <p><strong>Capacity:</strong> ${truck.truck_capacity} kg</p>
    <p><strong>Location:</strong> ${truck.truck_location} (${truck.truck_latitude}, ${truck.truck_longitude})</p>
    <p><strong>Availability:</strong> ${truck.truck_availability ? 'Available' : 'Reserved'}</p>
    <p><strong>Fuel Efficiency:</strong> ${truck.truck_mpg_capacity} MPG</p>
  `;

  reserveBtn.disabled = !truck.truck_availability;

  reserveBtn.addEventListener('click', async () => {
    const { error: reserveError } = await supabase
      .from('trucks')
      .update({ truck_availability: false })
      .eq('truck_id', truckId);

    if (!reserveError) {
      alert('Truck reserved successfully!');
      loadTruckDetails();
    } else {
      alert('Error reserving truck.');
    }
  });

  // Get diesel price from FuelEconomy.gov
  const fuelPrice = await getDieselPrice();
  dieselPriceSpan.textContent = parseFloat(fuelPrice);

  // Get route distance from Geoapify
  const userLat = -26.402460;
  const userLng = 31.300703;
  const distance = await getDistance(userLat, userLng, truck.truck_latitude, truck.truck_longitude);
  distanceSpan.textContent = parseFloat(distance).toFixed(2);

  // Calculate estimated fuel cost
  const estimatedFuelCost = calculateFuelCost(distance, truck.truck_mpg_capacity, fuelPrice);
  fuelCostSpan.textContent = parseFloat(estimatedFuelCost).toFixed(2);

  // Show routing link
  const routingLink = `https://www.openstreetmap.org/directions?engine=graphhopper_car&route=${userLat},${userLng};${truck.truck_latitude},${truck.truck_longitude}`;
  routeContainer.innerHTML += `<p><a href="${routingLink}" target="_blank">Plan Route to Truck</a></p>`;
}

// Function to fetch diesel price
async function getDieselPrice() {
  try {
    const response = await fetch("https://www.fueleconomy.gov/ws/rest/fuelprices", {
      headers: { "Accept": "application/json" }
    });
    const data = await response.json();
    return data.diesel; // Diesel price per gallon
  } catch (error) {
    console.error("Error fetching diesel price:", error);
    return 3.50; // Default fallback price
  }
}

// Function to estimate distance using Geoapify
async function getDistance(lat1, lon1, lat2, lon2) {
  try {
    const response = await fetch(`https://api.geoapify.com/v1/routing?waypoints=${lat1},${lon1}|${lat2},${lon2}&mode=drive&apiKey=${apiKey}`);
    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      console.error("No route data found.");
      return 0;
    }

    return data.features[0].properties.distance / 1609.34; // Convert meters to kilometers
  } catch (error) {
    console.error("Error fetching route distance:", error);
    return 0;
  }
}

// Function to calculate estimated fuel cost
function calculateFuelCost(distance, mpg, fuelPrice) {
  if (distance === 0 || mpg === 0) {
    return 0;
  }

  const gallonsNeeded = distance / (mpg * 1.60934); // Convert MPG to km per liter
  return gallonsNeeded * fuelPrice;
}

function saveViewedTruck(truck) {
  let viewedTrucks = JSON.parse(localStorage.getItem('viewedTrucks')) || [];

  // Remove duplicate entries
  viewedTrucks = viewedTrucks.filter(t => t.truck_id !== truck.truck_id);

  // Add the new truck details
  viewedTrucks.push(truck);

  // Keep only the last three viewed trucks
  viewedTrucks = viewedTrucks.slice(-3);

  localStorage.setItem('viewedTrucks', JSON.stringify(viewedTrucks));
}
