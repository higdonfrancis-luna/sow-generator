# Statement of Work Generator and RFI Builder: a first look (video)

A 1:12 narrated overview of the tool for Adobe partners, built the same way as the Brand Visibility videos: Firefly characters, the OpenAI Echo voice, and everything else drawn and assembled in code.

**State (Nov 17 2026): a draft for Adam's review. It is not published anywhere and not linked from the tool.**

| File | What it is |
|---|---|
| `out/SOW_Generator_and_RFI_Builder_First_Look.mp4` | The draft, 1920 x 1080, 12.4 MB |
| `out/SOW_Generator_and_RFI_Builder_First_Look_web.mp4` | A lighter copy for a web page, 6.6 MB |
| `out/SOW_Generator_and_RFI_Builder_First_Look.srt` | The captions as a file (they are also drawn into the video) |

## What Adam asked for (Nov 17 2026)

- A video like the Brand Visibility ones, about 90 seconds, on the tool's most important features.
- The point of it, in his words: partners sell more Adobe when they can see the services they can deliver from what Adobe sells, which they aren't aware of today, and the money they could make from those services.
- **Who watches it:** Adobe partners. "We are giving them a heads up on what it can do." So the narration speaks to partners ("your team", "your client").
- **The name said out loud:** Statement of Work Generator and RFI Builder.
- **The money example:** approved ("money looks good"): the play Brand Visibility + Sites Optimizer and Edge Delivery Services, Typical size, $150 an hour.

The storyboard he approved is in `../mockups/nov17_overview_video/`. Its lines were written for Adobe colleagues; the lines below are the partner version he was shown before recording.

## Narration (Echo, 164 words)

| # | Scene | Starts | Echo says |
|---|---|---|---|
| 1 | The question, then the name | 0:01 | Behind every Adobe product is services work your team can deliver. Which services? How many hours? What is it worth? Here's a first look at the Statement of Work Generator and RFI Builder. |
| 2 | Pick a play | 0:13 | Pick a ready-made play, or start from your client's problem, and the Adobe products land on a canvas. |
| 3 | The services on a connection | 0:20 | Every line is a connection between two products. Click one to see the services you can deliver on it, with planning hours, each drawn from Adobe's public documentation. |
| 4 | What's inside | 0:32 | Thirty-three products. One hundred sixty-two connections. Five hundred sixty-nine services. |
| 5 | The money | 0:38 | Then enter your own hourly rate, and the hours become dollars: the build, the monthly work, and the first-year total. |
| 6 | Statement of work, then the RFI | 0:47 | One more click turns it into a statement of work on your own paper, ready to edit. Have an RFI? Drop it in for drafted answers with Adobe's sources. |
| 7 | The close | 0:58 | See the services. See what they're worth. Then put them in front of your client. The Statement of Work Generator and RFI Builder, for Adobe partners. |

"RFI" is written "R F I" for the voice (the `say` field in `script.json`); the captions keep RFI.

## Where everything on screen comes from

- **The screens** are captures of the real tool, taken by `build/capture.js` from the build on branch `claude/sow-generator-handoff-517tq8` (commit `7c9b85a`), with real clicks: the first page, the canvas of the play, the rate typed one digit at a time (the totals on screen are the tool's own at $1, $15 and $150), the connection card, the statement of work, and the RFI Builder answering the sample retail RFI from `qa/rfp_fixtures/retail_rfi.docx`. Nothing in a panel labeled "From the tool" is drawn by hand. The cursor, the red rings, the notes and the big money panel are drawn over them.
- **33 products:** the first page's "33 products to choose from" (the catalog's 34 Adobe products, with AEM Sites and its Edge Delivery form counted as one).
- **162 connections and 569 services:** counted in `canvas/catalog.json` of that build.
- **$487,200, $271,200 one-time, $18,000 a month, 13 services:** the tool's own totals for the play at Typical size and $150 an hour. The scene says it is an example and "illustrative fees, not a quote", as the tool does.
- **Characters:** the partner, Scout and Letter buddy from the Brand Visibility videos (`video/art/` on the `abv-partner-plays` branch of the warroom repository), made with Adobe Firefly. The closing frame says "Character art created with Adobe Firefly".
- **Voice:** OpenAI text-to-speech, voice `echo`, model `tts-1-hd`, speed 1.0, one recording per line, through the `warroom-assistant` worker's `/openai/tts` route (`openai_client.py`). The recordings as the worker returned them are `audio/*.mp3`.
- **Music and sound effects:** made in code by `build/make_audio.py`, as in the Brand Visibility videos. Nothing licensed.
- **Font:** Source Sans 3 (`fonts/`, SIL Open Font License).

## Rebuild

Run everything from this folder. The recipe behind these scripts is `video/Firefly_Explainer_Video_Recipe.md` on the `abv-partner-plays` branch of the warroom repository.

1. **Screens** (only when the tool changed). Serve the tool's built site and capture it:
   ```bash
   cd <a checkout of the tool's build>/site && python3 -m http.server 8765
   ```
   ```bash
   node build/capture.js http://localhost:8765 <that checkout>/qa/rfp_fixtures/retail_rfi.docx
   ```
   This rewrites `shots/*.png` and `shots/rects.json`. If a box or button moved, update the positions near the top of each scene in `anim/anim.js`.
2. **Voice** (only for a changed line; name the line's id to record just that one):
   ```bash
   python3 openai_client.py tts script.json audio s5_money
   ```
   ```bash
   for f in audio/*.mp3; do ffmpeg -v error -y -i $f -ar 48000 -ac 1 -c:a pcm_s16le ${f%.mp3}.wav; done
   ```
3. **Timing:** `python3 build/measure_speech.py`, `python3 build/align_words.py`, `python3 build/make_timeline.py`. The animation's beats and the captions follow the spoken words.
4. **Preview a moment:** `node build/preview.js <folder> 16.2 41.5` writes PNGs of those seconds.
5. **Render and mix:**
   ```bash
   node build/render_video.js out/silent.mp4 timeline
   ```
   ```bash
   python3 build/make_audio.py timeline
   ```
   ```bash
   python3 build/mux.py out/silent.mp4 build/mix_timeline.wav out/SOW_Generator_and_RFI_Builder_First_Look.mp4
   ```
   ```bash
   python3 build/mux.py out/silent.mp4 build/mix_timeline.wav out/SOW_Generator_and_RFI_Builder_First_Look_web.mp4 --web
   ```
   Then copy `captions.srt` to `out/SOW_Generator_and_RFI_Builder_First_Look.srt`.
6. **Check:** `python3 build/check.py <a checkout of the tool's build>` must end with ALL VIDEO CHECKS PASSED (57 checks: files, size, length, loudness at -16 LUFS, every spoken word in the captions, the name never split across two captions, no dashes, every number against the tool's own data, and a look at one frame of every scene).

Python needs `numpy`, `scipy`, `Pillow`, `requests` and `pocketsphinx`; Node needs Playwright with Chromium; `ffmpeg` and `ffprobe` on the path. `out/silent.mp4` and `build/mix_timeline.wav` are rebuilt each time and are not saved here.

## Files

| Path | What it is |
|---|---|
| `script.json` | The seven lines, the voice and the model |
| `audio/` | The recordings (`.mp3` as returned, `.wav` for the mix), `speech.json` (where the voice starts and stops) and `words.json` (when each word is spoken) |
| `shots/` | Captures of the tool at twice the size, and `rects.json`, the measured positions of boxes and buttons |
| `anim/` | The animation: `animate.html`, `anim.css`, `anim.js`. `window.render(t)` draws the exact frame at `t` seconds |
| `build/` | `capture.js`, `measure_speech.py`, `align_words.py`, `make_timeline.py`, `preview.js`, `render_video.js`, `make_audio.py`, `mux.py`, `check.py`, and the built `timeline.json`, `timeline.js` and `cues_timeline.json` |
| `captions.srt` | The captions |
| `art/`, `fonts/` | The characters, the Adobe logo and the font |

## For Adam to decide

- **Length.** It runs 1:12, not 1:30: Echo reads these seven lines in 60 seconds. Two more beats would bring it to about 1:30 without padding. Offered, not built: the Small, Typical and Large size switch with "change any line or add your own service"; and Create your own play with the GenStudio family.
- **Where it goes.** Nothing is published. It could play on the tool's first page, where the "Start here" card now shows the five-minute Brand Visibility video.
- **A listen.** Every word was found and timed in the recordings by a forced aligner, which confirms the words are there but is not the same as hearing them. The name and "RFI" are the two readings worth a careful listen.

## Flagged, not changed

- The tool's own masthead says "Partner services statement of work"; the video calls it the Statement of Work Generator and RFI Builder.
- This branch (`claude/upbeat-cerf-veoxip`) is built on `main`, which is older than the build the screens come from. Nothing in the tool is changed by this folder.
