// ===== "Polly" — Polypost's built-in chat assistant (used on every page) =====
// Works with no setup. If you paste a Dify embed snippet into a page's <head>,
// this built-in bot hides itself and Dify's chat bubble is used instead.
(function () {
  if (window.difyChatbotConfig) return; // Dify chatbot present → let Dify handle chat

  const KB = [
    { k: ['hi', 'hello', 'hey', 'yo', 'good morning', 'good afternoon'],
      a: "Hi there! 👋 I'm Polly, Polypost's assistant. Ask me about features, pricing, platforms, languages or how the AI works." },
    { k: ['what is', 'what does', 'about', 'polypost', 'explain'],
      a: 'Polypost turns one draft into ready-to-post content for every platform. You write the idea once; we create a short X/Twitter post, a story-style LinkedIn post, an Instagram caption and more, all in your brand voice.' },
    { k: ['how', 'work', 'workflow', 'process', 'steps', 'dify'],
      a: 'Behind the scenes it is an AI workflow: (1) read your draft and any files, (2) figure out which platforms you want, (3) combine all the key facts, (4) learn each platform\'s style, and (5) write a post for each one in parallel. The "How it works" page walks through every step.' },
    { k: ['price', 'pricing', 'cost', 'plan', 'pay', 'free', 'subscription', 'how much'],
      a: 'We have 3 plans: Starter is free (2 platforms, 20 posts/month), Team is $29/month (all platforms, unlimited posts, brand voice), and Agency is $99/month (multiple brands, approvals, API). See the "How it works" page for details.' },
    { k: ['platform', 'twitter', 'linkedin', 'instagram', 'threads', 'facebook', 'tiktok', ' x '],
      a: 'Today Polypost writes for X/Twitter, LinkedIn, Instagram, Threads and Facebook. TikTok captions and YouTube descriptions are next on our roadmap.' },
    { k: ['language', 'spanish', 'chinese', 'french', 'translate'],
      a: 'Yes! Pick a language and every post is written natively in it: English, Spanish, Chinese, French, German, Japanese and more.' },
    { k: ['file', 'upload', 'pdf', 'image', 'document', 'screenshot'],
      a: 'You can upload up to 10 files, like a press release, PDF, slide or product screenshot. Polypost extracts the key facts and uses them in every post.' },
    { k: ['tone', 'voice', 'brand', 'style'],
      a: 'Describe your voice once, for example "friendly and enthusiastic, but professional", and every post matches it. Try the tone buttons in the live demo on the home page!' },
    { k: ['secure', 'privacy', 'data', 'safe', 'confidential'],
      a: 'Your drafts and files are only used to create your posts. They are never used to train models and you can delete them anytime.' },
    { k: ['demo', 'try', 'preview', 'test'],
      a: 'Scroll to "See your post on every platform" on the home page. Type anything and watch the previews update live!' },
    { k: ['contact', 'email', 'support', 'help', 'human'],
      a: 'You can reach the team at hello@polypost.app. We usually reply within one business day.' },
    { k: ['thank', 'thanks', 'awesome', 'cool', 'great'],
      a: "You're welcome! 😊 Anything else I can help with?" },
    { k: ['bye', 'goodbye', 'see you'],
      a: 'Bye! Happy posting 🚀' }
  ];
  const FALLBACK = "Good question! I'm a simple assistant, so try asking about features, pricing, platforms, languages, file uploads or how the AI workflow works.";
  const SUGGEST = ['What is Polypost?', 'How does it work?', 'Pricing', 'Which platforms?'];

  function answer(q) {
    const s = ' ' + q.toLowerCase() + ' ';
    let best = null, score = 0;
    KB.forEach(item => {
      const sc = item.k.filter(k => s.includes(k)).length;
      if (sc > score) { score = sc; best = item; }
    });
    return best ? best.a : FALLBACK;
  }

  const css = `
  .pb-launch{position:fixed;right:24px;bottom:24px;z-index:9999;width:62px;height:62px;border-radius:50%;border:none;cursor:pointer;
    background:linear-gradient(135deg,#6c5ce7,#ff6b5b);color:#fff;font-size:28px;box-shadow:0 10px 30px rgba(108,92,231,.45);transition:transform .2s}
  .pb-launch:hover{transform:scale(1.08)}
  .pb-launch .ping{position:absolute;top:4px;right:4px;width:14px;height:14px;border-radius:50%;background:#ffc857;border:2px solid #fff}
  .pb-win{position:fixed;right:24px;bottom:100px;z-index:9999;width:360px;max-width:calc(100vw - 32px);height:500px;max-height:calc(100vh - 130px);
    background:#fff;border-radius:22px;box-shadow:0 20px 60px rgba(20,18,43,.3);display:none;flex-direction:column;overflow:hidden;font-family:"DM Sans",system-ui,sans-serif}
  .pb-win.open{display:flex;animation:pbIn .25s ease}
  @keyframes pbIn{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}
  .pb-top{background:linear-gradient(135deg,#2b2770,#6c5ce7);color:#fff;padding:16px 18px;display:flex;align-items:center;gap:12px}
  .pb-top .av{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.18);display:grid;place-items:center;font-size:20px}
  .pb-top b{display:block}.pb-top small{opacity:.8}
  .pb-top button{margin-left:auto;background:none;border:none;color:#fff;font-size:22px;cursor:pointer}
  .pb-msgs{flex:1;overflow-y:auto;padding:16px;background:#f7f5ff;display:flex;flex-direction:column;gap:10px}
  .pb-m{max-width:82%;padding:10px 14px;border-radius:16px;font-size:.93rem;line-height:1.45;color:#1a1830}
  .pb-m.bot{background:#fff;align-self:flex-start;border-bottom-left-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.05)}
  .pb-m.me{background:#6c5ce7;color:#fff;align-self:flex-end;border-bottom-right-radius:4px}
  .pb-typing{display:inline-flex;gap:4px}.pb-typing i{width:7px;height:7px;border-radius:50%;background:#b9b5e0;animation:pbB 1s infinite}
  .pb-typing i:nth-child(2){animation-delay:.15s}.pb-typing i:nth-child(3){animation-delay:.3s}
  @keyframes pbB{0%,60%,100%{transform:none}30%{transform:translateY(-5px)}}
  .pb-sugg{display:flex;gap:6px;flex-wrap:wrap;padding:8px 12px 0;background:#fff}
  .pb-sugg button{border:1.5px solid #e2dff5;background:#fff;border-radius:99px;padding:5px 11px;font:inherit;font-size:.8rem;cursor:pointer;color:#2b2770}
  .pb-sugg button:hover{background:#6c5ce7;color:#fff;border-color:#6c5ce7}
  .pb-form{display:flex;gap:8px;padding:12px;background:#fff}
  .pb-form input{flex:1;border:1.5px solid #e2dff5;border-radius:99px;padding:10px 14px;font:inherit;outline:none}
  .pb-form input:focus{border-color:#6c5ce7}
  .pb-form button{border:none;background:#ff6b5b;color:#fff;border-radius:50%;width:42px;height:42px;font-size:18px;cursor:pointer}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const launch = document.createElement('button');
  launch.className = 'pb-launch'; launch.setAttribute('aria-label', 'Open chat'); launch.innerHTML = '💬<span class="ping"></span>';
  const win = document.createElement('div');
  win.className = 'pb-win';
  win.innerHTML = `
    <div class="pb-top"><div class="av">🤖</div><div><b>Polly</b><small>Polypost assistant · online</small></div><button aria-label="Close">×</button></div>
    <div class="pb-msgs"></div>
    <div class="pb-sugg">${SUGGEST.map(s => `<button>${s}</button>`).join('')}</div>
    <form class="pb-form"><input placeholder="Ask me anything…" aria-label="Message"><button type="submit">➤</button></form>`;
  document.body.append(launch, win);

  const msgs = win.querySelector('.pb-msgs');
  const input = win.querySelector('input');
  function add(text, who) {
    const m = document.createElement('div'); m.className = 'pb-m ' + who; m.textContent = text;
    msgs.appendChild(m); msgs.scrollTop = msgs.scrollHeight; return m;
  }
  function send(text) {
    text = text.trim(); if (!text) return;
    add(text, 'me'); input.value = '';
    const t = document.createElement('div'); t.className = 'pb-m bot';
    t.innerHTML = '<span class="pb-typing"><i></i><i></i><i></i></span>';
    msgs.appendChild(t); msgs.scrollTop = msgs.scrollHeight;
    setTimeout(() => { t.textContent = answer(text); msgs.scrollTop = msgs.scrollHeight; }, 650 + Math.random() * 500);
  }
  let greeted = false;
  function toggle() {
    win.classList.toggle('open');
    launch.querySelector('.ping') && launch.querySelector('.ping').remove();
    if (!greeted) { greeted = true; add("Hi! 👋 I'm Polly. Ask me anything about Polypost, or tap a suggestion below.", 'bot'); }
    if (win.classList.contains('open')) input.focus();
  }
  launch.onclick = toggle;
  win.querySelector('.pb-top button').onclick = toggle;
  win.querySelector('.pb-form').onsubmit = e => { e.preventDefault(); send(input.value); };
  win.querySelectorAll('.pb-sugg button').forEach(b => b.onclick = () => send(b.textContent));
})();
