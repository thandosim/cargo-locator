import { loadPartial, updateFooter } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  loadPartial("head", "../partials/head.html");
  loadPartial("header", "../partials/header.html");
  loadPartial("footer", "../partials/footer.html").then(() => {
    updateFooter();
  });
});

window.addEventListener("load", function () {
    setTimeout(function () {
        document.getElementById("loader").classList.add("hidden");
    }, 2000); // 2-second delay
});
