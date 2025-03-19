# Modern Snake Game

A classic Snake game with a modern UI built using HTML5, CSS3, and JavaScript.

## Features

- Responsive design that works on both desktop and mobile devices
- Sleek and modern UI with gradient colors
- Touch controls for mobile users
- Keyboard controls (arrow keys or WASD) for desktop users
- Game speed increases as your score gets higher
- High score tracking using local storage
- Pause/Resume functionality

## How to Play

1. Open `index.html` in your web browser
2. Click the "Start Game" button
3. Use arrow keys or WASD (on desktop) or the on-screen buttons (on mobile) to control the snake
4. Eat the red food to grow your snake and increase your score
5. Avoid hitting the walls or your own tail
6. The game gets faster as your score increases

## Controls

- **Desktop:**
  - Arrow Keys or WASD: Change direction
  - Space: Pause/Resume
  - Start Game/Reset: On-screen buttons

- **Mobile:**
  - On-screen arrow buttons: Change direction
  - Start Game/Reset: On-screen buttons

## Installation

No installation required. Simply download the files and open `index.html` in a web browser.

```
git clone https://github.com/yourusername/snake-game.git
cd snake-game
```

Then open `index.html` in your browser.

## Customization

You can easily customize the game by modifying the following:

- **Grid Size:** Change `GRID_SIZE`, `GRID_WIDTH`, and `GRID_HEIGHT` constants in `game.js`
- **Speed:** Adjust `INITIAL_SPEED`, `SPEED_INCREMENT`, and `MIN_SPEED` in `game.js`
- **Colors:** Modify the `colors` object in `game.js`
- **Styling:** Edit the CSS in `style.css`

## License

MIT License 