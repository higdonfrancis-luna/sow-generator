"""Build the soundtrack: Firefly narration (Tom), a soft music bed and light sound effects.
Everything except the narration is synthesized here, so there is nothing to license.

    python3 build/make_audio.py [timeline]        (run from the video folder)

timeline: timeline (full video, default) or timeline_cja / timeline_com / timeline_aem.
Reads build/<timeline>.json, build/cues_<timeline>.json (written by render_video.js) and
audio/*.wav. Writes build/mix_<timeline>.wav (48 kHz stereo, 24-bit).
"""
import json
import sys
import wave

import numpy as np
from scipy.signal import butter, sosfilt

SR = 48000
rng = np.random.default_rng(7)


# ---------------------------------------------------------------- io
def read_wav(path):
    with wave.open(path) as w:
        assert w.getframerate() == SR and w.getsampwidth() == 2, path
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
        if w.getnchannels() > 1:
            x = x.reshape(-1, w.getnchannels()).mean(1)
    return x


def write_wav(path, x, bits=24):
    x = np.clip(x, -1, 1)
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    if bits == 24:
        v = np.round(x * 8388607).astype(np.int32)
        b = np.zeros((v.size, 3), dtype=np.uint8)
        flat = v.reshape(-1)
        b[:, 0] = flat & 0xFF
        b[:, 1] = (flat >> 8) & 0xFF
        b[:, 2] = (flat >> 16) & 0xFF
        data = b.tobytes()
    else:
        data = np.round(x * 32767).astype(np.int16).tobytes()
    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(bits // 8)
        w.setframerate(SR)
        w.writeframes(data)


def tt(dur):
    return np.arange(int(dur * SR)) / SR


def lp(x, f, order=2):
    return sosfilt(butter(order, f, 'low', fs=SR, output='sos'), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, 'high', fs=SR, output='sos'), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], 'band', fs=SR, output='sos'), x)


def sweep(f, t):
    """sine with a time-varying frequency array"""
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def norm(x, peak=1.0):
    m = np.max(np.abs(x))
    return x * (peak / m) if m > 0 else x


# ---------------------------------------------------------------- sound effects
def sfx_pop():
    t = tt(0.16)
    y = sweep(520 + 820 * np.exp(-t / 0.025), t) * np.exp(-t / 0.045) * (1 - np.exp(-t / 0.0015))
    return norm(y)


def sfx_tick():
    t = tt(0.05)
    y = np.sin(2 * np.pi * 2300 * t) * np.exp(-t / 0.008) + 0.6 * hp(rng.normal(0, 1, t.size), 3000) * np.exp(-t / 0.003)
    return norm(y)


def sfx_click():
    t = tt(0.12)
    y = 0.8 * hp(rng.normal(0, 1, t.size), 2000) * np.exp(-t / 0.003) + np.sin(2 * np.pi * 1700 * t) * np.exp(-t / 0.012)
    rel = np.zeros_like(y)
    k = int(0.07 * SR)
    rel[k:] = 0.5 * y[: y.size - k]
    return norm(y + rel)


def sfx_toggle():
    t = tt(0.16)
    blip = sweep(700 + 500 * np.clip(t / 0.06, 0, 1), t) * np.exp(-t / 0.05)
    c = sfx_click()
    return norm(0.7 * np.pad(c, (0, max(0, t.size - c.size)))[: t.size] + blip)


def sfx_whoosh(dur=0.6):
    t = tt(dur)
    n = rng.normal(0, 1, t.size)
    p = t / dur
    fc = 380 + 1500 * np.sin(np.pi * np.clip(p * 1.1, 0, 1)) ** 2
    # time-varying resonant band-pass (state variable filter)
    y = np.zeros_like(n)
    low = band = 0.0
    q = 0.9
    for i in range(n.size):
        f = 2 * np.sin(np.pi * fc[i] / SR)
        low += f * band
        high = n[i] - low - q * band
        band += f * high
        y[i] = band
    y *= np.sin(np.pi * p) ** 2
    return norm(y)


def sfx_chime():
    t = tt(1.0)
    y = np.zeros_like(t)
    for f, d in ((1318.5, 0.0), (1975.5, 0.07)):
        k = int(d * SR)
        tk = t[: t.size - k]
        y[k:] += (np.sin(2 * np.pi * f * tk) + 0.18 * np.sin(4 * np.pi * f * tk)) * np.exp(-tk / 0.32) * (1 - np.exp(-tk / 0.003))
    return norm(y)


def sfx_land():
    t = tt(0.2)
    y = sweep(70 + 130 * np.exp(-t / 0.02), t) * np.exp(-t / 0.06) + 0.3 * lp(rng.normal(0, 1, t.size), 900) * np.exp(-t / 0.02)
    return norm(y)


def sfx_pulse():
    t = tt(0.85)
    p = t / t[-1]
    f = 480 * (3.2 ** p)
    y = (sweep(f, t) + 0.35 * sweep(f * 1.5, t) * (0.6 + 0.4 * np.sin(2 * np.pi * 18 * t))) * np.sin(np.pi * p) ** 1.6
    return norm(lp(y, 5000))


def sfx_fizzle():
    t = tt(0.7)
    p = t / t[-1]
    f = 560 + 280 * np.sin(np.pi * np.clip(p * 1.6, 0, 1)) - 260 * np.clip(p * 2 - 1, 0, 1)
    tone = sweep(f, t) * np.sin(np.pi * np.clip(p * 1.6, 0, 1)) ** 1.5
    crack = (rng.random(t.size) < 0.004) * rng.normal(0, 1, t.size)
    crack = hp(crack, 1500) * np.clip(p * 3 - 0.6, 0, 1) * np.exp(-t / 0.35)
    return norm(0.8 * tone + 0.8 * crack)


def sfx_thunk():
    t = tt(0.22)
    y = sweep(170 + 140 * np.exp(-t / 0.012), t) * np.exp(-t / 0.05) + 0.4 * bp(rng.normal(0, 1, t.size), 300, 2500) * np.exp(-t / 0.01)
    return norm(y)


def sfx_rise():
    t = tt(1.65)
    p = np.clip(t / 1.5, 0, 1)
    f = 300 * (3.3 ** p)
    amp = (0.25 + 0.75 * p) * np.where(t < 1.5, 1.0, np.exp(-(t - 1.5) / 0.03))
    return norm((sweep(f, t) + 0.2 * sweep(2 * f, t)) * amp)


def sfx_swell():
    t = tt(1.4)
    env = (1 - np.exp(-t / 0.18)) * np.exp(-t / 0.55)
    y = lp(rng.normal(0, 1, t.size), 2500) * env + 0.8 * np.sin(2 * np.pi * 110 * t) * env + 0.5 * np.sin(2 * np.pi * 220 * t) * env
    return norm(y)


def sfx_sparkle():
    t = tt(0.7)
    y = np.zeros_like(t)
    for k, f in enumerate((2637, 3136, 3520, 4186, 3951)):
        s = int(k * 0.085 * SR)
        tk = t[: t.size - s]
        y[s:] += np.sin(2 * np.pi * f * tk) * np.exp(-tk / 0.09) * (1 - np.exp(-tk / 0.002))
    return norm(y)


SFX = {'pop': (sfx_pop, 0.50), 'tick': (sfx_tick, 0.30), 'click': (sfx_click, 0.50), 'toggle': (sfx_toggle, 0.55),
       'whoosh': (sfx_whoosh, 0.40), 'chime': (sfx_chime, 0.42), 'land': (sfx_land, 0.45), 'pulse': (sfx_pulse, 0.32),
       'fizzle': (sfx_fizzle, 0.38), 'thunk': (sfx_thunk, 0.50), 'rise': (sfx_rise, 0.28), 'swell': (sfx_swell, 0.40),
       'sparkle': (sfx_sparkle, 0.32)}


# ---------------------------------------------------------------- music bed
BPM = 100
BEAT = 60 / BPM
BAR = 4 * BEAT
# C(add9), G/B, Am7, Fmaj7: pad voicing, arpeggio tones and bass root (MIDI note numbers)
CHORDS = [((64, 67, 72, 74), (72, 76, 79, 86), 48),
          ((62, 67, 71, 74), (71, 74, 79, 83), 47),
          ((64, 67, 69, 72), (69, 72, 76, 79), 45),
          ((65, 69, 72, 76), (72, 76, 77, 81), 41)]
ARP = (0, 1, 2, 3, 1, 2, 3, 2)


def pad_note(f, dur):
    t = tt(dur + 1.2)
    y = np.zeros_like(t)
    for det in (-0.004, 0.0, 0.0045):
        for k in range(1, 7):
            y += np.sin(2 * np.pi * f * (1 + det) * k * t + k) / k ** 1.4
    a = 1 - np.exp(-t / 0.35)
    r = np.where(t < dur, 1.0, np.exp(-(t - dur) / 0.45))
    return y * a * r


def pluck(f):
    t = tt(0.9)
    return (np.sin(2 * np.pi * f * t) + 0.22 * np.sin(4 * np.pi * f * t) + 0.08 * np.sin(6 * np.pi * f * t)) * np.exp(-t / 0.26) * (1 - np.exp(-t / 0.004))


def bass_note(f, dur):
    t = tt(dur + 0.2)
    y = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)
    return y * (1 - np.exp(-t / 0.01)) * np.where(t < dur, 0.7 + 0.3 * np.exp(-t / 0.2), np.exp(-(t - dur) / 0.06))


def kick():
    t = tt(0.3)
    return sweep(48 + 70 * np.exp(-t / 0.03), t) * np.exp(-t / 0.13)


def shaker():
    t = tt(0.06)
    return hp(rng.normal(0, 1, t.size), 6500) * np.exp(-t / 0.012)


def snare():
    t = tt(0.2)
    return bp(rng.normal(0, 1, t.size), 900, 5000) * np.exp(-t / 0.06) + 0.3 * np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.05)


def place(buf, x, at, gain=1.0, pan=0.0):
    i = int(round(at * SR))
    if i >= buf.shape[0] or i + x.size <= 0:
        return
    j = max(0, -i)
    x = x[j:]
    i = max(0, i)
    n = min(x.size, buf.shape[0] - i)
    left, right = np.sqrt(0.5 * (1 - pan)), np.sqrt(0.5 * (1 + pan))
    buf[i:i + n, 0] += gain * left * x[:n]
    buf[i:i + n, 1] += gain * right * x[:n]


def music(total, groove_on, groove_off, lift_at):
    pad = np.zeros((int(total * SR) + SR, 2))
    arp = np.zeros_like(pad)
    low = np.zeros_like(pad)
    drums = np.zeros_like(pad)
    k = kick()
    sh = shaker()
    sn = snare()
    bar = 0
    while bar * BAR < total:
        t0 = bar * BAR
        voicing, tones, root = CHORDS[bar % 4]
        for i, n in enumerate(voicing):
            place(pad, pad_note(midi(n), BAR), t0, 1.0, (-0.5, -0.15, 0.15, 0.5)[i])
        for s, idx in enumerate(ARP):
            n = tones[idx]
            place(arp, pluck(midi(n)), t0 + s * BEAT / 2, 1.0, (-0.35, 0.35)[s % 2])
            if t0 >= lift_at:
                place(arp, pluck(midi(n + 12)), t0 + s * BEAT / 2 + BEAT / 4, 0.45, (0.4, -0.4)[s % 2])
        if groove_on <= t0 < groove_off:
            for b in range(4):
                tb = t0 + b * BEAT
                place(low, bass_note(midi(root), BEAT * 0.9), tb, 1.0 if b in (0, 2) else 0.6)
                if b in (0, 2):
                    place(drums, k, tb, 1.0)
                else:
                    place(drums, sn, tb, 0.18)
                place(drums, sh, tb + BEAT / 2, 0.22, 0.3)
        bar += 1
    pad = lp(pad.T, 1700).T
    low = lp(low.T, 380).T
    mix = 0.30 * norm(pad) + 0.42 * norm(arp) + 0.32 * norm(low) + 0.30 * norm(drums)
    return mix[: int(total * SR)]


# ---------------------------------------------------------------- mix
def speech_level(x):
    """RMS over the voiced 50 ms frames (within 30 dB of the loudest), a steady loudness proxy"""
    hop = int(0.05 * SR)
    fr = x[: x.size // hop * hop].reshape(-1, hop)
    rms = np.sqrt((fr ** 2).mean(1)) + 1e-12
    keep = rms > rms.max() * 10 ** (-30 / 20)
    return float(np.sqrt((fr[keep] ** 2).mean()))


def main():
    name = sys.argv[1] if len(sys.argv) > 1 else 'timeline'
    tl = json.load(open(f'build/{name}.json', encoding='utf-8'))
    cues = json.load(open(f'build/cues_{name}.json', encoding='utf-8'))
    total = tl['duration']
    N = int(total * SR)

    # narration: every part leveled to the same speech loudness as the full video's clips
    ref = float(np.median([speech_level(hp(read_wav(f"audio/{s['id']}.wav"), 70)) for s in tl['scenes']]))
    narr = np.zeros(N)
    for part in tl['audio']:
        x = hp(read_wav(part['file']), 70)[int(part['from'] * SR):int(part['to'] * SR)]
        x = x * (ref / speech_level(x))
        i = int(round(part['at'] * SR))
        n = min(x.size, N - i)
        narr[i:i + n] += x[:n]

    # speech activity envelope for ducking the music
    act = np.zeros(N)
    for a, b in tl['speech']:
        act[int(a * SR):int(b * SR)] = 1.0
    win = int(0.35 * SR)
    cs = np.concatenate([[0.0], np.cumsum(act)])
    lo = np.clip(np.arange(N) - win // 2, 0, N)
    hi = np.clip(np.arange(N) + win // 2, 0, N)
    act = (cs[hi] - cs[lo]) / win

    # music bed: no beat under the opening, a light groove through the products, a lift at the close
    m = music(total, tl['music']['grooveOn'], tl['music']['liftAt'], tl['music']['liftAt'])
    m *= ref * 10 ** (-14 / 20) / np.sqrt(np.mean(m ** 2))
    duck = 1 - 0.38 * act
    fade_in = np.clip(np.arange(N) / (1.2 * SR), 0, 1)
    fade_out = np.clip((N - np.arange(N)) / (3.0 * SR), 0, 1) ** 1.5
    m *= (duck * fade_in * fade_out)[:, None]

    # sound effects at the animation's cue times
    fx = np.zeros((N, 2))
    fx_peak = np.max(np.abs(narr)) * 10 ** (-9 / 20)
    cache = {}
    used = 0
    for c in cues:
        if not 0 <= c['t'] < total:
            continue
        fn, g = SFX[c['name']]
        if c['name'] not in cache:
            cache[c['name']] = fn()
        pan = 0.25 if c['name'] in ('pop', 'tick', 'chime') else 0.0
        place(fx, cache[c['name']], c['t'], fx_peak * g * c['gain'], pan)
        used += 1

    mix = np.stack([narr, narr], 1) + m + fx
    mix *= 10 ** (-1 / 20) / np.max(np.abs(mix))
    write_wav(f'build/mix_{name}.wav', mix)
    print(f'{name}: {total:.2f} s, {len(tl["audio"])} voice parts, {used} cues, music {20 * np.log10(np.sqrt(np.mean(m ** 2)) / ref):.1f} dB vs speech')


if __name__ == '__main__':
    main()
