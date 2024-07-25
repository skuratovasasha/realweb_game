document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bird-game');
    const ctx = canvas.getContext('2d');

    const GRAVITY = 0.5;
    const BIRD_WIDTH = 40;
    const BIRD_HEIGHT = 40;
    const PIPE_WIDTH = 60;
    const PIPE_GAP = 200;
    const SYMBOL_SIZE = 20;
    const SYMBOLS = ['0', '1'];

    canvas.width = 800;
    canvas.height = 600;

    let birdX = 100;
    let birdY = canvas.height / 2;
    let birdVelocity = 0;
    const BIRD_FLAP = -10;
    let birdAcceleration = GRAVITY;
    let pipes = [];
    let frame = 0;
    let score = 0;

    const birdImage = new Image();
    birdImage.src = 'assets/Frame 1-2 (фон удален).png';

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            birdVelocity = BIRD_FLAP;
        }
    });

    birdImage.onload = () => {
        function drawBird() {
            ctx.drawImage(birdImage, birdX, birdY, BIRD_WIDTH, BIRD_HEIGHT);
        }

        function drawSymbols() {
            ctx.font = `${SYMBOL_SIZE}px monospace`;

            pipes.forEach(pipe => {
                for (let i = 0; i < pipe.top; i += SYMBOL_SIZE) {
                    const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                    drawGlowingSymbol(symbol, pipe.x, i + SYMBOL_SIZE, '#D7B8FF');
                }

                for (let i = canvas.height - pipe.bottom; i < canvas.height; i += SYMBOL_SIZE) {
                    const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                    drawGlowingSymbol(symbol, pipe.x, i, '#D7B8FF');
                }
            });
        }

        function drawGlowingSymbol(symbol, x, y, glowColor) {
            const blurSteps = 5;
            const maxAlpha = 0.6;

            for (let i = 0; i < blurSteps; i++) {
                ctx.fillStyle = `${glowColor}${Math.floor((maxAlpha - (i / blurSteps) * maxAlpha) * 255).toString(16)}`;
                ctx.fillText(symbol, x, y);
                ctx.globalAlpha = maxAlpha - (i / blurSteps) * maxAlpha;
            }
            ctx.globalAlpha = 1.0;
        }

        function updatePipes() {
            if (frame % 75 === 0) {
                const topPipeHeight = Math.floor(Math.random() * (Math.floor(canvas.height / SYMBOL_SIZE) - (PIPE_GAP / SYMBOL_SIZE)));
                const bottomPipeHeight = Math.floor(canvas.height / SYMBOL_SIZE) - topPipeHeight - (PIPE_GAP / SYMBOL_SIZE);
                pipes.push({
                    x: canvas.width,
                    top: topPipeHeight * SYMBOL_SIZE,
                    bottom: bottomPipeHeight * SYMBOL_SIZE
                });
            }
            pipes.forEach(pipe => {
                pipe.x -= 2;
            });
            pipes = pipes.filter(pipe => pipe.x + PIPE_WIDTH > 0);
        }

        function detectCollision() {
            for (let pipe of pipes) {
                if (
                    (birdX < pipe.x + PIPE_WIDTH && birdX + BIRD_WIDTH > pipe.x && birdY < pipe.top) ||
                    (birdX < pipe.x + PIPE_WIDTH && birdX + BIRD_WIDTH > pipe.x && birdY + BIRD_HEIGHT > canvas.height - pipe.bottom)
                ) {
                    return true;
                }
            }
            return birdY + BIRD_HEIGHT > canvas.height || birdY < 0;
        }

        function drawScore() {
            ctx.fillStyle = 'white';
            ctx.font = '24px Arial';
            ctx.fillText(`Score: ${score}`, 10, 30);
        }

        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#070037';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            birdVelocity += birdAcceleration;
            birdY += birdVelocity;

            drawBird();
            drawSymbols();
            drawScore();

            updatePipes();

            if (detectCollision()) {
                alert(`Game Over! Your score was ${score}`);
                document.location.reload();
            }

            frame++;
            if (frame % 75 === 0) {
                score++;
            }

            requestAnimationFrame(gameLoop);
        }

        gameLoop();
    };
});