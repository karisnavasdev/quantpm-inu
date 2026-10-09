/* ==========================================================================
   QUANTUM INU - main.js (no build step, no dependencies)
   config binding, launch-gated links/CA/chart, svg inliner (theme recolor),
   starfield particles, reveal, parallax, tilt, magnetic, marquee, gallery
   + lightbox, chart pending waves.
   ========================================================================== */
(() => {
  const S = window.SITE || {};
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => [...el.querySelectorAll(q)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = matchMedia("(hover: none)").matches;
  const launched = Boolean(S.launched);
  const sym = "$" + S.symbol;
  const tpl = (t) => String(t || "").replaceAll("{symbol}", S.symbol).replaceAll("{name}", S.name);
  const esc = (t) => String(t || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const toast = $("#toast");
  const showToast = (m) => {
    if (!toast) return;
    toast.textContent = m;
    toast.classList.add("show");
    clearTimeout(showToast.t);
    showToast.t = setTimeout(() => toast.classList.remove("show"), 2000);
  };

  /* ---------- 1. Bind config ---------- */
  const bind = {
    description: S.description,
    aboutLong: S.aboutLong,
    chainName: S.chainName,
    dexName: S.dexName,
    contract: S.contract || "0xcomingsoon",
  };
  $$("[data-bind]").forEach((el) => {
    const v = bind[el.dataset.bind];
    if (v) el.textContent = v;
    else if (el.dataset.bind === "aboutLong") el.remove();
  });
  const yr = $("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
  if (S.slots) Object.entries(S.slots).forEach(([k, src]) => {
    if (src) $$(`[data-slot="${k}"]`).forEach((img) => (img.src = src));
  });
  if (S.icons) {
    $$(".chain-icon").forEach((el) => { if (!el.dataset.svg) el.dataset.svg = S.icons.chain; });
    $$(".dex-icon").forEach((el) => (el.dataset.svg = S.icons.dex));
  }

  // links: X always live; buy gated until CA; dexscreener may be chain-only
  $$("[data-link]").forEach((el) => {
    const key = el.dataset.link;
    const url = (S.links || {})[key];
    if (key === "telegram" && !url) { el.hidden = true; return; }
    if (key === "buy" && !launched) {
      el.removeAttribute("href");
      el.classList.add("is-pending");
      el.setAttribute("aria-disabled", "true");
      el.addEventListener("click", (e) => {
        e.preventDefault();
        showToast(`${sym} has not launched yet. Stay tuned on X.`);
      });
      return;
    }
    if (url) { el.href = url; el.hidden = false; el.classList.remove("is-pending"); return; }
    el.removeAttribute("href");
    el.classList.add("is-pending");
    el.setAttribute("aria-disabled", "true");
    el.addEventListener("click", (e) => {
      e.preventDefault();
      showToast(`${sym} has not launched yet. Stay tuned on X.`);
    });
  });

  // pending CA box
  $$("[data-copy-ca]").forEach((box) => {
    if (!launched) box.classList.add("is-pending");
  });

  // stats
  const stats = $("[data-stats]");
  if (stats && S.stats) {
    stats.innerHTML = S.stats.map((s) => `<div class="stat"><b>${esc(s.value)}</b><small>${esc(s.label)}</small></div>`).join("");
  }

  // steps
  const steps = $("[data-steps]");
  if (steps && S.steps) {
    steps.innerHTML = S.steps.map((st, i) => `
      <article class="step reveal tilt-soft" data-delay="${i * 120}">
        <div class="step-media">
          ${st.img ? `<img src="${st.img}" alt="" loading="lazy" width="1280" height="720">` : ""}
          <span class="step-num">step 0${i + 1}</span>
          <span class="step-icon">${st.icon ? `<span class="svg-icon" data-svg="${st.icon}" data-mono></span>` : (S.icons && S.icons.dex ? `<span class="svg-icon" data-svg="${S.icons.dex}" data-mono></span>` : "")}</span>
        </div>
        <div class="step-body"><h3>${esc(tpl(st.title))}</h3><p>${esc(tpl(st.text))}</p></div>
      </article>`).join("");
  }

  const partners = $("[data-partners]");
  if (partners) {
    const list = S.partners || [
      S.icons && S.icons.chain,
      S.icons && S.icons.wallet,
      S.icons && S.icons.dex,
      "assets/icons/dexscreener.svg",
      "assets/icons/x.svg",
    ].filter(Boolean);
    partners.innerHTML = list.map((p) => `<span class="svg-icon" data-svg="${p}" data-mono></span>`).join("");
  }

  // marquee
  const mq = $("[data-marquee]");
  if (mq) {
    const words = S.marquee || [S.name, sym];
    const run = Array(4).fill(words).flat().map((w) => `<span>${esc(w)}</span>`).join("");
    mq.innerHTML = run + run;
  }

  // gallery + lightbox
  const gal = $("[data-gallery]");
  const items = (S.gallery || []).map((g) => (typeof g === "string" ? { src: g } : g));
  if (gal && items.length) {
    gal.innerHTML = items.map((it, i) => `
      <figure class="g-item reveal tilt-soft" data-delay="${(i % 4) * 90}" data-index="${i}" tabindex="0" role="button" aria-label="Open ${esc(it.caption || "image")}">
        <img src="${it.src}" alt="${esc(it.caption || S.name)}" loading="lazy" width="1280" height="720">
        ${it.caption ? `<figcaption><b>${esc(it.caption)}</b>${it.text ? `<small>${esc(it.text)}</small>` : ""}</figcaption>` : ""}
      </figure>`).join("");
  }
  const lb = $("#lightbox"), lbImg = $("#lb-img"), lbCap = $("#lb-cap");
  let lbIdx = 0;
  function openLb(i) {
    if (!lb || !items.length) return;
    lbIdx = (i + items.length) % items.length;
    const it = items[lbIdx];
    lbImg.style.animation = "none";
    void lbImg.offsetWidth;
    lbImg.style.animation = "";
    lbImg.src = it.src;
    lbImg.alt = it.caption || S.name;
    lbCap.innerHTML = `${it.caption ? `<b>${esc(it.caption)}</b>` : ""}${esc(it.text || "")}`;
    if (lb.hidden) {
      lb.hidden = false;
      requestAnimationFrame(() => lb.classList.add("open"));
      document.body.style.overflow = "hidden";
    }
  }
  function closeLb() {
    if (!lb) return;
    lb.classList.remove("open");
    setTimeout(() => (lb.hidden = true), 300);
    document.body.style.overflow = "";
  }
  if (lb && gal) {
    gal.addEventListener("click", (e) => { const f = e.target.closest(".g-item"); if (f) openLb(+f.dataset.index); });
    gal.addEventListener("keydown", (e) => {
      const f = e.target.closest(".g-item");
      if (f && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openLb(+f.dataset.index); }
    });
    $(".lb-close", lb)?.addEventListener("click", closeLb);
    $(".lb-prev", lb)?.addEventListener("click", () => openLb(lbIdx - 1));
    $(".lb-next", lb)?.addEventListener("click", () => openLb(lbIdx + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
    addEventListener("keydown", (e) => {
      if (lb.hidden) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") openLb(lbIdx - 1);
      if (e.key === "ArrowRight") openLb(lbIdx + 1);
    });
  }

  // floaters
  const fl = $(".hero-floaters");
  if (fl && S.floaters && S.floaters.length) {
    const spots = [[6, 18], [84, 14], [10, 72], [80, 70], [46, 8], [50, 86]];
    fl.innerHTML = S.floaters.map((f, i) => {
      const it = typeof f === "string" ? { src: f } : f;
      const [x, y] = spots[i % spots.length];
      return `<img src="${it.src}" alt="" style="left:${x}%;top:${y}%;animation:floatY ${6 + (i % 4)}s ease-in-out ${-i}s infinite" data-parallax="${0.05 + (i % 3) * 0.05}">`;
    }).join("");
  }

  // chart
  const ifr = $("#dexscreener-embed"), pending = $("#chart-pending");
  if (ifr && S.dexscreenerEmbed) {
    if (pending) pending.remove();
    ifr.hidden = false;
    const io = new IntersectionObserver((e) => {
      if (e[0].isIntersecting) { ifr.src = S.dexscreenerEmbed; io.disconnect(); }
    }, { rootMargin: "400px" });
    io.observe(ifr);
  } else if (pending && !reduced) {
    const pa = $("#wave-a"), pb = $("#wave-b");
    let t = 0;
    const wave = (ph, k, amp) => {
      let d = "M0 60";
      for (let x = 0; x <= 600; x += 6) {
        d += ` L${x} ${(60 + Math.sin(x * k + ph) * amp * Math.sin((x / 600) * Math.PI)).toFixed(1)}`;
      }
      return d;
    };
    (function loop() {
      t += 0.035;
      if (pa) pa.setAttribute("d", wave(t, 0.03, 40));
      if (pb) pb.setAttribute("d", wave(-t * 1.3, 0.022, 34));
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- 2. SVG inliner ---------- */
  const svgCache = {};
  async function inlineSvgs(root = document) {
    for (const el of $$("[data-svg]", root)) {
      const src = el.dataset.svg;
      if (!src || el.dataset.done) continue;
      try {
        svgCache[src] = svgCache[src] || fetch(src).then(async (r) => {
          if (!r.ok) throw new Error("missing");
          const body = await r.text();
          if (!/<svg[\s>]/i.test(body)) throw new Error("not svg");
          return body;
        });
        let txt = await svgCache[src];
        txt = txt.replace(/<\?xml[^>]*>/, "").replace(/<title>.*?<\/title>/s, "");
        if (el.hasAttribute("data-mono") && !/metamask/i.test(src)) {
          txt = txt.split(/(<mask[\s\S]*?<\/mask>)/).map((part) =>
            part.startsWith("<mask") ? part :
              part.replace(/(fill|stroke|stop-color|flood-color)="(?!none)[^"]*"/g, '$1="currentColor"')
                  .replace(/(fill|stroke|stop-color):\s*(?!none)[^;"]+/g, "$1:currentColor")
          ).join("").replace(/<svg(?![^>]*\sfill=)/, '<svg fill="currentColor"');
        }
        const uid = "s" + Math.random().toString(36).slice(2, 7);
        txt = txt.replace(/id="([^"]+)"/g, `id="${uid}-$1"`)
                 .replace(/url\(#([^)]+)\)/g, `url(#${uid}-$1)`)
                 .replace(/href="#([^"]+)"/g, `href="#${uid}-$1"`);
        el.innerHTML = txt;
        el.dataset.done = "1";
      } catch (e) { /* ignore */ }
    }
  }
  inlineSvgs();

  /* ---------- 3. Copy CA ---------- */
  $$("[data-copy-ca]").forEach((box) => {
    const btn = $(".ca-copy", box);
    const ca = bind.contract;
    btn && btn.addEventListener("click", async () => {
      if (!launched || ca === "Coming soon") return showToast("Contract coming soon");
      try { await navigator.clipboard.writeText(ca); }
      catch {
        const t = document.createElement("textarea");
        t.value = ca; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove();
      }
      btn.textContent = "Copied";
      showToast("Contract address copied");
      setTimeout(() => (btn.textContent = "Copy"), 1600);
    });
  });

  /* ---------- 4. Nav ---------- */
  const nav = $("#nav"), links = $("#nav-links"), tog = $("#nav-toggle");
  tog && tog.addEventListener("click", () => links.classList.toggle("open"));
  $$("#nav-links a").forEach((a) => a.addEventListener("click", () => links.classList.remove("open")));

  /* ---------- 5. Scroll ---------- */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const d = +e.target.dataset.delay || 0;
        setTimeout(() => e.target.classList.add("in"), d);
        revealIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  const observeReveals = () => $$(".reveal:not(.in)").forEach((el) => revealIO.observe(el));
  observeReveals();

  const prog = $(".scroll-progress");
  let ticking = false;
  function onScroll() {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    nav && nav.classList.toggle("scrolled", y > 20);
    if (prog) prog.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    if (!reduced) $$("[data-parallax]").forEach((el) => { el.style.translate = `0 ${y * +el.dataset.parallax}px`; });
    ticking = false;
  }
  addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  /* ---------- 6. Tilt + magnetic ---------- */
  function attachTilt(root = document) {
    if (touch || reduced) return;
    $$(".tilt, .tilt-soft", root).forEach((el) => {
      if (el.dataset.tilt) return;
      el.dataset.tilt = "1";
      const max = el.classList.contains("tilt-soft") ? 5 : 12;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${-py * max}deg) rotateY(${px * max}deg) scale(1.02)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
    $$(".magnetic", root).forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }
  attachTilt();
  observeReveals();

  /* ---------- 7. Cursor glow ---------- */
  const glow = $(".cursor-glow");
  if (glow && !touch) {
    addEventListener("pointermove", (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    }, { passive: true });
  }

  /* ---------- 8. Starfield particle canvas ---------- */
  const cv = $("#fx-canvas");
  if (cv && !reduced) {
    const ctx = cv.getContext("2d");
    const cfg = Object.assign({ count: 90, shape: "star", linkDistance: 100, speed: 0.28 }, S.particles || {});
    const css = getComputedStyle(document.documentElement);
    const colors = ["--primary", "--accent", "--accent-2", "--star"]
      .map((v) => css.getPropertyValue(v).trim()).filter(Boolean);
    let W, H, DPR, P = [];
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      DPR = Math.min(devicePixelRatio || 1, 2);
      W = cv.width = innerWidth * DPR;
      H = cv.height = innerHeight * DPR;
      const n = Math.round(cfg.count * Math.min(1, innerWidth / 1200) + 24);
      P = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * cfg.speed * DPR,
        vy: (Math.random() - 0.5) * cfg.speed * DPR,
        r: (Math.random() * 1.8 + 0.5) * DPR,
        c: colors[(Math.random() * colors.length) | 0],
        a: Math.random() * Math.PI * 2,
      }));
    }

    function star(x, y, r) {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const rr = i % 2 ? r : r * 2.4;
        const a = (i * Math.PI) / 5 - Math.PI / 2;
        ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
      }
      ctx.closePath();
      ctx.fill();
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);
      const ld = cfg.linkDistance * DPR;
      for (const p of P) {
        const dx = p.x - mouse.x * DPR, dy = p.y - mouse.y * DPR, d2 = dx * dx + dy * dy;
        if (d2 < 14400 * DPR * DPR) {
          const f = 0.55 / Math.sqrt(d2 + 1);
          p.vx += dx * f * 0.04;
          p.vy += dy * f * 0.04;
        }
        p.vx *= 0.99; p.vy *= 0.99;
        p.x += p.vx + Math.sin((p.a += 0.01)) * 0.12;
        p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.fillStyle = p.c;
        ctx.globalAlpha = 0.85;
        if (cfg.shape === "star") star(p.x, p.y, p.r);
        else { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); }
      }
      if (ld > 0) {
        ctx.lineWidth = DPR * 0.55;
        for (let i = 0; i < P.length; i++) {
          for (let j = i + 1; j < P.length; j++) {
            const a = P[i], b = P[j];
            const dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
            if (d < ld) {
              ctx.globalAlpha = (1 - d / ld) * 0.22;
              ctx.strokeStyle = a.c;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    }

    addEventListener("resize", resize);
    addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    resize();
    tick();
  }
})();
