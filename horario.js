/**
 * horario.js — Golosinas Dymitri
 * Muestra "Abierto" o "Cerrado" según el horario del negocio.
 *
 * Horarios:
 *   Lunes a Sábado → 08:30–13:30 y 17:30–22:30
 *   Domingo        → 17:30–22:30 únicamente
 */

(function () {
  /* ─── Utilidades ─────────────────────────────── */
  function minutosDesde(h, m) {
    return h * 60 + m;
  }

  function ahoraEnMinutos() {
    const ahora = new Date();
    return minutosDesde(ahora.getHours(), ahora.getMinutes());
  }

  /* ─── Lógica de horario ───────────────────────── */
  function estaAbierto() {
    const ahora    = new Date();
    const dia      = ahora.getDay();   // 0 = domingo, 1–6 = lun–sáb
    const minutos  = ahoraEnMinutos();

    const m_08_30  = minutosDesde(8,  30);
    const m_13_30  = minutosDesde(13, 30);
    const m_17_30  = minutosDesde(17, 30);
    const m_22_30  = minutosDesde(22, 30);

    if (dia === 0) {
      // Domingo: solo tarde
      return minutos >= m_17_30 && minutos <= m_22_30;
    }

    if (dia >= 1 && dia <= 6) {
      // Lunes a Sábado: mañana o tarde
      const turnoManana = minutos >= m_08_30 && minutos <= m_13_30;
      const turnoTarde  = minutos >= m_17_30 && minutos <= m_22_30;
      return turnoManana || turnoTarde;
    }

    return false;
  }

  /* ─── Inyección del badge ─────────────────────── */
  function inyectarBadge() {
    const topEl = document.querySelector('.side-card__top');
    if (!topEl) return;

    // Eliminar badge anterior si existe (para refresco dinámico)
    const viejo = topEl.querySelector('.estado-badge');
    if (viejo) viejo.remove();

    const abierto = estaAbierto();

    const badge = document.createElement('span');
    badge.className = 'estado-badge';
    badge.textContent = abierto ? '🟢 Local Abierto' : '🔴 Local Cerrado';

    // Estilos inline que respetan el diseño oscuro del sitio
    Object.assign(badge.style, {
      display:        'inline-flex',
      alignItems:     'center',
      gap:            '6px',
      marginTop:      '10px',
      padding:        '6px 14px',
      borderRadius:   '999px',
      fontSize:       '0.85rem',
      fontWeight:     '700',
      letterSpacing:  '0.2px',
      border:         '1px solid',
      // Colores según estado
      background: abierto
        ? 'rgba(0, 210, 100, 0.12)'
        : 'rgba(255, 60, 60, 0.12)',
      borderColor: abierto
        ? 'rgba(0, 210, 100, 0.30)'
        : 'rgba(255, 60, 60, 0.30)',
      color: abierto
        ? 'rgba(80, 255, 160, 0.95)'
        : 'rgba(255, 110, 110, 0.95)',
    });

    topEl.appendChild(badge);
  }

  /* ─── Init ────────────────────────────────────── */
  function init() {
    inyectarBadge();

    // Refresca cada minuto para que cambie automáticamente al llegar a un umbral
    setInterval(inyectarBadge, 60 * 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();