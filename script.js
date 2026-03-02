feather.replace();

window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');
    setTimeout(() => {
        loader.classList.add('fade-out');
        document.querySelector('.hero-content').classList.add('active');
    }, 300);
});

const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', (e) => {
    if (window.matchMedia("(pointer: fine)").matches && cursorGlow) {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    }
});

const interactables = document.querySelectorAll('a, button, .project-card, input, textarea');
interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursorGlow) {
            cursorGlow.style.width = '400px';
            cursorGlow.style.height = '400px';
            cursorGlow.style.background = 'radial-gradient(circle, rgba(101, 132, 165, 0.12) 0%, rgba(15, 16, 18, 0) 70%)';
        }
    });
    el.addEventListener('mouseleave', () => {
        if (cursorGlow) {
            cursorGlow.style.width = '300px';
            cursorGlow.style.height = '300px';
            cursorGlow.style.background = 'radial-gradient(circle, rgba(101, 132, 165, 0.08) 0%, rgba(15, 16, 18, 0) 70%)';
        }
    });
});

const navbar = document.getElementById('navbar');
let lastScrollY = window.scrollY;
let ticking = false;

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(() => {
            if (lastScrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            ticking = false;
        });
        ticking = true;
    }
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            if (entry.target.id === 'skills' || entry.target.querySelector('.progress')) {
                const progressBars = entry.target.querySelectorAll('.progress');
                progressBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width;
                });
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal, .transform-reveal').forEach(el => observer.observe(el));

// Canvas Animation
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let shootingStars = [];

    function initCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        shootingStars = [];
        // Dramatically reduce particles on mobile to improve performance
        const numParticles = width > 768 ? 100 : 15;

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.5 + 0.2, // Smaller, star-like
                vx: (Math.random() - 0.5) * 0.1, // extremely slow side drift
                vy: (Math.random() * -0.2) - 0.05, // very slow drift upward
                alpha: Math.random() * 0.5 + 0.1,
                alphaSpeed: (Math.random() * 0.01) + 0.005 // twinkling effect
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Twinkling logic
            p.alpha += p.alphaSpeed;
            if (p.alpha <= 0.1 || p.alpha >= 0.8) {
                p.alphaSpeed = -p.alphaSpeed;
            }

            // Wrap around
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 205, 215, ${p.alpha})`; // Clean whitish/silver 
            ctx.fill();
        });

        // Shooting Stars Logic - disabled on mobile for performance
        if (width > 768 && Math.random() < 0.02 && shootingStars.length < 3) {
            const startX = Math.random() * width;
            shootingStars.push({
                x: startX,
                y: 0,
                vx: (Math.random() * 4 + 4) * (startX > width / 2 ? -1 : 1), // travel toward center
                vy: Math.random() * 3 + 4, // fast down
                length: Math.random() * 80 + 30,
                opacity: 1,
                decay: Math.random() * 0.015 + 0.01 // speed of fading out
            });
        }

        for (let i = shootingStars.length - 1; i >= 0; i--) {
            let star = shootingStars[i];
            star.x += star.vx;
            star.y += star.vy;
            star.opacity -= star.decay;

            if (star.opacity <= 0 || star.y > height || star.x < 0 || star.x > width) {
                shootingStars.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(star.x - star.vx * (star.length * 0.1), star.y - star.vy * (star.length * 0.1));
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.stroke();
        }

        // Loop purely without connecting lines for cleaner aesthetic
        requestAnimationFrame(drawParticles);
    }
    window.addEventListener('resize', initCanvas);
    initCanvas();
    drawParticles();
}

// Modal
const modal = document.getElementById('project-modal');
const closeBtn = document.querySelector('.close-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalTags = document.getElementById('modal-tags');
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
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
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

document.getElementById('year').textContent = new Date().getFullYear();
