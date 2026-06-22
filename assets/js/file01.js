"use strict";

import { fetchMenu } from './functions.js';

const databaseURL = 'https://landing-2de01-default-rtdb.firebaseio.com/favoritos.json';

const showToast = () => {
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        toast.classList.add("md:block");
    }
};

const showVideo = () => {
    const demo = document.getElementById("demo");
    if (demo) {
        demo.addEventListener("click", () => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        });
    }
};

const renderMenu = () => {
    fetchMenu('assets/data/menu.json')
        .then(result => {
            if (!result.success) {
                alert('No se pudo cargar el menú.');
                return;
            }

            const container = document.getElementById('menu-container');
            if (!container) return;

            const productos = result.body;
            console.log('Productos cargados en el menú:', productos.length);

            container.innerHTML = '';

            productos.forEach(producto => {
                let cardHTML = `
                    <div class="card card-border shadow-none">
                        <figure>
                            <img src="[IMG]" alt="[NOMBRE]" class="h-28 w-full object-cover sm:h-40" />
                        </figure>
                        <div class="card-body gap-2">
                            <div class="flex items-center justify-between">
                                <h5 class="card-title text-lg">[NOMBRE]</h5>
                                <span class="text-primary text-lg font-semibold">$[PRECIO]</span>
                            </div>
                            <p class="text-base-content/80">[DESC]</p>
                        </div>
                    </div>`;

                cardHTML = cardHTML.replaceAll('[IMG]', producto.imagen || '');
                cardHTML = cardHTML.replaceAll('[NOMBRE]', producto.nombre || '');
                cardHTML = cardHTML.replaceAll('[PRECIO]', producto.precio || '0.00');
                cardHTML = cardHTML.replaceAll('[DESC]', producto.descripcion || '');

                container.innerHTML += cardHTML;
            });
        });
};

const sendData = () => {
    const form = document.getElementById('subscriberForm');
    if (!form) {
        alert('No se encontró el formulario.');
        return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (!data.nombre || !data.email || !data.favorito) {
        alert('Por favor completa todos los campos.');
        return;
    }

    data.fecha = new Date().toLocaleString('es-EC', {
        timeZone: 'America/Guayaquil'
    });

    console.log('Enviando registro:', data);

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
        alert('¡Gracias por unirte al club Frutanga, ' + data.nombre + '!');
        form.reset();
        getData();
    })
    .catch(() => {
        alert('Hubo un error. Vuelve a intentarlo más tarde.');
    });
};

const getData = async () => {
    try {
        const response = await fetch(databaseURL, {
            method: 'GET'
        });

        if (!response.ok) {
            alert('No se pudieron cargar los registros.');
            return;
        }

        const data = await response.json();
        const tbody = document.getElementById('subscribers');
        if (!tbody) return;

        if (data != null && Object.keys(data).length > 0) {
            tbody.innerHTML = '';
            let index = 1;
            for (let key in data) {
                const { nombre, favorito } = data[key];
                const fila = `
                    <tr>
                        <td>${index}</td>
                        <td>${nombre || 'Anónimo'}</td>
                        <td>${favorito || '-'}</td>
                    </tr>
                `;
                tbody.innerHTML += fila;
                index++;
            }
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center text-base-content/70 py-6">Todavía no hay registros.</td>
                </tr>
            `;
        }
    } catch (error) {
        alert('No se pudieron cargar los registros.');
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

    renderMenu();
    getData();
};

(() => {
    alert("¡Bienvenido a Frutanga, el sabor del campus!");
    console.log("Mensaje de bienvenida mostrado.");
    showToast();
    showVideo();
})();

document.addEventListener('DOMContentLoaded', ready);
