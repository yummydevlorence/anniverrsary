/* ============================================================
   EDIT ME 1: your password
   ============================================================ */
const PASSWORD = "200925";

/* ============================================================
   EDIT ME 2: your photos
   - "src" is the filename of a photo sitting in the same folder
     as index.html (e.g. "photo1.jpg")
   - "caption" is the little line of text under it
   ============================================================ */
const photos = [
  { src: "photo1.PNG", caption: "the day it all started" },
  { src: "photo2.PNG", caption: "one of my favorites" },
  { src: "photo3.PNG", caption: "us, being us" },
  { src: "photo4.PNG", caption: "that trip we loved" },
  { src: "photo5.PNG", caption: "cute" },
  { src: "photo6.PNG", caption: "date on museum" },
  { src: "photo22.PNG", caption: "graduation day on shs" },
  { src: "photo8.PNG", caption: "grabe kumiss yan sya" },
  { src: "photo9.PNG", caption: "sleeping joyjoy" },
  { src: "photo10.PNG", caption: "pasarap" }
];

/* ---------------- background: stars + hearts ---------------- */
const sky = document.getElementById('sky');
const STAR_COUNT = 55;
for (let i = 0; i < STAR_COUNT; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  const size = Math.random() * 2 + 1;
  s.style.width = size + 'px';
  s.style.height = size + 'px';
  s.style.left = Math.random() * 100 + '%';
  s.style.top = Math.random() * 100 + '%';
  s.style.animationDuration = (Math.random() * 3 + 2) + 's';
  s.style.animationDelay = (Math.random() * 4) + 's';
  sky.appendChild(s);
}
const HEART_COUNT = 12;
for (let i = 0; i < HEART_COUNT; i++) {
  const h = document.createElement('div');
  h.className = 'floating-heart';
  h.textContent = '♥';
  const size = Math.random() * 16 + 10;
  h.style.fontSize = size + 'px';
  h.style.left = Math.random() * 100 + '%';
  const riseDuration = Math.random() * 10 + 12;
  h.style.animationDuration = riseDuration + 's';
  h.style.animationDelay = '-' + (Math.random() * riseDuration) + 's';
  sky.appendChild(h);
}

/* ---------------- password gate ---------------- */
const lockScreen = document.getElementById('lockScreen');
const content = document.getElementById('content');
const passwordInput = document.getElementById('passwordInput');
const unlockBtn = document.getElementById('unlockBtn');
const errorMsg = document.getElementById('errorMsg');

function tryUnlock() {
  if (passwordInput.value.trim().toLowerCase() === PASSWORD.trim().toLowerCase()) {
    lockScreen.classList.add('unlocking');
    setTimeout(() => {
      lockScreen.classList.add('hidden');
      document.body.classList.add('unlocked');
      document.querySelectorAll('.floating-heart').forEach((heart) => {
        heart.style.animation = 'none';
        void heart.offsetWidth;
        heart.style.animation = '';
        heart.style.animationPlayState = 'running';
      });
      content.hidden = false;
      initScrollFade();
    }, 550);
  } else {
    passwordInput.classList.remove('shake');
    void passwordInput.offsetWidth;
    passwordInput.classList.add('shake');
    errorMsg.classList.add('show');
  }
}
unlockBtn.addEventListener('click', tryUnlock);
passwordInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') tryUnlock();
});

/* ---------------- photo album with slide effect ---------------- */
const track = document.getElementById('track');
const dotsWrap = document.getElementById('dots');
let index = 0;
let slideEls = [];

photos.forEach((photo, i) => {
  const slide = document.createElement('div');
  slide.className = 'slide' + (i === 0 ? ' active' : '');

  const img = document.createElement('img');
  img.src = photo.src;
  img.alt = photo.caption || ('photo ' + (i + 1));
  img.onerror = () => {
    img.style.display = 'none';
    const ph = document.createElement('div');
    ph.className = 'placeholder';
    ph.innerHTML = '<div style="font-size:34px;">🤍</div><div>add "' + photo.src + '" to this folder</div>';
    slide.prepend(ph);
  };
  slide.appendChild(img);

  const cap = document.createElement('div');
  cap.className = 'caption';
  cap.textContent = photo.caption || '';
  slide.appendChild(cap);

  track.appendChild(slide);
  slideEls.push(slide);

  const dot = document.createElement('div');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(dot);
});

function goTo(i) {
  index = Math.max(0, Math.min(photos.length - 1, i));
  track.style.transform = 'translateX(-' + (index * 100) + '%)';
  slideEls.forEach((s, si) => s.classList.toggle('active', si === index));
  [...dotsWrap.children].forEach((d, di) => d.classList.toggle('active', di === index));
}

document.getElementById('prevBtn').addEventListener('click', () => goTo(index - 1));
document.getElementById('nextBtn').addEventListener('click', () => goTo(index + 1));

// swipe / drag support
let startX = 0, currentX = 0, dragging = false;

function dragStart(x) { dragging = true; startX = x; currentX = x; }
function dragMove(x) { if (dragging) currentX = x; }
function dragEnd() {
  if (!dragging) return;
  dragging = false;
  const delta = currentX - startX;
  if (Math.abs(delta) > 50) {
    if (delta < 0) goTo(index + 1); else goTo(index - 1);
  }
}

track.addEventListener('touchstart', (e) => dragStart(e.touches[0].clientX));
track.addEventListener('touchmove', (e) => dragMove(e.touches[0].clientX));
track.addEventListener('touchend', dragEnd);

track.addEventListener('mousedown', (e) => dragStart(e.clientX));
window.addEventListener('mousemove', (e) => dragMove(e.clientX));
window.addEventListener('mouseup', dragEnd);

/* ---------------- scroll fade-in ---------------- */
function initScrollFade() {
  const sections = document.querySelectorAll('.fade-section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.15 });
  sections.forEach((sec) => observer.observe(sec));
}
