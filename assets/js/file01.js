"use strict";

import { fetchCategories, fetchProducts } from './functions.js';
import { saveVote, getVotes } from './firebase.js';

const databaseURL = 'https://<your-project>.firebaseio.com/subscribers.json';

/**
 * Muestra la notificación interactiva si el elemento existe.
 * @returns {void}
 */
const showToast = () => {
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        toast.classList.add("md:block");
    }
};

/**
 * Renderiza los productos obtenidos de la API.
 * @returns {void}
 */
const renderProducts = () => {
    fetchProducts('https://data-dawm.github.io/datum/reseller/products.json')
        .then(result => {
            if (!result.success) {
                alert(result.body);
                return;
            }

            const container = document.getElementById('products-container');
            if (!container) return;

            container.innerHTML = '';
            const products = result.body.slice(0, 6);

            products.forEach(product => {
                let productHTML = `
                    <div class="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
                        <img
                            class="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-lg object-cover transition-transform duration-300 hover:scale-[1.03]"
                            src="[PRODUCT.IMGURL]" alt="[PRODUCT.TITLE]" />
                        <h3 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                            $[PRODUCT.PRICE]
                        </h3>
                        <p class="text-base-content/80">[PRODUCT.TITLE]</p>
                        <div class="space-y-2">
                            <a href="[PRODUCT.PRODUCTURL]" target="_blank" rel="noopener noreferrer"
                                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full inline-block">
                                Ver en Amazon
                            </a>
                            <div class="hidden"><span class="1">[PRODUCT.CATEGORY_ID]</span></div>
                        </div>
                    </div>`;

                productHTML = productHTML.replaceAll('[PRODUCT.IMGURL]', product.imgUrl || '');
                productHTML = productHTML.replaceAll('[PRODUCT.TITLE]', product.title.length > 20 ? product.title.substring(0, 20) + '...' : product.title);
                productHTML = productHTML.replaceAll('[PRODUCT.PRICE]', product.price || '0.00');
                productHTML = productHTML.replaceAll('[PRODUCT.PRODUCTURL]', product.productURL || '#');
                productHTML = productHTML.replaceAll('[PRODUCT.CATEGORY_ID]', product.category_id || '');

                container.innerHTML += productHTML;
            });
        });
};

/**
 * Renderiza las categorías obtenidas desde XML.
 * @returns {Promise<void>}
 */
const renderCategories = async () => {
    try {
        const result = await fetchCategories('https://data-dawm.github.io/datum/reseller/categories.xml');

        if (!result.success) {
            alert(result.body);
            return;
        }

        const container = document.getElementById('categories');
        if (!container) return;

        container.innerHTML = `<option selected disabled>Seleccione una categoría</option>`;
        const categoriesXML = result.body;
        const categories = categoriesXML.getElementsByTagName('category');

        for (let category of categories) {
            const idElements = category.getElementsByTagName('id');
            const nameElements = category.getElementsByTagName('name');
            const id = idElements.length > 0 ? idElements[0].textContent : '';
            const name = nameElements.length > 0 ? nameElements[0].textContent : '';

            let categoryHTML = `<option value="[ID]">[NAME]</option>`;
            categoryHTML = categoryHTML.replaceAll('[ID]', id || '');
            categoryHTML = categoryHTML.replaceAll('[NAME]', name || '');
            container.innerHTML += categoryHTML;
        }
    } catch (error) {
        alert(error.message);
    }
};

/**
 * Habilita el formulario de votación y guarda el voto en Firebase.
 * @returns {void}
 */
const enableForm = () => {
    const form = document.getElementById('form_voting');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const productID = document.getElementById('select_product').value;
        if (!productID) {
            alert('Seleccione un producto antes de votar.');
            return;
        }
        const result = await saveVote(productID);
        alert(result.message);
        if (result.status === 'success') {
            form.reset();
            displayVotes();
        }
    });
};

/**
 * Obtiene los votos desde Firebase y los muestra agrupados en una tabla.
 * @returns {Promise<void>}
 */
const displayVotes = async () => {
    const resultsDiv = document.getElementById('results');
    if (!resultsDiv) return;

    const result = await getVotes();

    if (result.status === 'success') {
        const totals = {};
        const votes = result.data;
        for (let key in votes) {
            const productID = votes[key].productID;
            totals[productID] = (totals[productID] || 0) + 1;
        }

        let table = '<table class="w-full text-left text-gray-700 dark:text-gray-200"><tr><th class="p-2">Producto</th><th class="p-2">Total Votos</th></tr>';
        for (let productID in totals) {
            table += `<tr><td class="p-2">${productID}</td><td class="p-2">${totals[productID]}</td></tr>`;
        }
        table += '</table>';
        resultsDiv.innerHTML = table;
    } else {
        resultsDiv.innerHTML = `<p class="text-gray-500 dark:text-gray-300 text-center mt-16">${result.message || 'Resultado de la votación'}</p>`;
    }
};

/**
 * Agrega el evento click al botón demo para abrir un video en una nueva pestaña.
 * @returns {void}
 */
const showVideo = () => {
    const demo = document.getElementById("demo");
    if (demo) {
        demo.addEventListener("click", () => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        });
    }
};

const sendData = () => {
    const form = document.getElementById('subscriberForm');
    if (!form) {
        alert('No se encontró el formulario.');
        return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const emailText = (data.email || '').trim();
    const emailElement = document.getElementById('subscriberEmail');

    if (emailText.length === 0) {
        if (emailElement) {
            emailElement.focus();
            emailElement.classList.add('input-error');
            setTimeout(() => {
                emailElement.classList.remove('input-error');
            }, 700);
        }
        return;
    }

    data.saved = new Date().toLocaleString('es-CO', {
        timeZone: 'America/Guayaquil'
    });

    fetch(databaseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }
        return response.json();
    })
    .then(() => {
        alert('Agradeciendo tu preferencia, nos mantenemos actualizados y enfocados en atenderte como mereces');
        if (form) {
            form.reset();
        }
        getData();
    })
    .catch(() => {
        alert('Hemos experimentado un error. ¡Vuelve pronto!');
    });
};

const getData = async () => {
    try {
        const response = await fetch(databaseURL, {
            method: 'GET'
        });

        if (!response.ok) {
            alert('Hemos experimentado un error. ¡Vuelve pronto!');
            return;
        }

        const data = await response.json();
        const subscribersBody = document.getElementById('subscribers');
        const countSuscribers = new Map();

        if (data != null && Object.keys(data).length > 0) {
            for (let key in data) {
                const { email, saved } = data[key];
                const date = saved ? saved.split(',')[0] : 'Sin fecha';
                const count = countSuscribers.get(date) || 0;
                countSuscribers.set(date, count + 1);
            }
        }

        if (subscribersBody) {
            if (countSuscribers.size > 0) {
                subscribersBody.innerHTML = '';
                let index = 1;
                for (let [date, count] of countSuscribers) {
                    const rowTemplate = `
                        <tr>
                            <td>${index}</td>
                            <td>${date}</td>
                            <td>${count}</td>
                        </tr>
                    `;
                    subscribersBody.innerHTML += rowTemplate;
                    index++;
                }
            } else {
                subscribersBody.innerHTML = `
                    <tr>
                        <td colspan="3" class="text-center text-base-content/70 py-6">No subscriber data available yet.</td>
                    </tr>
                `;
            }
        }
    } catch (error) {
        alert('Hemos experimentado un error. ¡Vuelve pronto!');
    }
};

const ready = () => {
    console.log('DOM está listo');

    const form = document.getElementById('subscriberForm');
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            sendData();
        });
    }

    getData();
    renderProducts();
    renderCategories();
    enableForm();
    displayVotes();
};

(() => {
    alert("¡Bienvenido a la página!");
    console.log("Mensaje de bienvenida mostrado.");
    showToast();
    showVideo();
})();

document.addEventListener('DOMContentLoaded', ready);
