/* ==================== ESCORPIÓN DE ORO - APP WEB ==================== */
/* Sitio multipágina con base de datos local IndexedDB. */

(() => {
  const STORAGE_KEY = 'escorpion_app_v1';

  const estadoInicial = {
    entrenador: {
      nombre: 'Mateo Rivas',
      bio: 'Estratega del baloncesto con 12 años de experiencia dirigiendo plantillas élite. Especialista en formación de líderes en la cancha y desarrollo de juego ofensivo rápido.',
      temporadas: 12,
      titulos: 8,
      partidos: 240,
      foto: 'WhatsApp Image 2026-11-12 at 16.20.44 (3).jpeg'
    },
    miembros: [
      { nombre: 'J. Navarro', rol: 'Base', foto: 'WhatsApp Image 2026-11-12 at 16.20.43 (1).jpeg' },
      { nombre: 'L. Méndez', rol: 'Escolta', foto: 'WhatsApp Image 2026-11-12 at 16.20.43 (2).jpeg' },
      { nombre: 'D. Rojas', rol: 'Alero', foto: 'WhatsApp Image 2026-11-12 at 16.20.43 (3).jpeg' },
      { nombre: 'S. Cruz', rol: 'Ala-Pívot', foto: 'WhatsApp Image 2026-11-12 at 16.20.44 (3).jpeg' },
      { nombre: 'M. Silva', rol: 'Pívot', foto: 'WhatsApp Image 2026-11-12 at 16.20.44 (4).jpeg' },
      { nombre: 'A. Ibarra', rol: 'Base', foto: 'WhatsApp Image 2026-11-12 at 16.20.44 (5).jpeg' }
    ],
    horarios: [
      { dia: 'Lunes', categoria: 'Premini', hora: '16:00 - 17:30', lugar: 'Polideportivo Escorpión', entrenador: 'Coach Mateo Rivas' },
      { dia: 'Martes', categoria: 'Infantil', hora: '17:30 - 19:00', lugar: 'Polideportivo Escorpión', entrenador: 'Coach Mateo Rivas' },
      { dia: 'Miércoles', categoria: 'Cadete', hora: '18:00 - 20:00', lugar: 'Centro de Entrenamiento', entrenador: 'Coach Mateo Rivas' },
      { dia: 'Jueves', categoria: 'Juvenil', hora: '19:00 - 21:00', lugar: 'Polideportivo Escorpión', entrenador: 'Coach Mateo Rivas' },
      { dia: 'Viernes', categoria: 'Senior', hora: '20:00 - 22:00', lugar: 'Polideportivo Escorpión', entrenador: 'Coach Mateo Rivas' },
      { dia: 'Sábado', categoria: 'Partido Oficial', hora: '12:00', lugar: 'Según calendario', entrenador: 'Coach Mateo Rivas' }
    ],
    partidos: [
      { fecha: '10 nov 2026', local: 'Escorpión de Oro', visitante: 'Rivales BC', resultado: '78 - 65', competicion: 'Liga', estado: 'ganado' },
      { fecha: '05 nov 2026', local: 'CB Olímpico', visitante: 'Escorpión de Oro', resultado: '71 - 74', competicion: 'Copa', estado: 'ganado' },
      { fecha: '28 oct 2026', local: 'Escorpión de Oro', visitante: 'Halcones Sur', resultado: '62 - 69', competicion: 'Liga', estado: 'perdido' },
      { fecha: '22 oct 2026', local: 'Tigres Norte', visitante: 'Escorpión de Oro', resultado: '80 - 85', competicion: 'Amistoso', estado: 'ganado' },
      { fecha: '15 oct 2026', local: 'Escorpión de Oro', visitante: 'Águilas Centro', resultado: '55 - 61', competicion: 'Liga', estado: 'perdido' }
    ],
    cronograma: [
      { titulo: 'Entrenamiento Senior', tipo: 'Entrenamiento', fecha: '2026-11-14', hora: '20:00', lugar: 'Polideportivo Escorpión' },
      { titulo: 'Reunión de Directiva', tipo: 'Reunión', fecha: '2026-11-15', hora: '10:00', lugar: 'Oficinas del Club' },
      { titulo: 'Partido vs Halcones', tipo: 'Partido', fecha: '2026-11-16', hora: '12:00', lugar: 'Polideportivo Escorpión' },
      { titulo: 'Charla de Nutrición', tipo: 'Evento', fecha: '2026-11-17', hora: '18:00', lugar: 'Salón de Actos' },
      { titulo: 'Entrenamiento Cadete', tipo: 'Entrenamiento', fecha: '2026-11-18', hora: '18:00', lugar: 'Centro de Entrenamiento' }
    ]
  };

  let estado = null;

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  /* ---------- Inicialización ---------- */
  async function init() {
    estado = await window.escDb.load() || JSON.parse(JSON.stringify(estadoInicial));

    renderMiembrosHeader();
    renderEntrenador();
    renderGaleria();

    setupTheme();
    setupNavMobile();

    /* Renders condicionales según la página actual */
    if ($('#horariosBody')) renderHorarios();
    if ($('#partidosBody')) { renderPartidos(); setupBusquedaPartidos(); }
    if ($('#puntuacionBody')) { renderPuntuacion(); setupGuardarPartido(); }
    if ($('#cronogramaGrid')) { renderCronograma(); setupCronogramaModal(); }

    animarContadores();
    setupScrollAnim();
  }

  /* ---------- Entrenador y miembros (solo index) ---------- */
  function renderEntrenador() {
    const e = estado.entrenador;
    const nombreEl = $('#entrenadorNombre');
    const bioEl = $('#entrenadorBio');
    if (nombreEl) nombreEl.textContent = e.nombre;
    if (bioEl) bioEl.textContent = e.bio;
  }

  function renderMiembrosHeader() {
    const list = $('#membersList');
    const toggle = $('#membersToggle');
    if (!list) return;
    list.innerHTML = estado.miembros.slice(0, 3).map(m =>
      `<img src="${m.foto}" alt="${m.nombre}" class="member-avatar" title="${m.nombre} - ${m.rol}" onerror="this.style.display='none'">`
    ).join('');
    if (toggle) {
      toggle.textContent = estado.miembros.length > 3 ? `+${estado.miembros.length - 3}` : '';
      toggle.style.display = estado.miembros.length > 3 ? 'flex' : 'none';
    }
  }

  function renderGaleria() {
    const gallery = $('#clubGallery');
    if (!gallery) return;
    const fotos = [
      'WhatsApp Image 2026-11-12 at 16.20.45 (3).jpeg',
      'WhatsApp Image 2026-11-12 at 16.20.45 (4).jpeg',
      'WhatsApp Image 2026-11-12 at 16.20.45 (5).jpeg',
      'WhatsApp Image 2026-11-12 at 16.20.46 (3).jpeg',
      'WhatsApp Image 2026-11-12 at 16.20.46.jpeg'
    ];
    gallery.innerHTML = fotos.map(f =>
      `<div class="gallery-item"><img src="${f}" alt="Club" onerror="this.style.display='none'"></div>`
    ).join('');
  }

  /* ---------- Tema ---------- */
  function setupTheme() {
    const toggle = $('#themeToggle');
    if (!toggle) return;
    const claroGuardado = localStorage.getItem('escorpion_tema') === 'claro';
    if (claroGuardado) document.documentElement.classList.add('tema-claro');
    toggle.textContent = claroGuardado ? '☀️' : '🌙';

    toggle.addEventListener('click', () => {
      const claro = document.documentElement.classList.toggle('tema-claro');
      localStorage.setItem('escorpion_tema', claro ? 'claro' : 'oscuro');
      toggle.textContent = claro ? '☀️' : '🌙';
    });
  }

  /* ---------- Menú móvil ---------- */
  function setupNavMobile() {
    const toggle = $('#navToggle');
    const nav = $('#mainNav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    $$('.nav-link').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
  }

  /* ---------- Horarios ---------- */
  function renderHorarios() {
    const body = $('#horariosBody');
    if (!body) return;
    body.innerHTML = estado.horarios.map(h =>
      `<tr><td><strong>${h.dia}</strong></td><td>${h.categoria}</td><td>${h.hora}</td><td>${h.lugar}</td><td>${h.entrenador}</td></tr>`
    ).join('');
  }

  /* ---------- Partidos ---------- */
  function renderPartidos() {
    const body = $('#partidosBody');
    const empty = $('#partidosEmpty');
    if (!body) return;
    const filtro = $('#filtroEstado')?.value || 'todos';
    const busca = $('#buscarPartido')?.value.toLowerCase() || '';

    let lista = estado.partidos.filter(p => {
      const coincideEstado = filtro === 'todos' || p.estado === filtro;
      const coincideTexto = p.local.toLowerCase().includes(busca) ||
                            p.visitante.toLowerCase().includes(busca) ||
                            p.competicion.toLowerCase().includes(busca);
      return coincideEstado && coincideTexto;
    });

    if (lista.length === 0) {
      body.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';

    body.innerHTML = lista.map(p => `
      <tr>
        <td>${p.fecha}</td>
        <td>${p.local}</td>
        <td><strong>${p.resultado}</strong></td>
        <td>${p.visitante}</td>
        <td>${p.competicion}</td>
        <td><span class="estado-badge ${p.estado === 'ganado' ? 'estado-ganado' : 'estado-perdido'}">${p.estado === 'ganado' ? 'Ganado' : 'Perdido'}</span></td>
      </tr>
    `).join('');
  }

  function setupBusquedaPartidos() {
    $('#buscarPartido')?.addEventListener('input', renderPartidos);
    $('#filtroEstado')?.addEventListener('change', renderPartidos);
  }

  /* ---------- Puntuación ---------- */
  function calcularClasificacion() {
    const stats = {};
    const equipos = new Set();
    estado.partidos.forEach(p => {
      equipos.add(p.local);
      equipos.add(p.visitante);
      const [gLocal, gVisita] = p.resultado.split(' - ').map(Number);
      const ganoLocal = gLocal > gVisita;
      [p.local, p.visitante].forEach(eq => { if (!stats[eq]) stats[eq] = { PJ: 0, PG: 0, PP: 0, PF: 0, PC: 0 }; });
      stats[p.local].PJ++; stats[p.visitante].PJ++;
      stats[p.local].PF += gLocal; stats[p.local].PC += gVisita;
      stats[p.visitante].PF += gVisita; stats[p.visitante].PC += gLocal;
      if (ganoLocal) { stats[p.local].PG++; stats[p.visitante].PP++; }
      else { stats[p.visitante].PG++; stats[p.local].PP++; }
    });
    return Array.from(equipos).map(eq => {
      const s = stats[eq];
      const dif = s.PF - s.PC;
      const pts = s.PG * 2;
      return { equipo: eq, ...s, dif, pts };
    }).sort((a, b) => b.pts - a.pts || b.dif - a.dif || b.PF - a.PF);
  }

  function renderPuntuacion() {
    const body = $('#puntuacionBody');
    if (!body) return;
    const tabla = calcularClasificacion();
    body.innerHTML = tabla.map((t, i) => `
      <tr>
        <td><strong>${i + 1}</strong></td>
        <td>${t.equipo}</td>
        <td>${t.PJ}</td><td>${t.PG}</td><td>${t.PP}</td>
        <td>${t.PF}</td><td>${t.PC}</td>
        <td>${t.dif >= 0 ? '+' : ''}${t.dif}</td>
        <td><strong>${t.pts}</strong></td>
      </tr>
    `).join('');
  }

  function renderPuntuacionBody(tabla) {
    const body = $('#puntuacionBody');
    if (!body) return;
    body.innerHTML = tabla.map((t, i) => `
      <tr>
        <td><strong>${i + 1}</strong></td>
        <td>${t.equipo}</td>
        <td>${t.PJ}</td><td>${t.PG}</td><td>${t.PP}</td>
        <td>${t.PF}</td><td>${t.PC}</td>
        <td>${t.dif >= 0 ? '+' : ''}${t.dif}</td>
        <td><strong>${t.pts}</strong></td>
      </tr>
    `).join('');
  }

  function setupGuardarPartido() {
    const btn = $('#guardarPartido');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const rival = $('#nuevoRival').value.trim();
      const ptsLocal = Number($('#ptsLocal').value);
      const ptsRival = Number($('#ptsRival').value);
      const comp = $('#nuevaCompeticion').value;
      if (!rival || ptsLocal < 0 || ptsRival < 0) { alert('Completa rival y puntos válidos.'); return; }

      const hoy = new Date();
      const fecha = hoy.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
      estado.partidos.unshift({
        fecha, local: 'Escorpión de Oro', visitante: rival,
        resultado: `${ptsLocal} - ${ptsRival}`, competicion: comp,
        estado: ptsLocal > ptsRival ? 'ganado' : 'perdido'
      });
      await window.escDb.save(estado);
      $('#nuevoRival').value = ''; $('#ptsLocal').value = ''; $('#ptsRival').value = '';
      renderPartidos();
      renderPuntuacion();
    });

    $$('#tablaPuntuacion th[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const clave = th.textContent.trim().toLowerCase();
        const mapa = { posición: null, equipo: 'equipo', pj: 'PJ', pg: 'PG', pp: 'PP', pf: 'PF', pc: 'PC', dif: 'dif', pts: 'pts' };
        const key = mapa[clave];
        if (!key) return;
        const tabla = calcularClasificacion();
        tabla.sort((a, b) => typeof a[key] === 'string' ? a[key].localeCompare(b[key]) : b[key] - a[key]);
        renderPuntuacionBody(tabla);
      });
    });
  }

  /* ---------- Cronograma ---------- */
  function renderCronograma() {
    const grid = $('#cronogramaGrid');
    if (!grid) return;
    const filtro = $('#filtroSemana')?.value || 'actual';
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    let lista = estado.cronograma;
    if (filtro === 'actual') {
      const fin = new Date(hoy); fin.setDate(hoy.getDate() + 6);
      lista = estado.cronograma.filter(c => { const f = new Date(c.fecha); return f >= hoy && f <= fin; });
    } else {
      const inicio = new Date(hoy); inicio.setDate(hoy.getDate() + 7);
      const fin = new Date(inicio); fin.setDate(inicio.getDate() + 6);
      lista = estado.cronograma.filter(c => { const f = new Date(c.fecha); return f >= inicio && f <= fin; });
    }
    lista.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    if (lista.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--texto-suave);padding:2rem">No hay actividades programadas.</div>';
      return;
    }
    grid.innerHTML = lista.map(c => {
      const f = new Date(c.fecha);
      const opciones = { weekday: 'short', day: 'numeric', month: 'short' };
      return `<div class="cronograma-item tipo-${c.tipo}">
        <div class="cronograma-tipo tipo-${c.tipo}">${c.tipo}</div>
        <div class="cronograma-titulo">${c.titulo}</div>
        <div class="cronograma-meta"><span>${f.toLocaleDateString('es-ES', opciones)}</span><span>${c.hora}</span><span>${c.lugar}</span></div>
      </div>`;
    }).join('');
  }

  function setupCronogramaModal() {
    const btn = $('#agendarBtn');
    const modal = $('#modalAgendar');
    const cerrar = $('#cerrarModal');
    const form = $('#formAgendar');
    if (!btn || !modal || !cerrar || !form) return;

    btn.addEventListener('click', () => modal.classList.add('active'));
    cerrar.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      estado.cronograma.push({
        titulo: $('#actTitulo').value.trim(),
        tipo: $('#actTipo').value,
        fecha: $('#actFecha').value,
        hora: $('#actHora').value,
        lugar: $('#actLugar').value.trim() || 'Polideportivo Escorpión'
      });
      await window.escDb.save(estado);
      form.reset();
      modal.classList.remove('active');
      renderCronograma();
    });
    $('#filtroSemana')?.addEventListener('change', renderCronograma);
  }

  /* ---------- Contadores ---------- */
  function animarContadores() {
    $$('[data-target]').forEach(el => {
      const target = +el.dataset.target;
      let actual = 0;
      const paso = Math.ceil(target / 60);
      const timer = setInterval(() => {
        actual += paso;
        if (actual >= target) { actual = target; clearInterval(timer); }
        el.textContent = actual;
      }, 20);
    });
  }

  /* ---------- Scroll ---------- */
  function setupScrollAnim() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    $$('.card, .hero-content, .value').forEach(el => { el.classList.add('reveal'); observer.observe(el); });
  }

  /* Tema claro estilos extras */
  const style = document.createElement('style');
  style.textContent = `
    .tema-claro { --fondo: #f8fafc; --fondo-tarjeta: #ffffff; --fondo-input: #f1f5f9; --texto: #0f172a; --texto-suave: #475569; --borde: #e2e8f0; --sombra: 0 10px 30px -10px rgba(0,0,0,0.08); }
    .tema-claro .data-table th { background: #f1f5f9; color: #b8860b; }
    .tema-claro .data-table tr:hover { background: rgba(15, 118, 110, 0.08); }
    .tema-claro .cronograma-item { background: #f1f5f9; color: #0f172a; }
    .tema-claro .social a, .tema-claro .value { background: #f1f5f9; color: #0f172a; }
  `;
  document.head.appendChild(style);

  document.addEventListener('DOMContentLoaded', init);
})();
