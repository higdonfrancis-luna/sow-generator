# The SOW tool in 90 seconds: proposal (Nov 18 2026)

Adam's ask (Nov 18): a video like the Brand Visibility ones (Firefly characters, OpenAI Echo voice, the rest built in code), about 90 seconds, showing the tool's most important features. The punchline, in his words: this is how we get partners to sell more of our technology, by showing them the services they can deploy from what we sell, which they aren't aware of today, and the money they could make from those services. That is what will compel them to sell more Adobe.

**State: proposed. Nothing is recorded, rendered or built. Waiting for Adam's yes on the script and the storyboard.**

## Pictures

- `storyboard.png`: all seven scenes with the narration under each.
- `frame1.png` to `frame7.png`: each scene at video size (1920 x 1080).

The screens in the frames are the real tool, captured from the newest saved build (branch `claude/sow-generator-handoff-517tq8`, commit `7c9b85a`). The characters are the ones from the Brand Visibility videos (`video/art/` on the `abv-partner-plays` branch of the warroom repository): the partner, Scout and Letter buddy.

## Narration (Echo, about 176 words, about 1:28)

| # | Scene | About | Echo says |
|---|---|---|---|
| 1 | The problem | 0:00 to 0:14 | Partners sell what they know how to deliver. Today, most can't see the services behind Adobe's newest products, or what that work is worth. So those products don't get pitched. |
| 2 | Pick a play | 0:14 to 0:24 | This tool changes that. A partner picks a play, or starts from their client's problem, and the Adobe products land on a canvas. |
| 3 | The services on every connection | 0:24 to 0:38 | Every line is a connection between two products. Click one, and there are the services a partner can deliver on it, with hours, each drawn from Adobe's public documentation. |
| 4 | How much is in there | 0:38 to 0:45 | Thirty-three products. One hundred sixty-two connections. Five hundred sixty-nine services. |
| 5 | The money | 0:45 to 0:57 | Then comes the number. The partner enters their own hourly rate, and the hours become dollars: the build, the monthly work, and the first-year total. |
| 6 | Statement of work and RFI | 0:57 to 1:09 | One more click makes it a statement of work on the partner's own paper. Got an RFI? Drop it in for drafted answers with Adobe's sources. |
| 7 | The punchline | 1:09 to 1:28 | That's why we think this works. When partners can see the services, and the money, behind every Adobe product, they have a reason to sell more Adobe. |

The times are estimates from Echo's pace in the Brand Visibility videos (463 words in 3:22). The real times come from the recordings.

## Where the numbers come from

- **33 products:** the first page's "33 products to choose from" on Create your own play.
- **162 connections, 569 services:** counted in `canvas/catalog.json` of the build above.
- **$487,200:** the tool's own total for the play Brand Visibility + Sites Optimizer and Edge Delivery Services at Typical size and $150 an hour: $271,200 one-time (1,808 hours) plus $18,000 a month (120 hours) for 12 months, 13 services. On screen it is labeled an example and "illustrative fees, not a quote", as the tool says.

## How it would be built

The same pipeline as the Brand Visibility videos (`video/Firefly_Explainer_Video_Recipe.md` on the `abv-partner-plays` branch of the warroom repository):

1. Record the seven lines in Echo (`tts-1-hd`) through the `warroom-assistant` worker's `/openai/tts` route, one recording per line.
2. Measure the speech and time the captions and animation to the spoken words.
3. Record the tool's screens with real clicks, and animate them with the characters on a 1920 x 1080 stage.
4. Music and sound effects made in code, mixed to the same loudness as the other videos.
5. Checks, then a draft MP4 for Adam. Nothing goes on a website until he says deploy.

The cloud environment `sow-generator` allows the worker's address since Nov 18 (Adam approved it). The connection itself is not tested yet: the first call waits for his yes on the script.

## Open questions for Adam

1. Who watches it: Adobe colleagues and leaders (the script says "we" and "partners"), or partners themselves (the last line would speak to "you")?
2. What to call the tool out loud. The frames say "Partner SOW Generator"; the tool's own masthead says "Partner services statement of work".
3. Which money example to show. The frames use Brand Visibility + Sites Optimizer and Edge Delivery Services at $150 an hour.
4. Whether the screens should come from this saved build or from a newer one he has live.
