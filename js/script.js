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

// Estado del carrito
let carrito = [];

// --- FUNCIONES LÓGICAS ---

// 1. Generador de iconos de picante
function generarIconosPicante(nivel) {
    let html = '';
    for(let i=1; i<=3; i++) {
        if(i <= nivel) {
            html += '<i class="fas fa-pepper-hot"></i> '; 
        } else {
            html += '<i class="fas fa-pepper-hot" style="color:#ddd"></i> ';
        }
    }
    return html;
}

// 2. Renderizar menú (con filtro opcional)
function cargarMenu(filtro = 'todos') {
    const contenedor = document.getElementById('menu-container');
    contenedor.innerHTML = ''; 

    // Filtrar productos
    const productosFiltrados = productos.filter(p => {
        if (filtro === 'todos') return true;
        return p.picante === filtro;
    });

    if (productosFiltrados.length === 0) {
        contenedor.innerHTML = '<p class="text-center">No hay salsas con este nivel de picante.</p>';
        return;
    }

    productosFiltrados.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('producto-card');
        
        // Verificamos si ya está en el carrito para mostrar cantidad (opcional, avanzado)
        // Por simplicidad, mantenemos el botón "Agregar" genérico

        card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-img" onerror="this.src='https://via.placeholder.com/200'">
            <div class="producto-info">
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <div class="picante" title="Nivel de picante">${generarIconosPicante(producto.picante)}</div>
                <p class="desc">${producto.descripcion}</p>
                <div class="precio">$${producto.precio} <span style="font-size:0.8rem; font-weight:normal; color:#888">/ ${producto.presentacion}</span></div>
                <button class="btn-pedir" onclick="agregarAlCarrito(${producto.id})">
                    Agregar <i class="fas fa-plus"></i>
                </button>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

// 3. Sistema de Filtros
function filtrarPorPicante(nivel) {
    // Actualizar botones visualmente
    const botones = document.querySelectorAll('.btn-filtro');
    botones.forEach(btn => btn.classList.remove('active'));
    
    // Buscar el botón clickeado para activarlo (lógica simple basada en texto/evento podría mejorar)
    // Aquí asumimos que al repintar el usuario ve el cambio en el contenido
    event.target.classList.add('active');

    cargarMenu(nivel);
}

// 4. Lógica del Carrito
function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    
    // Buscar si ya existe en el carrito
    const itemEnCarrito = carrito.find(item => item.id === idProducto);
    
    if (itemEnCarrito) {
        itemEnCarrito.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    actualizarCarritoUI();
    
    // Feedback visual simple (vibración botón o toast)
    // alert(`¡${producto.nombre} agregado!`); 
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