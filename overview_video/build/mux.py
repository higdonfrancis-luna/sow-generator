"""Join the silent render and the soundtrack into the final MP4, with loudness
normalized to -16 LUFS (two-pass loudnorm), AAC audio and fast-start for web playback.

    python3 build/mux.py <silent.mp4> <mix.wav> <out.mp4> [--web]

--web makes the lighter copy for the watch page: the video is re-encoded at CRF 24 and the
audio at 128 kbps, which keeps the full video under Netlify's 10 MB guidance per file.
Without it the video stream is copied as rendered and the audio is 192 kbps.
"""
import json
import subprocess
import sys


def run(args):
    return subprocess.run(args, check=True, capture_output=True, text=True)


def main():
    video, audio, out = sys.argv[1:4]
    web = '--web' in sys.argv[4:]
    # pass 1: measure
    r = run(['ffmpeg', '-hide_banner', '-nostats', '-i', audio, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'])
    m = json.loads(r.stderr[r.stderr.rfind('{'):r.stderr.rfind('}') + 1])
    norm = (f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
            f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    # pass 2: apply and mux
    vcodec = ['-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p'] if web else ['-c:v', 'copy']
    run(['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-i', video, '-i', audio, '-map', '0:v:0', '-map', '1:a:0'] + vcodec +
        ['-af', norm, '-c:a', 'aac', '-b:a', '128k' if web else '192k', '-ar', '48000', '-movflags', '+faststart', '-shortest', out])
    # report
    r = run(['ffmpeg', '-hide_banner', '-nostats', '-i', out, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'])
    m2 = json.loads(r.stderr[r.stderr.rfind('{'):r.stderr.rfind('}') + 1])
    p = json.loads(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration,size:stream=codec_name', '-of', 'json', out]).stdout)
    print(f"{out}: {float(p['format']['duration']):.2f} s, {int(p['format']['size']) / 1e6:.1f} MB, "
          f"{[s['codec_name'] for s in p['streams']]}, loudness {m2['input_i']} LUFS, true peak {m2['input_tp']} dBTP")


if __name__ == '__main__':
    main()
