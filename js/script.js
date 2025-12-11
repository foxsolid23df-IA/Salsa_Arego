// --- CONFIGURACIÓN ---
// Número de teléfono que aparece en la etiqueta (sin espacios ni guiones)
const PHONE_NUMBER = "525504156083"; 

// Base de datos de productos (Puedes agregar más copiando y pegando los bloques {})
const productos = [
    {
        id: 1,
        nombre: "Salsa Verde Casera",
        precio: 65,
        presentacion: "250g",
        picante: 2, // 1: Bajo, 2: Medio, 3: Alto
        imagen: "img/salsa-verde.jpg", // Asegúrate de tener esta imagen en tu carpeta
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

// --- FUNCIONES LÓGICAS ---

// 1. Generador de iconos de picante
function generarIconosPicante(nivel) {
    let html = '';
    // Creamos 3 chiles
    for(let i=1; i<=3; i++) {
        if(i <= nivel) {
            html += '<i class="fas fa-pepper-hot"></i> '; // Chile activo
        } else {
            html += '<i class="fas fa-pepper-hot" style="color:#ddd"></i> '; // Chile inactivo (gris)
        }
    }
    return html;
}

// 2. Renderizar (dibujar) el menú en el HTML
function cargarMenu() {
    const contenedor = document.getElementById('menu-container');
    contenedor.innerHTML = ''; // Limpiar mensaje de carga

    productos.forEach(producto => {
        // Crear el elemento HTML de la tarjeta
        const card = document.createElement('div');
        card.classList.add('producto-card');

        // Imagen por defecto si falla la carga
        const imgPath = producto.imagen;
        
        card.innerHTML = `
            <img src="${imgPath}" alt="${producto.nombre}" class="producto-img" onerror="this.src='https://via.placeholder.com/200'">
            <div class="producto-info">
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <div class="picante" title="Nivel de picante">${generarIconosPicante(producto.picante)}</div>
                <p class="desc">${producto.descripcion}</p>
                <div class="precio">$${producto.precio} <span style="font-size:0.8rem; font-weight:normal; color:#888">/ ${producto.presentacion}</span></div>
                <button class="btn-pedir" onclick="pedirProducto('${producto.nombre}', ${producto.precio})">
                    Pedir <i class="fab fa-whatsapp"></i>
                </button>
            </div>
        `;
        
        contenedor.appendChild(card);
    });
}

// 3. Función para enviar pedido a WhatsApp
function pedirProducto(nombre, precio) {
    const mensaje = `Hola Salsas Arego! 🌶️\n\nEstoy viendo su menú virtual y me gustaría pedir:\n*${nombre}* ($${precio}).\n\n¿Me podrían dar detalles de entrega?`;
    abrirWhatsapp(mensaje);
}

// 4. Función para "Subir Foto" (Redirecciona a WA)
function enviarFoto() {
    const mensaje = `Hola! Quiero compartirles una foto de cómo disfruto mi Salsa Arego para que la suban a su página. 📸`;
    abrirWhatsapp(mensaje);
}

// 5. Contacto general (Botón flotante)
function contactarGeneral() {
    const mensaje = `Hola Salsas Arego, tengo una duda sobre sus productos.`;
    abrirWhatsapp(mensaje);
}

// Helper para abrir la URL
function abrirWhatsapp(msg) {
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}

// --- INICIALIZACIÓN ---
// Ejecutar cuando cargue la página
document.addEventListener('DOMContentLoaded', cargarMenu);