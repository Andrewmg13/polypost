// ===== X-Factor: Live multi-platform post previewer =====
(function () {
  const draftEl = document.getElementById('draft');
  const out = document.getElementById('previews');
  if (!draftEl || !out) return;

  let tone = 'friendly';
  let plats = new Set(['x', 'linkedin']);
  let seed = 0;

  const PLATFORMS = {
    x:         { name: 'X / Twitter', limit: 280,  color: '#111',    handle: '@polypost' },
    linkedin:  { name: 'LinkedIn',    limit: 3000, color: '#0a66c2', handle: 'Polypost · Company' },
    instagram: { name: 'Instagram',   limit: 2200, color: '#d62976', handle: 'polypost.app' },
    threads:   { name: 'Threads',     limit: 500,  color: '#333',    handle: '@polypost' }
  };

  const OPENERS = {
    friendly:     ['Big news! 🎉', 'Guess what? 👀', 'Some happy news to share 💛'],
    professional: ['Announcement:', 'Today we are pleased to share an update.', 'An update for our community:'],
    hype:         ['🚨 IT\'S HERE 🚨', 'LET\'S GOOO 🚀', 'This changes everything 🔥']
  };
  const QUESTIONS = [
    'What slows your team down the most: drafting, editing, or approvals?',
    'How many hours a week does your team spend rewriting posts?',
    'Which platform is hardest for you to write for?'
  ];
  const STOP = new Set('the a an and or but to of for in on with that this we our you your is are was were it its be just new helps help at by from as'.split(' '));

  const pick = (arr) => arr[seed % arr.length];
  const clean = (s) => s.trim().replace(/\s+/g, ' ');
  const sentence = (s) => { s = clean(s); return s && !/[.!?]$/.test(s) ? s + '.' : s; };

  function hashtags(text, n) {
    const words = (text.toLowerCase().match(/[a-z][a-z0-9]{3,}/g) || []).filter(w => !STOP.has(w));
    const uniq = [...new Set(words)].slice(0, n);
    return uniq.map(w => '#' + w.charAt(0).toUpperCase() + w.slice(1));
  }

  function build(p, d) {
    const open = pick(OPENERS[tone]);
    const q = pick(QUESTIONS);
    if (!d) return '';
    switch (p) {
      case 'x': {
        let t = `${open} ${d}\n\n${q} ${hashtags(d, 2).join(' ')}`;
        return t.length > 280 ? t.slice(0, 277) + '…' : t;
      }
      case 'linkedin':
        return `${open}\n\n${d}\n\nWhy it matters: teams shouldn't have to rewrite the same message five times. We'd love to hear from people doing this at scale.\n\n${q}\n\n${hashtags(d, 4).concat('#Productivity').join(' ')}`;
      case 'instagram':
        return `${open} ✨\n\n${d}\n\n👉 Link in bio to learn more\n💬 ${q}\n.\n.\n${hashtags(d, 6).concat('#ContentCreator', '#SmallBusiness').join(' ')}`;
      case 'threads':
        return `${open} ${d}\n\nreal talk: ${q.charAt(0).toLowerCase() + q.slice(1)}`;
    }
  }

  function render() {
    const d = sentence(draftEl.value);
    out.innerHTML = '';
    if (!d || plats.size === 0) {
      out.innerHTML = '<div class="empty">Type a draft and pick at least one platform to see previews ✍️</div>';
      return;
    }
    plats.forEach(p => {
      const cfg = PLATFORMS[p];
      const text = build(p, d);
      const pct = Math.min(100, (text.length / cfg.limit) * 100);
      const barColor = pct > 90 ? '#ff6b5b' : pct > 60 ? '#ffc857' : '#4cd4a0';
      const card = document.createElement('div');
      card.className = 'post';
      card.innerHTML = `
        <div class="post-head">
          <div class="avatar" style="background:${cfg.color}">P</div>
          <div class="who">Polypost<small>${cfg.handle}</small></div>
          <span class="plat" style="background:${cfg.color}">${cfg.name}</span>
        </div>
        <div class="post-body"></div>
        <div class="post-foot">
          <span>${text.length} / ${cfg.limit} chars</span>
          <div class="meter"><span style="width:${pct}%;background:${barColor}"></span></div>
          <button class="copy">Copy</button>
        </div>`;
      card.querySelector('.post-body').textContent = text;
      card.querySelector('.copy').onclick = (e) => {
        navigator.clipboard && navigator.clipboard.writeText(text);
        e.target.textContent = 'Copied ✓';
        setTimeout(() => (e.target.textContent = 'Copy'), 1400);
      };
      out.appendChild(card);
    });
  }

  document.getElementById('tones').addEventListener('click', e => {
    const b = e.target.closest('[data-tone]'); if (!b) return;
    document.querySelectorAll('#tones .chip').forEach(c => c.classList.remove('on'));
    b.classList.add('on'); tone = b.dataset.tone; render();
  });
  document.getElementById('plats').addEventListener('click', e => {
    const b = e.target.closest('[data-plat]'); if (!b) return;
    b.classList.toggle('on');
    b.classList.contains('on') ? plats.add(b.dataset.plat) : plats.delete(b.dataset.plat);
    render();
  });
  document.getElementById('shuffle').addEventListener('click', () => { seed++; render(); });
  draftEl.addEventListener('input', render);
  render();
})();
