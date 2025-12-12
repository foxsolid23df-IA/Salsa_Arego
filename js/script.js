// --- CONFIGURACIÓN ---
const PHONE_NUMBER = "525504156083";

// Base de datos de productos
const productos = [
    {
        id: 1,
        nombre: "Salsa Verde Casera",
        precio: 65,
        presentacion: "250g",
        picante: 2, // 1: Bajo, 2: Medio, 3: Alto
        imagen: "img/salsa-verde.jpg",
        descripcion: "Tomatillo fresco, serrano y el secreto de la abuela."
    },
    {
        id: 2,
        nombre: "Salsa Roja Martajada",
        precio: 70,
        presentacion: "250g",
        picante: 3,
        imagen: "img/salsa-roja.jpg",
        descripcion: "Jitomate asado a la leña con chile de árbol."
    },
    {
        id: 3,
        nombre: "Salsa Macha",
        precio: 85,
        presentacion: "230g",
        picante: 3,
        imagen: "img/salsa-macha.jpg",
        descripcion: "Mix de chiles secos, semillas y aceite de oliva."
    }
];

// Estado del carrito y filtros
let carrito = [];
let filtroActual = 'todos'; // Variable global para recordar filtro

// --- FUNCIONES LÓGICAS ---

// 1. Generador de iconos de picante
function generarIconosPicante(nivel) {
    let html = '';
    for (let i = 1; i <= 3; i++) {
        if (i <= nivel) {
            html += '<i class="fas fa-pepper-hot"></i> ';
        } else {
            html += '<i class="fas fa-pepper-hot" style="color:#ddd"></i> ';
        }
    }
    return html;
}

// 2. Renderizar menú (usa el filtro global)
function cargarMenu() {
    const contenedor = document.getElementById('menu-container');
    // Guardamos la posición del scroll antes de repintar (para que no salte)
    const scrollPos = window.scrollY;

    contenedor.innerHTML = '';

    // Filtrar productos
    const productosFiltrados = productos.filter(p => {
        if (filtroActual === 'todos') return true;
        return p.picante === filtroActual;
    });

    if (productosFiltrados.length === 0) {
        contenedor.innerHTML = '<p class="text-center">No hay salsas con este nivel de picante.</p>';
        return;
    }

    productosFiltrados.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('producto-card');

        // Verificar si está en carrito para decidir qué botón mostrar
        const itemEnCarrito = carrito.find(item => item.id === producto.id);
        const cantidad = itemEnCarrito ? itemEnCarrito.cantidad : 0;

        let botonesHtml = '';
        if (cantidad > 0) {
            // MOSTRAR CONTROLES CAMBIAR CANTIDAD [- 1 +]
            botonesHtml = `
                <div class="qty-selector">
                    <button class="btn-qty btn-minus" onclick="cambiarCantidad(${producto.id}, -1)">-</button>
                    <span class="qty-number">${cantidad}</span>
                    <button class="btn-qty btn-plus" onclick="cambiarCantidad(${producto.id}, 1)">+</button>
                </div>
            `;
        } else {
            // MOSTRAR BOTÓN AGREGAR NORMAL
            botonesHtml = `
                <button class="btn-pedir" onclick="cambiarCantidad(${producto.id}, 1)">
                    Agregar <i class="fas fa-plus"></i>
                </button>
            `;
        }

        card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-img" onerror="this.src='https://via.placeholder.com/200'">
            <div class="producto-info">
                <div class="info-top">
                    <h3 class="producto-nombre">${producto.nombre}</h3>
                    <div class="picante" title="Nivel de picante">${generarIconosPicante(producto.picante)}</div>
                    <p class="desc">${producto.descripcion}</p>
                </div>
                <div class="info-bottom">
                    <div class="precio">$${producto.precio} <span style="font-size:0.8rem; font-weight:normal; color:#888">/ ${producto.presentacion}</span></div>
                    ${botonesHtml}
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

// 3. Sistema de Filtros
function filtrarPorPicante(nivel) {
    filtroActual = nivel; // Guardamos filtro en variable global

    // Actualizar botones visualmente
    const botones = document.querySelectorAll('.btn-filtro');
    botones.forEach(btn => btn.classList.remove('active'));

    // Identificar botón por texto (simple) o evento. 
    // Como regeneramos el onclick, pasamos 'this' si fuera inline, pero aquí usamos una lógica simple:
    // En una app real usaríamos data-attributes. Por ahora, asumimos que el usuario ve el cambio.
    // (Opcional: lógica de UI para active class más robusta si se desea)

    cargarMenu();
}

// 4. Lógica del Carrito (Unificada: Agregar y Quitar)
function cambiarCantidad(idProducto, delta) {
    const producto = productos.find(p => p.id === idProducto);
    const itemIndex = carrito.findIndex(item => item.id === idProducto);

    if (itemIndex > -1) {
        // El producto ya existe
        carrito[itemIndex].cantidad += delta;

        // Si la cantidad llega a 0, eliminar del array
        if (carrito[itemIndex].cantidad <= 0) {
            carrito.splice(itemIndex, 1);
        }
    } else if (delta > 0) {
        // Producto nuevo (solo si estamos sumando)
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    actualizarCarritoUI();
    cargarMenu(); // Repintar para actualizar botones (+/-)
}

function actualizarCarritoUI() {
    const carritoBar = document.getElementById('carrito-flotante');
    const cantItemsSpan = document.getElementById('cant-items');
    const totalPrecioSpan = document.getElementById('total-precio');

    if (carrito.length === 0) {
        carritoBar.classList.add('hidden');
        document.body.classList.remove('has-cart');
    } else {
        carritoBar.classList.remove('hidden');
        document.body.classList.add('has-cart');
    }

    // Calcular totales
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const totalDinero = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    cantItemsSpan.innerText = `${totalItems} producto(s)`;
    totalPrecioSpan.innerText = `$${totalDinero}`;
}

// 5. Generar Pedido WhatsApp
function checkoutWhatsapp() {
    if (carrito.length === 0) return;

    let mensaje = "Hola Salsas Arego! 🌶️\n\nQuiero realizar el siguiente pedido:\n----------------------------------\n";

    let total = 0;
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += `▪️ ${item.cantidad}x ${item.nombre} ($${subtotal})\n`;
    });

    mensaje += `----------------------------------\n*TOTAL A PAGAR: $${total}*\n\n¿Me indican los datos para el pago y entrega?`;

    abrirWhatsapp(mensaje);
}

// 6. Funciones Auxiliares
function enviarFoto() {
    const mensaje = `Hola! Quiero compartirles una foto de cómo disfruto mi Salsa Arego para que la suban a su página. 📸`;
    abrirWhatsapp(mensaje);
}

function contactarGeneral() {
    const mensaje = `Hola Salsas Arego, tengo una duda sobre sus productos.`;
    abrirWhatsapp(mensaje);
}

function abrirWhatsapp(msg) {
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    cargarMenu(); // Carga inicial
});