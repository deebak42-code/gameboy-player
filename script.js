const tracks = [
  { title: 'Street Vibes', file: 'audio/street-vibes.mp3', bpm: 140, duration: '03:12' },
  { title: 'Drill Session', file: 'audio/drill-session.mp3', bpm: 145, duration: '02:45' },
  { title: 'Night Cruise', file: 'audio/night-cruise.mp3', bpm: 120, duration: '03:30' },
  { title: 'Cloudy Waves', file: 'audio/cloudy-waves.mp3', bpm: 130, duration: '02:58' },
  { title: 'Trap Lord', file: 'audio/trap-lord.mp3', bpm: 150, duration: '03:05' }
];

const player = document.getElementById('player');
const playlistEl = document.getElementById('playlist');
const nowLine = document.getElementById('nowLine');
const miniHint = document.getElementById('miniHint');
const buttons = [...document.querySelectorAll('.hotspot')];

let currentIndex = 0;
let currentMode = 'list';
let missingFileMessageShown = false;

function renderPlaylist() {
  playlistEl.innerHTML = '';
  tracks.forEach((track, index) => {
    const row = document.createElement('div');
    row.className = 'track';
    if (index === currentIndex) row.classList.add('selected');
    if (index === currentIndex && !player.paused && player.currentSrc) row.classList.add('playing');

    row.innerHTML = `
      <div class="name">${index + 1}. ${track.title.toUpperCase()}</div>
      <div class="meta">${track.duration}</div>
      <div class="meta">${track.bpm} BPM</div>
    `;

    playlistEl.appendChild(row);
  });
}

function setStatus(text) {
  nowLine.textContent = text;
}

function loadTrack(index, autoplay = false) {
  currentIndex = (index + tracks.length) % tracks.length;
  const track = tracks[currentIndex];
  player.src = track.file;
  player.load();
  renderPlaylist();
  setStatus(`${track.title} chargé.`);
  if (autoplay) {
    playCurrent();
  }
}

async function playCurrent() {
  const track = tracks[currentIndex];
  try {
    await player.play();
    document.body.classList.add('playing');
    setStatus(`Lecture : ${track.title}`);
  } catch (error) {
    document.body.classList.remove('playing');
    if (!missingFileMessageShown) {
      setStatus('Ajoute tes MP3 dans le dossier audio/ puis garde les mêmes noms.');
      missingFileMessageShown = true;
    } else {
      setStatus(`Impossible de lire ${track.title}.`);
    }
  }
  renderPlaylist();
}

function pauseCurrent() {
  player.pause();
  document.body.classList.remove('playing');
  setStatus(`Pause : ${tracks[currentIndex].title}`);
  renderPlaylist();
}

function togglePlayback() {
  if (!player.src) {
    loadTrack(currentIndex, true);
    return;
  }
  if (player.paused) {
    playCurrent();
  } else {
    pauseCurrent();
  }
}

function nextTrack(autoplay = !player.paused) {
  loadTrack(currentIndex + 1, autoplay);
}

function previousTrack(autoplay = !player.paused) {
  loadTrack(currentIndex - 1, autoplay);
}

function moveSelection(direction) {
  loadTrack(currentIndex + direction, false);
}

function toggleMode() {
  const track = tracks[currentIndex];
  currentMode = currentMode === 'list' ? 'detail' : 'list';

  if (currentMode === 'detail') {
    miniHint.textContent = `TRACK ${currentIndex + 1} · ${track.title.toUpperCase()} · ${track.duration} · ${track.bpm} BPM`;
    setStatus('Mode détail activé.');
  } else {
    miniHint.textContent = 'A = Play / Pause · B = Next · Start = Info · Select = Mode';
    setStatus('Mode playlist activé.');
  }
}

function showInfo() {
  const track = tracks[currentIndex];
  const info = player.duration && Number.isFinite(player.duration)
    ? `${formatTime(player.currentTime)} / ${formatTime(player.duration)}`
    : `${track.duration} · ${track.bpm} BPM`;
  setStatus(`${track.title} · ${info}`);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function handleAction(action) {
  switch (action) {
    case 'up':
      moveSelection(-1);
      break;
    case 'down':
      moveSelection(1);
      break;
    case 'prev':
      previousTrack();
      break;
    case 'next':
      nextTrack();
      break;
    case 'toggle':
      togglePlayback();
      break;
    case 'mode':
      toggleMode();
      break;
    case 'info':
      showInfo();
      break;
  }
}

buttons.forEach((button) => {
  const action = button.dataset.action;

  const press = () => {
    button.classList.add('pressed');
    handleAction(action);
  };
  const release = () => button.classList.remove('pressed');

  button.addEventListener('pointerdown', press);
  button.addEventListener('pointerup', release);
  button.addEventListener('pointerleave', release);
  button.addEventListener('pointercancel', release);
  button.addEventListener('contextmenu', (event) => event.preventDefault());
});

window.addEventListener('keydown', (event) => {
  const map = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'prev',
    ArrowRight: 'next',
    Enter: 'toggle',
    ' ': 'toggle',
    a: 'toggle',
    b: 'next',
    s: 'info',
    x: 'mode'
  };

  const action = map[event.key];
  if (!action) return;
  event.preventDefault();
  handleAction(action);
});

player.addEventListener('play', () => {
  document.body.classList.add('playing');
  renderPlaylist();
});

player.addEventListener('pause', () => {
  document.body.classList.remove('playing');
  renderPlaylist();
});

player.addEventListener('ended', () => {
  nextTrack(true);
});

player.addEventListener('timeupdate', () => {
  if (!player.paused && currentMode === 'detail') {
    const total = Number.isFinite(player.duration) ? formatTime(player.duration) : tracks[currentIndex].duration;
    setStatus(`${tracks[currentIndex].title} · ${formatTime(player.currentTime)} / ${total}`);
  }
});

player.addEventListener('error', () => {
  document.body.classList.remove('playing');
  setStatus('Fichier audio introuvable. Vérifie le nom du MP3 dans audio/.');
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

loadTrack(0, false);
renderPlaylist();
setStatus('Choisis une track puis appuie sur A.');
