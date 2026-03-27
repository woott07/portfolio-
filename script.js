// ===== FEATHER ICONS =====
feather.replace();

// ===== PAGE LOADER =====
window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');
    setTimeout(() => {
        loader.classList.add('fade-out');
        document.querySelector('.hero-content').classList.add('active');
    }, 500);
});

// ===== DUAL CURSOR =====
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
const cursorGlow = document.getElementById('cursor-glow');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    }
    if (cursorGlow) {
        cursorGlow.style.left = `${mouseX}px`;
        cursorGlow.style.top = `${mouseY}px`;
    }
});

// Smooth cursor ring follow
function animateCursorRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    if (cursorRing) {
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
    }
    requestAnimationFrame(animateCursorRing);
}
animateCursorRing();

// Cursor hover effects
const interactables = document.querySelectorAll('a, button, .project-card, input, textarea, .tech-tag, .about-card');
interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursorRing) cursorRing.classList.add('hover');
        if (cursorDot) {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorDot.style.background = 'var(--neon-purple)';
        }
        if (cursorGlow) {
            cursorGlow.style.width = '500px';
            cursorGlow.style.height = '500px';
        }
    });
    el.addEventListener('mouseleave', () => {
        if (cursorRing) cursorRing.classList.remove('hover');
        if (cursorDot) {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorDot.style.background = 'var(--neon-cyan)';
        }
        if (cursorGlow) {
            cursorGlow.style.width = '400px';
            cursorGlow.style.height = '400px';
        }
    });
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ===== INTERSECTION OBSERVER (REVEAL) =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Animate skill progress bars
            const bars = entry.target.querySelectorAll('.progress');
            bars.forEach(bar => {
                bar.style.width = bar.getAttribute('data-width');
            });
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .transform-reveal').forEach(el => observer.observe(el));

// ===== CANVAS HERO — NEON PARTICLE NETWORK =====
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, particles = [], shootingStars = [];

    const COLORS = ['rgba(176,68,255,', 'rgba(0,212,255,', 'rgba(255,68,170,'];

    function initCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        shootingStars = [];
        const num = width > 768 ? 80 : 20;

        for (let i = 0; i < num; i++) {
            const colorBase = COLORS[Math.floor(Math.random() * COLORS.length)];
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.2 + 0.3,
                vx: (Math.random() - 0.5) * 0.18,
                vy: (Math.random() - 0.5) * 0.18,
                alpha: Math.random() * 0.6 + 0.1,
                alphaDir: Math.random() < 0.5 ? 1 : -1,
                alphaSpeed: Math.random() * 0.008 + 0.003,
                colorBase
            });
        }
    }

    function drawFrame() {
        ctx.clearRect(0, 0, width, height);

        // Draw faint connection lines between nearby particles
        if (width > 768) {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 130) {
                        const lineAlpha = (1 - dist / 130) * 0.08;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(176,68,255,${lineAlpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        // Draw & update particles
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha += p.alphaSpeed * p.alphaDir;
            if (p.alpha >= 0.7 || p.alpha <= 0.05) p.alphaDir *= -1;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // Glow effect
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
            ctx.fillStyle = `${p.colorBase}${p.alpha * 0.15})`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `${p.colorBase}${p.alpha})`;
            ctx.fill();
        });

        // Shooting stars
        if (width > 768 && Math.random() < 0.015 && shootingStars.length < 3) {
            const startX = Math.random() * width;
            const colorBase = COLORS[Math.floor(Math.random() * COLORS.length)];
            shootingStars.push({
                x: startX, y: 0,
                vx: (Math.random() * 5 + 3) * (startX > width / 2 ? -1 : 1),
                vy: Math.random() * 3 + 3,
                opacity: 1,
                decay: Math.random() * 0.018 + 0.01,
                length: Math.random() * 100 + 40,
                colorBase
            });
        }

        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const s = shootingStars[i];
            s.x += s.vx; s.y += s.vy;
            s.opacity -= s.decay;

            if (s.opacity <= 0 || s.y > height || s.x < 0 || s.x > width) {
                shootingStars.splice(i, 1);
                continue;
            }

            const grad = ctx.createLinearGradient(
                s.x, s.y,
                s.x - s.vx * (s.length * 0.1),
                s.y - s.vy * (s.length * 0.1)
            );
            grad.addColorStop(0, `${s.colorBase}${s.opacity})`);
            grad.addColorStop(1, `${s.colorBase}0)`);

            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s.x - s.vx * (s.length * 0.1), s.y - s.vy * (s.length * 0.1));
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = grad;
            ctx.stroke();
        }

        requestAnimationFrame(drawFrame);
    }

    window.addEventListener('resize', initCanvas, { passive: true });
    initCanvas();
    drawFrame();
}

// ===== TYPING EFFECT =====
const phrases = [
    'Automating the boring stuff...',
    'Building Discord bots that judge you.',
    'Turning APIs into solutions.',
    'Writing Python so you don\'t have to.',
    'Making computers do the heavy lifting.'
];

let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function typeLoop() {
    if (!typedEl) return;
    const current = phrases[phraseIdx];

    if (!deleting) {
        typedEl.textContent = current.slice(0, ++charIdx);
        if (charIdx === current.length) {
            deleting = true;
            setTimeout(typeLoop, 2200);
            return;
        }
    } else {
        typedEl.textContent = current.slice(0, --charIdx);
        if (charIdx === 0) {
            deleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
        }
    }

    setTimeout(typeLoop, deleting ? 40 : 70);
}

setTimeout(typeLoop, 1200);

// ===== PROJECT MODAL =====
const modal = document.getElementById('project-modal');
const closeBtn = document.querySelector('.close-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalTags = document.getElementById('modal-tags');
const modalLink = document.getElementById('modal-link');

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        modalTitle.textContent = card.getAttribute('data-title');
        modalDesc.textContent = card.getAttribute('data-desc');
        modalTags.innerHTML = '';
        card.getAttribute('data-tags').split(',').forEach(tag => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = tag.trim();
            modalTags.appendChild(span);
        });
        const link = card.getAttribute('data-link');
        if (link && modalLink) {
            modalLink.href = link;
            modalLink.style.display = 'inline-flex';
            modalLink.innerHTML = '<i data-feather="external-link"></i> Live Demo';
            feather.replace();
        } else if (modalLink) {
            modalLink.style.display = 'none';
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

if (modal) {
    modal.addEventListener('click', e => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Escape key closes modal
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== FOOTER YEAR =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
