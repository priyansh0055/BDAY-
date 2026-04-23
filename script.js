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
let countdownInterval;

function updateCountdown() {
    const now = new Date();
    let birthday = new Date(now.getFullYear(), 3, 24); // April 24th

    // Check if directly passed target and is the same day
    const isBirthday = now.getMonth() === 3 && now.getDate() === 24;

    let diff = birthday - now;
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    let minutes = Math.floor((diff / 1000 / 60) % 60);
    let seconds = Math.floor((diff / 1000) % 60);

    const countdownContainer = document.getElementById('countdown');
    const bdayMessage = document.getElementById('birthday-message');
    const countdownTitle = document.getElementById('countdown-title');

    if (isBirthday || (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0)) {
        clearInterval(countdownInterval);

        if (countdownContainer) countdownContainer.style.display = 'none';
        if (countdownTitle) countdownTitle.style.display = 'none';
        if (bdayMessage) {
            bdayMessage.classList.remove('hidden');
            bdayMessage.querySelector('.celebration-text').innerText = "🎂 It's Your Birthday! 🎂";
        }

        onBirthdayReached();
        return;
    } else {
        if (now > birthday) {
            birthday = new Date(now.getFullYear() + 1, 3, 24); // Move to next year
            diff = birthday - now;
            days = Math.floor(diff / (1000 * 60 * 60 * 24));
            hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            minutes = Math.floor((diff / 1000 / 60) % 60);
            seconds = Math.floor((diff / 1000) % 60);
        }
    }

    document.getElementById('days').innerText = String(days).padStart(2, '0');
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
}

function onBirthdayReached() {
    // Prevent multiple executions
    if (window.celebrationStarted) return;
    window.celebrationStarted = true;

    // 3. Auto-launch confetti cannon for 5 seconds
    const confettiInterval = setInterval(() => {
        shootConfetti(window.innerWidth / 2, window.innerHeight / 2, 40);
    }, 200);
    setTimeout(() => clearInterval(confettiInterval), 5000);

    // 4. Show birthday popup modal
    setTimeout(() => {
        const celModal = document.getElementById('celebration-modal');
        if (celModal) celModal.classList.remove('hidden');
    }, 1500);

    // 5. Play music (if not playing)
    if (bgMusic && bgMusic.paused) {
        bgMusic.play().then(() => {
            if (musicToggle) {
                musicToggle.textContent = '♫';
                musicToggle.classList.add('playing');
            }
            isMusicPlaying = true;
        }).catch(err => console.log('Autoplay blocked:', err));
    }

    // 6. Make all heart balloons speed up briefly (CSS class 'celebrate')
    const balloons = document.querySelectorAll('.balloon');
    balloons.forEach(b => b.classList.add('celebrate'));
    // Remove class after 3 seconds
    setTimeout(() => {
        const updatedBalloons = document.querySelectorAll('.balloon');
        updatedBalloons.forEach(b => b.classList.remove('celebrate'));
    }, 3000);

    // 7. Sparkle burst around the main heading for 3 seconds
    const heading = document.querySelector('.elegant-heading');
    if (heading) {
        const rect = heading.getBoundingClientRect();
        const sparklesC = document.getElementById('sparkles-container');
        for (let i = 0; i < 40; i++) {
            const span = document.createElement('span');
            span.className = 'sparkle';
            // Centered around heading x/y randomly
            span.style.left = (rect.left + rect.width / 2 + (Math.random() * 200 - 100)) + 'px';
            span.style.top = (rect.top + rect.height / 2 + (Math.random() * 100 - 50)) + 'px';
            span.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            span.style.animationDuration = '3s'; // Longer sparkle for heading
            sparklesC.appendChild(span);
            setTimeout(() => span.remove(), 3000);
        }
    }
}

countdownInterval = setInterval(updateCountdown, 1000);
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
let bgMusic = document.getElementById('bgMusic');
if (!bgMusic) {
    bgMusic = document.createElement('audio');
    bgMusic.id = 'bgMusic';
    bgMusic.src = 'WhatsApp Audio 2026-04-23 at 23.28.06.mpeg'; // Fixed filename
    bgMusic.loop = true;
    document.body.appendChild(bgMusic);
}

const musicBtn = document.getElementById('musicToggle');

musicBtn.addEventListener('click', function (e) {
    e.stopPropagation(); // Prevent trigger competition
    console.log('Music button clicked, paused:', bgMusic.paused);
    if (bgMusic.paused) {
        bgMusic.play().catch(e => console.log('Play error:', e));
        musicBtn.textContent = '♫';
        musicBtn.classList.add('playing');
    } else {
        bgMusic.pause();
        musicBtn.textContent = '♪';
        musicBtn.classList.remove('playing');
    }
});

document.body.addEventListener('click', function startMusic() {
    bgMusic.play().then(() => {
        musicBtn.textContent = '♫';
        musicBtn.classList.add('playing');
    }).catch(e => console.log('Autoplay error:', e));
    document.body.removeEventListener('click', startMusic);
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

const celCloseBtn = document.getElementById('close-celebration-btn');
if (celCloseBtn) {
    celCloseBtn.addEventListener('click', () => {
        document.getElementById('celebration-modal').classList.add('hidden');
    });
}


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
