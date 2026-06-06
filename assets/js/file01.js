"use strict";

import { fetchProducts, fetchCategories, fetchReservation } from './functions.js';

const URL_PRODUCTS = "https://data-dawm.github.io/datum/reseller/products.json";
const URL_CATEGORIES = "https://data-dawm.github.io/datum/reseller/categories.xml";
const URL_RESERVATION = "https://jsonplaceholder.typicode.com/posts";

/**
 * Muestra una notificacion tipo toast y la oculta despues de 4 segundos
 */
const showToast = () => {
  const toast = document.getElementById("toast-interactive");
  if (toast) {
    toast.classList.remove("hidden");
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 4000);
  }
};

/**
 * Abre un video de YouTube al hacer click en el boton demo
 */
const showVideo = () => {
  const demoBtn = document.getElementById("demo");
  if (demoBtn) {
    demoBtn.addEventListener("click", () => {
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
    });
  }
};

/**
 * Obtiene productos desde la API y los renderiza como cards en el contenedor
 */
const renderProducts = () => {
  fetchProducts(URL_PRODUCTS).then(result => {
    if (result.success) {
      const container = document.getElementById("products-container");
      if (!container) return;
      container.innerHTML = "";
      const primeros6 = result.body.slice(0, 6);
      primeros6.forEach(product => {
        let html = `
          <div class="card card-border shadow-none">
            <figure>
              <img src="[IMGURL]" alt="[TITLE]" class="h-40 w-full object-cover" />
            </figure>
            <div class="card-body gap-2">
              <h5 class="card-title text-base">[TITLE]</h5>
              <p class="text-base-content/80 text-sm">$[PRICE]</p>
              <span class="badge badge-soft badge-primary text-xs">[CAT]</span>
            </div>
          </div>
        `;
        html = html.replaceAll("[IMGURL]", product.IMGURL);
        html = html.replaceAll("[TITLE]", product.TITLE.substring(0, 30));
        html = html.replaceAll("[PRICE]", product.PRICE);
        html = html.replaceAll("[CAT]", product.CATEGORY_ID);
        container.innerHTML += html;
      });
    } else {
      alert("Error al cargar productos: " + result.body);
    }
  });
};

/**
 * Obtiene categorias desde la API XML y llena el select de categorias
 */
const renderCategories = async () => {
  try {
    const result = await fetchCategories(URL_CATEGORIES);
    if (result.success) {
      const select = document.getElementById("categories");
      if (!select) return;
      select.innerHTML = '<option selected disabled>Seleccione una categoria</option>';
      const categories = result.body.getElementsByTagName("category");
      for (let cat of categories) {
        const id = cat.getElementsByTagName("id")[0].textContent;
        const name = cat.getElementsByTagName("name")[0].textContent;
        let option = `<option value="[ID]">[NAME]</option>`;
        option = option.replaceAll("[ID]", id);
        option = option.replaceAll("[NAME]", name);
        select.innerHTML += option;
      }
    } else {
      alert("Error al cargar categorias: " + result.body);
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
};

(() => {
  showToast();
  showVideo();
  renderProducts();
  renderCategories();

  const form = document.getElementById("reservation-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("username").value;
      const phone = document.getElementById("userphone").value;
      const local = document.getElementById("userlocal").value;
      const date = document.getElementById("userdate").value;
      const message = document.getElementById("usermessage").value;

      fetchReservation(URL_RESERVATION, { name, phone, local, date, message }).then(result => {
        if (result.success) {
          const section = document.getElementById("reservation-result");
          if (section) {
            document.getElementById("result-name").textContent = name;
            document.getElementById("result-local").textContent = local;
            document.getElementById("result-date").textContent = date;
            section.classList.remove("hidden");
          }
          showToast();
        } else {
          alert("Error al enviar el pedido: " + result.body);
        }
      });
    });
  }
})();
