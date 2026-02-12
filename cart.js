// Carrito persistente con localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Agregar producto al carrito
function addToCart(name, quantity, price) {
  quantity = parseInt(quantity);
  if (quantity > 0) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ name, quantity, price: parseFloat(price) });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    // Resetear cantidad en el producto
    const qtySpan = event.target.previousElementSibling.querySelector('span');
    qtySpan.textContent = '0';
  }
}

// Actualizar display del carrito (contador y contenido)
function updateCartDisplay() {
  const cartCount = document.getElementById('cartCount');
  const cartCountMobile = document.getElementById('cartCountMobile');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  
  // Contador total de items
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  cartCountMobile.textContent = totalItems;
  
  // Contenido del drawer
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    total += item.quantity * item.price;
    cartItems.innerHTML += `
      <div class="cart-item">
        <div class="cart-item__top">
          <span class="cart-item__name">${item.name}</span>
          <span class="cart-item__price">$${item.quantity * item.price}</span>
        </div>
        <div class="cart-item__controls">
          <div class="cart-item__qty">
            <button onclick="changeCartQty(${index}, -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="changeCartQty(${index}, 1)">+</button>
          </div>
          <button class="remove-btn" onclick="removeFromCart(${index})">Quitar</button>
        </div>
      </div>
    `;
  });
  cartTotal.textContent = `$${total}`;
}

// Cambiar cantidad en el carrito
function changeCartQty(index, delta) {
  cart[index].quantity = Math.max(1, cart[index].quantity + delta); // Mínimo 1
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
}

// Quitar producto del carrito
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
}

// Vaciar carrito
function clearCart() {
  cart = [];
  localStorage.removeItem('cart');
  updateCartDisplay();
}

// Toggle del drawer del carrito
function toggleCart() {
  const drawer = document.getElementById('cartDrawer');
  drawer.classList.toggle('open');
}

// Enviar pedido por WhatsApp
function checkout() {
  if (cart.length === 0) {
    alert('El carrito está vacío.');
    return;
  }
  let message = 'Hola! Quiero hacer un pedido:\n\n';
  let total = 0;
  cart.forEach(item => {
    message += `${item.name} x${item.quantity} - $${item.quantity * item.price}\n`;
    total += item.quantity * item.price;
  });
  message += `\nTotal: $${total}\n\nDirección: Av. América 860, Salliqueló`;
  const url = `https://wa.me/5492392558607?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// Inicialización del carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  updateCartDisplay();
  
  // Event listeners para el carrito
  document.getElementById('openCartBtn').addEventListener('click', toggleCart);
  document.getElementById('openCartBtnMobile').addEventListener('click', toggleCart);
  document.getElementById('closeCartBtn').addEventListener('click', toggleCart);
  document.getElementById('cartOverlay').addEventListener('click', toggleCart);
  document.getElementById('checkoutBtn').addEventListener('click', checkout);
  document.getElementById('clearCartBtn').addEventListener('click', clearCart);
});