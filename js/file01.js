import { fetchProducts, fetchCategories } from "./functions.js";

"use strict";

const renderPoducts = () => {
    fetchProducts('https://data-dawm.github.io/datum/reseller/products.json').then(result => {
        if (result.success) {
            let container = document.getElementById("products-container")
            container.innerHTML = '';
            let products = result.body.slice(0, 6);

            products.forEach(product => {
                let productHTML = `
                <div class="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
                    <img
                        class="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-lg object-cover transition-transform duration-300 hover:scale-[1.03]"
                        src="[PRODUCT.IMGURL]" alt="[PRODUCT.TITLE]">
                    <h3
                        class="h-6 text-xl font-semibold tracking-tight text-gray-900 dark:text-white hover:text-black-600 dark:hover:text-white-400">
                        $[PRODUCT.PRICE]
                    </h3>
                    <div class="h-5 rounded w-full">[PRODUCT.TITLE]</div>
                    <div class="space-y-2">
                        <a href="[PRODUCT.PRODUCTURL]" target="_blank" rel="noopener noreferrer"
                            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full inline-block">
                            Ver en Amazon
                        </a>
                        <div class="hidden">
                            <span class="1">[PRODUCT.CATEGORY_ID]</span>
                        </div>
                    </div>
                </div>`;

                productHTML = productHTML.replaceAll("[PRODUCT.TITLE]", product.title);
                productHTML = productHTML.replaceAll("[PRODUCT.CATEGORY_ID]", product.category_id);
                productHTML = productHTML.replaceAll("[PRODUCT.IMGURL]", product.imgUrl);
                productHTML = productHTML.replaceAll("[PRODUCT.PRICE]", product.price);
                productHTML = productHTML.replaceAll("[PRODUCT.PRODUCTURL]", product.productUrl);

                container.innerHTML += productHTML
            })
        }
    })
}

/**
 * Muestra el elemento de notificación interactiva (Toast) en la interfaz de usuario
 * agregando la clase de estilo necesaria si el elemento existe.
 * 
 * @function showToast
 * @returns {void} No retorna ningún valor.
 */
const showToast = () => {
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        toast.classList.add("md:block");
    }
};

/**
 * Configura un escuchador de eventos (Event Listener) en el elemento de demostración.
 * Al hacer clic, abre un enlace de video de YouTube en una nueva pestaña.
 * 
 * @function showVideo
 * @returns {void} No retorna ningún valor.
 */
const showVideo = () => {
    const demo = document.getElementById("demo");
    if (demo) {
        demo.addEventListener("click", () => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        });
    }
};

/**
 * Carga y renderiza las categorías de productos en el elemento select
 * con id "categories", obtenidas desde un documento XML remoto.
 * 
 * @async
 * @function renderCategories
 * @returns {Promise<void>} No retorna ningún valor.
 */
const renderCategories = async () => {
    try {
        let result = await fetchCategories('https://data-dawm.github.io/datum/reseller/categories.xml');

        if (result.success) {
            let container = document.getElementById("categories");
            container.innerHTML = `<option selected disabled>Seleccione una categoría</option>`;

            let categoriesXML = result.body;
            let categories = categoriesXML.getElementsByTagName("category");

            for (let category of categories) {
                let categoryHTML = `<option value="[ID]">[NAME]</option>`;

                let id = category.getElementsByTagName("id")[0].textContent;
                let name = category.getElementsByTagName("name")[0].textContent;

                categoryHTML = categoryHTML.replaceAll("[ID]", id);
                categoryHTML = categoryHTML.replaceAll("[NAME]", name);

                container.innerHTML += categoryHTML;
            }
        } else {
            alert(result.body);
        }
    } catch (error) {
        alert(error.message);
    }
};

(() => {
    showToast();
    showVideo();
    renderPoducts();
    renderCategories();
})();