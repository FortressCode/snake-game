document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('highScore');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const upBtn = document.getElementById('upBtn');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    const downBtn = document.getElementById('downBtn');

    // Game constants
    const GRID_SIZE = 20;
    const GRID_WIDTH = 25;
    const GRID_HEIGHT = 25;
    const INITIAL_SPEED = 150; // ms
    const SPEED_INCREMENT = 5; // ms
    const MIN_SPEED = 50; // ms
    
    // Set canvas dimensions
    canvas.width = GRID_WIDTH * GRID_SIZE;
    canvas.height = GRID_HEIGHT * GRID_SIZE;
    
    // Game variables
    let snake = [];
    let food = {};
    let direction = '';
    let nextDirection = '';
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let gameInterval;
    let currentSpeed = INITIAL_SPEED;
    let isPlaying = false;
    let gameOver = false;

    // Colors
    const colors = {
        background: '#0f0f1a',
        snake: {
            head: '#6ee7b7',
            body: '#10b981',
            border: '#047857'
        },
        food: '#f87171',
        foodGlow: 'rgba(248, 113, 113, 0.5)',
        grid: '#1e293b'
    };

    // Initialize the game
    function initGame() {
        // Reset variables
        snake = [{ x: Math.floor(GRID_WIDTH / 2), y: Math.floor(GRID_HEIGHT / 2) }];
        generateFood();
        direction = '';
        nextDirection = '';
        score = 0;
        currentSpeed = INITIAL_SPEED;
        gameOver = false;
        
        // Update UI
        scoreElement.textContent = score;
        highScoreElement.textContent = highScore;
        
        // Clear any existing interval
        if (gameInterval) {
            clearInterval(gameInterval);
        }
        
        // Draw initial state
        drawGame();
    }

    // Generate food at random position
    function generateFood() {
        let overlapping = true;
        
        while (overlapping) {
            food = {
                x: Math.floor(Math.random() * GRID_WIDTH),
                y: Math.floor(Math.random() * GRID_HEIGHT)
            };
            
            // Check if food is not on snake
            overlapping = snake.some(segment => 
                segment.x === food.x && segment.y === food.y
            );
        }
    }

    // Draw game elements
    function drawGame() {
        // Clear canvas
        ctx.fillStyle = colors.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid lines (optional)
        drawGrid();
        
        // Draw food with glowing effect
        drawFood();
        
        // Draw snake
        drawSnake();
        
        // Draw game over message if needed
        if (gameOver) {
            drawGameOver();
        }
    }

    // Draw grid lines
    function drawGrid() {
        ctx.strokeStyle = colors.grid;
        ctx.lineWidth = 0.5;
        
        // Vertical lines
        for (let x = 0; x <= canvas.width; x += GRID_SIZE) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= canvas.height; y += GRID_SIZE) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    // Draw food with glowing effect
    function drawFood() {
        // Draw glow
        ctx.fillStyle = colors.foodGlow;
        ctx.beginPath();
        ctx.arc(
            food.x * GRID_SIZE + GRID_SIZE / 2,
            food.y * GRID_SIZE + GRID_SIZE / 2,
            GRID_SIZE * 0.8,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Draw food
        ctx.fillStyle = colors.food;
        ctx.beginPath();
        ctx.arc(
            food.x * GRID_SIZE + GRID_SIZE / 2,
            food.y * GRID_SIZE + GRID_SIZE / 2,
            GRID_SIZE / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    // Draw snake with gradient colors
    function drawSnake() {
        snake.forEach((segment, index) => {
            // Different color for head
            if (index === 0) {
                ctx.fillStyle = colors.snake.head;
            } else {
                ctx.fillStyle = colors.snake.body;
            }
            
            // Draw segment
            ctx.fillRect(
                segment.x * GRID_SIZE,
                segment.y * GRID_SIZE,
                GRID_SIZE,
                GRID_SIZE
            );
            
            // Draw border
            ctx.strokeStyle = colors.snake.border;
            ctx.lineWidth = 2;
            ctx.strokeRect(
                segment.x * GRID_SIZE,
                segment.y * GRID_SIZE,
                GRID_SIZE,
                GRID_SIZE
            );
        });
    }

    // Draw game over message
    function drawGameOver() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 30);
        
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillText('Press Start to play again', canvas.width / 2, canvas.height / 2 + 50);
    }

    // Update game state
    function updateGame() {
        // Update direction
        if (nextDirection) {
            direction = nextDirection;
            nextDirection = '';
        }
        
        // If no direction is set yet, wait for user input
        if (!direction) return;
        
        // Get current head position
        const head = { ...snake[0] };
        
        // Update head position based on direction
        switch (direction) {
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;
        }
        
        // Check for game over conditions
        if (isCollision(head)) {
            endGame();
            return;
        }
        
        // Add new head
        snake.unshift(head);
        
        // Check if snake eats food
        if (head.x === food.x && head.y === food.y) {
            // Increase score
            score++;
            scoreElement.textContent = score;
            
            // Update high score if needed
            if (score > highScore) {
                highScore = score;
                highScoreElement.textContent = highScore;
                localStorage.setItem('snakeHighScore', highScore);
            }
            
            // Generate new food
            generateFood();
            
            // Increase speed
            if (currentSpeed > MIN_SPEED) {
                currentSpeed -= SPEED_INCREMENT;
                clearInterval(gameInterval);
                gameInterval = setInterval(gameLoop, currentSpeed);
            }
        } else {
            // Remove tail if not eating
            snake.pop();
        }
    }

    // Check for collisions
    function isCollision(position) {
        // Wall collision
        if (
            position.x < 0 ||
            position.y < 0 ||
            position.x >= GRID_WIDTH ||
            position.y >= GRID_HEIGHT
        ) {
            return true;
        }
        
        // Self collision (skip checking first segment which is the new head position)
        return snake.some((segment, index) => {
            if (index === 0) return false;
            return segment.x === position.x && segment.y === position.y;
        });
    }

    // Game loop
    function gameLoop() {
        updateGame();
        drawGame();
    }

    // Start the game
    function startGame() {
        if (isPlaying) return;
        
        // If game over, reinitialize
        if (gameOver) {
            initGame();
        }
        
        isPlaying = true;
        gameInterval = setInterval(gameLoop, currentSpeed);
        startBtn.textContent = 'Pause';
    }

    // Pause the game
    function pauseGame() {
        if (!isPlaying) return;
        
        clearInterval(gameInterval);
        isPlaying = false;
        startBtn.textContent = 'Resume';
    }

    // End the game
    function endGame() {
        clearInterval(gameInterval);
        isPlaying = false;
        gameOver = true;
        startBtn.textContent = 'Start Game';
        drawGameOver();
    }

    // Reset the game
    function resetGame() {
        pauseGame();
        initGame();
    }

    // Event listeners
    startBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseGame();
        } else {
            startGame();
        }
    });

    resetBtn.addEventListener('click', resetGame);

    // Keyboard controls
    document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
        
        // Prevent default behavior for arrow keys to avoid scrolling
        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
            event.preventDefault();
        }
        
        switch (key) {
            case 'arrowup':
            case 'w':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'arrowdown':
            case 's':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'arrowleft':
            case 'a':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'arrowright':
            case 'd':
                if (direction !== 'left') nextDirection = 'right';
                break;
            case ' ':
                if (isPlaying) {
                    pauseGame();
                } else {
                    startGame();
                }
                break;
        }
    });

    // Mobile controls
    upBtn.addEventListener('click', () => {
        if (direction !== 'down') nextDirection = 'up';
    });
    
    downBtn.addEventListener('click', () => {
        if (direction !== 'up') nextDirection = 'down';
    });
    
    leftBtn.addEventListener('click', () => {
        if (direction !== 'right') nextDirection = 'left';
    });
    
    rightBtn.addEventListener('click', () => {
        if (direction !== 'left') nextDirection = 'right';
    });

    // Initialize game
    initGame();
}); 