#!/usr/bin/env python3
"""
Optimizador de imágenes para Golosinas Dymitri
Aplica: lazy loading, placeholder, y fade-in al cargar
"""

import re
import os

# Archivos a procesar
html_files = [
    'index.html',
    'salado.html',
    'dulce.html',
    'jugos.html',
    'masitas.html',
    'condimentos.html',
]

# CSS a inyectar en el <head> de cada página
LAZY_CSS = """
  <style id="lazy-img-styles">
    /* Placeholder mientras carga */
    .product-img {
      background-color: rgba(255,255,255,0.06);
      transition: opacity 0.35s ease;
    }
    .product-img.lazy-pending {
      opacity: 0;
    }
    .product-img.lazy-loaded {
      opacity: 1;
    }
  </style>
"""

# JS a inyectar antes del </body>
LAZY_JS = """
  <script id="lazy-img-script">
    (function() {
      // Intersection Observer para lazy load
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              const img = entry.target;
              const src = img.getAttribute('data-src');
              if (src) {
                img.src = src;
                img.removeAttribute('data-src');
                img.addEventListener('load', function() {
                  img.classList.remove('lazy-pending');
                  img.classList.add('lazy-loaded');
                });
                img.addEventListener('error', function() {
                  img.classList.remove('lazy-pending');
                  img.classList.add('lazy-loaded');
                });
              }
              observer.unobserve(img);
            }
          });
        }, {
          rootMargin: '200px 0px', // Precarga 200px antes de que aparezca
          threshold: 0
        });

        document.querySelectorAll('img.product-img[data-src]').forEach(function(img) {
          observer.observe(img);
        });
      } else {
        // Fallback para browsers sin IntersectionObserver
        document.querySelectorAll('img.product-img[data-src]').forEach(function(img) {
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          img.classList.add('lazy-loaded');
        });
      }
    })();
  </script>
"""

def process_file(filepath):
    if not os.path.exists(filepath):
        print(f"  ⚠️  No encontrado: {filepath}")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Agregar loading="lazy" y convertir src -> data-src en product-img
    #    Solo afecta <img ... class="product-img" ...>
    def replace_img(match):
        tag = match.group(0)
        # Agregar clase lazy-pending si no está
        if 'lazy-pending' not in tag:
            tag = tag.replace('class="product-img"', 'class="product-img lazy-pending"')
        # Convertir src="..." a data-src="..."
        tag = re.sub(r'\bsrc="(?!data:)', 'data-src="', tag)
        # Quitar loading si ya existía para no duplicar
        tag = re.sub(r'\s*loading="[^"]*"', '', tag)
        # Agregar loading=lazy (nativo también como respaldo)
        tag = tag.replace('<img ', '<img loading="lazy" ')
        return tag

    content = re.sub(r'<img[^>]*class="product-img"[^>]*>', replace_img, content)

    # 2. Inyectar CSS lazy antes de </head> si no está ya
    if 'lazy-img-styles' not in content:
        content = content.replace('</head>', LAZY_CSS + '</head>', 1)

    # 3. Inyectar JS lazy antes de </body> si no está ya
    if 'lazy-img-script' not in content:
        content = content.replace('</body>', LAZY_JS + '</body>', 1)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✅ Optimizado: {filepath}")
    else:
        print(f"  ℹ️  Sin cambios: {filepath}")

print("=== Optimizador de carga de imágenes ===\n")
for html in html_files:
    process_file(html)
print("\n✅ Listo. Subí los archivos modificados a tu servidor.")
