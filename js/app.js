/* Pensión Monterredondo · maqueta navegable (Ad2Place) */
(() => {
  'use strict';

  const LANGS = ['es', 'gl', 'en'];
  const LANG_NAMES = [['es', 'Español'], ['gl', 'Galego'], ['en', 'English']];
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HAS_GSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const app = document.getElementById('app');
  const footerEl = document.getElementById('footer');
  let lang = 'es';
  let T = window.I18N.es;
  let lenis = null;
  let firstRender = true;

  /* ---------- Iconos ---------- */
  const I = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5" stroke-linecap="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M3 12V4h8l10 10-8 8L3 12Z"/><circle cx="7.5" cy="8.5" r="1.3"/></svg>',
    moto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="16.5" r="3"/><circle cx="18.5" cy="16.5" r="3"/><path d="M5.5 16.5 9 10h5l4.5 6.5M14 10l-1.5-3H15M9 10l3 6.5h-1"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>',
    flask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/></svg>',
    pan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M3 11h14a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4ZM17 12h4M8 8c0-1 1-1 1-2s-1-1-1-2M12 8c0-1 1-1 1-2s-1-1-1-2"/></svg>',
    drag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 7 4 12l5 5M15 7l5 5-5 5"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>'
  };
  const PERK_ICONS = [I.tag, I.moto, I.clock, I.chat];

  /* Marca: un monte redondo con el Miño naciendo a sus pies */
  function hill(cls = '') {
    return `<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width=".6" stroke-dasharray="1 3" opacity=".6"/><path class="hill" d="M14 66C24 40 38 30 50 30s26 10 36 36Z" fill="currentColor"/><path d="M22 75c8-4 14 3 22-1s14-4 22 0 10 1 14-1" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M32 84c6-2 10 1 16-1s10-2 16 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity=".6"/></svg>`;
  }

  /* ---------- Datos ---------- */
  const TYPES = {
    individual: { max: 1, units: 3, base: [36, 39, 44], hero: 'img/ia/hab-individual.webp', imgs: ['img/ia/hab-individual.webp', 'img/ia/bano.webp', 'img/booking/10480475-retocada.webp', 'img/booking/10481077-retocada.webp'], feats: ['bath', 'heating', 'wifi', 'tv', 'desk', 'wardrobe', 'towels', 'nosmoke'] },
    doble: { max: 3, units: 6, base: [55, 60, 68], hero: 'img/ia/hab-triple.webp', imgs: ['img/ia/hab-triple.webp', 'img/ia/bano.webp', 'img/booking/10480842-retocada.webp', 'img/booking/10480876-retocada.webp', 'img/booking/10480540-retocada.webp'], feats: ['bath', 'heating', 'wifi', 'tv', 'wardrobe', 'towels', 'desk', 'nosmoke'] },
    economica: { max: 2, units: 4, base: [48, 52, 58], hero: 'img/ia/hab-twin.webp', imgs: ['img/ia/hab-twin.webp', 'img/ia/bano.webp', 'img/booking/10480952-retocada.webp', 'img/booking/10481209-retocada.webp'], feats: ['bath', 'heating', 'wifi', 'tv', 'wardrobe', 'towels', 'nosmoke', 'desk'] },
    triple: { max: 3, units: 3, base: [68, 74, 84], hero: 'img/ia/hab-familiar.webp', imgs: ['img/ia/hab-familiar.webp', 'img/ia/bano.webp', 'img/booking/10480919-retocada.webp', 'img/booking/10481249-retocada.webp', 'img/booking/10481122-retocada.webp'], feats: ['bath', 'heating', 'wifi', 'tv', 'desk', 'wardrobe', 'towels', 'nosmoke'] }
  };
  const TYPE_KEYS = Object.keys(TYPES);

  /* Citas literales de Google y Booking (consultadas el 19-oct-2026) */
  const QUOTES = [
    ['Viajamos con moto y nos dejan su garaje para guardarlas, todo un detalle para agradecer. El restaurante es otro punto fuerte: cada plato que probamos estaba delicioso, con sabores caseros y productos frescos.', 'Antonio S.', 'Google'],
    ['Calidad precio excelente. Muy limpio. Con calefacción, agua caliente, confortable y con un amplio espacio para aparcar. Estuve 3 semanas y me sentí como en casa.', 'Alexandra B.', 'Google'],
    ['Lo mejor fue el entorno, la limpieza de las habitaciones y la gran amabilidad de todo el personal. Hemos repetido y seguiremos repitiendo!', 'Laam', 'Booking'],
    ['Buscamos una ubicación central como base para recorrer desde allí toda Galicia, el Hotel es básico pero cómodo, ideal para lo que buscábamos, un sitio limpio para llegar, ducharnos y dormir. El restaurante ofrece todo tipo de Menu a buen precio…', 'Banuls', 'Booking']
  ];

  /* ---------- Utilidades ---------- */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const L = (path) => `#/${lang}${path ? '/' + path : '/'}`;
  const money = (n) => new Intl.NumberFormat(T.locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  const fmtDate = (d, opts = { day: 'numeric', month: 'short' }) => d ? new Intl.DateTimeFormat(T.locale, opts).format(d) : '—';
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const parseIso = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const nightsBetween = (a, b) => Math.round((b - a) / 864e5);
  const TODAY = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
  const splitLines = (lines) => lines.map(l => `<span class="line"><span>${l}</span></span>`).join('');
  const isReal = (src) => src.includes('/booking/') || src.includes('/real/');

  /* Abierto todo el año: julio y agosto, temporada alta */
  const tier = (d) => { const m = d.getMonth(); return (m === 6 || m === 7) ? 2 : (m === 5 || m === 8 || m === 3) ? 1 : 0; };
  const nightPrice = (type, d) => { const b = TYPES[type].base[tier(d)]; const wk = d.getDay() === 5 || d.getDay() === 6; return Math.round(b * (wk ? 1.06 : 1)); };
  const availOn = (type, d) => {
    const idx = TYPE_KEYS.indexOf(type);
    const h = (d.getFullYear() * 373 + (d.getMonth() + 1) * 131 + d.getDate() * 17 + idx * 101 + d.getDate() * d.getDate()) % 100;
    const occ = [0.2, 0.45, 0.7][tier(d)] + (h / 100) * 0.35;
    return Math.max(0, TYPES[type].units - Math.round(TYPES[type].units * occ));
  };
  const quote = (type, a, b) => {
    let total = 0, min = 99;
    for (let d = new Date(a); d < b; d = addDays(d, 1)) { total += nightPrice(type, d); min = Math.min(min, availOn(type, d)); }
    return { total, left: Math.max(0, min), other: Math.round(total * 1.15 / 5) * 5 };
  };

  /* Estado compartido de la reserva: por defecto, el próximo viernes, dos noches */
  const nextFri = (() => { let d = addDays(TODAY, 7); while (d.getDay() !== 5) d = addDays(d, 1); return d; })();
  const BK = { in: nextFri, out: addDays(nextFri, 2), adults: 2, type: null, step: 1, offset: 0, data: {} };
  const monthOffsetFor = (d) => (d.getFullYear() - TODAY.getFullYear()) * 12 + d.getMonth() - TODAY.getMonth();

  /* ---------- Plantillas compartidas ---------- */
  function header() {
    const n = T.nav;
    return `
      <div class="container header__inner">
        <a href="${L('')}" class="logo" aria-label="Pensión Monterredondo">
          <span class="logo__mark">${hill()}</span>
          <span class="logo__text"><span class="logo__name">Monterredondo</span><span class="logo__sub">Pensión · Restaurante · Meira</span></span>
        </a>
        <nav class="nav" aria-label="Principal">
          <a class="nav__link" data-r="" href="${L('')}">${n.home}</a>
          <a class="nav__link" data-r="habitaciones" href="${L('habitaciones')}">${n.rooms}</a>
          <a class="nav__link" data-r="restaurante" href="${L('restaurante')}">${n.resto}</a>
          <a class="nav__link" data-r="meira" href="${L('meira')}">${n.area}</a>
          <a class="nav__link" data-r="contacto" href="${L('contacto')}">${n.contact}</a>
        </nav>
        <div class="header__right">
          <div class="lang">
            <button class="lang__btn" aria-haspopup="true" aria-expanded="false">${I.globe}${lang.toUpperCase()}</button>
            <div class="lang__menu" role="menu">
              ${LANG_NAMES.map(([c, nm]) => `<a role="menuitem" href="#" data-lang="${c}" aria-current="${c === lang}">${nm}<span>${c.toUpperCase()}</span></a>`).join('')}
            </div>
          </div>
          <a href="${L('reservar')}" class="btn btn--sea btn--sm btn-book" data-magnetic>${n.book}</a>
          <button class="burger" aria-label="${n.menu}"><span></span><span></span></button>
        </div>
      </div>`;
  }
  function mobileNav() {
    const n = T.nav;
    return `<button class="mnav__close" aria-label="${n.close}">${I.close}</button>
      <a href="${L('')}">${n.home}</a><a href="${L('habitaciones')}">${n.rooms}</a><a href="${L('restaurante')}">${n.resto}</a>
      <a href="${L('meira')}">${n.area}</a><a href="${L('contacto')}">${n.contact}</a><a href="${L('reservar')}" style="color:var(--sea-light)">${n.book} →</a>`;
  }
  function footer() {
    const f = T.footer, n = T.nav;
    return `
      <div class="container">
        <div class="footer__big" aria-hidden="true"><span>Monterredondo</span></div>
        <div class="footer__grid">
          <div>
            <h4>Pensión Monterredondo</h4>
            <p>${f.address}</p>
            <p style="margin-top:.5rem"><a href="tel:+34636256062">+34 636 25 60 62</a></p>
            <p class="tiny" style="color:rgba(255,255,255,.5);margin-top:1rem">${f.reg}</p>
          </div>
          <div><h4>${n.menu}</h4><ul><li><a href="${L('habitaciones')}">${n.rooms}</a></li><li><a href="${L('restaurante')}">${n.resto}</a></li><li><a href="${L('meira')}">${n.area}</a></li><li><a href="${L('reservar')}">${n.book}</a></li></ul></div>
          <div><h4>${f.langs}</h4><ul>${LANG_NAMES.map(([c, nm]) => `<li><a href="#" data-lang="${c}">${nm}</a></li>`).join('')}</ul></div>
          <div><h4>Legal</h4><ul>${f.legal.map(x => `<li><a href="#" data-demo>${x}</a></li>`).join('')}</ul></div>
        </div>
        <div class="footer__bottom"><span>© ${new Date().getFullYear()} Pensión Monterredondo</span><a href="${L('propuesta')}">${f.made} · ${T.ribbonMore} →</a></div>
      </div>`;
  }
  function roomCard(key, i, opts = {}) {
    const t = T.types[key], d = TYPES[key];
    const chips = d.feats.slice(0, 3).map(f => `<span class="chip">${T.feat[f]}</span>`).join('');
    return `
      <a class="apt-card" href="${L('habitaciones/' + key)}" data-cursor="${T.rooms.discover}">
        <div class="apt-card__img"><img src="${d.hero}" alt="${t.name}" loading="lazy"></div>
        <span class="apt-card__num">0${i + 1}</span>
        <span class="apt-card__price"><small>${T.rooms.from}</small><b>${money(d.base[0])}</b><small>${T.rooms.night.replace('/', '')} · ${T.rooms.example}</small></span>
        <div class="apt-card__body">
          <h3 class="apt-card__name">${t.name}</h3>
          <p class="apt-card__tag">${t.tagline}</p>
          ${opts.noChips ? '' : `<div class="apt-card__chips">${chips}<span class="chip">${t.cap}</span></div>`}
        </div>
        <span class="apt-card__go">${I.arrow}</span>
      </a>`;
  }
  const finalCta = () => `
    <section class="final">
      <div class="final__bg" data-parallax="15"><img src="img/ia/exterior-azul.webp" alt="" loading="lazy"></div>
      <div class="container">
        <h2 class="final__title">${T.cta.title}</h2>
        <a href="${L('reservar')}" class="btn btn--light" data-magnetic>${T.cta.btn} ${I.arrow}</a>
      </div>
    </section>`;
  const realTag = (src, cls = 'tile__tag') => isReal(src) ? `<span class="${cls}">${src.includes('/booking/') ? T.realTagBooking : T.realTag}</span>` : '';

  /* Bloque de restaurante (portada) */
  function restoBlock() {
    const r = T.resto;
    return `
      <section class="resto on-dark">
        <div class="container resto__grid">
          <div class="resto__stack">
            <div class="clip resto__a"><img src="img/ia/restaurante.webp" alt="${r.kicker}" data-parallax="8" loading="lazy"></div>
            <div class="clip resto__b"><img src="img/ia/comida-menu.webp" alt="${r.menuTitle}" data-parallax="8" loading="lazy"></div>
            <svg class="resto__stamp js-stamp" viewBox="0 0 120 120" aria-hidden="true"><defs><path id="st" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0"/></defs><text><textPath href="#st">${r.stamp} ${r.stamp}</textPath></text><circle cx="60" cy="60" r="30" fill="none" stroke="currentColor" stroke-width="1"/><g transform="translate(46 46) scale(1.15)" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M3 11h14a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4ZM17 12h4M8 8c0-1 1-1 1-2s-1-1-1-2M12 8c0-1 1-1 1-2s-1-1-1-2"/></g></svg>
          </div>
          <div>
            <p class="kicker reveal">${r.kicker}</p>
            <h2 class="h2 reveal">${r.title}</h2>
            <p class="lead reveal" style="margin-top:1.25rem">${r.text}</p>
            <div class="menu-card reveal">
              <div class="menu-card__head"><h3>${r.menuTitle}</h3><span class="menu-card__price">${r.menuPrice}</span></div>
              <ul>${r.menu.map(([a, b]) => `<li><small>${a}</small><span>${b}</span></li>`).join('')}</ul>
              <p class="tiny">${r.menuNote}</p>
            </div>
            <p class="reveal" style="margin-top:2.25rem"><a class="link-arrow" href="${L('restaurante')}">${r.more} ${I.arrow}</a></p>
          </div>
        </div>
      </section>`;
  }

  /* ---------- Páginas ---------- */
  function pageHome() {
    const h = T.hero, s = T.search;
    const nights = nightsBetween(BK.in, BK.out);
    const mq = [...T.marquee, ...T.marquee].map(w => `<span class="marquee__item">${w}${hill()}</span>`).join('');
    const words = T.intro.text.split(' ').map(w => `<span class="w">${w} </span>`).join('');
    return `
      <section class="hero" id="top">
        <div class="hero__media"><video class="hero__video" autoplay muted loop playsinline preload="auto" poster="video/hero-poster.jpg"></video></div>
        <span class="hero__note">${h.videoNote}</span>
        <div class="container hero__content">
          <p class="hero__eyebrow js-hero-fade">${h.eyebrow}</p>
          <h1 class="h1">${splitLines(h.title)}</h1>
          <p class="hero__sub js-hero-fade">${h.sub}</p>
        </div>
        <div class="hero__scroll"><span>${h.scroll}</span><i></i></div>
        <form class="search js-hero-fade" onsubmit="return false">
          <span class="search__best">${I.shield}${s.best}</span>
          <a class="search__field" href="${L('reservar')}" data-step="1"><span class="search__label">${s.arrival}</span><span class="search__value">${fmtDate(BK.in, { weekday: 'short', day: 'numeric', month: 'short' })}</span></a>
          <a class="search__field" href="${L('reservar')}" data-step="1"><span class="search__label">${s.departure}</span><span class="search__value">${fmtDate(BK.out, { weekday: 'short', day: 'numeric', month: 'short' })} · ${nights} ${nights === 1 ? T.booking.night1 : T.booking.nights}</span></a>
          <div class="search__field search__field--g"><span class="search__label">${s.guests}</span><span class="search__guests"><button type="button" data-g="-1" aria-label="-">−</button><span class="search__value js-g">${BK.adults} ${BK.adults === 1 ? s.adult : s.adults}</span><button type="button" data-g="1" aria-label="+">+</button></span></div>
          <a class="btn" href="${L('reservar')}" data-step="2" data-magnetic>${s.cta} ${I.arrow}</a>
        </form>
      </section>

      <div class="marquee" aria-hidden="true"><div class="marquee__track">${mq}</div></div>

      <section class="intro">
        <svg class="river" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true"><path class="js-river" d="M1180 -10C1150 120 1260 180 1200 300S980 380 1010 520 1260 640 1150 760 820 840 760 910"/></svg>
        ${hill('rose-deco')}
        <div class="container">
          <div class="intro__grid">
            <p class="kicker reveal">${T.intro.kicker}</p>
            <p class="intro__text">${words}</p>
          </div>
          <div class="stats">
            ${T.intro.stats.map(([n, u, l]) => `<div class="stat reveal"><div class="stat__num"><span class="js-count" data-to="${n}">${n}</span><small>${u}</small></div><p class="stat__label">${l}</p></div>`).join('')}
          </div>
        </div>
      </section>

      <section class="apts">
        <div class="container apts__head">
          <div><p class="kicker reveal">${T.rooms.kicker}</p><h2 class="h2 reveal">${T.rooms.title}</h2></div>
          <p class="lead reveal">${T.rooms.sub}</p>
        </div>
        <div class="apts__pin">
          <div class="apts__track">
            ${TYPE_KEYS.map((k, i) => roomCard(k, i)).join('')}
            <div class="apts__end">
              <p class="serif">${T.booking.title}</p>
              <a href="${L('reservar')}" class="btn btn--sea" data-magnetic>${T.search.cta} ${I.arrow}</a>
              <p class="tiny">${T.booking.priceNote}</p>
            </div>
          </div>
        </div>
      </section>

      ${restoBlock()}

      <section class="complex">
        <div class="container">
          <div class="bento">
            <div class="tile tile--a clip"><img src="img/ia/exterior-azul.webp" alt="Pensión Monterredondo" data-parallax="8" loading="lazy"></div>
            <div class="tile tile--b clip"><img src="img/ia/comida-ternera.webp" alt="${T.resto.dishes[2][0]}" data-parallax="8" loading="lazy"></div>
            <div class="tile tile--c clip"><img src="img/real/pedregal-02.webp" alt="Pedregal de Irimia" data-parallax="8" loading="lazy"><span class="tile__tag">${T.realTag} · Pedregal de Irimia</span></div>
            <div class="tile tile--d clip"><img src="img/ia/garaje-motos.webp" alt="${T.direct.perks[1][0]}" data-parallax="8" loading="lazy"></div>
            <div class="tile tile--e clip"><img src="img/ia/bar-desayuno.webp" alt="${T.resto.hours[0][0]}" data-parallax="8" loading="lazy"></div>
            <div class="tile tile--f clip">
              ${hill('')}
              <ul class="amen">${['wifi', 'heating', 'bath', 'nosmoke'].map(x => `<li>${I.check}${T.feat[x]}</li>`).join('')}<li>${I.check}${T.direct.perks[1][0]}</li></ul>
            </div>
          </div>
        </div>
      </section>

      <section class="direct on-dark">
        ${hill('direct__rose')}
        <div class="container direct__grid">
          <div>
            <p class="kicker reveal">${T.direct.kicker}</p>
            <h2 class="h2 reveal">${T.direct.title}</h2>
            <p class="lead reveal" style="margin-top:1.25rem">${T.direct.sub}</p>
            <div class="perks">
              ${T.direct.perks.map(([h3, p], i) => `<div class="perk reveal"><span class="perk__icon">${PERK_ICONS[i]}</span><h3>${h3}</h3><p>${p}</p></div>`).join('')}
            </div>
            <p class="tiny" style="color:rgba(255,255,255,.5);margin-top:1rem">${T.direct.note}</p>
          </div>
          <div class="compare reveal">
            <div class="compare__top"><span class="badge">${T.direct.compareNote}</span><span class="tiny">${T.direct.perStay}</span></div>
            <div class="compare__row"><span>${T.direct.other}</span><s>${money(195)}</s></div>
            <div class="compare__row"><span>${T.direct.official}</span><b>${money(170)}</b></div>
            <div class="compare__save"><span>${T.direct.save}</span><b>${money(25)}</b></div>
            <a href="${L('reservar')}" class="btn btn--sea" style="width:100%;margin-top:1.25rem" data-magnetic>${T.cta.btn} ${I.arrow}</a>
          </div>
        </div>
      </section>

      <section class="reviews">
        <div class="container">
          <p class="kicker reveal">${T.reviews.kicker}</p>
          <h2 class="h2 reveal">${T.reviews.title}</h2>
          <div class="reviews__grid">
            ${T.reviews.scores.map(([v, src, c]) => `<div class="score reveal"><div class="score__num"><span class="js-count" data-to="${v}">${v}</span><small>/10</small></div><div class="score__bar"><i style="--v:${parseFloat(v.replace(',', '.')) / 10}"></i></div><p class="score__src">${src}</p><p class="score__count">${c}</p></div>`).join('')}
          </div>
          <div class="quotes">
            ${QUOTES.map(([q, who, src]) => `<blockquote class="quote reveal"><p>${q}</p><footer><span>${who}</span><span>${src}${T.reviews.original ? ' · ' + T.reviews.original : ''}</span></footer></blockquote>`).join('')}
          </div>
          <p class="tiny" style="margin-top:1.25rem">${T.reviews.note}</p>
        </div>
      </section>

      <section class="area">
        <div class="container area__grid">
          <div class="area__media clip">
            <img src="img/real/mosteiro-fachada.webp" alt="Mosteiro de Santa María de Meira" data-parallax="10" loading="lazy">
            <span class="badge area__caption">${T.area.places[1][1]}</span>
            <div class="area__float"><img src="img/real/pedregal-01.webp" alt="Pedregal de Irimia" loading="lazy"></div>
          </div>
          <div>
            <p class="kicker reveal">${T.area.kicker}</p>
            <h2 class="h2 reveal">${T.area.title}</h2>
            <p class="lead reveal" style="margin-top:1.25rem">${T.area.text}</p>
            <ul class="dist">${T.area.dist.map(([a, b]) => `<li class="reveal"><b>${a}</b><span>${b}</span></li>`).join('')}</ul>
            <p class="tiny" style="margin-top:.75rem">${T.area.distNote}</p>
            <p class="reveal" style="margin-top:2rem"><a class="link-arrow" href="${L('meira')}">${T.area.more} ${I.arrow}</a></p>
          </div>
        </div>
      </section>
      ${finalCta()}`;
  }

  function pageHero(img, kicker, lines, lead, back) {
    return `
      <section class="page-hero">
        <div class="page-hero__bg" data-parallax="12"><img src="${img}" alt=""></div>
        <div class="container">
          ${back ? `<a class="back" href="${back[0]}">${I.arrow}${back[1]}</a><br>` : ''}
          <p class="kicker js-hero-fade">${kicker}</p>
          <h1>${splitLines(lines)}</h1>
          ${lead ? `<p class="lead js-hero-fade">${lead}</p>` : ''}
        </div>
      </section>`;
  }

  function pageRooms() {
    return pageHero('img/ia/hab-twin.webp', T.rooms.kicker, [T.rooms.title.replace(/<\/?em>/g, '')], T.rooms.sub) + `
      <section class="detail"><div class="container">
        <div class="others others--tall">${TYPE_KEYS.map((k, i) => roomCard(k, i)).join('')}</div>
        <p class="tiny" style="margin-top:1.25rem">${T.detail.aiNote} ${T.booking.priceNote}</p>
      </div></section>` + finalCta();
  }

  function pageDetail(key) {
    const t = T.types[key], d = TYPES[key], dt = T.detail;
    const idx = TYPE_KEYS.indexOf(key);
    return pageHero(d.hero, `0${idx + 1} · ${T.rooms.kicker}`, [t.name], t.tagline, [L('habitaciones'), dt.back]) + `
      <section class="detail"><div class="container detail__grid">
        <div>
          <div class="specs reveal">
            <div class="spec"><small>${dt.cap}</small><b>${t.cap}*</b></div>
            <div class="spec"><small>${dt.beds}</small><b>${t.beds}*</b></div>
            <div class="spec"><small>${dt.size}</small><b>${t.size}*</b></div>
          </div>
          <p class="lead reveal" style="margin-top:2rem">${t.desc}</p>
          <div class="gallery">${d.imgs.map((src, i) => `<button class="clip" data-lb="${i}" data-cursor="+"><img src="${src}" alt="${t.name} ${i + 1}" loading="lazy">${realTag(src)}</button>`).join('')}</div>
          <p class="tiny" style="margin-top:.75rem">${dt.aiNote}</p>
          <h2 class="block-title reveal">${dt.incl}</h2>
          <ul class="feat-list">${d.feats.map(f => `<li class="reveal">${I.check}${T.feat[f]}</li>`).join('')}</ul>
          <h2 class="block-title reveal">${dt.good}</h2>
          <ul class="policies" style="margin-top:1rem">${dt.policies.map(p => `<li class="reveal">${I.info}${p}</li>`).join('')}</ul>
          <p class="tiny" style="margin-top:1rem">${dt.confirm}</p>
        </div>
        <aside class="sticky-card reveal">
          <span class="badge">${T.rooms.example}</span>
          <p class="price" style="margin-top:1rem"><small>${T.rooms.from}</small> ${money(d.base[0])}<small>${T.rooms.night}</small></p>
          <div class="sum-row" style="margin-top:1rem"><span>${T.search.arrival}</span><b>${fmtDate(BK.in, { day: 'numeric', month: 'short', year: 'numeric' })}</b></div>
          <div class="sum-row"><span>${T.search.departure}</span><b>${fmtDate(BK.out, { day: 'numeric', month: 'short', year: 'numeric' })}</b></div>
          <div class="sum-row"><span>${T.search.guests}</span><b>${Math.min(BK.adults, d.max)} ${Math.min(BK.adults, d.max) === 1 ? T.search.adult : T.search.adults}</b></div>
          <a class="btn btn--sea" style="width:100%;margin-top:1.25rem" href="${L('reservar')}" data-type="${key}" data-magnetic>${dt.reserve} ${I.arrow}</a>
          <p class="tiny" style="margin-top:1rem;display:flex;gap:.4rem;align-items:center"><span style="width:16px;color:var(--sea)">${I.shield}</span>${T.search.best}</p>
        </aside>
      </div>
      <div class="container">
        <h2 class="block-title reveal">${dt.other}</h2>
        <div class="others">${TYPE_KEYS.filter(k => k !== key).slice(0, 2).map(k => roomCard(k, TYPE_KEYS.indexOf(k), { noChips: true })).join('')}</div>
      </div></section>`;
  }

  function pageResto() {
    const r = T.resto;
    const strip = ['img/ia/comida-menu.webp', 'img/ia/comida-ternera.webp', 'img/ia/bar-desayuno.webp', 'img/ia/restaurante.webp'];
    return pageHero('img/ia/restaurante.webp', r.kicker, r.pageTitle, r.pageLead) + `
      <div class="container">
        <div class="split">
          <div class="split__img clip"><img src="img/ia/comida-menu.webp" alt="${r.menuTitle}" data-parallax="10" loading="lazy"></div>
          <div>
            <p class="kicker reveal">${r.kicker}</p>
            <h2 class="h2 reveal">${r.title}</h2>
            <p class="lead reveal" style="margin-top:1.25rem">${r.text}</p>
            <div class="menu-card reveal">
              <div class="menu-card__head"><h3>${r.menuTitle}</h3><span class="menu-card__price">${r.menuPrice}</span></div>
              <ul>${r.menu.map(([a, b]) => `<li><small>${a}</small><span>${b}</span></li>`).join('')}</ul>
              <p class="tiny">${r.menuNote}</p>
            </div>
          </div>
        </div>
        <div class="cards4">${r.dishes.map(([h, p], i) => `<div class="card reveal"><span class="card__n">0${i + 1}</span><h3>${h}</h3><p>${p}</p></div>`).join('')}</div>
        <div class="gallery-strip">${strip.map(s => `<figure><img src="${s}" alt="${r.kicker}" loading="lazy"></figure>`).join('')}</div>
        <div class="split split--rev">
          <div class="split__img clip"><img src="img/ia/exterior-azul.webp" alt="Pensión Monterredondo" data-parallax="10" loading="lazy"></div>
          <div>
            <p class="kicker reveal">${r.groups}</p>
            <h2 class="h2 reveal">${r.hours.map(([a, b]) => `${a} <em>${b}</em>`).join('<br>')}</h2>
            <p class="tiny reveal" style="margin-top:1rem">${r.hoursNote}</p>
            <p class="lead reveal" style="margin-top:1.5rem">${r.groupsText}</p>
            <p class="reveal" style="margin-top:2rem"><a class="btn btn--sea" href="tel:+34636256062" data-magnetic>${I.phone} +34 636 25 60 62</a></p>
          </div>
        </div>
      </div>` + finalCta();
  }

  function pageArea() {
    const a = T.area;
    return pageHero('img/real/serra-04.webp', a.kicker, a.pageTitle, a.pageLead) + `
      <div class="container">
        <div class="places">${a.places.map(([k, h, p, img]) => `<article class="place reveal"><img src="${img}" alt="${h}" loading="lazy"><small>${k}</small><h3>${h}</h3><p>${p}</p></article>`).join('')}</div>
        <div class="split">
          <div>
            <p class="kicker reveal">${a.kicker}</p>
            <h2 class="h2 reveal">${a.title}</h2>
            <ul class="dist">${a.dist.map(([x, y]) => `<li class="reveal"><b>${x}</b><span>${y}</span></li>`).join('')}</ul>
            <p class="tiny" style="margin-top:.75rem">${a.distNote}</p>
          </div>
          <div class="split__img clip"><img src="img/real/mosteiro-nave.webp" alt="Mosteiro de Santa María de Meira" data-parallax="10" loading="lazy"><span class="tile__tag">${T.realTag}</span></div>
        </div>
        <div class="split">
          <div><p class="kicker reveal">${a.how}</p><h2 class="h2 reveal">Paraxes, 26 · Meira</h2><p class="lead reveal" style="margin-top:1.25rem">${a.howText}</p></div>
          <div class="map reveal"><iframe title="Mapa" loading="lazy" src="https://maps.google.com/maps?q=43.21543,-7.30902&z=14&output=embed"></iframe></div>
        </div>
        <p class="tiny" style="padding-bottom:var(--section)">${a.credits}: Miguel Branco (CC BY-SA 4.0), lomarper (CC BY-SA 3.0), José Antonio Gil Martínez (CC BY 2.0), Simon Burchell (CC BY-SA 4.0), Fernando Pascullo (CC BY-SA 4.0). <a class="link-arrow" href="${L('propuesta')}">${T.ribbonMore} ${I.arrow}</a></p>
      </div>` + finalCta();
  }

  function pageContact() {
    const c = T.contact;
    return `
      <section class="contact"><div class="container">
        <p class="kicker reveal">${c.kicker}</p>
        <h1 class="h2 reveal" style="font-size:var(--t-3xl)">${c.title}</h1>
        <p class="lead reveal" style="margin-top:1.25rem">${c.sub}</p>
        <div class="contact__grid">
          <div>
            <ul class="contact__info">
              <li class="reveal"><small>${c.phone}</small><b><a href="tel:+34636256062">+34 636 25 60 62</a></b></li>
              <li class="reveal"><small>${c.whatsapp}</small><b><a href="https://wa.me/34636256062" target="_blank" rel="noopener">+34 636 25 60 62</a></b></li>
              <li class="reveal"><small>${c.mail}</small><b>${c.mailValue}</b></li>
              <li class="reveal"><small>${c.where}</small><b>${T.footer.address}</b></li>
            </ul>
            <div class="map reveal"><iframe title="Mapa" loading="lazy" src="https://maps.google.com/maps?q=43.21543,-7.30902&z=16&output=embed"></iframe></div>
          </div>
          <form class="panel reveal js-contact" novalidate>
            <div class="form-grid">
              <div class="field field--full"><label for="cn">${c.name}</label><input id="cn" autocomplete="off"></div>
              <div class="field field--full"><label for="ce">${c.email}</label><input id="ce" type="email" autocomplete="off"></div>
              <div class="field field--full"><label for="cm">${c.msg}</label><textarea id="cm" rows="6"></textarea></div>
            </div>
            <button class="btn btn--sea" style="margin-top:1.25rem" data-magnetic>${c.send} ${I.arrow}</button>
            <p class="err js-contact-msg" aria-live="polite"></p>
          </form>
        </div>
      </div></section>`;
  }

  /* Página para la propietaria: qué es real y qué no (solo en castellano) */
  function pageProposal() {
    const pairs = [
      ['img/booking/10480791.webp', 'img/ia/exterior-azul.webp', 'Fachada. A la derecha, la misma casa con la fachada limpia, luz de atardecer y el restaurante iluminado.'],
      ['img/booking/10480842.webp', 'img/ia/hab-triple.webp', 'Habitación doble: misma ventana y distribución, con textiles nuevos y luz cálida.'],
      ['img/booking/10480952.webp', 'img/ia/hab-twin.webp', 'Doble con dos camas: el mismo cuarto, mejor contado.'],
      ['img/booking/10480475.webp', 'img/ia/hab-individual.webp', 'Individual: escritorio, cama y luz de tarde.'],
      ['img/booking/10481201.webp', 'img/ia/bano.webp', 'Baño. Aquí la recreación va más allá de una foto: cambia la bañera por un plato de ducha. Solo como idea.']
    ];
    const ba = ([a, b, cap]) => `
      <figure class="reveal">
        <div class="ba js-ba">
          <img src="${a}" alt="Foto actual en Booking" loading="lazy">
          <img class="ba__after" src="${b}" alt="Recreación con IA" loading="lazy">
          <span class="ba__lbl ba__lbl--l">Hoy · Booking</span><span class="ba__lbl ba__lbl--r">Recreación IA</span>
          <span class="ba__line"></span><span class="ba__knob">${I.drag}</span>
          <input type="range" min="0" max="100" value="50" aria-label="Comparar antes y después">
        </div>
        <figcaption class="ba-cap">${cap}</figcaption>
      </figure>`;
    const yellow = '<span class="badge" style="background:rgba(255,214,102,.95);color:var(--ink)">IA</span>';
    const dark = '<span class="badge" style="background:var(--ink);color:#fff">Real</span>';
    const grey = '<span class="badge">Ejemplo</span>';
    return `
      <section class="prop"><div class="container">
        <div class="prop__hero">
          <div>
            <p class="kicker reveal">Sobre esta maqueta</p>
            <h1 class="reveal">Así podría ser la web de <em>Monterredondo</em></h1>
            <p class="lead reveal" style="margin-top:1.5rem">Hemos montado esta maqueta navegable con la información pública de vuestras fichas de Booking y Google. El diseño, la estructura, los tres idiomas y el flujo de reserva son reales. Las fotos de habitaciones y comida, los precios y parte de los textos son provisionales.</p>
            <p class="reveal" style="margin-top:2rem"><a class="btn btn--sea" href="${L('')}" data-magnetic>Ver la web ${I.arrow}</a></p>
          </div>
          <ul class="legend">
            <li class="reveal">${yellow}<span><b>«Foto no real · Recreación IA»</b>Imágenes creadas con IA a partir de vuestras fotos de Booking para enseñar el estilo. En la web definitiva irían fotos reales de una sesión profesional.</span></li>
            <li class="reveal">${dark}<span><b>«Foto real»</b>Fotos de vuestra ficha de Booking (con un ligero retoque de luz) y fotos con licencia libre de Meira y alrededores, con su autor citado.</span></li>
            <li class="reveal">${grey}<span><b>Vídeo de portada</b>Montaje con clips libres de Pexels de paisajes del norte. No es Meira: en la web real se grabaría con dron la casa, la Serra y el Pedregal de Irimia.</span></li>
            <li class="reveal">${grey}<span><b>Precios, menú, horarios y ventajas</b>Son ejemplos. Los decidís vosotros.</span></li>
            <li class="reveal">${grey}<span><b>Reserva</b>Motor de demostración: no cobra ni envía datos. En la versión final, conectado a Booking para no duplicar reservas.</span></li>
          </ul>
        </div>

        <div class="facts">
          <div class="fact reveal"><small>Hoy</small><h3>No tenéis web propia</h3><p>Google enlaza a un directorio de terceros. Quien os busca por el nombre acaba reservando en Booking, con comisión.</p></div>
          <div class="fact reveal"><small>Hoy</small><h3>Las fotos de Booking tienen años</h3><p>Y ninguna enseña el restaurante, que es lo que más elogian vuestros clientes.</p></div>
          <div class="fact reveal"><small>Hoy</small><h3>En Booking, solo pago en efectivo</h3><p>Con la web se puede cobrar con tarjeta o pedir una señal, y así bajan las cancelaciones de última hora.</p></div>
          <div class="fact reveal"><small>Oportunidad</small><h3>8,8 en limpieza y en trato</h3><p>Vuestros clientes ya lo dicen. La web lo pone en primer plano junto a la comida casera.</p></div>
          <div class="fact reveal"><small>Oportunidad</small><h3>Meira se vende sola</h3><p>Nacimiento del Miño, monasterio del siglo XII, rutas, Lugo a 33 km. Contenido que atrae visitas desde Google.</p></div>
          <div class="fact reveal"><small>Oportunidad</small><h3>Castellano, gallego e inglés</h3><p>Para el viajero de aquí y para el peregrino o motero que viene de fuera.</p></div>
        </div>

        <div style="margin-top:var(--section)">
          <p class="kicker reveal">Antes y después</p>
          <h2 class="h2 reveal">Las mismas habitaciones, <em>mejor contadas</em></h2>
          <p class="lead reveal" style="margin-top:1rem">Arrastra la barra. A la izquierda, la foto que hoy aparece en Booking. A la derecha, una recreación con IA de cómo podría verse con buena luz, ropa de cama nueva y una sesión de fotos.</p>
          <div class="ba-grid">${pairs.map(ba).join('')}</div>
        </div>

        <ul class="credits">
          <li>Vídeo: Pexels (licencia Pexels, uso libre), clips 26599221, 28499217, 19938382 y 36668432.</li>
          <li>Pedregal de Irimia y Serra de Meira: Miguel Branco, CC BY-SA 4.0, Wikimedia Commons.</li>
          <li>Mosteiro de Santa María de Meira: lomarper, CC BY-SA 3.0, Wikimedia Commons.</li>
          <li>Nave del monasterio: José Antonio Gil Martínez, CC BY 2.0, Wikimedia Commons.</li>
          <li>Muralla de Lugo: Simon Burchell, CC BY-SA 4.0, Wikimedia Commons.</li>
          <li>Catedral de Mondoñedo: Fernando Pascullo, CC BY-SA 4.0, Wikimedia Commons.</li>
          <li>Fotos actuales de la casa: ficha pública de Pensión Monterredondo en Booking.com.</li>
          <li>Recreaciones: generadas con IA por Ad2Place para esta maqueta.</li>
        </ul>
        <p class="tiny" style="margin-top:2rem">Maqueta preparada por Ad2Place el 19 de octubre de 2026 · Jose Redondo · <a href="mailto:joseredondo@ad2place.com" style="text-decoration:underline">joseredondo@ad2place.com</a></p>
      </div></section>`;
  }

  /* ---------- Motor de reservas (demo) ---------- */
  function pageBooking() {
    return `<section class="booking"><div class="container">
      <div class="notice reveal">${I.flask}<div><b>${T.booking.noticeTitle}</b><p>${T.booking.notice}</p></div></div>
      <h1 class="h2 reveal" style="margin-top:2rem">${T.booking.title}</h1>
      <div class="steps js-steps"></div>
      <div class="bk-grid"><div class="js-bk-main"></div><aside class="panel summary js-bk-sum"></aside></div>
    </div></section>`;
  }

  function bkSteps() {
    $('.js-steps').innerHTML = T.booking.steps.map((s, i) => `<span class="step ${i + 1 === BK.step ? 'is-current' : ''} ${i + 1 < BK.step ? 'is-done' : ''}"><i>${i + 1 < BK.step ? '✓' : i + 1}</i>${s}</span>`).join('');
  }

  function bkCalendar() {
    const b = T.booking;
    const months = [0, 1].map(k => {
      const first = new Date(TODAY.getFullYear(), TODAY.getMonth() + BK.offset + k, 1);
      const lbl = new Intl.DateTimeFormat(T.locale, { month: 'long', year: 'numeric' }).format(first); const label = lbl.charAt(0).toUpperCase() + lbl.slice(1);
      const startDow = (first.getDay() + 6) % 7;
      const daysIn = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
      const dows = [...Array(7)].map((_, i) => new Intl.DateTimeFormat(T.locale, { weekday: 'narrow' }).format(new Date(2024, 0, 1 + i)));
      let cells = dows.map(x => `<span class="cal__dow">${x}</span>`).join('') + '<span></span>'.repeat(startDow);
      for (let dd = 1; dd <= daysIn; dd++) {
        const d = new Date(first.getFullYear(), first.getMonth(), dd);
        const past = d < TODAY;
        const full = !past && TYPE_KEYS.every(t => availOn(t, d) === 0);
        const dis = past || full;
        const s = iso(d);
        let cls = 'day';
        if (full) cls += ' is-closed';
        if (BK.in && iso(BK.in) === s) cls += ' is-start';
        if (BK.out && iso(BK.out) === s) cls += ' is-end';
        if (BK.in && BK.out && d > BK.in && d < BK.out) cls += ' in-range';
        cells += `<button class="${cls}" data-d="${s}" ${dis ? 'disabled' : ''} aria-label="${fmtDate(d, { day: 'numeric', month: 'long', year: 'numeric' })}${full ? ' · ' + b.closed : ''}">${dd}${!dis ? `<small>${nightPrice('individual', d)}</small>` : ''}</button>`;
      }
      return `<div class="cal"><p class="cal__month">${label}</p><div class="cal__grid">${cells}</div></div>`;
    }).join('');
    const hint = !BK.in || (BK.in && BK.out) ? b.selectIn : b.selectOut;
    $('.js-bk-main').innerHTML = `
      <div class="panel">
        <div class="cal-head"><h2>${hint}</h2><div class="cal-nav"><button class="js-prev" aria-label="prev" ${BK.offset <= 0 ? 'disabled' : ''}>${I.arrow}</button><button class="js-next" aria-label="next" ${BK.offset >= 18 ? 'disabled' : ''}>${I.arrow}</button></div></div>
        <div class="cals">${months}</div>
        <div class="cal-legend"><span><i></i>${b.closed}</span><span><b style="color:var(--sea);font-size:.7rem">36</b>${T.rooms.from} · ${T.types.individual.name} · ${T.rooms.example}</span></div>
        <div class="guests-row"><b>${T.search.guests}</b><div class="stepper"><button class="js-ad" data-v="-1" aria-label="-">−</button><b>${BK.adults}</b><button class="js-ad" data-v="1" aria-label="+">+</button><span class="muted">${BK.adults === 1 ? T.search.adult : T.search.adults}</span></div></div>
      </div>`;
    $('.js-prev').onclick = () => { BK.offset--; bkCalendar(); };
    $('.js-next').onclick = () => { BK.offset++; bkCalendar(); };
    $$('.day[data-d]').forEach(btn => btn.addEventListener('click', () => {
      const d = parseIso(btn.dataset.d);
      if (!BK.in || BK.out || d <= BK.in) { BK.in = d; BK.out = null; }
      else BK.out = d;
      bkCalendar(); bkSummary();
    }));
    $$('.js-ad').forEach(b2 => b2.onclick = () => { BK.adults = Math.min(3, Math.max(1, BK.adults + +b2.dataset.v)); bkCalendar(); bkSummary(); });
  }

  function bkResults() {
    const b = T.booking, n = nightsBetween(BK.in, BK.out);
    $('.js-bk-main').innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:1.25rem">
        <h2 class="serif" style="font-size:var(--t-xl)">${b.available}</h2>
        <button class="link-arrow js-change">${b.change}</button>
      </div>
      <div class="results">${TYPE_KEYS.map(k => {
        const q = quote(k, BK.in, BK.out), t = T.types[k];
        const capOk = BK.adults <= TYPES[k].max;
        const sold = q.left === 0 || !capOk;
        return `<article class="result reveal ${BK.type === k ? 'is-selected' : ''} ${sold ? 'is-sold' : ''}">
          <div class="result__img"><img src="${TYPES[k].hero}" alt="${t.name}"></div>
          <div>
            <h3>${t.name}</h3>
            <p class="result__meta">${t.cap} · ${t.beds}</p>
            <p class="result__meta">${TYPES[k].feats.slice(0, 3).map(f => T.feat[f]).join(' · ')}</p>
            ${sold ? `<span class="result__left">${capOk ? b.soldOut : t.cap}</span>` : (q.left <= 2 ? `<span class="result__left">${b.left.replace('{n}', q.left)}</span>` : '')}
          </div>
          <div class="result__price">
            <div><s>${money(q.other)}</s><b>${money(q.total)}</b><small>${n} ${n === 1 ? b.night1 : b.nights} · ${T.rooms.example}</small></div>
            <button class="btn ${BK.type === k ? 'btn--sea' : ''} btn--sm js-pick" data-k="${k}" ${sold ? 'disabled' : ''}>${BK.type === k ? '✓ ' : ''}${b.choose}</button>
          </div>
        </article>`;
      }).join('')}</div>
      <p class="tiny" style="margin-top:1rem">${b.priceNote}</p>`;
    $('.js-change').onclick = () => { BK.step = 1; bkRender(); };
    $$('.js-pick').forEach(x => x.onclick = () => { BK.type = x.dataset.k; bkResults(); bkSummary(); animateIn($('.js-bk-main')); });
  }

  function bkForm() {
    const f = T.booking.form;
    const regions = ['ES', 'PT', 'FR', 'DE', 'GB', 'IT', 'NL', 'BE', 'IE', 'US'];
    let dn = null; try { dn = new Intl.DisplayNames([T.locale], { type: 'region' }); } catch (e) { /* navegador antiguo */ }
    const def = { es: 'ES', gl: 'ES', en: 'GB' }[lang];
    const times = ['12:00–16:00', '16:00–20:00', '20:00–23:00', '> 23:00'];
    const v = BK.data;
    $('.js-bk-main').innerHTML = `
      <form class="panel js-bkf" novalidate>
        <div class="form-grid">
          <div class="field field--full"><label for="bn">${f.name} *</label><input id="bn" name="name" required value="${v.name || ''}" autocomplete="off"></div>
          <div class="field"><label for="be">${f.email} *</label><input id="be" name="email" type="email" required value="${v.email || ''}" autocomplete="off"></div>
          <div class="field"><label for="bp">${f.phone} *</label><input id="bp" name="phone" type="tel" required value="${v.phone || ''}" autocomplete="off"></div>
          <div class="field"><label for="bc">${f.country}</label><select id="bc" name="country">${regions.map(r => `<option value="${r}" ${(v.country || def) === r ? 'selected' : ''}>${dn ? dn.of(r) : r}</option>`).join('')}</select></div>
          <div class="field"><label for="bt">${f.time}</label><select id="bt" name="time">${times.map(x => `<option>${x}</option>`).join('')}</select></div>
          <div class="field field--full"><label for="bx">${f.notes}</label><textarea id="bx" name="notes" rows="3">${v.notes || ''}</textarea></div>
          <label class="check"><input type="checkbox" name="accept" required ${v.accept ? 'checked' : ''}>${f.accept}</label>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-top:1.5rem;flex-wrap:wrap">
          <button type="button" class="link-arrow js-back">${T.booking.backBtn}</button>
          <button class="btn btn--sea" data-magnetic>${f.confirm} ${I.arrow}</button>
        </div>
        <p class="err js-ferr" aria-live="polite"></p>
      </form>`;
    $('.js-back').onclick = () => { BK.step = 2; bkRender(); };
    $('.js-bkf').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      BK.data = Object.fromEntries(fd.entries()); BK.data.accept = fd.get('accept') === 'on';
      if (!BK.data.name || !BK.data.email || !BK.data.phone || !BK.data.accept) { $('.js-ferr').textContent = T.booking.needAll; return; }
      BK.step = 4; BK.locator = 'DEMO-' + Math.random().toString(36).slice(2, 7).toUpperCase(); bkRender();
    });
  }

  function bkDone() {
    const b = T.booking;
    $('.js-bk-main').innerHTML = `
      <div class="panel done">
        <div class="done__icon">${I.check}</div>
        <h2>${b.done}</h2>
        <p class="lead">${b.doneText}</p>
        <p class="tiny" style="margin-top:2rem">${b.locator}</p>
        <span class="locator" style="margin-top:.5rem">${BK.locator}</span>
        <p style="margin-top:2rem"><button class="btn js-new">${b.newSearch} ${I.arrow}</button></p>
      </div>`;
    $('.js-new').onclick = () => { BK.step = 1; BK.type = null; BK.data = {}; bkRender(); };
    burst();
  }

  function bkSummary() {
    const b = T.booking, el = $('.js-bk-sum'); if (!el) return;
    const n = BK.in && BK.out ? nightsBetween(BK.in, BK.out) : 0;
    const q = BK.type && n ? quote(BK.type, BK.in, BK.out) : null;
    const cta = { 1: b.next, 2: b.next, 3: null, 4: null }[BK.step];
    el.innerHTML = `
      <h3>${b.summary}</h3>
      <div class="sum-row" style="margin-top:1rem"><span>${b.dates}</span><b>${fmtDate(BK.in)} → ${fmtDate(BK.out)}</b></div>
      <div class="sum-row"><span>${n ? `${n} ${n === 1 ? b.night1 : b.nights}` : '—'}</span><b>${BK.adults} ${BK.adults === 1 ? T.search.adult : T.search.adults}</b></div>
      ${BK.type ? `<div class="sum-row"><span>${T.rooms.kicker}</span><b>${T.types[BK.type].name}</b></div>` : ''}
      ${q ? `<div class="sum-row"><span>${b.other}</span><s>${money(q.other)}</s></div>
             <div class="sum-total"><span>${b.total}</span><b>${money(q.total)}</b></div>
             <p class="tiny" style="color:var(--terra);font-weight:700">${b.save.replace('{x}', money(q.other - q.total))}</p>` : ''}
      ${cta ? `<button class="btn btn--sea js-next-step" data-magnetic>${cta} ${I.arrow}</button>` : ''}
      <p class="err js-serr" aria-live="polite"></p>
      <p class="tiny" style="margin-top:.5rem;display:flex;gap:.4rem;align-items:flex-start"><span style="width:16px;flex:none;color:var(--sea)">${I.shield}</span>${T.search.best}</p>`;
    const nx = $('.js-next-step');
    if (nx) nx.onclick = () => {
      if (BK.step === 1) { if (!BK.in || !BK.out) { $('.js-serr').textContent = b.needDates; return; } BK.step = 2; }
      else if (BK.step === 2) { if (!BK.type) { BK.type = TYPE_KEYS.find(k => quote(k, BK.in, BK.out).left > 0 && BK.adults <= TYPES[k].max) || null; if (!BK.type) return; } BK.step = 3; }
      bkRender();
    };
  }

  function bkRender() {
    if (BK.step === 2 && (!BK.in || !BK.out)) BK.step = 1;
    bkSteps();
    ({ 1: bkCalendar, 2: bkResults, 3: bkForm, 4: bkDone })[BK.step]();
    bkSummary();
    animateIn($('.js-bk-main'));
    if (lenis && !firstRender) lenis.scrollTo(0, { duration: .8 });
  }

  /* Confeti verde y dorado al confirmar */
  function burst() {
    if (REDUCED || !HAS_GSAP) return;
    const host = $('.done__icon'); if (!host) return;
    const r = host.getBoundingClientRect();
    const colors = ['#3d6b4c', '#b5d6a7', '#c9a45c', '#b4532a', '#17231c'];
    for (let i = 0; i < 46; i++) {
      const p = document.createElement('i');
      Object.assign(p.style, { position: 'fixed', left: r.left + r.width / 2 + 'px', top: r.top + r.height / 2 + 'px', width: '8px', height: '12px', background: colors[i % 5], borderRadius: '2px', zIndex: 260, pointerEvents: 'none' });
      document.body.appendChild(p);
      gsap.to(p, { x: (Math.random() - .5) * 700, y: (Math.random() - .8) * 500, rotation: Math.random() * 720, opacity: 0, duration: 1.6 + Math.random(), ease: 'power3.out', onComplete: () => p.remove() });
    }
  }

  /* ---------- Router ---------- */
  function parseRoute() {
    const h = location.hash.replace(/^#\/?/, '');
    const parts = h.split('/').filter(Boolean);
    let l = parts[0];
    if (!LANGS.includes(l)) { l = null; }
    else parts.shift();
    return { lang: l, path: parts };
  }

  function render() {
    const { lang: l, path } = parseRoute();
    if (!l) { location.replace(`#/${lang}/${path.join('/')}`); return; }
    lang = l; T = window.I18N[lang];
    document.documentElement.lang = lang;
    document.title = T.meta.title;
    const desc = $('meta[name="description"]'); if (desc) desc.content = T.meta.desc;
    const rb = $('.ribbon'); rb.href = L('propuesta'); rb.querySelector('span').textContent = T.ribbon; rb.querySelector('u').textContent = T.ribbonMore + ' →';
    $('.skip-link').textContent = T.skip;
    $('#header').innerHTML = header();
    $('#mnav').innerHTML = mobileNav();
    footerEl.innerHTML = footer();

    const [p0, p1] = path;
    let html, dark = true;
    if (!p0) html = pageHome();
    else if (p0 === 'habitaciones' && p1 && TYPES[p1]) html = pageDetail(p1);
    else if (p0 === 'habitaciones') html = pageRooms();
    else if (p0 === 'restaurante') html = pageResto();
    else if (p0 === 'meira') html = pageArea();
    else if (p0 === 'contacto') { html = pageContact(); dark = false; }
    else if (p0 === 'reservar') { html = pageBooking(); dark = false; }
    else if (p0 === 'propuesta') { html = pageProposal(); dark = false; }
    else html = pageHome();
    app.innerHTML = html;
    document.body.classList.toggle('is-light-top', !dark);
    $$('.nav__link').forEach(a => a.classList.toggle('is-active', a.dataset.r === (p0 || '')));
    bindCommon();
    if (p0 === 'reservar') bkRender();
    if (p0 === 'contacto') bindContact();
    if (p0 === 'propuesta') bindCompare();
    if (!p0) bindHome();
    if (p0 === 'habitaciones' && p1 && TYPES[p1]) bindLightbox(TYPES[p1].imgs, T.types[p1].name);
    initAnimations(!p0);
    headerState();
  }

  /* Transición entre páginas con cortina y el monte */
  let navigating = false;
  function go() {
    if (firstRender || REDUCED || !HAS_GSAP) { render(); afterRender(); return; }
    if (navigating) return;
    navigating = true;
    const c = $('.curtain');
    gsap.timeline()
      .set(c, { y: 0, yPercent: 100, visibility: 'visible' })
      .to(c, { yPercent: 0, duration: .55, ease: 'power3.inOut' })
      .fromTo(c.querySelector('svg'), { scale: .6, opacity: 0 }, { scale: 1, opacity: 1, duration: .55, ease: 'power2.out' }, '<')
      .add(() => { killScroll(); render(); window.scrollTo(0, 0); if (lenis) lenis.scrollTo(0, { immediate: true }); afterRender(); })
      .to(c, { yPercent: -100, duration: .7, ease: 'power3.inOut', delay: .05 })
      .set(c, { visibility: 'hidden' })
      .add(() => { navigating = false; });
  }
  function afterRender() { if (HAS_GSAP) ScrollTrigger.refresh(); firstRender = false; }
  function killScroll() { if (HAS_GSAP) ScrollTrigger.getAll().forEach(t => t.kill()); }

  /* ---------- Interacciones ---------- */
  function bindCommon() {
    const lg = $('.lang');
    $('.lang__btn').onclick = (e) => { e.stopPropagation(); lg.classList.toggle('is-open'); $('.lang__btn').setAttribute('aria-expanded', lg.classList.contains('is-open')); };
    document.onclick = () => lg.classList.remove('is-open');
    $$('[data-lang]').forEach(a => a.onclick = (e) => {
      e.preventDefault();
      const { path } = parseRoute();
      location.hash = `#/${a.dataset.lang}/${path.join('/')}`;
    });
    const mn = $('#mnav');
    $('.burger').onclick = () => { mn.classList.add('is-open'); document.body.classList.add('is-locked'); };
    const closeM = () => { mn.classList.remove('is-open'); document.body.classList.remove('is-locked'); };
    $('.mnav__close').onclick = closeM;
    $$('#mnav a').forEach(a => a.addEventListener('click', closeM));
    $$('[data-demo]').forEach(a => a.onclick = (e) => e.preventDefault());
    $$('[data-type]').forEach(a => a.addEventListener('click', () => { BK.type = a.dataset.type; BK.adults = Math.min(BK.adults, TYPES[BK.type].max); BK.step = BK.in && BK.out ? 2 : 1; if (BK.in) BK.offset = Math.max(0, monthOffsetFor(BK.in)); }));
    $$('a[href$="/reservar"]:not([data-type]):not([data-step])').forEach(a => a.addEventListener('click', () => { BK.step = 1; if (BK.in) BK.offset = Math.max(0, monthOffsetFor(BK.in)); }));
    $$('[data-step]').forEach(a => a.addEventListener('click', () => { BK.step = +a.dataset.step; BK.offset = Math.max(0, monthOffsetFor(BK.in)); }));
    magnetic(); cursorTargets();
  }

  function bindHome() {
    const v = $('.hero__video');
    if (v) {
      v.src = window.innerWidth <= 720 ? 'video/hero-galicia-720.mp4' : 'video/hero-galicia-1080.mp4';
      if (REDUCED) { v.removeAttribute('autoplay'); v.pause(); } else v.play().catch(() => {});
    }
    $$('[data-g]').forEach(b => b.onclick = () => {
      BK.adults = Math.min(3, Math.max(1, BK.adults + +b.dataset.g));
      $('.js-g').textContent = `${BK.adults} ${BK.adults === 1 ? T.search.adult : T.search.adults}`;
    });
  }

  function bindContact() {
    $('.js-contact').addEventListener('submit', (e) => { e.preventDefault(); $('.js-contact-msg').textContent = T.contact.sent; });
  }

  /* Comparador antes / después: se arrastra y, al entrar en pantalla, hace un pequeño barrido */
  function bindCompare() {
    $$('.js-ba').forEach(el => {
      const input = el.querySelector('input');
      const set = (v) => el.style.setProperty('--pos', v + '%');
      input.addEventListener('input', () => set(input.value));
      if (REDUCED || !HAS_GSAP) return;
      const o = { v: 50 };
      ScrollTrigger.create({ trigger: el, start: 'top 75%', once: true, onEnter: () => gsap.timeline().to(o, { v: 82, duration: .9, ease: 'power2.inOut', onUpdate: () => set(o.v) }).to(o, { v: 18, duration: 1.3, ease: 'power2.inOut', onUpdate: () => set(o.v) }).to(o, { v: 50, duration: .9, ease: 'power2.inOut', onUpdate: () => { set(o.v); input.value = o.v; } }) });
    });
  }

  function bindLightbox(imgs, name) {
    const lb = $('#lightbox'); let idx = 0;
    const show = () => { $('#lightbox img').src = imgs[idx]; $('#lightbox img').alt = `${name} ${idx + 1}`; };
    $$('[data-lb]').forEach(b => b.onclick = () => { idx = +b.dataset.lb; show(); lb.classList.add('is-open'); lenis && lenis.stop(); });
    const close = () => { lb.classList.remove('is-open'); lenis && lenis.start(); };
    $('.lightbox__close').onclick = close;
    $('.lightbox__nav--prev').onclick = () => { idx = (idx - 1 + imgs.length) % imgs.length; show(); };
    $('.lightbox__nav--next').onclick = () => { idx = (idx + 1) % imgs.length; show(); };
    document.onkeydown = (e) => { if (!lb.classList.contains('is-open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') $('.lightbox__nav--prev').click(); if (e.key === 'ArrowRight') $('.lightbox__nav--next').click(); };
  }

  function magnetic() {
    if (REDUCED || !HAS_GSAP || window.matchMedia('(pointer: coarse)').matches) return;
    $$('[data-magnetic]').forEach(el => {
      const xTo = gsap.quickTo(el, 'x', { duration: .6, ease: 'elastic.out(1, .4)' });
      const yTo = gsap.quickTo(el, 'y', { duration: .6, ease: 'elastic.out(1, .4)' });
      el.addEventListener('mousemove', (e) => { const r = el.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * .3); yTo((e.clientY - r.top - r.height / 2) * .3); });
      el.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
    });
  }

  const cursor = $('.cursor');
  function cursorTargets() {
    if (!cursor) return;
    $$('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('is-big'); cursor.querySelector('span').textContent = el.dataset.cursor; });
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-big'));
    });
  }
  if (cursor && HAS_GSAP && !window.matchMedia('(pointer: coarse)').matches) {
    const cx = gsap.quickTo(cursor, 'x', { duration: .35, ease: 'power3' }), cy = gsap.quickTo(cursor, 'y', { duration: .35, ease: 'power3' });
    window.addEventListener('mousemove', (e) => { cx(e.clientX); cy(e.clientY); });
  }

  /* Cabecera: sólida al hacer scroll, se oculta al bajar */
  let lastY = 0;
  function headerState() {
    const y = window.scrollY, hd = $('#header');
    const light = document.body.classList.contains('is-light-top');
    hd.classList.toggle('is-solid', y > 40 || light);
    hd.classList.toggle('is-hidden', y > 400 && y > lastY && !$('#mnav').classList.contains('is-open'));
    lastY = y;
  }
  window.addEventListener('scroll', headerState, { passive: true });

  /* ---------- Animaciones ---------- */
  function animateIn(el) {
    if (!el || REDUCED || !HAS_GSAP) { $$('.reveal', el || document).forEach(x => { x.style.opacity = 1; x.style.transform = 'none'; }); return; }
    gsap.fromTo(el.children, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .7, ease: 'power3.out', stagger: .06, overwrite: true });
    $$('.reveal', el).forEach(x => gsap.to(x, { opacity: 1, y: 0, duration: .7, ease: 'power3.out' }));
  }

  function initAnimations(isHome) {
    if (REDUCED || !HAS_GSAP) {
      $$('.reveal').forEach(x => { x.style.opacity = 1; x.style.transform = 'none'; });
      $$('.clip').forEach(x => x.style.clipPath = 'none');
      $$('.intro__text .w').forEach(w => w.style.opacity = 1);
      $$('.h1 .line > span, .page-hero h1 .line > span').forEach(x => x.style.transform = 'none');
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const delay = isHome && firstLoad ? 1.9 : (firstLoad ? 1.6 : .35);

    // Titulares del hero
    gsap.from('.h1 .line > span, .page-hero h1 .line > span', { yPercent: 115, rotate: 3, duration: 1.4, ease: 'expo.out', stagger: .12, delay });
    gsap.from('.js-hero-fade', { opacity: 0, y: 30, duration: 1.1, ease: 'power3.out', stagger: .12, delay: delay + .35 });
    gsap.from('.hero__note, .hero__scroll', { opacity: 0, duration: 1, delay: delay + .8 });

    // Vídeo: zoom de entrada y efecto «ventana» al hacer scroll
    const media = $('.hero__media');
    if (media) {
      gsap.to('.hero__media video', { scale: 1, duration: 2.6, ease: 'power2.out', delay: delay - .4 });
      gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
        .fromTo(media, { clipPath: 'inset(0% 0% 0% 0% round 0px)' }, { clipPath: 'inset(7% 5% 14% 5% round 28px)', ease: 'none' }, 0)
        .to('.hero__content', { yPercent: -30, opacity: 0, ease: 'none' }, 0)
        .to('.search', { y: -80, opacity: 0, ease: 'none' }, 0)
        .to('.hero__media video', { yPercent: 12, ease: 'none' }, 0);
    }
    // Fondo de cabecera interior
    $$('.page-hero__bg img').forEach(img => gsap.fromTo(img, { scale: 1.2 }, { scale: 1, duration: 2.2, ease: 'power2.out', delay: .2 }));

    // Texto de intro palabra a palabra y el Miño dibujándose
    const words = $$('.intro__text .w');
    if (words.length) gsap.to(words, { opacity: 1, stagger: .05, ease: 'none', scrollTrigger: { trigger: '.intro__text', start: 'top 80%', end: 'bottom 50%', scrub: .6 } });
    const river = $('.js-river');
    if (river) {
      const len = river.getTotalLength();
      gsap.fromTo(river, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.intro', start: 'top 85%', end: 'bottom 40%', scrub: 1 } });
    }
    if ($('.rose-deco')) gsap.to('.rose-deco', { rotation: 30, y: -60, ease: 'none', scrollTrigger: { trigger: '.intro', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    if ($('.direct__rose')) gsap.to('.direct__rose', { rotation: -20, ease: 'none', scrollTrigger: { trigger: '.direct', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    if ($('.js-stamp')) gsap.to('.js-stamp', { rotation: 360, ease: 'none', scrollTrigger: { trigger: '.resto', start: 'top bottom', end: 'bottom top', scrub: 1 } });

    // Contadores
    $$('.js-count').forEach(el => {
      const raw = el.dataset.to, dec = raw.includes(',') || raw.includes('.') ? 1 : 0;
      const target = parseFloat(raw.replace(',', '.')); const o = { v: 0 };
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: target, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = dec ? o.v.toFixed(1).replace('.', lang === 'en' ? '.' : ',') : Math.round(o.v); } }) });
    });
    $$('.score').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => el.classList.add('is-in') }));

    // Apariciones genéricas
    ScrollTrigger.batch('.reveal', { start: 'top 90%', once: true, onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: .08 }) });
    ScrollTrigger.batch('.clip', { start: 'top 88%', once: true, onEnter: (els) => gsap.to(els, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.out', stagger: .1 }) });

    // Parallax en imágenes
    $$('[data-parallax]').forEach(el => {
      const amt = +el.dataset.parallax || 10;
      gsap.fromTo(el, { yPercent: -amt }, { yPercent: amt * .3, ease: 'none', scrollTrigger: { trigger: el.closest('section, .tile, .split__img, .area__media, .resto__stack') || el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // Habitaciones en horizontal (escritorio)
    const track = $('.apts__track');
    if (track && window.innerWidth > 720) {
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.apts__pin', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 } });
    }
    // Comparador y menú flotantes
    if ($('.compare')) gsap.to('.compare', { y: -40, rotate: 1.5, ease: 'none', scrollTrigger: { trigger: '.direct', start: 'top bottom', end: 'bottom top', scrub: true } });
    if ($('.resto .menu-card')) gsap.fromTo('.resto .menu-card', { rotate: -3 }, { rotate: 1, ease: 'none', scrollTrigger: { trigger: '.resto', start: 'top bottom', end: 'bottom top', scrub: true } });
    if ($('.area__float')) gsap.fromTo('.area__float', { y: 80 }, { y: -40, ease: 'none', scrollTrigger: { trigger: '.area', start: 'top bottom', end: 'bottom top', scrub: true } });
    // Título final
    if ($('.final__title')) gsap.from('.final__title', { y: 80, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.final', start: 'top 70%' } });
    // Footer gigante
    gsap.from('.footer__big span', { yPercent: 100, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.footer', start: 'top 85%' } });
    firstLoad = false;
  }
  let firstLoad = true;

  /* ---------- Arranque ---------- */
  function boot() {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    if (HAS_GSAP) {
      gsap.registerPlugin(ScrollTrigger);
      if (!REDUCED && typeof window.Lenis !== 'undefined') {
        lenis = new Lenis({ lerp: .09, smoothWheel: true });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((t) => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
      }
    }
    const pref = (navigator.language || 'es').slice(0, 2);
    if (!parseRoute().lang) lang = LANGS.includes(pref) && location.search.includes('auto') ? pref : 'es';
    window.addEventListener('hashchange', go);
    go();
    const loader = $('.loader');
    if (REDUCED || !HAS_GSAP) { loader.remove(); return; }
    gsap.to(loader, { yPercent: -100, duration: 1, ease: 'expo.inOut', delay: 1.6, onComplete: () => loader.remove() });
  }
  boot();
})();
