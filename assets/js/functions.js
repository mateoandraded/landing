"use strict";

/**
 * Obtiene productos desde una URL JSON
 * @param {string} url - URL del endpoint de productos
 * @returns {Promise<{success: boolean, body: any}>}
 */
let fetchProducts = (url) => {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      return { success: true, body: data };
    })
    .catch(error => {
      return { success: false, body: error.message };
    });
};

/**
 * Obtiene categorias desde una URL XML
 * @param {string} url - URL del endpoint XML
 * @returns {Promise<{success: boolean, body: Document|string}>}
 */
let fetchCategories = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    let text = await response.text();
    const parser = new DOMParser();
    const data = parser.parseFromString(text, "application/xml");
    return { success: true, body: data };
  } catch (error) {
    return { success: false, body: error.message };
  }
};

/**
 * Envia una reserva mediante HTTP POST
 * @param {string} url - URL del endpoint
 * @param {Object} data - Datos del formulario
 * @returns {Promise<{success: boolean, body: any}>}
 */
let fetchReservation = (url, data) => {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then(result => {
      return { success: true, body: result };
    })
    .catch(error => {
      return { success: false, body: error.message };
    });
};

export { fetchProducts, fetchCategories, fetchReservation };
