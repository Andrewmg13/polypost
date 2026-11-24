# Polypost: Lab 5 website

Files: index.html (landing page), how-it-works.html (second page), style.css, previewer.js (X-factor), chatbot.js (chatbot on both pages).

## 1. Make the video (Gemini / Veo)
Example prompt:
> A 5-second cinematic loop: a single glowing sheet of paper floats in a dark indigo space, then splits into four smaller glowing cards that fly outward, each turning into a social media post card (bird, briefcase, camera, thread icons). Coral and gold light trails. Smooth, seamless loop, no text.

Download it, rename it to exactly **hero.mp4**, and put it in the same folder as index.html.

## 2. Publish on GitHub Pages
1. github.com → New repository → name it (e.g. `polypost`) → Public → Create.
2. "uploading an existing file" → drag in ALL files (including hero.mp4) → Commit changes.
3. Settings → Pages → Source: Deploy from a branch → Branch: main, / (root) → Save.
4. Wait 1–2 minutes. Your URL: https://YOUR-USERNAME.github.io/polypost/

## 3. (Optional) Use your own Dify chatbot
In Dify (Chatbot or Chatflow app): Publish → Embed Into Site → copy the chat-bubble script.
Paste it in the marked spot in the <head> of BOTH html files. The built-in "Polly" bot hides automatically.
