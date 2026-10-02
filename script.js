// ===== КОНФИГ =====
const HEDGEHOGS = [
  "assets/hedgehog-1.png",
  "assets/hedgehog-2.png",
  "assets/hedgehog-3.png",
  "assets/hedgehog-4.png",
  "assets/hedgehog-5.png",
];
const SUPER_HEDGEHOG = "assets/hedgehog-super.png";
const AFTER_PHOTO = "assets/hedgehog-after.png";
const FINAL_PHOTO = "assets/final-photo.jpg";

const MEMORIES = [
  { video: "videos/memory-1.mp4", title: "💩 ТВОЯ КОШОЛКО №1", text: "КОШОЛКОООО СМАТРИ, ТУТ МЫ ГУЛЯЛИ ПО ЗАБРОШКЕ, ДУМАЮ ТЕБЕ ЭТОТ ДЕНЬ СИЛЬНО ЗАПОМНИТСЯ В ЖИЗНЕ, ТУТ НАМ БЫЛО ВЕСЕЛО И ЧТО ХОЧУ СКАЗАТЬ МНЕ БЫЛО ВЕСЕЛО, ХОТЬ ТЕБЕ И БЫЛО СТРАШНО НЕМНОГО, НО ЭТО БЫЛО КРУТО, ЭТОТ ДЕНЬ МНЕ ОЧЕНЬ ПОНРАВИЛСЯ И МНЕ БЫЛО ВЕСЕЛО ВТРОЕМ ПОГУЛЯТЬ ПО ЗАБРОШКЕ, С ДНЕМ РОЖДЕНИЯ ТЕБЯ КОШОЛКО!!!" },
  { video: "videos/memory-2.mp4", title: "💩 ТВОЯ КОШОЛКО №2", text: "СМОТРИИИ ЭТА ЗИМА, МЫ С АНГЕЛИНОЙ ТОГДА ГУЛЯЛИ, ЭТА БЫЛО ПРИКОЛЬНО ПРЯМ ВАЩЕ ТОПЧЕККК, МНЕ ТОГДА БЫЛО ВЕСЕЛО, И МНЕ НРААВИЛОСЬ ТОГДА ГУЛЯТЬ ЗИМОЙ, ЛЮБЛЮ ЗИМУ, С ДНЕМ РОЖДЕНИЯ ТЕБЯ УЗБАГОЙСЯ МОНСТРР" },
  { video: "videos/memory-3.mp4", title: "💩 ТВОЯ КОШОЛКО №3", text: "СМОТРИИ, А ТУТ МЫ КОРОЧЕ ШЛИ В ПОДВАЛ, А Я ТЕБЯ ПУГАЛ ВАЩЕ ЛАШАРА БЕЗДАРЬ, НУ НИЧО МНЕ ВСЕ ПОНРАВИЛОСЬ, БЫЛО ОЧЕНЬ ВЕСЕЛО, ЭТОТ ДЕНЬ Я ЗАПОМНЮ НАДОЛГО!!! С ДНЕМ РОЖДЕНИЯ ТЕБЯ БАКЛАЖАН" },
  { photo: "videos/memory-4.jpg", title: "💩 ТВОЯ КОШОЛКО №4", text: "НУ Я НИКОГДА НЕ ЗАБУДУ ТВОЙ ПРАЙМ С ЭЛАМ И ТВОИМ ГИПЕРФИКСОМ НА НЕГО, ОН С ТОБОЙ ДОЛЖЕН БЫТЬ ДО КНОЦА ЖИЗНИ ПОНЯЛА МЕНЯ ДУРА ТУПАЙЦА?!??! С ДР ТЕБЯ ПАРШИВКА МЕЛКАЯ ВЖЕ 13 РОЧКЫЫЫЫЫЫВ" },
  { photo: "videos/memory-5.jpg", title: "💩 ТВОЯ КОШОЛКО №5", text: "СМАТРИИ У МЕНЯ НЕ ОСТАЛОСЬ ПРАВДА ВИДЕО С ЭТИМ НО МНЕ БЫЛО ОЧЕНЬ ИНТЕРЕСНО ПОБЕГАТЬ ПО ЗАКРЫТОЙ НОЧНОЙ ШКОЛЕ)))) БЫЛО ДОВОЛЬНО ВЕСЕЛО, ХОТЬ ЧУТКА И СТРАНШОВАТО, НО КАК ПО МНЕ ЭТО БЫЛО ОЧЕНЬ ВЕСЕЛО, СПАСИБО ТЕБЕ ЗА ЭТИ ВРЕМЕНА, С ДНЕМ РОЖДЕНИЯ ТЕБЯ!!!" },
];
const FINAL_VIDEOS = [];

// ===== ЗВУК: всё синтезируется, файлов не надо =====
let audioCtx = null;
let soundOn = true;
const soundBtn = document.getElementById('sound-btn');
const bgMusic = document.getElementById('bg-music');
bgMusic.volume = 0.5;
soundBtn.addEventListener('click', () => {
  soundOn = !soundOn;
  soundBtn.textContent = soundOn ? '🔊' : '🔇';
  soundBtn.classList.toggle('off', !soundOn);
  if (soundOn) { musicStarted = false; startMusic(); }
  else { musicStarted = false; stopMusic(); }
});
// музыка стартует с первого касания (браузеры запрещают автоплей со звуком без жеста).
// Играем через WebAudio — так слышно даже в тихом режиме на айфоне; если не вышло — запасной <audio>.
let musicStarted = false;
let musicBuffer = null;
let musicNodes = null;
async function ensureMusic() {
  if (musicBuffer) return true;
  try {
    const ctx = ac();
    const res = await fetch('videos/music.mp3');
    const ab = await res.arrayBuffer();
    musicBuffer = await ctx.decodeAudioData(ab);
    return true;
  } catch (e) { return false; }
}
function stopMusic() {
  try { musicNodes && musicNodes.src.stop(); } catch (e) {}
  musicNodes = null;
  try { bgMusic.pause(); } catch (e) {}
}
function startMusic() {
  if (musicStarted || !soundOn) return;
  musicStarted = true;
  ensureMusic().then(ok => {
    if (!soundOn) { musicStarted = false; return; }
    if (ok) {
      try {
        const ctx = ac();
        stopMusic();
        const src = ctx.createBufferSource();
        src.buffer = musicBuffer; src.loop = true;
        const g = ctx.createGain(); g.gain.value = 0.5;
        src.connect(g); g.connect(ctx.destination); src.start();
        musicNodes = { src, g };
      } catch (e) {
        bgMusic.play().catch(() => { musicStarted = false; });
      }
    } else {
      bgMusic.play().catch(() => { musicStarted = false; });
    }
  });
}
document.addEventListener('pointerdown', startMusic, { passive: true });
function ac() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
// Пердеж: пила 90->35Гц + LFO-бульканье + шум
function playFart() {
  if (!soundOn) return;
  try {
    const ctx = ac();
    const t = ctx.currentTime;
    const dur = 0.5 + Math.random() * 0.35;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90 + Math.random() * 40, t);
    osc.frequency.exponentialRampToValueAtTime(32 + Math.random() * 10, t + dur);
    const lfo = ctx.createOscillator();
    lfo.type = 'square';
    lfo.frequency.setValueAtTime(18 + Math.random() * 12, t);
    lfo.frequency.exponentialRampToValueAtTime(9, t + dur);
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 28;
    lfo.connect(lfoGain); lfoGain.connect(osc.frequency);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 420; filter.Q.value = 6;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.55, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(filter); filter.connect(g); g.connect(ctx.destination);
    osc.start(t); lfo.start(t); osc.stop(t + dur + 0.05); lfo.stop(t + dur + 0.05);
  } catch (e) {}
}
function playPop() {
  if (!soundOn) return;
  try {
    const ctx = ac(); const t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(500, t);
    o.frequency.exponentialRampToValueAtTime(900, t + 0.09);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.35, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t + 0.14);
  } catch (e) {}
}
function playBoom() {
  if (!soundOn) return;
  try {
    const ctx = ac(); const t = ctx.currentTime;
    // низкий удар
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(28, t + 0.7);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.8, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
    o.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t + 0.85);
    // шум взрыва
    const len = ctx.sampleRate * 0.6;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900;
    const ng = ctx.createGain(); ng.gain.value = 0.5;
    src.connect(f); f.connect(ng); ng.connect(ctx.destination);
    src.start(t);
    playFart(); setTimeout(playFart, 180);
  } catch (e) {}
}

// ===== ЛОГИКА ИГРЫ =====
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const hedgeImg = document.getElementById('hedgehog');
const fallbackHedge = document.getElementById('fallback-hedge');
const wrap = document.getElementById('hedgehog-wrap');
const hint = document.getElementById('hint');
const counter = document.getElementById('counter');
const flyZone = document.getElementById('fly-zone');
const dock = document.getElementById('dock');
const holdBarWrap = document.getElementById('hold-bar-wrap');
const holdBar = document.getElementById('hold-bar');
const holdText = document.getElementById('hold-text');
const holdRing = document.getElementById('hold-ring');
const tapFlash = document.getElementById('tap-flash');
const progressDots = [...document.querySelectorAll('#progress span')];

let order = shuffle([0,1,2,3,4]);
let step = 0, spawned = 0;
let viewed = new Set();
let flying = [];
let phase = 'tap';
let holdStart = 0, holdRAF = null;

// предзагрузка ежей (они тяжёлые по 2-5МБ)
HEDGEHOGS.forEach(s => { const im = new Image(); im.src = s; });
new Image().src = SUPER_HEDGEHOG;

hedgeImg.onerror = () => { hedgeImg.style.display = 'none'; fallbackHedge.style.display = 'block'; };
hedgeImg.src = HEDGEHOGS[order[0]];

function updateCounter() {
  counter.textContent = `💩 ${viewed.size}/5`;
  progressDots.forEach((d, i) => d.classList.toggle('on', viewed.has(i)));
}

let downTime = 0;
wrap.addEventListener('pointerdown', (e) => {
  ac(); // разблокировать звук первым касанием
  if (phase === 'hold') { startHold(); return; }
  downTime = Date.now();
});
wrap.addEventListener('pointerup', () => {
  if (phase === 'hold') { cancelHold(); return; }
  if (phase !== 'tap') return;
  if (Date.now() - downTime > 400) return;
  tapHedgehog();
});
wrap.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ac(); phase === 'tap' ? tapHedgehog() : null; }
});
wrap.addEventListener('pointerleave', () => { if (phase === 'hold') cancelHold(); });

function puff() {
  tapFlash.textContent = ['💨','💩','💨💨'][Math.floor(Math.random()*3)];
  tapFlash.classList.remove('show');
  void tapFlash.offsetWidth;
  tapFlash.classList.add('show');
}

function tapHedgehog() {
  if (step >= 5) {
    hint.textContent = "ТАПАЙ КАШОЛКА";
    playFart();
    puff();
    navigator.vibrate && navigator.vibrate(40);
    return;
  }
  playFart();
  puff();
  navigator.vibrate && navigator.vibrate(40);
  spawnPoop(step);
  step++; spawned++;
  renderDock();
  if (step < 5) {
    hedgeImg.src = HEDGEHOGS[order[step]];
  } else {
    hint.textContent = "ТАПАЙ КАШОЛКА";
  }
}

function spawnPoop(idx) {
  const el = document.createElement('div');
  el.className = 'poop-fly';
  el.textContent = '💩';
  el.dataset.idx = idx;
  const r = wrap.getBoundingClientRect();
  let x = r.left + r.width / 2 - 26 + window.scrollX;
  // fly-zone fixed, поэтому координаты относительно viewport:
  x = r.left + r.width / 2 - 26;
  let y = r.top + 60;
  el.addEventListener('pointerdown', (e) => { e.stopPropagation(); });
  el.addEventListener('click', (e) => { e.stopPropagation(); openMemory(idx); });
  flyZone.appendChild(el);
  const angle = Math.random() * Math.PI * 2;
  const speed = 2 + Math.random() * 3.2;
  flying.push({ el, idx, x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, rot: Math.random() * 360 });
  el.style.transform = `translate3d(${x | 0}px,${y | 0}px,0)`;
  if (!window._loopStarted) { window._loopStarted = true; requestAnimationFrame(loop); }
}

// размеры экрана кэшируем, а не читаем каждый кадр
let viewW = window.innerWidth, viewH = window.innerHeight;
window.addEventListener('resize', () => { viewW = window.innerWidth; viewH = window.innerHeight; });

function loop() {
  if (flying.length === 0) { window._loopStarted = false; return; }
  const t = performance.now();
  const maxX = viewW - 60, maxY = viewH - 60;
  for (const p of flying) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) { p.x = 0; p.vx *= -1; } else if (p.x > maxX) { p.x = maxX; p.vx *= -1; }
    if (p.y < 0) { p.y = 0; p.vy *= -1; } else if (p.y > maxY) { p.y = maxY; p.vy *= -1; }
    // один transform вместо left/top — считает GPU, а не layout
    p.el.style.transform = `translate3d(${p.x | 0}px,${p.y | 0}px,0) rotate(${(t / 28 + p.rot) % 360}deg)`;
  }
  requestAnimationFrame(loop);
}

function renderDock() {
  dock.innerHTML = '';
  if (spawned === 0) { return; }
  for (let i = 0; i < spawned; i++) {
    const caught = viewed.has(i);
    const d = document.createElement('div');
    d.className = 'poop-dock' + (caught ? ' viewed' : ' locked');
    d.textContent = caught ? '💩' : '❔';
    d.title = MEMORIES[i].title;
    // кнопки открывают только ПОСЛЕ поимки, до этого — только летающие какашки
    if (caught) {
      d.addEventListener('click', () => openMemory(i, 'dock'));
    }
    dock.appendChild(d);
  }
}

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalVideo = document.getElementById('modal-video');
const modalPhoto = document.getElementById('modal-photo');
const modalText = document.getElementById('modal-text');
let currentIdx = null;

function openMemory(idx, source) {
  // с дока — только пойманные (пересмотр), с экрана — только летающие (поимка)
  if (source === 'dock' && !viewed.has(idx)) return;
  if (!source && viewed.has(idx)) return; // уже пойманную надо открывать только с кнопки
  if (!viewed.has(idx) && !flying.some(p => p.idx === idx)) return;
  playPop();
  currentIdx = idx;
  const m = MEMORIES[idx];
  modalTitle.textContent = m.title;
  modalText.textContent = m.text;
  if (m.photo) {
    modalVideo.classList.add('hidden');
    try { modalVideo.pause(); modalVideo.removeAttribute('src'); modalVideo.load(); } catch(e){}
    modalPhoto.src = m.photo;
    modalPhoto.classList.remove('hidden');
  } else {
    modalPhoto.classList.add('hidden');
    modalPhoto.removeAttribute('src');
    modalVideo.classList.remove('hidden');
    modalVideo.src = m.video;
  }
  modal.classList.remove('hidden');
}
function closeMemory() {
  playPop();
  modal.classList.add('hidden');
  modalVideo.pause();
  try { modalVideo.removeAttribute('src'); modalVideo.load(); } catch(e){}
  modalPhoto.classList.add('hidden');
  modalPhoto.removeAttribute('src');
  if (currentIdx !== null && !viewed.has(currentIdx)) {
    viewed.add(currentIdx);
    const fi = flying.findIndex(p => p.idx === currentIdx);
    if (fi >= 0) { flying[fi].el.remove(); flying.splice(fi, 1); }
    renderDock(); updateCounter();
    checkAllCollected();
  }
  currentIdx = null;
}
document.getElementById('modal-close').addEventListener('click', closeMemory);
document.getElementById('modal-ok').addEventListener('click', closeMemory);
modal.addEventListener('click', (e) => { if (e.target === modal) closeMemory(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeMemory(); });

function checkAllCollected() {
  if (viewed.size === 5 && phase === 'tap') {
    phase = 'hold';
    hint.textContent = "";
    holdText.classList.remove('hidden');
    holdBarWrap.classList.remove('hidden');
    navigator.vibrate && navigator.vibrate(200);
    document.getElementById('stage').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function startHold() {
  holdStart = Date.now();
  hedgeImg.classList.add('exploding');
  ac();
  // нарастающий пердеж на фоне зажима
  const DURATION = 5000;
  const stepHold = () => {
    const p = Math.min((Date.now() - holdStart) / DURATION, 1);
    holdBar.style.width = (p * 100) + '%';
    const scale = 1 + p * 0.9;
    hedgeImg.style.transform = `scale(${scale})`;
    holdRing.style.borderColor = `rgba(255,179,0,${0.25 + p * 0.75})`;
    holdRing.style.boxShadow = `0 0 ${10 + p * 34}px rgba(255,123,172,${0.3 + p * 0.6})`;
    if (p > 0.55 && Math.random() < 0.06) playFart();
    if (p > 0.6 && hedgeImg.dataset.super !== '1') {
      hedgeImg.dataset.super = '1';
      const test = new Image();
      test.onload = () => { hedgeImg.src = SUPER_HEDGEHOG; };
      test.src = SUPER_HEDGEHOG;
    }
    if (p >= 1) { doBoom(); return; }
    holdRAF = requestAnimationFrame(stepHold);
  };
  holdRAF = requestAnimationFrame(stepHold);
}
function cancelHold() {
  if (phase !== 'hold') return;
  cancelAnimationFrame(holdRAF);
  hedgeImg.classList.remove('exploding');
  hedgeImg.style.transform = '';
  holdBar.style.width = '0%';
  holdRing.style.borderColor = 'transparent';
  holdRing.style.boxShadow = 'none';
  if (!hedgeImg.dataset.boomed) {
    hedgeImg.dataset.super = '';
    hedgeImg.src = HEDGEHOGS[order[4]];
  }
}

function doBoom() {
  cancelAnimationFrame(holdRAF);
  phase = 'boom';
  hedgeImg.dataset.boomed = '1';
  playBoom();
  const flash = document.createElement('div');
  flash.className = 'boom-flash';
  flash.textContent = '💥';
  document.body.appendChild(flash);
  navigator.vibrate && navigator.vibrate([100, 50, 250]);
  setTimeout(() => {
    flash.remove();
    wrap.style.display = 'none';
    document.querySelector('.neon-ring').style.display = 'none';
    holdText.classList.add('hidden');
    holdBarWrap.classList.add('hidden');
    const after = document.getElementById('after-boom');
    after.classList.remove('hidden');
    const afterImg = document.getElementById('after-photo');
    afterImg.onerror = () => { afterImg.style.display = 'none'; };
    hint.innerHTML = "ЖМИ НА ЭТО 👇";
    after.scrollIntoView({ behavior: 'smooth' });
  }, 750);
}

document.getElementById('after-photo').addEventListener('click', () => {
  playPop();
  phase = 'final';
  document.getElementById('after-boom').classList.add('hidden');
  const fin = document.getElementById('final');
  fin.classList.remove('hidden');
  hint.textContent = "";
  const fp = document.getElementById('final-photo');
  fp.onerror = () => { fp.style.display = 'none'; };
  const fvBox = document.getElementById('final-videos');
  fvBox.innerHTML = '';
  FINAL_VIDEOS.forEach(v => {
    const vid = document.createElement('video');
    vid.src = v.file; vid.controls = true; vid.playsInline = true;
    fvBox.appendChild(vid);
  });
  fin.scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('replay').addEventListener('click', () => location.reload());

updateCounter();
renderDock();
