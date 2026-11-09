# Libraries the RFP Builder loads in the browser (Nov 8 2026)

Shipped with the site so Adobe Proto and Netlify serve them from the same folder, with no CDN call.
Loaded only when the RFP Builder tab opens.

| File | What | Version | License |
|---|---|---|---|
| `pdf.min.mjs`, `pdf.worker.min.mjs` | Mozilla pdf.js, reads the text of a PDF in the browser | 4.10.38 | Apache 2.0 |
| `mammoth.browser.min.js` | mammoth.js, reads the text of a Word (.docx) file in the browser | 1.8.0 | BSD 2-Clause |
| `xlsx.mini.min.js` | SheetJS Community Edition (mini build), reads Excel (.xlsx, .xls) and CSV in the browser | 0.18.5 | Apache 2.0 |

Source: cdnjs.cloudflare.com, copied unchanged. `rfp_prototype/build.py` copies this folder to `rfp_prototype/site/lib/`.
