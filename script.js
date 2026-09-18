document.getElementById('year').textContent = new Date().getFullYear();

/* ---- live clock (WIB, UTC+7) ---- */
const clockEl = document.getElementById('clock');
function updateClock(){
  const now = new Date(Date.now() + (7 * 60 - new Date().getTimezoneOffset()) * 60000);
  const hh = String(now.getUTCHours()).padStart(2, '0');
  const mm = String(now.getUTCMinutes()).padStart(2, '0');
  clockEl.textContent = `${hh}:${mm} WIB`;
}
updateClock();
setInterval(updateClock, 15000);

/* ---- theme switcher ---- */
const savedTheme = localStorage.getItem('almas-theme') || 'void';
document.body.dataset.theme = savedTheme;

document.querySelectorAll('.theme-switcher [data-theme]').forEach((button) => {
  button.classList.toggle('active', button.dataset.theme === savedTheme);
  button.addEventListener('click', () => {
    const theme = button.dataset.theme;
    document.body.dataset.theme = theme;
    localStorage.setItem('almas-theme', theme);
    document.querySelectorAll('.theme-switcher [data-theme]').forEach((item) => {
      item.classList.toggle('active', item === button);
    });
  });
});

/* ---- starfield canvas: twinkling stars + the occasional shooting star ---- */
const canvas = document.getElementById('sky');
const ctx = canvas.getContext('2d');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let stars = [];
let shootingStar = null;
let w, h;

function resize(){
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  const count = Math.floor((w * h) / 9000);
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.2 + 0.3,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.015 + 0.005,
  }));
}
window.addEventListener('resize', resize);
resize();

function maybeSpawnShootingStar(){
  if (!shootingStar && Math.random() < 0.003) {
    const startX = Math.random() * w * 0.6;
    shootingStar = { x: startX, y: -10, vx: 6, vy: 3, life: 1 };
  }
}

function draw(){
  ctx.clearRect(0, 0, w, h);
  for (const s of stars){
    s.phase += s.speed;
    const twinkle = reduceMotion ? 0.75 : 0.5 + Math.sin(s.phase) * 0.5;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(244,242,251,${0.25 + twinkle * 0.55})`;
    ctx.fill();
  }

  if (!reduceMotion){
    maybeSpawnShootingStar();
    if (shootingStar){
      const s = shootingStar;
      ctx.save();
      ctx.strokeStyle = `rgba(244,242,251,${s.life})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.vx * 8, s.y - s.vy * 8);
      ctx.stroke();
      ctx.restore();
      s.x += s.vx;
      s.y += s.vy;
      s.life -= 0.02;
      if (s.life <= 0 || s.x > w || s.y > h) shootingStar = null;
    }
  }

  requestAnimationFrame(draw);
}
draw();
