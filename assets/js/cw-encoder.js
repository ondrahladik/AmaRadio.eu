"use strict";

const MORSE = {
  A:".-", B:"-...", C:"-.-.", D:"-..", E:".", F:"..-.", G:"--.",
  H:"....", I:"..", J:".---", K:"-.-", L:".-..", M:"--", N:"-.",
  O:"---", P:".--.", Q:"--.-", R:".-.", S:"...", T:"-",
  U:"..-", V:"...-", W:".--", X:"-..-", Y:"-.--", Z:"--..",
  1:".----", 2:"..---", 3:"...--", 4:"....-", 5:".....",
  6:"-....", 7:"--...", 8:"---..", 9:"----.", 0:"-----",
  ".":".-.-.-", ",":"--..--", "?":"..--..", "/":"-..-.", "-":"-....-",
  "(":"-.--.", ")":"-.--.-", "'":".----.", ":":"---...", ";":"-.-.-.",
  "=":"-...-", "+":".-.-.", "\"":".-..-.", "$":"...-..-", "@":".--.-."
};

const encUi = {
  text:         document.getElementById("plainText"),
  freq:         document.getElementById("freqInput"),
  wpm:          document.getElementById("wpmInput"),
  volume:       document.getElementById("volumeInput"),
  ramp:         document.getElementById("rampInput"),
  gap:          document.getElementById("gapInput"),
  freqValue:    document.getElementById("freqValue"),
  wpmValue:     document.getElementById("wpmValue"),
  volumeValue:  document.getElementById("volumeValue"),
  gapValue:     document.getElementById("gapValue"),
  morseOutput:  document.getElementById("morseOutput"),
  durationValue:document.getElementById("durationValue"),
  dotValue:     document.getElementById("dotValue"),
  charValue:    document.getElementById("charValue"),
  outputValue:  document.getElementById("outputValue"),
  statusText:   document.getElementById("statusText"),
  playBtn:      document.getElementById("playBtn"),
  stopBtn:      document.getElementById("stopBtn"),
  downloadBtn:  document.getElementById("downloadBtn"),
  clearBtn:     document.getElementById("clearBtn"),
  waveCanvas:   document.getElementById("waveCanvas")
};

let encAudioCtx = null;
let encActiveSource = null;
let encLastBuffer = null;
let encPlaybackStartTime = 0;
let encPlaybackToken = 0;
let encWaveRaf = null;

function encUpdateButtons() {
  const hasText = encUi.text.value.trim().length > 0;
  const playing  = encActiveSource !== null;
  encUi.playBtn.disabled     = !hasText || playing;
  encUi.stopBtn.disabled     = !playing;
  encUi.downloadBtn.disabled = !hasText;
  encUi.clearBtn.disabled    = !hasText || playing;
  encUi.wpm.disabled         = playing;
}

function encClamp(v, mn, mx) { return Math.min(mx, Math.max(mn, v)); }

function encUnitMs() { return 1200 / Number(encUi.wpm.value); }

function encTextToMorse(text) {
  return text.toUpperCase().split(/\s+/).filter(Boolean).map(word =>
    [...word].map(char => MORSE[char] || "").filter(Boolean).join(" ")
  ).join(" / ");
}

function encMakeSegments(text) {
  const words = text.toUpperCase().split(/\s+/).filter(Boolean);
  const unit  = encUnitMs();
  const wordGap = Number(encUi.gap.value) || 7;
  const segs  = [];

  words.forEach((word, wi) => {
    [...word].forEach((char, ci) => {
      const code = MORSE[char];
      if (!code) return;
      [...code].forEach((mark, mi) => {
        segs.push({ on: true,  ms: mark === "." ? unit : unit * 3 });
        if (mi < code.length - 1) segs.push({ on: false, ms: unit });
      });
      if (ci < word.length - 1) segs.push({ on: false, ms: unit * 3 });
    });
    if (wi < words.length - 1) segs.push({ on: false, ms: unit * wordGap });
  });
  return segs;
}

function encRenderBuffer() {
  const sampleRate  = 48000;
  const segs        = encMakeSegments(encUi.text.value);
  const totalMs     = Math.max(250, segs.reduce((s, g) => s + g.ms, 250));
  const samples     = Math.ceil(sampleRate * totalMs / 1000);
  const data        = new Float32Array(samples);
  const freq        = Number(encUi.freq.value);
  const volume      = Number(encUi.volume.value) / 100;
  const rampSamples = Math.max(1, Math.round(sampleRate * Number(encUi.ramp.value) / 1000));
  let offset = 0, phase = 0;
  const phaseStep = 2 * Math.PI * freq / sampleRate;

  for (const seg of segs) {
    const count = Math.round(sampleRate * seg.ms / 1000);
    for (let i = 0; i < count && offset + i < data.length; i++) {
      if (seg.on) {
        const envelope = Math.min(1, i / rampSamples, (count - i) / rampSamples);
        data[offset + i] = Math.sin(phase) * volume * envelope;
      }
      phase += phaseStep;
    }
    offset += count;
  }

  encLastBuffer = { data, sampleRate, duration: data.length / sampleRate };
  return encLastBuffer;
}

async function encEnsureCtx() {
  if (!encAudioCtx) encAudioCtx = new (window.AudioContext || window.webkitAudioContext)({ latencyHint:"interactive" });
  if (encAudioCtx.state === "suspended") await encAudioCtx.resume();
}

async function encPlay(startOffsetSec = 0) {
  await encEnsureCtx();
  const rendered = encRenderBuffer();
  const safeOffsetSec = encClamp(
    startOffsetSec,
    0,
    Math.max(0, rendered.duration - 0.001)
  );
  if (encActiveSource) {
    encPlaybackToken++;
    try { encActiveSource.stop(); } catch (_) {}
    try { encActiveSource.disconnect(); } catch (_) {}
    encActiveSource = null;
  }
  const buf = encAudioCtx.createBuffer(1, rendered.data.length, rendered.sampleRate);
  buf.copyToChannel(rendered.data, 0);
  const token = ++encPlaybackToken;
  encActiveSource = encAudioCtx.createBufferSource();
  encActiveSource.buffer = buf;
  encActiveSource.connect(encAudioCtx.destination);
  encActiveSource.onended = () => {
    if (token !== encPlaybackToken) return;
    encActiveSource = null;
    encStopWaveAnimation();
    encUi.statusText.textContent = cwEncT.finished;
    encUi.statusText.className = "cw-status";
    encDrawWaveform();
    encUpdateButtons();
  };
  encActiveSource.start(0, safeOffsetSec);
  encPlaybackStartTime = encAudioCtx.currentTime - safeOffsetSec;
  encStartWaveAnimation();
  encUi.statusText.textContent = cwEncT.playing;
  encUi.statusText.className = "cw-status ok";
  encUpdateView();
  encUpdateButtons();
}

function encStop() {
  if (encActiveSource) {
    encPlaybackToken++;
    try { encActiveSource.stop(); }    catch(_) {}
    try { encActiveSource.disconnect(); } catch(_) {}
    encActiveSource = null;
  }
  encStopWaveAnimation();
  encUi.statusText.textContent = cwEncT.stopped;
  encUi.statusText.className = "cw-status";
  encDrawWaveform();
  encUpdateButtons();
}

function encWriteString(view, offset, str) {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}

function encBuildWav(rendered) {
  const d = rendered.data;
  const bytes = new ArrayBuffer(44 + d.length * 2);
  const view  = new DataView(bytes);
  encWriteString(view, 0,  "RIFF");
  view.setUint32(4,  36 + d.length * 2, true);
  encWriteString(view, 8,  "WAVE");
  encWriteString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1,  true);
  view.setUint16(22, 1,  true);
  view.setUint32(24, rendered.sampleRate, true);
  view.setUint32(28, rendered.sampleRate * 2, true);
  view.setUint16(32, 2,  true);
  view.setUint16(34, 16, true);
  encWriteString(view, 36, "data");
  view.setUint32(40, d.length * 2, true);
  for (let i = 0; i < d.length; i++)
    view.setInt16(44 + i * 2, encClamp(d[i], -1, 1) * 32767, true);
  return new Blob([view], { type:"audio/wav" });
}

function encBuildDownloadName() {
  const slug = encUi.text.value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug || "cw-morse"}.wav`;
}

function encDownload() {
  const rendered = encRenderBuffer();
  const blob = encBuildWav(rendered);
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = encBuildDownloadName();
  a.click();
  URL.revokeObjectURL(url);
  encUi.statusText.textContent = cwEncT.wavExported;
  encUi.statusText.className = "cw-status info";
  encUpdateView();
}

async function encRestartPlaybackFromCurrentPosition() {
  if (!encActiveSource || !encAudioCtx) return;
  const elapsedSec = Math.max(0, encAudioCtx.currentTime - encPlaybackStartTime);
  await encPlay(elapsedSec);
}

function encNormalizeTextToUppercase() {
  const original = encUi.text.value;
  const upper = original.toUpperCase();
  if (original === upper) return;
  const start = encUi.text.selectionStart;
  const end = encUi.text.selectionEnd;
  encUi.text.value = upper;
  encUi.text.setSelectionRange(start, end);
}

function encPlaybackProgress() {
  if (!encActiveSource || !encAudioCtx || !encLastBuffer) return null;
  const elapsed = Math.max(0, encAudioCtx.currentTime - encPlaybackStartTime);
  if (encLastBuffer.duration <= 0) return 0;
  return encClamp(elapsed / encLastBuffer.duration, 0, 1);
}

function encStopWaveAnimation() {
  if (encWaveRaf !== null) {
    cancelAnimationFrame(encWaveRaf);
    encWaveRaf = null;
  }
}

function encStartWaveAnimation() {
  encStopWaveAnimation();
  const tick = () => {
    if (!encActiveSource) {
      encWaveRaf = null;
      return;
    }
    encDrawWaveform();
    encWaveRaf = requestAnimationFrame(tick);
  };
  encWaveRaf = requestAnimationFrame(tick);
}

function encDrawWaveform() {
  const canvas = encUi.waveCanvas;
  const ratio  = window.devicePixelRatio || 1;
  const rect   = canvas.getBoundingClientRect();
  canvas.width  = Math.max(320, Math.floor(rect.width  * ratio));
  canvas.height = Math.max(120, Math.floor(rect.height * ratio));
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#03070a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(77,184,255,0.12)";
  ctx.lineWidth = 1;
  for (let i = 1; i < 6; i++) {
    const y = canvas.height * i / 6;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  const rendered = encLastBuffer || encRenderBuffer();
  const data = rendered.data;
  ctx.strokeStyle = "#45f0a1";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x < canvas.width; x++) {
    const start = Math.floor(x / canvas.width * data.length);
    const end   = Math.floor((x + 1) / canvas.width * data.length);
    let peak = 0;
    for (let i = start; i < end; i++) peak = Math.max(peak, Math.abs(data[i] || 0));
    const y  = canvas.height / 2 - peak * canvas.height * 0.42;
    const y2 = canvas.height / 2 + peak * canvas.height * 0.42;
    ctx.moveTo(x, y); ctx.lineTo(x, y2);
  }
  ctx.stroke();

  const progress = encPlaybackProgress();
  if (progress !== null) {
    const playX = Math.floor(progress * canvas.width);

    ctx.fillStyle = "rgba(3,7,10,0.42)";
    ctx.fillRect(0, 0, playX, canvas.height);

    const glowWidth = Math.max(10, Math.floor(canvas.width * 0.012));
    const glow = ctx.createLinearGradient(playX - glowWidth, 0, playX + glowWidth, 0);
    glow.addColorStop(0, "rgba(0,255,224,0)");
    glow.addColorStop(0.5, "rgba(0,255,224,0.6)");
    glow.addColorStop(1, "rgba(0,255,224,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(playX - glowWidth, 0, glowWidth * 2, canvas.height);

    ctx.strokeStyle = "rgba(0,255,224,0.85)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(playX + 0.5, 0);
    ctx.lineTo(playX + 0.5, canvas.height);
    ctx.stroke();
  }
}

function encUpdateView() {
  const morse = encTextToMorse(encUi.text.value);
  const rendered = encRenderBuffer();
  encUi.freqValue.textContent   = `${encUi.freq.value} Hz`;
  encUi.wpmValue.textContent    = encUi.wpm.value;
  encUi.volumeValue.textContent = `${encUi.volume.value}%`;
  encUi.gapValue.textContent    = encUi.gap.value;
  encUi.morseOutput.textContent = morse || "";
  encUi.durationValue.textContent = `${rendered.duration.toFixed(2)} s`;
  encUi.dotValue.textContent    = `${Math.round(encUnitMs())} ms`;
  encUi.charValue.textContent   = String(encUi.text.value.replace(/\s/g, "").length);
  encDrawWaveform();
  encUpdateButtons();
}

encUi.playBtn.addEventListener("click", () =>
  encPlay().catch(err => {
    encUi.statusText.textContent = `${cwEncT.failed} ${err.message}`;
    encUi.statusText.className = "cw-status error";
  })
);
encUi.stopBtn.addEventListener("click", encStop);
encUi.downloadBtn.addEventListener("click", encDownload);
encUi.clearBtn.addEventListener("click", () => {
  encUi.text.value = "";
  encUpdateView();
  encUi.statusText.textContent = cwEncT.cleared;
  encUi.statusText.className = "cw-status";
  encUpdateButtons();
});

encUi.text.addEventListener("input", () => {
  encNormalizeTextToUppercase();
  encUpdateView();
});

[encUi.freq, encUi.wpm, encUi.volume, encUi.ramp, encUi.gap].forEach(el => {
  el.addEventListener("input", () => {
    encUpdateView();
    encRestartPlaybackFromCurrentPosition().catch(err => {
      encUi.statusText.textContent = `${cwEncT.failed} ${err.message}`;
      encUi.statusText.className = "cw-status error";
    });
  });
});

window.addEventListener("resize", encDrawWaveform);
encUpdateView();
