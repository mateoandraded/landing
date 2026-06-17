"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set, push, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

/**
 * Configuración de Firebase tomada desde las variables de entorno de Vite.
 * Los valores reales se definen en el archivo .env (no versionado).
 */
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

/**
 * Guarda un voto para un producto en la Realtime Database.
 * @param {string} productID - Identificador del producto votado.
 * @returns {Promise<{status: string, message: string}>}
 */
const saveVote = async (productID) => {
    try {
        const votesRef = ref(database, 'votes');
        const newVoteRef = push(votesRef);
        await set(newVoteRef, {
            productID: productID,
            date: new Date().toISOString()
        });
        return { status: 'success', message: 'Voto guardado correctamente' };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
};

/**
 * Obtiene todos los votos almacenados en la Realtime Database.
 * @returns {Promise<{status: string, data?: object, message?: string}>}
 */
const getVotes = async () => {
    try {
        const votesRef = ref(database, 'votes');
        const snapshot = await get(votesRef);
        if (snapshot.exists()) {
            return { status: 'success', data: snapshot.val() };
        } else {
            return { status: 'info', message: 'No hay datos' };
        }
    } catch (error) {
        return { status: 'error', message: error.message };
    }
};

export { saveVote, getVotes };
