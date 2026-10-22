/*!
 * © 2026 Ad2Place Digital · Inversiones Azteca Mataró S.L. · CIF B01955863
 * Maqueta confidencial preparada como propuesta comercial. El diseño, el código,
 * los textos y las imágenes son propiedad de Ad2Place y están protegidos por la
 * Ley de Propiedad Intelectual (RDL 1/1996). Prohibida su copia, reproducción,
 * descarga, modificación o cesión a terceros, total o parcial, sin autorización
 * escrita de Ad2Place. Contacto: joseredondo@ad2place.com
 */
(function () {
  var me = document.currentScript;
  var cliente = (me && me.getAttribute('data-cliente')) || 'el cliente';
  var KEY = 'ad2place-aviso-visto';

  function visto() { try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function marcar() { try { sessionStorage.setItem(KEY, '1'); } catch (e) {} }

  var css =
    '.a2p-aviso{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:16px;background:rgba(20,18,16,.72);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);font:400 16px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#2b2b2b;animation:a2pIn .35s ease both}' +
    '.a2p-aviso__card{width:100%;max-width:560px;max-height:calc(100vh - 32px);overflow:auto;background:#fff;border-radius:20px;box-shadow:0 30px 80px rgba(0,0,0,.35);padding:28px 28px 24px;border-top:5px solid #d4a843}' +
    '.a2p-aviso__logo{display:block;width:150px;height:auto;margin:0 0 18px}' +
    '.a2p-aviso__tag{display:inline-block;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#3d3d3d;background:#f7efdc;border-left:3px solid #d4a843;padding:5px 9px;margin-bottom:12px}' +
    '.a2p-aviso h2{font:700 22px/1.25 Georgia,"Times New Roman",serif;color:#2b2b2b;margin:0 0 12px}' +
    '.a2p-aviso p{margin:0 0 12px;font-size:15px}' +
    '.a2p-aviso ul{margin:0 0 14px;padding-left:20px;font-size:15px}' +
    '.a2p-aviso li{margin:4px 0}' +
    '.a2p-aviso small{display:block;color:#6b6b6b;font-size:12.5px;line-height:1.5;margin-bottom:18px}' +
    '.a2p-aviso button{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:12px 22px;border:0;border-radius:12px;background:#3d3d3d;color:#fff;font:700 15px/1 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;cursor:pointer}' +
    '.a2p-aviso button:hover{background:#2b2b2b}' +
    '.a2p-aviso button:focus-visible{outline:3px solid #d4a843;outline-offset:3px}' +
    '@keyframes a2pIn{from{opacity:0}to{opacity:1}}' +
    '@media (prefers-reduced-motion:reduce){.a2p-aviso{animation:none}}';

  function abrir() {
    if (visto()) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var prev = document.activeElement;
    var wrap = document.createElement('div');
    wrap.className = 'a2p-aviso';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-labelledby', 'a2p-aviso-t');
    wrap.innerHTML =
      '<div class="a2p-aviso__card">' +
        '<img class="a2p-aviso__logo" src="img/ad2place-logo.webp" alt="Ad2Place" width="480" height="169">' +
        '<span class="a2p-aviso__tag">Maqueta confidencial</span>' +
        '<h2 id="a2p-aviso-t">Esta web es una propuesta de Ad2Place</h2>' +
        '<p>Ad2Place Digital ha preparado esta maqueta exclusivamente para <strong>' + cliente + '</strong>, como parte de una propuesta comercial.</p>' +
        '<ul>' +
          '<li>El diseño, el código, los textos y las imágenes son <strong>propiedad de Ad2Place</strong> y están protegidos por la Ley de Propiedad Intelectual.</li>' +
          '<li><strong>No está permitido</strong> copiarlos, descargarlos, reproducirlos, modificarlos ni cederlos a terceros, ni total ni parcialmente, sin nuestra autorización por escrito.</li>' +
          '<li>Los derechos de uso pasan al cliente solo cuando acepta el presupuesto y lo paga.</li>' +
        '</ul>' +
        '<small>Ad2Place Digital · Inversiones Azteca Mataró S.L. · CIF B01955863 · joseredondo@ad2place.com<br>El uso no autorizado podrá ser objeto de las acciones legales que correspondan.</small>' +
        '<button type="button">Entendido, ver la maqueta</button>' +
      '</div>';
    document.body.appendChild(wrap);
    var btn = wrap.querySelector('button');
    var html = document.documentElement, ov = html.style.overflow;
    html.style.overflow = 'hidden';
    function cerrar() {
      marcar(); html.style.overflow = ov;
      document.removeEventListener('keydown', onKey, true);
      wrap.remove();
      if (prev && prev.focus) { try { prev.focus(); } catch (e) {} }
    }
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
      else if (e.key === 'Tab') { e.preventDefault(); btn.focus(); }
    }
    // que el scroll suave de la página (Lenis) no se mueva por detrás
    ['wheel', 'touchmove'].forEach(function (t) { wrap.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: true }); });
    btn.addEventListener('click', cerrar);
    document.addEventListener('keydown', onKey, true);
    setTimeout(function () { btn.focus(); }, 50);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', abrir);
  else abrir();
})();
