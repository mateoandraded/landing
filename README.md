# Frutanga – Landing Page

Landing page de **Frutanga**, el comedor de la ESPOL. Tostadas, batidos, fritada,
hamburguesas y hot dogs a precio de estudiante.

Proyecto 03 de Desarrollo de Aplicaciones Web y Móviles. Hecho con TailwindCSS
(FlyonUI) y JavaScript.

## Cómo verlo

Es un sitio estático, no necesita compilarse. Se puede servir con cualquier
servidor estático, por ejemplo:

```
python -m http.server 5050
```

y abrir http://localhost:5050

## Qué tiene

- Secciones: inicio, nosotros, especialidades, menú, equipo, contacto y registro.
- Menú que se carga con `fetch` (HTTP GET) desde `assets/data/menu.json`.
- Formulario de registro que envía los datos con `fetch` (HTTP POST) y los
  muestra en una tabla con `fetch` (HTTP GET).
- Menú de navegación entre secciones, responsive y con estilos propios.

## Firebase

El formulario guarda los registros en una Realtime Database de Firebase.
Reemplaza la constante `databaseURL` en `assets/js/file01.js` por la URL de tu
base (formato `https://TU-PROYECTO-default-rtdb.firebaseio.com/suscriptores.json`).
