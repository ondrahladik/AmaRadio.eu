"use strict";

const MORSE_TABLE = {
  ".-":"A",   "-...":"B",  "-.-.":"C",  "-..":"D",   ".":"E",
  "..-.":"F", "--.":"G",   "....":"H",  "..":"I",    ".---":"J",
  "-.-":"K",  ".-..":"L",  "--":"M",    "-.":"N",    "---":"O",
  ".--.":"P", "--.-":"Q",  ".-.":"R",   "...":"S",   "-":"T",
  "..-":"U",  "...-":"V",  ".--":"W",   "-..-":"X",  "-.--":"Y",
  "--..":"Z", ".----":"1", "..---":"2", "...--":"3", "....-":"4",
  ".....":"5","-....":"6", "--...":"7", "---..":"8", "----.":"9",
  "-----":"0",".-.-.-":".",  "--..--":",", "..--..":"?",
  "-..-.":"/", "-....-":"-", "-.--.":"(",  "-.--.-":")",
  ".----.":`'`,"---...":":", "-.-.-.":";", "-...-":"=",
  ".-.-.":"+", ".-..-.":"\"","...-..-":"$",".--.-.":"@"
};

const decUi = {
  startBtn:        document.getElementById("startBtn"),
  startBtnIcon:    document.getElementById("startBtnIcon"),
  stopBtn:         document.getElementById("stopBtn"),
  clearBtn:        document.getElementById("clearBtn"),
  findBtn:         document.getElementById("findBtn"),
  sourceMode:      document.getElementById("sourceMode"),
  fileInput:       document.getElementById("fileInput"),
  dropZone:        document.getElementById("dropZone"),
  freqInput:       document.getElementById("freqInput"),
  thresholdInput:  document.getElementById("thresholdInput"),
  wpmInput:        document.getElementById("wpmInput"),
  bandwidthInput:  document.getElementById("bandwidthInput"),
  squelchInput:    document.getElementById("squelchInput"),
  autoTuneInput:   document.getElementById("autoTuneInput"),
  agcInput:        document.getElementById("agcInput"),
  audioMonitorInput:document.getElementById("audioMonitorInput"),
  freqValue:       document.getElementById("freqValue"),
  thresholdValue:  document.getElementById("thresholdValue"),
  wpmValue:        document.getElementById("wpmValue"),
  meterFill:       document.getElementById("meterFill"),
  meterThreshold:  document.getElementById("meterThreshold"),
  strengthText:    document.getElementById("strengthText"),
  snrValue:        document.getElementById("snrValue"),
  symbolOutput:    document.getElementById("symbolOutput"),
  decodedOutput:   document.getElementById("decodedOutput"),
  spectrumCanvas:  document.getElementById("spectrumCanvas"),
  waterfallCanvas: document.getElementById("waterfallCanvas")
};

let decAudioCtx      = null;
let decAnalyser      = null;
let decProcessor     = null;
let decActiveSource  = null;
let decMicCache      = null;
let decPlaybackSrc   = null;
let decSelectedFile  = null;
let decRunning       = false;
let decCurrentMode   = "idle";

const dsp = {
  targetFreq:0, detectedFreq:700, scanCounter:0, scanEvery:8,
  sampleRate:48000, envelope:0, slowEnvelope:0, noiseFloor:0.004,
  peakLevel:0.025, strength:0, snrDb:0, isTone:false,
  toneCandidateFrames:0, silenceCandidateFrames:0, lastTransitionTime:0,
  toneStartTime:0, silenceStartTime:0, currentSymbol:"", decodedText:"",
  dotMs:60, lastMarkMs:0, lastGapMs:0, pendingCharacter:false,
  pendingWord:false, frameTimeMs:0, samplesSeen:0, lastAutoTuneMs:0
};

// Goertzel
function goertzelPower(samples, sr, freq) {
  const n = samples.length;
  const omega = (2 * Math.PI * freq) / sr;
  const coeff = 2 * Math.cos(omega);
  let q0=0, q1=0, q2=0;
  for (let i = 0; i < n; i++) {
    const w = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (n - 1));
    q0 = coeff * q1 - q2 + samples[i] * w;
    q2 = q1; q1 = q0;
  }
  return (q1*q1 + q2*q2 - coeff*q1*q2) / n;
}

function decRms(samples) {
  let sum = 0;
  for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i];
  return Math.sqrt(sum / samples.length);
}

function decClamp(v, mn, mx) { return Math.min(mx, Math.max(mn, v)); }
function decLerp(a, b, t)    { return a + (b - a) * t; }

// Audio setup
async function decEnsureCtx() {
  if (!decAudioCtx) {
    decAudioCtx = new (window.AudioContext || window.webkitAudioContext)({ latencyHint:"interactive" });
    dsp.sampleRate = decAudioCtx.sampleRate;

    decAnalyser = decAudioCtx.createAnalyser();
    decAnalyser.fftSize = 4096;
    decAnalyser.smoothingTimeConstant = 0.42;

    decProcessor = decAudioCtx.createScriptProcessor(512, 1, 1);
    decProcessor.onaudioprocess = decHandleAudio;
    decProcessor.connect(decAudioCtx.destination);
  }
  if (decAudioCtx.state === "suspended") await decAudioCtx.resume();
}

function decConnect(source, monitor = false) {
  decDisconnect();
  decActiveSource = source;
  source.connect(decAnalyser);
  source.connect(decProcessor);
  if (monitor) source.connect(decAudioCtx.destination);
  decRunning = true;
  decReset(false);
}

function decSetStatus(msg, kind = "muted") {
  // Status messages removed from UI
}

async function decGetMicStream() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(cwDecT.errSecure);
  }
  if (decMicCache && decMicCache.getAudioTracks().some(t => t.readyState === "live")) {
    return decMicCache;
  }
  const constraints = {
    audio: {
      echoCancellation:false, noiseSuppression:false,
      autoGainControl:false, channelCount:{ideal:1}, sampleRate:{ideal:48000}
    }
  };
  try {
    decMicCache = await navigator.mediaDevices.getUserMedia(constraints);
    return decMicCache;
  } catch(e) {
    decSetStatus(`${cwDecT.warnFallback} (${e.name})`, "warn");
    decMicCache = await navigator.mediaDevices.getUserMedia({ audio:true });
    return decMicCache;
  }
}

function decDisconnect() {
  if (decActiveSource)  { try { decActiveSource.disconnect(); } catch(_){} }
  if (decPlaybackSrc)   {
    try { decPlaybackSrc.stop(); }       catch(_){}
    try { decPlaybackSrc.disconnect(); } catch(_){}
  }
  decActiveSource = null;
  decPlaybackSrc  = null;
}

function decReleaseMic() {
  if (decMicCache) { decMicCache.getTracks().forEach(t => t.stop()); decMicCache = null; }
}

async function decStartMic() {
  await decEnsureCtx();
  decSetStatus(cwDecT.requestingMic, "info");
  const stream = await decGetMicStream();
  decCurrentMode = "mic";
  decReset(true);
  decConnect(decAudioCtx.createMediaStreamSource(stream), decUi.audioMonitorInput.checked);
  const track = stream.getAudioTracks()[0];
  const label = track && track.label ? track.label : "default";
  const state = track ? track.readyState : "unknown";
  decSetStatus(`${cwDecT.micActive} ${label} (${state})`, "ok");
}

async function decStartFile(file) {
  await decEnsureCtx();
  const ab = await file.arrayBuffer();
  const audioBuf = await decAudioCtx.decodeAudioData(ab);
  const gain = decAudioCtx.createGain();
  gain.gain.value = decNormGain(audioBuf);
  const src = decAudioCtx.createBufferSource();
  src.buffer = audioBuf;
  src.onended = () => { if (decCurrentMode === "file") decStopDecoder(); };
  src.connect(gain);
  decCurrentMode = "file";
  decReset(true);
  decConnect(gain, decUi.audioMonitorInput.checked);
  decPlaybackSrc = src;
  src.start();
  decSetStatus(cwDecT.wavStart, "info");
}

function decNormGain(buf) {
  let peak = 0;
  for (let c = 0; c < buf.numberOfChannels; c++) {
    const d = buf.getChannelData(c);
    const step = Math.max(1, Math.floor(d.length / 120000));
    for (let i = 0; i < d.length; i += step) {
      const v = Math.abs(d[i]);
      if (v > peak) peak = v;
    }
  }
  if (peak < 0.0001) return 1;
  return decClamp(0.62 / peak, 0.25, 8);
}

// DSP
function decHandleAudio(event) {
  const out = event.outputBuffer.getChannelData(0);
  out.fill(0);
  if (!decRunning) return;

  const input  = event.inputBuffer.getChannelData(0);
  const nowMs  = decAudioCtx.currentTime * 1000;
  dsp.samplesSeen += input.length;
  dsp.frameTimeMs = (input.length / decAudioCtx.sampleRate) * 1000;

  decMaybeAutoTune(input, nowMs);

  const bw     = decClamp(Number(decUi.bandwidthInput.value) || 70, 20, 180);
  const target = Number(decUi.freqInput.value);
  const cp = Math.max(
    goertzelPower(input, decAudioCtx.sampleRate, target),
    goertzelPower(input, decAudioCtx.sampleRate, decClamp(target-12,120,3000)),
    goertzelPower(input, decAudioCtx.sampleRate, decClamp(target+12,120,3000))
  );
  const lp  = goertzelPower(input, decAudioCtx.sampleRate, decClamp(target-bw,120,3000));
  const hp  = goertzelPower(input, decAudioCtx.sampleRate, decClamp(target+bw,120,3000));
  const adj = Math.max(1e-9, (lp + hp) * 0.5);
  const tone = Math.sqrt(Math.max(0, cp - adj * 0.42));

  dsp.envelope = decLerp(dsp.envelope, tone, tone > dsp.envelope ? 0.62 : 0.38);
  dsp.slowEnvelope = decLerp(dsp.slowEnvelope, dsp.envelope, 0.018);
  if (!dsp.isTone) dsp.noiseFloor = decLerp(dsp.noiseFloor, Math.max(1e-6, dsp.envelope), 0.012);

  if (decUi.agcInput.checked) {
    dsp.peakLevel = dsp.envelope > dsp.peakLevel
      ? decLerp(dsp.peakLevel, dsp.envelope, 0.08)
      : decLerp(dsp.peakLevel, Math.max(dsp.noiseFloor*5, dsp.envelope), 0.004);
  } else {
    dsp.peakLevel = 0.06;
  }

  const squelchDb = Number(decUi.squelchInput.value) || 0;
  dsp.snrDb = 10 * Math.log10((cp+1e-10) / (adj+1e-10));
  const norm = decClamp((dsp.envelope - dsp.noiseFloor) / Math.max(0.00001, dsp.peakLevel - dsp.noiseFloor), 0, 1);
  const noiseOk = dsp.snrDb >= squelchDb || norm > 0.82;
  dsp.strength  = noiseOk ? norm : norm * 0.36;

  const thr = Number(decUi.thresholdInput.value) / 100;
  const candidate = dsp.isTone
    ? dsp.strength > thr * 0.58 && noiseOk
    : dsp.strength > thr && noiseOk;

  decUpdateTone(candidate, nowMs);
  decCheckGaps(nowMs);
}

function decMaybeAutoTune(samples, nowMs) {
  if (!decUi.autoTuneInput.checked) return;
  if (dsp.isTone || dsp.strength > Number(decUi.thresholdInput.value)/100) return;
  if (dsp.currentSymbol || dsp.pendingCharacter || dsp.pendingWord) return;
  dsp.scanCounter++;
  if (dsp.scanCounter % dsp.scanEvery !== 0 && nowMs - dsp.lastAutoTuneMs < 360) return;
  dsp.lastAutoTuneMs = nowMs;
  if (!decAnalyser) return;

  const bins = new Uint8Array(decAnalyser.frequencyBinCount);
  decAnalyser.getByteFrequencyData(bins);
  const nyq = decAudioCtx.sampleRate / 2;
  let bestFreq=Number(decUi.freqInput.value), bestVal=0, floorSum=0, floorCnt=0;
  for (let f=300; f<=1200; f+=5) {
    const bin = Math.round((f/nyq)*bins.length);
    const val = bins[decClamp(bin,0,bins.length-1)];
    floorSum += val; floorCnt++;
    if (val > bestVal) { bestVal=val; bestFreq=f; }
  }
  const floor = floorSum / Math.max(1, floorCnt);
  if (bestVal > Math.max(34, floor+12)) {
    dsp.detectedFreq = Math.round(decLerp(dsp.detectedFreq, bestFreq, 0.42));
    if (Math.abs(Number(decUi.freqInput.value) - dsp.detectedFreq) > 2) {
      decUi.freqInput.value = String(decClamp(dsp.detectedFreq, 300, 1200));
      decUpdateLabels();
    }
  }
}

function decUpdateTone(candidate, nowMs) {
  if (candidate) { dsp.toneCandidateFrames++; dsp.silenceCandidateFrames=0; }
  else           { dsp.silenceCandidateFrames++; dsp.toneCandidateFrames=0; }

  const req = 2;
  const next = dsp.isTone
    ? dsp.silenceCandidateFrames < req
    : dsp.toneCandidateFrames >= req;
  if (next === dsp.isTone) return;

  const t = nowMs - (req-1) * dsp.frameTimeMs;
  const elapsed = dsp.lastTransitionTime ? t - dsp.lastTransitionTime : 0;
  dsp.lastTransitionTime = t;

  if (next) {
    dsp.isTone=true; dsp.toneStartTime=t; dsp.lastGapMs=elapsed; decHandleGap(elapsed);
  } else {
    dsp.isTone=false; dsp.silenceStartTime=t; dsp.lastMarkMs=elapsed; decHandleMark(elapsed);
  }
}

function decBaseDot() {
  const manual = 1200 / Number(decUi.wpmInput.value);
  if (!Number.isFinite(dsp.dotMs) || dsp.dotMs<=0) return manual;
  return decClamp(dsp.dotMs, manual*0.35, manual*2.6);
}

function decHandleMark(ms) {
  const dot = decBaseDot();
  if (ms < Math.max(18, dot*0.38)) return;
  const mark = ms < dot*2.05 ? "." : "-";
  dsp.currentSymbol += mark;
  dsp.pendingCharacter = true;
  dsp.pendingWord = true;
  dsp.dotMs = decLerp(dot, mark==="." ? ms : ms/3, mark==="." ? 0.22 : 0.12);
  decUi.symbolOutput.textContent = dsp.currentSymbol;
}

function decHandleGap(ms) {
  const dot = decBaseDot();
  if (!dsp.pendingCharacter) {
    if (dsp.pendingWord && ms >= dot*6.2) { decAppend(" "); dsp.pendingWord=false; }
    return;
  }
  if (ms >= dot*6.2)  { decFlush(); decAppend(" "); dsp.pendingWord=false; }
  else if (ms >= dot*2.55) { decFlush(); }
}

function decCheckGaps(nowMs) {
  if (dsp.isTone || !dsp.silenceStartTime) return;
  const gap = nowMs - dsp.silenceStartTime;
  const dot = decBaseDot();
  if (gap >= dot*6.8 && dsp.pendingWord) {
    if (dsp.pendingCharacter) decFlush();
    decAppend(" "); dsp.pendingWord=false;
  } else if (dsp.pendingCharacter && gap >= dot*3.15) {
    decFlush();
  }
}

function decFlush() {
  if (!dsp.currentSymbol) return;
  const ch = MORSE_TABLE[dsp.currentSymbol] || "□";
  decAppend(ch);
  dsp.currentSymbol=""; dsp.pendingCharacter=false;
  decUi.symbolOutput.textContent="";
}

function decAppend(ch) {
  if (ch===" " && dsp.decodedText.endsWith(" ")) return;
  dsp.decodedText += ch;
  decUi.decodedOutput.textContent = dsp.decodedText;
  decUi.decodedOutput.scrollTop   = decUi.decodedOutput.scrollHeight;
}

function decReset(clearText) {
  const dot = 1200 / Number(decUi.wpmInput.value);
  Object.assign(dsp, {
    targetFreq:Number(decUi.freqInput.value), detectedFreq:Number(decUi.freqInput.value),
    scanCounter:0, envelope:0, slowEnvelope:0, noiseFloor:0.004, peakLevel:0.025,
    strength:0, snrDb:0, isTone:false, toneCandidateFrames:0, silenceCandidateFrames:0,
    lastTransitionTime:0, toneStartTime:0, silenceStartTime:0, currentSymbol:"",
    dotMs:dot, lastMarkMs:0, lastGapMs:0, pendingCharacter:false, pendingWord:false, samplesSeen:0
  });
  if (clearText) { dsp.decodedText=""; decUi.decodedOutput.textContent=""; }
  decUi.symbolOutput.textContent="";
}

function decStopDecoder(resetMode=true) {
  decRunning=false;
  decFlush();
  decDisconnect();
  if (resetMode) decCurrentMode="idle";
}

// Visualization
const specCtx  = decUi.spectrumCanvas.getContext("2d");
const fallCtx  = decUi.waterfallCanvas.getContext("2d");
let specData   = null;

function decResizeCanvas(canvas) {
  const r = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(320, Math.floor(rect.width * r));
  const h = Math.max(100, Math.floor(rect.height * r));
  if (canvas.width!==w || canvas.height!==h) { canvas.width=w; canvas.height=h; }
}

function decDrawLoop() {
  decResizeCanvas(decUi.spectrumCanvas);
  decResizeCanvas(decUi.waterfallCanvas);
  decDrawSpectrum();
  decDrawWaterfall();
  decUpdateReadouts();
  requestAnimationFrame(decDrawLoop);
}

function decDrawSpectrum() {
  const cv=decUi.spectrumCanvas, ctx=specCtx;
  ctx.clearRect(0,0,cv.width,cv.height);
  ctx.fillStyle="#03070a"; ctx.fillRect(0,0,cv.width,cv.height);
  decDrawGrid(ctx, cv.width, cv.height);
  if (!decAnalyser) return;

  if (!specData || specData.length!==decAnalyser.frequencyBinCount)
    specData = new Uint8Array(decAnalyser.frequencyBinCount);
  decAnalyser.getByteFrequencyData(specData);

  const minF=100, maxF=1600, nyq=decAudioCtx.sampleRate/2;
  ctx.beginPath(); ctx.lineWidth=Math.max(2,cv.width/600); ctx.strokeStyle="#45f0a1";
  for (let x=0; x<cv.width; x++) {
    const freq=minF+(x/cv.width)*(maxF-minF);
    const bin=Math.round((freq/nyq)*specData.length);
    const val=specData[decClamp(bin,0,specData.length-1)]/255;
    const y=cv.height - val*cv.height*0.92 - cv.height*0.04;
    if (x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.stroke();

  const xT=((Number(decUi.freqInput.value)-minF)/(maxF-minF))*cv.width;
  ctx.strokeStyle="#f4c95d"; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(xT,0); ctx.lineTo(xT,cv.height); ctx.stroke();

  ctx.fillStyle="#b8c9d9";
  ctx.font=`${Math.max(11,cv.width/70)}px Cascadia Mono,monospace`;
  for (let f=300; f<=1200; f+=300) {
    const x=((f-minF)/(maxF-minF))*cv.width;
    ctx.fillText(`${f}Hz`, x+4, cv.height-8);
  }
}

function decDrawWaterfall() {
  const cv=decUi.waterfallCanvas, ctx=fallCtx;
  if (!decAnalyser || !specData || !decRunning) {
    if (!decRunning) { ctx.fillStyle="#03070a"; ctx.fillRect(0,0,cv.width,cv.height); }
    return;
  }
  const img=ctx.getImageData(0,0,cv.width,cv.height-1);
  ctx.putImageData(img,0,1);
  const minF=100,maxF=1600,nyq=decAudioCtx.sampleRate/2;
  for (let x=0; x<cv.width; x++) {
    const freq=minF+(x/cv.width)*(maxF-minF);
    const bin=Math.round((freq/nyq)*specData.length);
    const val=specData[decClamp(bin,0,specData.length-1)]/255;
    ctx.fillStyle=decFallColor(val); ctx.fillRect(x,0,1,1);
  }
}

function decDrawGrid(ctx,w,h) {
  ctx.strokeStyle="rgba(77,184,255,0.1)"; ctx.lineWidth=1;
  for (let i=1;i<6;i++) { const y=h/6*i; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
  for (let i=1;i<10;i++){ const x=w/10*i; ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
}

function decFallColor(v) {
  v=decClamp(v,0,1);
  const r=Math.round(decClamp((v-0.52)*520,0,255));
  const g=Math.round(decClamp(v*360,0,255));
  const b=Math.round(decClamp(80+v*210-Math.max(0,v-0.75)*320,0,255));
  return `rgb(${r},${g},${b})`;
}

function decUpdateReadouts() {
  const sp=Math.round(dsp.strength*100);
  const thr=Number(decUi.thresholdInput.value);
  decUi.meterFill.style.width=`${decClamp(sp,0,100)}%`;
  decUi.meterThreshold.style.left=`${thr}%`;
  decUi.strengthText.textContent=`${sp}%`;
  decUi.snrValue.textContent=decRunning ? `${dsp.snrDb.toFixed(1)} dB` : "-- dB";
}

function decUpdateLabels() {
  const f=decClamp(Number(decUi.freqInput.value)||700,300,1200);
  decUi.freqInput.value=String(f);
  decUi.freqValue.textContent=`${f} Hz`;
  decUi.thresholdValue.textContent=`${decUi.thresholdInput.value}%`;
  decUi.wpmValue.textContent=decUi.wpmInput.value;
  dsp.targetFreq=f; dsp.detectedFreq=f;
  dsp.dotMs=decLerp(dsp.dotMs||1200/Number(decUi.wpmInput.value),1200/Number(decUi.wpmInput.value),0.18);
}

function decClearAll() {
  decReset(true);
  fallCtx.fillStyle="#03070a";
  fallCtx.fillRect(0,0,decUi.waterfallCanvas.width,decUi.waterfallCanvas.height);
}

function decFindStrongest() {
  if (!decAnalyser || !decAudioCtx) return;
  if (!specData || specData.length!==decAnalyser.frequencyBinCount)
    specData=new Uint8Array(decAnalyser.frequencyBinCount);
  decAnalyser.getByteFrequencyData(specData);
  const nyq=decAudioCtx.sampleRate/2;
  let best=700, bestV=0;
  for (let f=300; f<=1200; f+=5) {
    const bin=Math.round((f/nyq)*specData.length);
    const v=specData[decClamp(bin,0,specData.length-1)];
    if (v>bestV) { bestV=v; best=f; }
  }
  decUi.freqInput.value=String(best);
  decUpdateLabels();
}

function decSetFile(file) {
  decSelectedFile=file;
  decUi.sourceMode.value="file";
  decSetStatus(file ? `${cwDecT.wavReady} ${file.name}` : cwDecT.fileHint, file?"info":"warn");
  decUpdateSourceUi();
}

function decUpdateSourceUi() {
  const isFile = decUi.sourceMode.value==="file";
  decUi.dropZone.classList.toggle("d-none", !isFile);
  decUi.startBtnIcon.className = isFile ? "fa-solid fa-play" : "fa-solid fa-microphone";
  if (isFile) {
    decSetStatus(decSelectedFile ? `${cwDecT.wavReady} ${decSelectedFile.name}` : cwDecT.fileHint, decSelectedFile?"info":"warn");
  } else {
    decSetStatus(cwDecT.micModeSelected, "muted");
  }
}

async function decStartSource() {
  if (decUi.sourceMode.value==="file") {
    if (!decSelectedFile) { decSetStatus(cwDecT.noFileSelected, "warn"); return; }
    await decStartFile(decSelectedFile); return;
  }
  await decStartMic();
}

// Events
decUi.startBtn.addEventListener("click", () => {
  decStartSource().catch(err => {
    const hint = err.name==="NotAllowedError" ? cwDecT.errPerm
               : err.name==="NotFoundError"   ? cwDecT.errNotFound
               : err.message;
    const src = decUi.sourceMode.value==="file" ? "WAV" : "Microphone";
    decSetStatus(`${src}: ${hint}`, "error");
  });
});
decUi.stopBtn.addEventListener("click", () => {
  decStopDecoder();
  const cached = decMicCache && decMicCache.getAudioTracks().some(t=>t.readyState==="live");
  decSetStatus(cached ? cwDecT.stoppedCached : cwDecT.stopped, "muted");
});
decUi.clearBtn.addEventListener("click", decClearAll);
decUi.findBtn.addEventListener("click", decFindStrongest);
decUi.sourceMode.addEventListener("change", decUpdateSourceUi);

decUi.freqInput.addEventListener("input", decUpdateLabels);
[decUi.thresholdInput, decUi.wpmInput].forEach(el => el.addEventListener("input", decUpdateLabels));

decUi.fileInput.addEventListener("change", e => { const f=e.target.files[0]; if(f) decSetFile(f); });

decUi.dropZone.addEventListener("dragover", e => { e.preventDefault(); decUi.dropZone.classList.add("dragover"); });
decUi.dropZone.addEventListener("dragleave", () => decUi.dropZone.classList.remove("dragover"));
decUi.dropZone.addEventListener("drop", e => {
  e.preventDefault();
  decUi.dropZone.classList.remove("dragover");
  const f=e.dataTransfer.files[0];
  if (f) decSetFile(f);
});

window.addEventListener("resize", () => {
  decResizeCanvas(decUi.spectrumCanvas);
  decResizeCanvas(decUi.waterfallCanvas);
});
window.addEventListener("beforeunload", decReleaseMic);

// Init
decUpdateLabels();
if (!window.isSecureContext) decSetStatus(cwDecT.errSecure, "error");
decClearAll();
decUpdateSourceUi();
decDrawLoop();
