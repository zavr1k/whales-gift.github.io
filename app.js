const modal = document.getElementById("certificateModal");
const openButtons = document.querySelectorAll("[data-open-modal]");
const closeButton = document.querySelector("[data-close-modal]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

const colors = ["#ffbf4d", "#fe5f8f", "#7afcff", "#9b5bff", "#4fffb0"];
const fireworks = [];
const particles = [];
let intervalId;
let animationFrameId;

function lockBodyScroll(lock) {
  document.body.classList.toggle("freeze", lock);
}

function openModal() {
  modal.classList.add("visible");
  modal.setAttribute("aria-hidden", "false");
  modal.tabIndex = -1;
  modal.focus({ preventScroll: true });
  lockBodyScroll(true);
}

function closeModal() {
  modal.classList.remove("visible");
  modal.setAttribute("aria-hidden", "true");
  lockBodyScroll(false);
}

openButtons.forEach((btn) => btn.addEventListener("click", openModal));
closeButton.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("visible")) {
    closeModal();
  }
});

class Firework {
  constructor() {
    this.startX = Math.random() * window.innerWidth;
    this.x = this.startX;
    this.y = window.innerHeight + Math.random() * 80;
    this.targetY = window.innerHeight * (0.15 + Math.random() * 0.4);
    this.speed = 6 + Math.random() * 2;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.trail = [];
  }

  update() {
    this.y -= this.speed;
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 8) {
      this.trail.shift();
    }
    if (this.y <= this.targetY) {
      this.explode();
      return true;
    }
    return false;
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.startX, window.innerHeight);
    for (let i = 0; i < this.trail.length; i += 1) {
      const point = this.trail[i];
      ctx.lineTo(point.x, point.y);
    }
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  explode() {
    const particleCount = 30 + Math.floor(Math.random() * 20);
    for (let i = 0; i < particleCount; i += 1) {
      particles.push(new Particle(this.x, this.y, this.color));
    }
  }
}

class Particle {
  constructor(x, y, color) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1;
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.gravity = 0.03;
    this.alpha = 1;
    this.decay = 0.01 + Math.random() * 0.01;
    this.color = color;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.alpha -= this.decay;
    return this.alpha <= 0;
  }

  draw() {
    ctx.globalAlpha = Math.max(this.alpha, 0);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}

function launchFirework() {
  fireworks.push(new Firework());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = fireworks.length - 1; i >= 0; i -= 1) {
    const remove = fireworks[i].update();
    fireworks[i].draw();
    if (remove) {
      fireworks.splice(i, 1);
    }
  }

  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const remove = particles[i].update();
    particles[i].draw();
    if (remove) {
      particles.splice(i, 1);
    }
  }

  animationFrameId = requestAnimationFrame(animate);
}

function startFireworks() {
  if (prefersReducedMotion.matches) {
    canvas.style.display = "none";
    return;
  }

  canvas.style.display = "block";
  resizeCanvas();
  launchFirework();
  animate();

  if (!intervalId) {
    intervalId = window.setInterval(() => {
      launchFirework();
      if (Math.random() > 0.7) {
        launchFirework();
      }
    }, 800);
  }
}

function stopFireworks() {
  clearInterval(intervalId);
  intervalId = null;
  cancelAnimationFrame(animationFrameId);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener("resize", resizeCanvas);
function handleMotionPreference(event) {
  if (event.matches) {
    stopFireworks();
    canvas.style.display = "none";
  } else {
    startFireworks();
  }
}

if (typeof prefersReducedMotion.addEventListener === "function") {
  prefersReducedMotion.addEventListener("change", handleMotionPreference);
} else if (typeof prefersReducedMotion.addListener === "function") {
  prefersReducedMotion.addListener(handleMotionPreference);
}

startFireworks();
