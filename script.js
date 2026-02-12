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
  qty = Math.max(0, qty + delta); // No bajar de 0
  qtySpan.textContent = qty;
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  // Menú móvil
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  
  // Año en footer
  document.getElementById('year').textContent = new Date().getFullYear();
});