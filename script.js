// Función para scroll suave a secciones
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

// Cambiar cantidad en productos (+/-)
function changeQty(button, delta) {
  const qtySpan = button.parentElement.querySelector('span');
  let qty = parseInt(qtySpan.textContent);
  qty = Math.max(1, qty + delta); // No bajar de 1
  qtySpan.textContent = qty;
}

// Mostrar notificación de producto agregado
function showAddedNotification(productName) {
  // Eliminar notificación previa si existe
  const existing = document.getElementById('addedNotification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.id = 'addedNotification';
  notification.innerHTML = `
    <span class="notif-icon">✅</span>
    <span class="notif-text"><strong>${productName}</strong><br>agregado al carrito</span>
  `;
  document.body.appendChild(notification);

  // Mostrar con animación
  requestAnimationFrame(() => {
    notification.classList.add('notif-visible');
  });

  // Ocultar después de 2.5s
  setTimeout(() => {
    notification.classList.remove('notif-visible');
    setTimeout(() => notification.remove(), 400);
  }, 2500);
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  // Menú móvil
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
  }

  // Año en footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Establecer cantidad por defecto en 1 en todos los qty span
  document.querySelectorAll('.qty span').forEach(span => {
    span.textContent = '1';
  });

  // Botón scroll arriba
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
