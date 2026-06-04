# SportFit | E-Commerce de Ropa Deportiva Premium

Este proyecto es una aplicación web de E-Commerce interactiva y responsive para la tienda de ropa deportiva **SportFit**. Ha sido desarrollado utilizando una estructura semántica en HTML5, estilos avanzados en CSS3 integrados con **Bootstrap 5**, y lógica interactiva en JavaScript Vanilla adaptada al nivel académico del plan de estudios.

---

## 🚀 Características del Proyecto

### 1. Estructura & SEO
* **HTML5 Semántico**: Uso correcto de etiquetas (`header`, `nav`, `main`, `section`, `article`, `footer`) para garantizar una estructura limpia, accesible y legible para lectores de pantalla.
* **Optimización SEO**: Incorporación de metaetiquetas en el `<head>` para `description`, `keywords` y `author`, aumentando la visibilidad en motores de búsqueda.
* **Accesibilidad**: Atributos `alt` descriptivos implementados en todas las imágenes.

### 2. Diseño Moderno e Integración de Bootstrap 5
* **Productos Responsivos**: Listado organizado de forma flexible utilizando clases de Flexbox de Bootstrap 5.
* **Reseñas Grid**: Sección de comentarios de clientes diseñada con CSS Grid (`grid-template-columns`).
* **Sección de Contacto Adaptable**: Adaptabilidad garantizada mediante Media Queries.
* **Modal de Carrito**: Modal interactivo de Bootstrap 5, personalizado estéticamente con una paleta deportiva oscura y verde neón (`#00ff88`), que muestra una tabla de compras dinámica.

### 3. Lógica de Negocio en JavaScript (script.js)
* **Consumo de API REST Asíncrono**: Consumo de la API externa de productos [FakeStoreAPI](https://fakestoreapi.com/products/category/men's clothing) mediante la estructura tradicional de promesas (`fetch().then().catch()`) sin hacer uso de `async/await`.
* **Funciones Tradicionales**: Estructurado modularmente mediante declaraciones tradicionales (`function nombre()`).
* **Carrito Interactivo**:
  * Botón para agregar ítems que incrementa cantidades o añade nuevos productos.
  * Contador numérico dinámico en tiempo real en la cabecera.
  * Gestión en el modal (botones `+` y `-` para modificar cantidad, eliminación directa de filas, cálculo automático de subtotales y total general).
* **Persistencia Local**: Uso de `localStorage` (`JSON.stringify` y `JSON.parse`) para evitar la pérdida de los productos en el carrito al recargar la página.
* **Finalización de la Compra**: Simulación que vacía el carrito, limpia el almacenamiento local, alerta al usuario mediante un pop-up y cierra el modal automáticamente.
* **Validación de Formularios**: Control y filtrado manual del evento `submit` en el formulario de contacto (longitud mínima del nombre y formato regex de email) antes del envío a Formspree.

---

## 📁 Estructura de Archivos

```text
TALENTOTECHTP/
├── img/                  # Directorio para recursos visuales (logos, banners)
├── index.html            # Archivo principal de la aplicación (HTML5 + Bootstrap 5 CDN)
├── style.css             # Hoja de estilos personalizados integrada con el modal
├── script.js             # Lógica e interacción del e-commerce (Promesas + DOM + LocalStorage)
└── README.md             # Documentación del proyecto (este archivo)
```

---

## 🛠️ Tecnologías Utilizadas

* **HTML5** & **CSS3**
* **Bootstrap 5.3.3** (a través de CDN)
* **JavaScript ES6** (Promesas tradicionales, Fetch API, DOM, LocalStorage)
* **FakeStoreAPI** (Servicios REST externos)

---

## 💻 Instrucciones de Uso

1. Clonar o descargar el repositorio del proyecto en tu computadora.
2. Asegurar que las imágenes del proyecto se encuentren dentro de la carpeta `img/`.
3. Abrir el archivo `index.html` en cualquier navegador web moderno.
4. Interactuar agregando productos al carrito, modificando cantidades en el modal de compras o validando el envío del formulario de contacto.