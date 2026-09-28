# SSD Tokens Tirupati (Offline) - Free static site

100% free stack: HTML/CSS/JS only. No server, no DB, no API key.

## Run locally
Just open `index.html` in browser. Or: `python -m http.server` in this folder.

## Deploy free (pick one)
1. **Cloudflare Pages (recommended):** dash.cloudflare.com > Pages > Upload folder `SSDTOKENS` > free `*.pages.dev` URL.
2. **GitHub Pages:** new repo > upload these 3 files > Settings > Pages > Deploy from branch.
3. **Vercel:** vercel.com > Add New > upload folder.

No build command. No env vars.

## Why autonomous + free works here
No live TTD API exists, so page uses IST time logic in `app.js` (`todayStatus()`).
To change timings, edit `app.js` only.
