// Slide navigation: keys, buttons, swipe and #n deep links, plus fitting the canvas to the window
// and switching between the dark (default) and light themes.
(() => {
  const root = document.documentElement;
  const deck = document.querySelector('.deck');
  const slides = [...deck.querySelectorAll('.slide')];
  const current = deck.querySelector('[data-current]');
  const prev = deck.querySelector('[data-prev]');
  const next = deck.querySelector('[data-next]');
  const themeToggle = deck.querySelector('[data-theme-toggle]');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const bar = deck.querySelector('.progress__bar');
  // The pieces of a slide that rise in one after another: its direct children, or the items of its lists
  const REVEAL = ':scope > :not(ol, ul, dl, .story), :scope > :is(ol, ul) > li, :scope > dl > div, .story > p, .outcomes > li';
  let index = -1;

  const pad = (n) => String(n).padStart(2, '0');

  function fit() {
    const css = getComputedStyle(root);
    const w = parseFloat(css.getPropertyValue('--canvas-w'));
    const h = parseFloat(css.getPropertyValue('--canvas-h'));
    root.style.setProperty('--scale', Math.min(innerWidth / w, innerHeight / h));
  }

  function go(to) {
    to = Math.max(0, Math.min(slides.length - 1, to));
    if (to === index) return;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === to);
      slide.inert = i !== to;
    });
    index = to;
    current.textContent = pad(index + 1);
    prev.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    deck.classList.toggle('at-start', index === 0);
    bar.style.transform = `scaleX(${(index + 1) / slides.length})`;
    history.replaceState(null, '', `#${index + 1}`);
  }

  const fromHash = () => (parseInt(location.hash.slice(1), 10) || 1) - 1;

  function syncTheme() {
    const light = root.dataset.theme === 'light';
    themeToggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    themeColor.content = getComputedStyle(root).getPropertyValue('--paper').trim();
  }

  function toggleTheme() {
    const theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    const apply = () => {
      root.dataset.theme = theme;
      syncTheme();
    };
    try { localStorage.setItem('theme', theme); } catch {}
    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  }

  addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    // Let Space and Enter press a focused button or link instead of turning the page
    if ((e.key === ' ' || e.key === 'Enter') && e.target.closest('a, button')) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'PageDown':
      case 'Enter':
        go(index + 1);
        break;
      case ' ':
        go(index + (e.shiftKey ? -1 : 1));
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        go(index - 1);
        break;
      case 'Home':
        go(0);
        break;
      case 'End':
        go(slides.length - 1);
        break;
      case 'f':
        if (document.fullscreenElement) document.exitFullscreen();
        else root.requestFullscreen?.();
        break;
      case 't':
        toggleTheme();
        break;
      default:
        return;
    }
    e.preventDefault();
  });

  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));
  themeToggle.addEventListener('click', toggleTheme);

  let start = null;
  deck.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') start = { x: e.clientX, y: e.clientY };
  });
  deck.addEventListener('pointerup', (e) => {
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    start = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1));
  });
  deck.addEventListener('pointercancel', () => { start = null; });

  addEventListener('hashchange', () => go(fromHash()));
  addEventListener('resize', fit);

  slides.forEach((slide) => {
    slide.querySelectorAll(REVEAL).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.setProperty('--i', i);
    });
  });

  deck.querySelector('[data-total]').textContent = pad(slides.length);
  syncTheme();
  fit();
  // Turn motion on first, then show the opening slide, so it animates in too
  requestAnimationFrame(() => requestAnimationFrame(() => {
    deck.classList.add('is-ready');
    go(fromHash());
  }));

  // The old Gatsby site registered an offline service worker; remove it for returning visitors
  navigator.serviceWorker?.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
})();
