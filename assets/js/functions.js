"use strict";

/**
 * Realiza una petición HTTP para obtener productos en formato JSON.
 * @param {string} url - URL de la API de productos.
 * @returns {Promise<{success: boolean, body: any}>}
 */
const fetchProducts = (url) => {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            return {
                success: true,
                body: data
            };
        })
        .catch(error => {
            return {
                success: false,
                body: error.message
            };
        });
};

/**
 * Realiza una petición HTTP para obtener categorías en formato XML.
 * @param {string} url - URL de la API de categorías.
 * @returns {Promise<{success: boolean, body: Document|string}>}
 */
const fetchCategories = async (url) => {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const text = await response.text();
        const parser = new DOMParser();
        const data = parser.parseFromString(text, "application/xml");

        return {
            success: true,
            body: data
        };
    } catch (error) {
        return {
            success: false,
            body: error.message
        };
    }
};

export { fetchProducts, fetchCategories };