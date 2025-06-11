import { loadPartial, updateFooter } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  loadPartial("head", "../partials/head.html");
  loadPartial("header", "../partials/header.html");
  loadPartial("footer", "../partials/footer.html").then(() => {
    updateFooter();
  });
});
