const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

const nightSkyGradient = c.createLinearGradient(0, 0, 0, canvas.height);
nightSkyGradient.addColorStop(0, '#001a33');
nightSkyGradient.addColorStop(1, '#0c3c64');

const moonGradient = c.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, 50);
moonGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
moonGradient.addColorStop(1, 'transparent');

let moonX = canvas.width / 2;
let moonY = canvas.height / 4; // Adjusted moon position
let moonRadius = 50; // Decreased moon size
let moonSpeed = 0.05;

class Star {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: 3
        };
        this.friction = 0.8;
        this.gravity = 1;
    }

    draw() {
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.shadowColor = '#E3EAEF';
        c.shadowBlur = 20;
        c.fill();
        c.closePath();
        c.restore();
    }

    update() {
        this.draw();

        if (this.y + this.radius + this.velocity.y > canvas.height) {
            this.velocity.y = -this.velocity.y * this.friction;
            this.shatter();
        } else {
            this.velocity.y += this.gravity;
        }

        if (this.x + this.radius + this.velocity.x > canvas.width || this.x - this.radius <= 0) {
            this.velocity.x = -this.velocity.x * this.friction;
            this.shatter();
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    shatter() {
        this.radius -= 3;
        for (let i = 0; i < 8; i++) {
            miniStars.push(new MiniStar(this.x, this.y, 2));
        }
    }
}

class MiniStar extends Star {
    constructor(x, y, radius, color) {
        super(x, y, radius, color);
        this.velocity = {
            x: (Math.random() - 0.5) * 10,
            y: (Math.random() - 0.5) * 30
        };
        this.friction = 0.8;
        this.gravity = 0.1;
        this.ttl = 100;
        this.opacity = 1;
    }

    draw() {
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = `rgba(227,234, 239, ${this.opacity})`;
        c.shadowColor = '#E3EAEF';
        c.shadowBlur = 20;
        c.fill();
        c.closePath();
        c.restore();
    }

    update() {
        this.draw();

        if (this.y + this.radius + this.velocity.y > canvas.height) {
            this.velocity.y = -this.velocity.y * this.friction;
        } else {
            this.velocity.y += this.gravity;
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.ttl -= 1;
        this.opacity -= 0.0001 * this.ttl;
    }
}

let stars = [];
let miniStars = [];
let backgroundStars = [];
let ticker = 0;
let randomSpawnRate = 75;
const groundHeight = 0.09 * canvas.height;
let inf = 1e9;

function init() {
    stars = [];
    miniStars = [];
    backgroundStars = [];

    for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 3;
        backgroundStars.push(new Star(x, y, radius, 'white'));
    }
}

function animate() {
    c.clearRect(0, 0, 0, canvas.height);
    c.fillStyle = nightSkyGradient;
    c.fillRect(0, 0, canvas.width, canvas.height);

    backgroundStars.forEach(backgroundStar => {
        backgroundStar.draw();
    });

    creatMountainRange(1, canvas.height * 0.7, '#384551');
    creatMountainRange(2, canvas.height * 0.6, '#2B3843');
    creatMountainRange(3, canvas.height * 0.4, '#26333E');

    c.fillStyle = '#182028';
    c.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

    stars.forEach((star, index) => {
        star.update();
        if (star.radius == 0) {
            stars.splice(index, 1);
        }
    });

    miniStars.forEach((miniStar, index) => {
        miniStar.update();
        if (miniStar.ttl == 0) {
            miniStars.splice(index, 1);
        }
    });

    ticker++;
    if (ticker >= inf) {
        ticker = 0;
    }
    if (ticker % randomSpawnRate == 0) {
        const radius = 9;
        const x = Math.max(radius, Math.random() * canvas.width - radius);
        stars.push(new Star(x, -100, 9, '#E3EAEF'));
        randomSpawnRate = Math.floor(Math.random() * (200 - 125 + 1) + 125);
    }

    drawMoon();

    requestAnimationFrame(animate);
}

function drawMoon() {
    c.save();
    c.beginPath();
    c.fillStyle = moonGradient;
    c.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    c.fill();
    c.closePath();
    c.restore();
}

function creatMountainRange(mountainAmount, height, color) {
    for (let i = 0; i < mountainAmount; i++) {
        const mountainWidth = canvas.width / mountainAmount;
        c.beginPath();
        c.moveTo(i * mountainWidth, canvas.height);
        c.lineTo(i * mountainWidth + mountainWidth + 0.2 * canvas.height, canvas.height);
        c.lineTo(i * mountainWidth + mountainWidth / 2, canvas.height - height);
        c.lineTo(i * mountainWidth - 0.2 * canvas.height, canvas.height);
        c.fillStyle = color;
        c.fill();
        c.closePath();
    }
}

init();
animate();
