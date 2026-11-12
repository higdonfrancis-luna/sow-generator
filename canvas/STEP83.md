# Step 83: the plays video opens the first page (Nov 12 2026)

Adam: "I want this video to be front and center on the first page you come to because in the first page ... you're
gonna look to put into place the sales plays ... the best compliment to those sales plays is this video
https://proto.adobe.io/Brand-Visibilty-Plays/". Two placements were drawn (`sow/mockups/nov12_video_front/`); he chose
"B" and added "it's also here https://abvfirefly.netlify.app/".

## What a partner sees

The first page opens with a box the same width as the one below it: the video's poster on the left; on the right
"Start here", "Watch the four Brand Visibility partner plays", one sentence ("Five minutes on what each play sells, who
it is for and the services partners deliver. Then pick a play below and build its statement of work.") and a red Watch
the video button. A click on the picture or the button puts the player in the picture's place and plays it, with the
browser's controls (full screen included). Start from your client's problem, the play cards and the RFI door follow as
before. On a phone the picture sits above the words.

## How it works

- The video file is **not in the site** and not in the zip. It is played from Adam's video site,
  `https://abvfirefly.netlify.app/brand-visibility-four-plays-coworker-cd091098.mp4` (`VIDEO_URL` in
  `sow/canvas/template.html`, 20 MB, 5:15, 1920 wide). Nothing is fetched until the partner clicks.
- The poster is in the page (`sow/video_poster.jpg`, 66 KB, a smaller copy of the video page's poster, put in by
  `build.py` as `{{VIDEO_POSTER}}`).
- Where the file cannot play, a line appears: "The video could not play here. Open the video page", linking to
  abvfirefly.netlify.app in a new tab.
- `sow/canvas/patch_step83.py`; `node sow/test_step83.js` (18, the file's request answered by the test). Played for
  real from the built page on Nov 12: it started and ran. Picture: `sow/mockups/nov12_video_front/built_first_page.png`.

## To know

- **If the video is replaced on abvfirefly.netlify.app under a new file name, `VIDEO_URL` must change with it**, or the
  first page shows the "could not play" line. The file's name carries a code (`cd091098`) that changes with each new
  video build.
- The first page depends on that Netlify site staying up. The copy on Proto (proto.adobe.io/Brand-Visibilty-Plays/)
  could not be opened from this session; if its video file has a stable address, `VIDEO_URL` can point there instead.
- Not tested from here: whether Proto's own settings let a page play video from another site. If they do not, the
  "could not play" line and its link are what a partner would see.

## Step 84: Jump to, Next and full screen (Nov 12)

Adam, with a picture of his video page: "we don't have the jump to on our video ... We need that for the video on our
SOW generator as well."

- The first page's player is now the video page's own: **Jump to** opens the list of the video's eight parts with their
  times (Intro, CJA, Coworker in CJA, Commerce, BV + Sites Optimizer + EDS, Coworker in AEM, FSI, Coworker for FSI), the
  part playing is marked in red, **Next** names the part after it, and a **full screen** button takes the video and its
  buttons together. The buttons show while the video is paused and for a few seconds after the pointer moves, as there.
- When the video starts, it widens from the left half of the card to the card's whole width (about 1,030 pixels), so
  the list opens inside the picture as on the video page; the headline and the button give way to it. On a phone the
  list opens as a sheet at the foot of the screen.
- The look and the behaviour are carried over from `exec/build_web_coworker.py` on the `abv-partner-plays` branch. The
  parts and their times are `VIDEO_PARTS` in `sow/canvas/template.html`, copied from that page's `chapters.vtt`.
  **A new cut of the video needs both `VIDEO_URL` and `VIDEO_PARTS` updated.**
- `sow/canvas/patch_step84.py`; `node sow/test_step83.js` (23). Played for real from the built page: the video ran,
  Jump to opened, a jump to Commerce landed at 1:58 with Commerce marked and Next naming the part after it. Pictures:
  `sow/mockups/nov12_video_front/built_jump_open.png`, `built_jump_commerce.png`.
