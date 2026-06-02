/* =========================================================
   voidcontests · deck controller
   Fixed 1920x1080 stage · scaled to viewport · keyboard nav
   ========================================================= */
(() => {
  const stage = document.getElementById('stage');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotsHost = document.getElementById('dots');
  let idx = 0;
  const total = slides.length;

  /* ---- build dots ---- */
  const dots = [];
  for (let i = 0; i < total; i++) {
    const d = document.createElement('span');
    d.className = 'd' + (i === 0 ? ' active' : '');
    dotsHost.appendChild(d);
    dots.push(d);
  }

  /* ---- uniform stage scaling ---- */
  function fit() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(vw / 1920, vh / 1080);
    stage.style.transform = `scale(${scale})`;
  }
  fit();
  window.addEventListener('resize', fit);

  /* ---- navigation ---- */
  const pageno = document.getElementById('pageno');
  function setPage(n) {
    if (pageno) pageno.textContent = String(n + 1).padStart(2, '0');
  }
  function go(n) {
    n = Math.max(0, Math.min(total - 1, n));
    if (n === idx) return;
    slides[idx].classList.remove('is-active');
    dots[idx].classList.remove('active');
    idx = n;
    slides[idx].classList.add('is-active');
    dots[idx].classList.add('active');
    setPage(idx);
  }
  setPage(0);

  function next() { go(idx + 1); }
  function prev() { go(idx - 1); }

  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'PageDown':
        e.preventDefault(); next(); break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault(); prev(); break;
      case 'Home': e.preventDefault(); go(0); break;
      case 'End': e.preventDefault(); go(total - 1); break;
    }
  });

  /* ---- touch / click ---- */
  let touchX = null;
  window.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  window.addEventListener('touchend', (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    touchX = null;
  });

  window.addEventListener('click', (e) => {
    // ignore clicks on chrome
    if (e.target.closest('.chrome, .hint')) return;
    const x = e.clientX;
    (x > window.innerWidth / 2 ? next : prev)();
  });
})();
