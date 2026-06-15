'use strict';

const fetchProducts = (url) => {
    return fetch(url)
        .then(response => {
            // Verificar si la respuesta no es exitosa
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Respuesta exitosa
            return {
                success: true,
                body: data
            };
        })
        .catch(error => {
            // Error en la solicitud
            return {
                success: false,
                body: error.message
            };
        });
}

const fetchCategories = (url) => {
    return fetch(url)
        .then(response => {
            // Verificar si la respuesta no es exitosa
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            // Parsear el texto XML a un documento XML
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(data, "text/xml");
            return {
                success: true,
                body: xmlDoc
            };
        })
        .catch(error => {
            // Error en la solicitud
            return {
                success: false,
                body: error.message
            };
        });
}

export { fetchProducts, fetchCategories }