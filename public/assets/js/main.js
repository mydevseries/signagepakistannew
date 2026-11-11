/* Signage Pakistan — site interactions (no dependencies) */
(() => {
  // WhatsApp uses the UAN line (country code, digits only)
  const WHATSAPP_NUMBER = '923111777105';
  const WA_DEFAULT_TEXT = 'Hello Signage Pakistan, I would like a quote for a sign.';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const waLink = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  let parallaxEls = [];

  const updateParallax = () => {
    const vh = window.innerHeight;
    parallaxEls.forEach((el) => {
      const parent = el.parentElement;
      if (!parent) return;
      const box = parent.getBoundingClientRect();
      if (box.bottom < 0 || box.top > vh) return;
      const progress = (box.top + box.height / 2 - vh / 2) / vh;
      el.style.transform = `translate3d(0, ${(-progress * Number(el.dataset.parallax) * 100).toFixed(2)}%, 0)`;
    });
  };

  const onScrollState = () => {
    const y = window.scrollY;
    const header = $('#header');
    const waFloat = $('.wa-float');
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (waFloat) waFloat.classList.toggle('is-visible', y > window.innerHeight * 0.6);
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      onScrollState();
      updateParallax();
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  const initChrome = () => {
    requestAnimationFrame(() => document.body.classList.add('is-loaded'));
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Mega menu ---------- */
    const megaBtn = $('#mega-trigger');
    const mega = $('#mega');
    if (megaBtn && mega && !megaBtn.dataset.spInit) {
      megaBtn.dataset.spInit = 'true';
      let closeTimer;
      let hoverOpenedAt = 0;
      const setMega = (open) => {
        clearTimeout(closeTimer);
        megaBtn.setAttribute('aria-expanded', String(open));
        mega.classList.toggle('is-open', open);
      };
      megaBtn.addEventListener('click', () => {
        if (performance.now() - hoverOpenedAt < 500) return;
        setMega(megaBtn.getAttribute('aria-expanded') !== 'true');
      });
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        [megaBtn, mega].forEach((el) => {
          el.addEventListener('mouseenter', () => {
            if (!mega.classList.contains('is-open')) hoverOpenedAt = performance.now();
            setMega(true);
          });
          el.addEventListener('mouseleave', () => { closeTimer = setTimeout(() => setMega(false), 180); });
        });
      }
      mega.addEventListener('click', (e) => { if (e.target.closest('a')) setMega(false); });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mega.classList.contains('is-open')) { setMega(false); megaBtn.focus(); }
      });
      document.addEventListener('click', (e) => {
        if (!mega.contains(e.target) && !megaBtn.contains(e.target)) setMega(false);
      });
      mega.addEventListener('focusout', (e) => {
        if (!mega.contains(e.relatedTarget) && e.relatedTarget !== megaBtn) setMega(false);
      });

      /* ---------- Mega menu categories ---------- */
      const megaCats = $$('.mega__cat');
      const showCat = (tab) => {
        megaCats.forEach((t) => {
          const on = t === tab;
          t.classList.toggle('is-active', on);
          const ctrl = $('#' + t.getAttribute('aria-controls'));
          if (ctrl) ctrl.hidden = !on;
        });
      };
      megaCats.forEach((tab, i) => {
        tab.addEventListener('mouseenter', () => showCat(tab));
        tab.addEventListener('focus', () => showCat(tab));
        tab.addEventListener('keydown', (e) => {
          const step = { ArrowDown: 1, ArrowUp: -1 }[e.key];
          if (!step) return;
          e.preventDefault();
          megaCats[(i + step + megaCats.length) % megaCats.length].focus();
        });
      });
    }

    /* ---------- Mobile drawer ---------- */
    const drawer = $('#drawer');
    const openBtn = $('#menu-open');
    const closeBtn = $('#menu-close');
    if (drawer && openBtn && closeBtn && !drawer.dataset.spInit) {
      drawer.dataset.spInit = 'true';
      const setDrawer = (open) => {
        drawer.classList.toggle('is-open', open);
        openBtn.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
        (open ? closeBtn : openBtn).focus();
      };
      openBtn.addEventListener('click', () => setDrawer(true));
      closeBtn.addEventListener('click', () => setDrawer(false));
      drawer.addEventListener('click', (e) => { if (e.target.closest('a')) setDrawer(false); });
      drawer.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setDrawer(false);
        if (e.key !== 'Tab') return;
        const f = $$('a, button', drawer).filter((el) => el.offsetParent !== null);
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      });
      $$('.drawer__item > button', drawer).forEach((btn) => {
        btn.addEventListener('click', () => {
          const open = btn.getAttribute('aria-expanded') !== 'true';
          btn.setAttribute('aria-expanded', String(open));
          const sub = $('#' + btn.getAttribute('aria-controls'));
          if (sub) sub.classList.toggle('is-open', open);
        });
      });
    }

    onScroll();
  };

  /* ==========================================================================
     Page content. Runs once per page; re-run when content is swapped.
     ========================================================================== */
  const initPage = (root = document) => {
    /* ---------- WhatsApp links ---------- */
    $$('[data-wa]', root).forEach((a) => {
      a.href = waLink(WA_DEFAULT_TEXT);
      a.target = '_blank';
      a.rel = 'noopener';
    });

    /* ---------- Accordion (one open at a time) ---------- */
    const accs = $$('.acc', root);
    accs.forEach((acc) => {
      if (acc.dataset.spInit) return;
      acc.dataset.spInit = 'true';
      const btn = $('.acc__btn', acc);
      if (btn) {
        btn.addEventListener('click', () => {
          const willOpen = !acc.classList.contains('is-open');
          accs.forEach((a) => {
            const on = a === acc && willOpen;
            a.classList.toggle('is-open', on);
            const b = $('.acc__btn', a);
            if (b) b.setAttribute('aria-expanded', String(on));
          });
        });
      }
    });

    /* ---------- FAQ accordions (any [data-faq] block; one answer open at a time) ---------- */
    $$('[data-faq]', root).forEach((faq) => {
      if (faq.dataset.spInit) return;
      faq.dataset.spInit = 'true';
      const items = $$('.faq__item', faq);
      items.forEach((item) => {
        const q = $('.faq__q', item);
        if (q) {
          q.addEventListener('click', () => {
            const willOpen = !item.classList.contains('is-open');
            items.forEach((it) => {
              const on = it === item && willOpen;
              it.classList.toggle('is-open', on);
              const b = $('.faq__q', it);
              if (b) b.setAttribute('aria-expanded', String(on));
            });
          });
        }
      });
    });

    /* ---------- Reveal + mask reveal ---------- */
    const revealEls = $$('.reveal, .mask', root);
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-in'));
    } else {
      const targets = new Map();
      revealEls.forEach((el) => {
        if (el.classList.contains('is-in')) return;
        const trigger = el.classList.contains('mask') ? el.parentElement : el;
        if (!trigger) return;
        if (!targets.has(trigger)) targets.set(trigger, []);
        targets.get(trigger).push(el);
      });
      if (targets.size > 0) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const list = targets.get(entry.target);
            if (list) list.forEach((el) => el.classList.add('is-in'));
            io.unobserve(entry.target);
          });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
        targets.forEach((_, trigger) => io.observe(trigger));
      }
    }

    /* ---------- Number counters ---------- */
    const runCounter = (el) => {
      const target = Number(el.dataset.count);
      if (reduceMotion) { el.textContent = target; return; }
      const dur = 1800;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - t, 4)));
        if (t < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0';
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          cio.unobserve(entry.target);
        });
      }, { threshold: 0.6 });
      $$('[data-count]', root).forEach((el) => {
        if (!el.dataset.spCounted) {
          el.dataset.spCounted = 'true';
          cio.observe(el);
        }
      });
    }

    /* ---------- Machinery collage: gentle 3D tilt toward the pointer ---------- */
    if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      $$('.collage__tile', root).forEach((tile) => {
        if (tile.dataset.spInit) return;
        tile.dataset.spInit = 'true';
        tile.addEventListener('pointermove', (e) => {
          const r = tile.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          tile.style.setProperty('--ry', `${(x * 6).toFixed(2)}deg`);
          tile.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
        });
        tile.addEventListener('pointerleave', () => { tile.style.removeProperty('--rx'); tile.style.removeProperty('--ry'); });
      });
    }

    /* ---------- Background video: muted loop, only plays while on screen ---------- */
    $$('[data-bg-video]', root).forEach((video) => {
      if (video.dataset.spInit) return;
      video.dataset.spInit = 'true';
      video.muted = true;
      if (reduceMotion) { video.removeAttribute('autoplay'); video.pause(); return; }
      const start = Number(video.dataset.start) || 0;
      if (start) {
        video.loop = false;
        const toStart = () => { try { video.currentTime = start; } catch (e) {} };
        if (video.readyState >= 1) toStart(); else video.addEventListener('loadedmetadata', toStart, { once: true });
        video.addEventListener('ended', () => { toStart(); video.play().catch(() => {}); });
      }
      const play = () => { const p = video.play(); if (p) p.catch(() => {}); };
      const parts = video.dataset.parts ? video.dataset.parts.split(',') : null;
      let loading = null;
      const getPart = (u, tries = 3) => fetch(u).then((r) => { if (!r.ok) throw new Error(r.status); return r.blob(); })
        .catch((e) => (tries > 1 ? new Promise((res) => setTimeout(res, 800)).then(() => getPart(u, tries - 1)) : Promise.reject(e)));
      const loadParts = () => loading || (loading = Promise.all(parts.map((u) => getPart(u)))
        .then((blobs) => { video.src = URL.createObjectURL(new Blob(blobs, { type: 'video/mp4' })); })
        .catch(() => { loading = null; }));
      if (!('IntersectionObserver' in window)) { if (parts) loadParts().then(play); else play(); return; }
      if (parts) {
        new IntersectionObserver(([entry], obs) => { if (entry.isIntersecting) { loadParts(); obs.disconnect(); } }, { rootMargin: '900px 0px' }).observe(video);
      }
      new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) { video.pause(); return; }
        if (parts) loadParts().then(play); else play();
      }, { threshold: 0.1 }).observe(video);
    });

    parallaxEls = reduceMotion ? [] : $$('[data-parallax]', root);

    /* ---------- Quote form → WhatsApp ---------- */
    const form = $('#quote-form', root);
    if (form && !form.dataset.spInit) {
      form.dataset.spInit = 'true';
      const validate = (input) => {
        const field = input.closest('.field');
        const ok = input.value.trim().length > 1;
        if (field) {
          field.toggleAttribute('data-invalid', !ok);
          const err = $('.field__error', field);
          if (err) err.hidden = ok;
        }
        input.setAttribute('aria-invalid', String(!ok));
        return ok;
      };
      const required = $$('[required]', form);
      required.forEach((input) => input.addEventListener('blur', () => { if (input.value) validate(input); }));
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const invalid = required.filter((input) => !validate(input));
        if (invalid.length) { invalid[0].focus(); return; }
        const d = Object.fromEntries(new FormData(form));
        const text = [
          'Hello Signage Pakistan, I would like a quote.',
          `Name: ${d.name}`,
          `Phone: ${d.phone}`,
          `Sign type: ${d.type}`,
          d.city ? `City: ${d.city}` : '',
          d.message ? `Details: ${d.message}` : '',
        ].filter(Boolean).join('\n');
        window.open(waLink(text), '_blank', 'noopener');
      });
    }

    onScroll();
  };

  window.SPInitSite = initChrome;
  window.SPInitPage = initPage;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initChrome();
      initPage(document);
    });
  } else {
    initChrome();
    initPage(document);
  }
})();
