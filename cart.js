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

    // Mostrar notificación
    showAddedNotification(name);

    // Resetear cantidad a 1 (no a 0)
    const qtySpan = event.target.previousElementSibling.querySelector('span');
    if (qtySpan) qtySpan.textContent = '1';
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
  if (cartCount) cartCount.textContent = totalItems;
  if (cartCountMobile) cartCountMobile.textContent = totalItems;

  // Contenido del drawer
  if (cartItems) {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
      total += item.quantity * item.price;
      cartItems.innerHTML += `
        <div class="cart-item">
          <div class="cart-item__top">
            <span class="cart-item__name">${item.name}</span>
            <span class="cart-item__price">$${(item.quantity * item.price).toLocaleString('es-AR')}</span>
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
    if (cartTotal) cartTotal.textContent = `$${total.toLocaleString('es-AR')}`;
  }
}

// Cambiar cantidad en el carrito
function changeCartQty(index, delta) {
  cart[index].quantity = Math.max(1, cart[index].quantity + delta);
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
  if (drawer) drawer.classList.toggle('open');
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
    const subtotal = item.quantity * item.price;
    message += `${item.name} x${item.quantity}${item.price > 0 ? ' - $' + subtotal.toLocaleString('es-AR') : ''}\n`;
    total += subtotal;
  });
  if (total > 0) {
    message += `\nTotal: $${total.toLocaleString('es-AR')}`;
  }
  message += `\n\n📍 Dirección: Av. América 860, Salliqueló`;
  const url = `https://wa.me/5492392558607?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// Inicialización del carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  updateCartDisplay();

  // Event listeners para el carrito
  const openCartBtn = document.getElementById('openCartBtn');
  const openCartBtnMobile = document.getElementById('openCartBtnMobile');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartOverlay = document.getElementById('cartOverlay');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const clearCartBtn = document.getElementById('clearCartBtn');

  if (openCartBtn) openCartBtn.addEventListener('click', toggleCart);
  if (openCartBtnMobile) openCartBtnMobile.addEventListener('click', toggleCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
  if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);
  if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);
  if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);
});
