// === 1. CONFETTI CANNON ===
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const colors = ['#F4A7B9', '#E91E8C', '#FFD6E0', '#C2185B', '#FF85A1'];

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = Math.random() * 6 + 2;
        this.dx = Math.random() * 10 - 5;
        this.dy = Math.random() * -10 - 5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.tilt = Math.random() * 10;
        this.tiltAngle = 0;
        this.tiltAngleInc = (Math.random() * 0.07) + 0.05;
    }
    update() {
        this.tiltAngle += this.tiltAngleInc;
        this.y += (Math.cos(this.tiltAngle) + 1 + this.r / 2) / 2;
        this.x += Math.sin(this.tiltAngle);
        this.dy += 0.1; // gravity
        this.y += this.dy;
        this.x += this.dx;
    }
    draw() {
        ctx.beginPath();
        ctx.lineWidth = this.r;
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.x + this.tilt + this.r, this.y);
        ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.r);
        ctx.stroke();
    }
}

function shootConfetti(x, y, count = 100) {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y));
    }
}

function animateConfetti() {
    requestAnimationFrame(animateConfetti);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].y > canvas.height) {
            particles.splice(i, 1);
            i--;
        }
    }
}
animateConfetti();
// Initial burst
window.addEventListener('load', () => shootConfetti(canvas.width / 2, canvas.height / 2, 200));
window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });


// === 2. COUNTDOWN TIMER ===
function updateCountdown() {
    const now = new Date();
    let birthday = new Date(now.getFullYear(), 3, 24); // April 24th

    // Check if today is the birthday (April 24th local time)
    const isBirthday = now.getMonth() === 3 && now.getDate() === 24;

    const countdownContainer = document.getElementById('countdown');
    const bdayMessage = document.getElementById('birthday-message');
    const countdownTitle = document.getElementById('countdown-title');

    if (isBirthday) {
        if (countdownContainer) countdownContainer.style.display = 'none';
        if (countdownTitle) countdownTitle.style.display = 'none';
        if (bdayMessage) bdayMessage.classList.remove('hidden');

        // Auto-fire confetti every 2 seconds if not already doing so
        if (!window.celebrationStarted) {
            window.celebrationStarted = true;
            setInterval(() => {
                shootConfetti(window.innerWidth / 2, window.innerHeight / 2, 80);
            }, 2000);
        }
        return;
    } else {
        if (countdownContainer) countdownContainer.style.display = 'flex';
        if (countdownTitle) countdownTitle.style.display = 'block';
        if (bdayMessage) bdayMessage.classList.add('hidden');

        if (now > birthday) {
            birthday = new Date(now.getFullYear() + 1, 3, 24); // Move to next year
        }
    }

    const diff = birthday - now;
    if (diff <= 0) return; // Fallback edge case

    document.getElementById('days').innerText = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
    document.getElementById('hours').innerText = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
    document.getElementById('minutes').innerText = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0');
    document.getElementById('seconds').innerText = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();


// === 3. TYPING ANIMATION ===
const typingText = "Get ready for the most magical day of the year!";
const pElement = document.getElementById('typing-text');
let typeIndex = 0;
function typeWriter() {
    if (typeIndex < typingText.length) {
        pElement.innerHTML += typingText.charAt(typeIndex);
        typeIndex++;
        setTimeout(typeWriter, 50);
    }
}
setTimeout(typeWriter, 1000);


// === 4. BACKGROUND AUDIO & POP SOUND ===
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('floating-music-toggle');
let isMusicPlaying = false;

function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
        musicToggle.innerText = '🎵';
    } else {
        bgMusic.play().catch(e => console.log("Audio play blocked", e));
        musicToggle.classList.add('playing');
        musicToggle.innerText = '♫';
    }
    isMusicPlaying = !isMusicPlaying;
}

musicToggle.addEventListener('click', toggleMusic);

document.body.addEventListener('click', function autoPlayOnce() {
    if (!isMusicPlaying) {
        toggleMusic();
    }
    document.body.removeEventListener('click', autoPlayOnce);
}, { once: true });

function playPop() {
    const AudioContextFn = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextFn) return;
    const ctx = new AudioContextFn();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
}


// === 5. MAKE A WISH INTERACTION ===
document.getElementById('wish-btn').addEventListener('click', (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Confetti pop
    shootConfetti(x, y, 50);

    // DOM sparkles
    const sparklesC = document.getElementById('sparkles-container');
    for (let i = 0; i < 30; i++) {
        const span = document.createElement('span');
        span.className = 'sparkle';
        span.style.left = x + (Math.random() * 200 - 100) + 'px';
        span.style.top = y + (Math.random() * 200 - 100) + 'px';
        span.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        sparklesC.appendChild(span);
        setTimeout(() => span.remove(), 800);
    }

    // Show Modal
    setTimeout(() => {
        document.getElementById('wish-modal').classList.remove('hidden');
    }, 400);
});

document.getElementById('close-modal-btn').addEventListener('click', () => {
    document.getElementById('wish-modal').classList.add('hidden');
});


// === 6. FLOATING BALLOONS ===
const balloonsC = document.getElementById('balloons-container');
const balloonColors = ['#F4A7B9', '#E91E8C', '#C2185B', '#AD1457', '#FF85A1'];

function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    balloon.style.setProperty('--heart-color', color);

    // Random position and float duration
    const left = Math.random() * 90 + 5; // 5% to 95%
    balloon.style.left = left + 'vw';
    const floatDur = 5 + Math.random() * 3; // 5s - 8s
    balloon.style.animation = `floatUpDown ${floatDur}s ease-in-out infinite`;

    // Slow drift upwards in JS
    let currentY = 0;
    const speed = (Math.random() * 0.5) + 0.3;

    function floatUp() {
        if (balloon.classList.contains('pop-anim')) return;
        currentY -= speed;
        balloon.style.bottom = (-150 - currentY) + 'px';
        if (-currentY > window.innerHeight + 200) {
            balloon.remove(); // Cleanup when it goes off screen
        } else {
            requestAnimationFrame(floatUp);
        }
    }
    floatUp();

    // Popping logic
    balloon.addEventListener('click', (e) => {
        playPop();
        shootConfetti(e.clientX, e.clientY, 30);
        balloon.classList.add('pop-anim');
        setTimeout(() => balloon.remove(), 200);
    });

    balloonsC.appendChild(balloon);
}

// Spawn balloons regularly
setInterval(createBalloon, 3000);
// Initial balloons
for (let i = 0; i < 5; i++) { setTimeout(createBalloon, i * 400); }
