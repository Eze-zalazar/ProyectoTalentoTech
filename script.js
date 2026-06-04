// URL de la API REST de indumentaria masculina
const API_URL = "https://fakestoreapi.com/products/category/men's clothing";

// Estado global de la aplicación (Carrito de compras)
// Cargamos el carrito desde el LocalStorage al iniciar, si no existe inicializamos un array vacío
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Elementos del DOM
const containerProductos = document.getElementById('product-container');
const contadorCarrito = document.getElementById('contador-carrito');
const carritoItems = document.getElementById('carrito-items');
const totalCarrito = document.getElementById('total-carrito');
const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');
const formContacto = document.getElementById('form-contacto');

// 1. OBTENER PRODUCTOS DESDE LA API REST (Usando Promesas tradicionales con .then() y .catch())
function obtenerProductos() {
    fetch(API_URL)
        .then(function (respuesta) {
            if (!respuesta.ok) {
                throw new Error("No se pudo obtener la respuesta de la API");
            }
            return respuesta.json();
        })
        .then(function (productos) {
            renderizarProductos(productos);
        })
        .catch(function (error) {
            console.error("Hubo un error cargando los productos:", error);
            containerProductos.innerHTML = `
                <div class="text-center w-100 py-5">
                    <p class="text-danger fw-bold">Lo sentimos, no pudimos cargar los productos en este momento. Volvé a intentarlo más tarde.</p>
                </div>
            `;
        });
}

// 2. RENDERIZADO DINÁMICO DE PRODUCTOS EN EL DOM
function renderizarProductos(productos) {
    containerProductos.innerHTML = ''; // Limpiamos el spinner de carga

    // Arreglo con las rutas de las imágenes locales que ya tenías en tu carpeta img
    const imagenesLocales = [
        "img/remera.jfif",
        "img/shorts.jfif",
        "img/zapatillas.jfif",
        "img/campera.jfif"
    ];

    productos.forEach(function (producto, index) {
        // Asignamos precios fijos en pesos argentinos basados en tu diseño original
        let precioLocal = 0;
        if (index === 0) {
            precioLocal = 24990;  // Remera Performance
        } else if (index === 1) {
            precioLocal = 18990;  // Short Training
        } else if (index === 2) {
            precioLocal = 89990;  // Zapatillas Velocity
        } else if (index === 3) {
            precioLocal = 39990;  // Campera Athletic
        } else {
            precioLocal = Math.round(producto.price * 450); // Backup por si hay más de 4 productos
        }
        
        // Mapeamos cada producto retornado por la API a una de tus imágenes locales según su posición (índice)
        const imagenAMostrar = imagenesLocales[index % imagenesLocales.length];
        
        // Creamos la tarjeta del producto utilizando la estructura de artículo semántico
        const card = document.createElement('article');
        card.className = 'card';
        
        card.innerHTML = `
            <img src="${imagenAMostrar}" alt="${producto.title}">
            <h3>${producto.title.substring(0, 20)}...</h3>
            <p class="precio">$${precioLocal.toLocaleString('es-AR')}</p>
            <button class="btn-card w-100 btn-agregar" 
                data-id="${producto.id}" 
                data-titulo="${producto.title}" 
                data-precio="${precioLocal}" 
                data-imagen="${imagenAMostrar}">
                Agregar al Carrito
            </button>
        `;
        
        containerProductos.appendChild(card);
    });

    // Una vez renderizados los productos, asignamos el evento click a los botones
    asignarEventosBotonesAgregar();
}

// 3. ASIGNAR EVENTOS CLICK A LOS BOTONES DE AGREGAR AL CARRITO
function asignarEventosBotonesAgregar() {
    const botonesAgregar = document.querySelectorAll('.btn-agregar');
    
    botonesAgregar.forEach(function (boton) {
        boton.addEventListener('click', function (e) {
            const id = e.target.getAttribute('data-id');
            const titulo = e.target.getAttribute('data-titulo');
            const precio = parseInt(e.target.getAttribute('data-precio'), 10);
            const imagen = e.target.getAttribute('data-imagen');

            // Creamos un objeto con los datos del producto seleccionado
            const productoSeleccionado = {
                id: id,
                titulo: titulo,
                precio: precio,
                imagen: imagen
            };

            agregarAlCarrito(productoSeleccionado);
        });
    });
}

// 4. LÓGICA DEL CARRITO: AGREGAR PRODUCTO
function agregarAlCarrito(productoNuevo) {
    // Buscamos si el producto ya está en el carrito
    let itemExistente = null;
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].id === productoNuevo.id) {
            itemExistente = carrito[i];
            break;
        }
    }

    if (itemExistente) {
        // Si existe, incrementamos su cantidad
        itemExistente.cantidad++;
    } else {
        // Si es nuevo, lo agregamos al carrito con cantidad inicial en 1
        productoNuevo.cantidad = 1;
        carrito.push(productoNuevo);
    }

    // Actualizamos el localStorage y la vista del carrito
    actualizarCarrito();

    // Mostramos la notificación toast personalizada
    mostrarNotificacion("Ítem agregado al carrito");
}

// FUNCIÓN AUXILIAR: MOSTRAR NOTIFICACIÓN TOAST PERSONALIZADA
function mostrarNotificacion(mensaje) {
    // Buscamos si ya existe el contenedor en el DOM
    let toast = document.getElementById('toast-notificacion');
    
    // Si no existe, lo creamos dinámicamente
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notificacion';
        toast.className = 'toast-carrito';
        document.body.appendChild(toast);
    }
    
    // Asignamos el texto solicitado
    toast.textContent = mensaje;
    
    // Añadimos la clase 'show' para disparar la animación de entrada
    toast.classList.add('show');
    
    // Limpiamos cualquier temporizador previo si se hace spam del botón
    if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
    }
    
    // Quitamos la clase después de 2 segundos para ocultarla
    window.toastTimeout = setTimeout(function () {
        toast.classList.remove('show');
    }, 2000);
}

// 5. ACTUALIZAR INTERFAZ DEL CARRITO Y PERSISTENCIA EN LOCALSTORAGE
function actualizarCarrito() {
    // Guardamos el array del carrito actualizado en LocalStorage como string JSON
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Calculamos el total de ítems agregados para el contador del header
    let totalItems = 0;
    for (let i = 0; i < carrito.length; i++) {
        totalItems += carrito[i].cantidad;
    }
    contadorCarrito.textContent = totalItems;

    // Renderizamos la tabla del carrito en el modal
    renderizarCarritoModal();
}

// 6. RENDERIZAR TABLA DINÁMICA DENTRO DEL MODAL
function renderizarCarritoModal() {
    // Si el carrito está vacío, mostramos un mensaje amistoso
    if (carrito.length === 0) {
        carritoItems.innerHTML = `
            <div class="text-center py-4">
                <span style="font-size: 3rem;">🛒</span>
                <p class="mt-2 text-secondary">Tu carrito está vacío. ¡Explorá nuestros productos!</p>
            </div>
        `;
        totalCarrito.textContent = "0";
        return;
    }

    // Estructura de la tabla responsiva
    let tablaHTML = `
        <table class="table table-dark align-middle">
            <thead>
                <tr>
                    <th scope="col">Prod.</th>
                    <th scope="col">Detalle</th>
                    <th scope="col">Precio</th>
                    <th scope="col" class="text-center">Cant.</th>
                    <th scope="col">Subtotal</th>
                    <th scope="col" class="text-center">Acción</th>
                </tr>
            </thead>
            <tbody>
    `;

    let totalAcumulado = 0;

    // Recorremos el carrito para armar las filas de la tabla
    carrito.forEach(function (item) {
        const subtotal = item.precio * item.cantidad;
        totalAcumulado += subtotal;

        tablaHTML += `
            <tr>
                <td>
                    <img src="${item.imagen}" alt="${item.titulo}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                </td>
                <td class="small text-truncate" style="max-width: 120px;">
                    ${item.titulo.substring(0, 15)}...
                </td>
                <td>
                    $${item.precio.toLocaleString('es-AR')}
                </td>
                <td class="text-center">
                    <div class="d-flex align-items-center justify-content-center gap-1">
                        <button class="btn-qty" onclick="cambiarCantidad('${item.id}', -1)">-</button>
                        <span class="fw-bold px-1">${item.cantidad}</span>
                        <button class="btn-qty" onclick="cambiarCantidad('${item.id}', 1)">+</button>
                    </div>
                </td>
                <td class="fw-semibold">
                    $${subtotal.toLocaleString('es-AR')}
                </td>
                <td class="text-center">
                    <button class="btn-delete" onclick="eliminarDelCarrito('${item.id}')" aria-label="Eliminar ${item.titulo}">
                        🗑️
                    </button>
                </td>
            </tr>
        `;
    });

    tablaHTML += `
            </tbody>
        </table>
    `;

    // Inyectamos la tabla armada en el DOM
    carritoItems.innerHTML = tablaHTML;
    // Actualizamos el total acumulado en el DOM
    totalCarrito.textContent = totalAcumulado.toLocaleString('es-AR');
}

// 7. FUNCIONES EXPUESTAS AL ÁMBITO GLOBAL PARA CONTROLAR CANTIDADES
window.cambiarCantidad = function (id, cambio) {
    let item = null;
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].id === id) {
            item = carrito[i];
            break;
        }
    }

    if (item) {
        item.cantidad += cambio;
        // Si la cantidad llega a 0 o menos, lo eliminamos automáticamente
        if (item.cantidad <= 0) {
            eliminarDelCarrito(id);
            return;
        }
    }
    actualizarCarrito();
};

window.eliminarDelCarrito = function (id) {
    // Filtramos el array del carrito excluyendo el elemento con el ID indicado
    let carritoFiltrado = [];
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].id !== id) {
            carritoFiltrado.push(carrito[i]);
        }
    }
    carrito = carritoFiltrado;
    actualizarCarrito();
};

// 8. FINALIZAR COMPRA
btnFinalizarCompra.addEventListener('click', function () {
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agregá algún artículo antes de pagar.");
        return;
    }

    // Cerramos el modal del carrito de manera programática primero
    const modalCarritoElement = document.getElementById('carritoModal');
    const modalCarritoInstance = bootstrap.Modal.getInstance(modalCarritoElement);
    if (modalCarritoInstance) {
        modalCarritoInstance.hide();
    }

    // Vaciamos el carrito y limpiamos persistencia
    carrito = [];
    actualizarCarrito();

    // Abrimos el modal de éxito (compraExitosaModal) de Bootstrap de manera programática
    const modalExitoElement = document.getElementById('compraExitosaModal');
    const modalExitoInstance = new bootstrap.Modal(modalExitoElement);
    modalExitoInstance.show();
});

// 9. VALIDACIÓN MANUAL DEL FORMULARIO DE CONTACTO
formContacto.addEventListener('submit', function (e) {
    const nombreInput = document.getElementById('nombre').value.trim();
    const emailInput = document.getElementById('email').value.trim();

    // Validación de longitud mínima para el nombre
    if (nombreInput.length < 3) {
        e.preventDefault(); // Evitamos que el formulario se envíe a Formspree
        alert("Por favor, ingresá un nombre válido de al menos 3 caracteres.");
        return;
    }

    // Expresión regular básica para estructura de correo electrónico
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(emailInput)) {
        e.preventDefault(); // Evitamos el envío
        alert("Por favor, ingresá una dirección de correo electrónico válida (ejemplo: usuario@dominio.com).");
        return;
    }
});

// 10. INICIALIZACIÓN AL CARGAR LA PÁGINA
document.addEventListener('DOMContentLoaded', function () {
    obtenerProductos();
    actualizarCarrito(); // Recupera y muestra ítems guardados en localStorage si los hay
});