// Carrito persistente con localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ── Alerta Sin Stock ────────────────────────────────────────────────────────
function mostrarAlertaSinStock() {
  let alerta = document.getElementById('sinStockAlert');
  if (!alerta) {
    alerta = document.createElement('div');
    alerta.id = 'sinStockAlert';
    Object.assign(alerta.style, {
      position:       'fixed',
      bottom:         '90px',
      right:          '20px',
      background:     'rgba(255, 50, 50, 0.15)',
      border:         '1px solid rgba(255, 80, 80, 0.40)',
      color:          'rgba(255, 140, 140, 0.95)',
      padding:        '14px 20px',
      borderRadius:   '16px',
      fontWeight:     '700',
      fontSize:       '0.95rem',
      zIndex:         '9999',
      backdropFilter: 'blur(10px)',
      boxShadow:      '0 8px 32px rgba(0,0,0,0.35)',
      transition:     'opacity 0.3s ease',
      opacity:        '0',
      pointerEvents:  'none',
    });
    alerta.textContent = '❌ Este producto está sin stock';
    document.body.appendChild(alerta);
  }

  alerta.style.opacity = '1';
  clearTimeout(alerta._timer);
  alerta._timer = setTimeout(() => { alerta.style.opacity = '0'; }, 2500);
}

// ── Agregar producto al carrito ─────────────────────────────────────────────
function addToCart(name, quantity, price) {
  // Verificar stock antes de agregar
  const btn   = event.currentTarget || event.target;
  const card  = btn.closest('.product-card');
  const stockSpan = card ? card.querySelector('.stock') : null;
  if (stockSpan && stockSpan.classList.contains('sin-stock')) {
    mostrarAlertaSinStock();
    return;
  }

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

    // Mostrar notificación de agregado
    showAddedNotification(name);

    // Resetear cantidad a 1
    const qtySpan = event.target.previousElementSibling.querySelector('span');
    if (qtySpan) qtySpan.textContent = '1';
  }
}

// ── Actualizar display del carrito ──────────────────────────────────────────
function updateCartDisplay() {
  const cartCount       = document.getElementById('cartCount');
  const cartCountMobile = document.getElementById('cartCountMobile');
  const cartItems       = document.getElementById('cartItems');
  const cartTotal       = document.getElementById('cartTotal');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount)       cartCount.textContent       = totalItems;
  if (cartCountMobile) cartCountMobile.textContent = totalItems;

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

// ── Cambiar cantidad en el carrito ──────────────────────────────────────────
function changeCartQty(index, delta) {
  cart[index].quantity = Math.max(1, cart[index].quantity + delta);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
}

// ── Quitar producto del carrito ─────────────────────────────────────────────
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
}

// ── Vaciar carrito ──────────────────────────────────────────────────────────
function clearCart() {
  cart = [];
  localStorage.removeItem('cart');
  updateCartDisplay();
}

// ── Toggle del drawer ───────────────────────────────────────────────────────
function toggleCart() {
  const drawer = document.getElementById('cartDrawer');
  if (drawer) drawer.classList.toggle('open');
}

// ── Enviar pedido por WhatsApp ──────────────────────────────────────────────
function checkout() {
  if (cart.length === 0) {
    alert('El carrito está vacío.');
    return;
  }
  let message = 'Hola! Quiero hacer un pedido:\n\n';
  let total   = 0;
  cart.forEach(item => {
    const subtotal = item.quantity * item.price;
    message += `${item.name} x${item.quantity}${item.price > 0 ? ' - $' + subtotal.toLocaleString('es-AR') : ''}\n`;
    total   += subtotal;
  });
  if (total > 0) {
    message += `\nTotal: $${total.toLocaleString('es-AR')}`;
  }
  message += `\n\n📍 Dirección: Av. América 860, Salliqueló`;
  const url = `https://wa.me/5492392558607?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// ── Inicialización ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateCartDisplay();

  const openCartBtn       = document.getElementById('openCartBtn');
  const openCartBtnMobile = document.getElementById('openCartBtnMobile');
  const closeCartBtn      = document.getElementById('closeCartBtn');
  const cartOverlay       = document.getElementById('cartOverlay');
  const checkoutBtn       = document.getElementById('checkoutBtn');
  const clearCartBtn      = document.getElementById('clearCartBtn');

  if (openCartBtn)       openCartBtn.addEventListener('click', toggleCart);
  if (openCartBtnMobile) openCartBtnMobile.addEventListener('click', toggleCart);
  if (closeCartBtn)      closeCartBtn.addEventListener('click', toggleCart);
  if (cartOverlay)       cartOverlay.addEventListener('click', toggleCart);
  if (checkoutBtn)       checkoutBtn.addEventListener('click', checkout);
  if (clearCartBtn)      clearCartBtn.addEventListener('click', clearCart);
});