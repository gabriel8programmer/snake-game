import Snake from "./Snake.js";
import Fruit from "./Fruit.js";

class Game {
  constructor() {
    //constants game
    this.stage = document.querySelector("#stage");
    this.ts = 20; //tile size
    this.cols = 20;
    this.rows = 20;
    this.width;
    this.height;
    this.ctx;
    //snake and fruit
    this.snake = null;
    this.fruit = null;
    //running state
    this.running = false;
    //gameover state
    this.gameover = false;
    //score
    this.score = 0;
    //gameloop
    this.loop = null;
    //speed game
    this.speed = 120;
  }

  start() {
    //define width and height Game
    this.stage.width = this.cols * this.ts;
    this.stage.height = this.rows * this.ts;
    this.ctx = this.stage.getContext("2d");
    this.width = this.stage.width;
    this.height = this.stage.height;

    //create the instance of the fruit
    this.fruit = new Fruit({
      x: Math.floor(Math.random() * this.cols) * this.ts,
      y: Math.floor(Math.random() * this.rows) * this.ts,
      w: this.ts,
      h: this.ts,
      c: "#a00"
    });

    //create the instance of the snake
    this.snake = new Snake({
      x: this.cols / 2 * this.ts,
      y: (this.rows - 4) * this.ts,
      w: this.ts,
      h: this.ts,
      c: "#0a0"
    });

    //update the screen
    this.loop = setInterval(this.update.bind(this), this.speed);
  }

  drawText(text, size, font, color, x, y) {
    //draw text
    this.ctx.font = `${size}px "${font}"`;
    this.ctx.fillStyle = color;
    const textWidth = this.ctx.measureText(text).width;
    const textHeight = parseInt(this.ctx.font);
    this.ctx.fillText(text, x - textWidth / 2, y + textHeight / 2);
    return {
      w: textWidth,
      h: textHeight
    };
  }

  render() {
    //draw screen
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.width, this.height);

    //draw fruit
    this.fruit.render(this.ctx);
    this.snake.render(this.ctx);

    //draw score
    this.drawText(this.score, 28, "Arial", "#fff", this.width - 30, 30);
  }

  updateScore() {
    const x = Math.floor(Math.random() * this.cols) * this.ts;
    const y = Math.floor(Math.random() * this.rows) * this.ts;
    this.snake.addPart(this.fruit);
    this.fruit.change(x, y);
    this.score++;
    //increment velocity game
    this.speed--;
    clearInterval(this.loop);
    this.loop = setInterval(this.update.bind(this), this.speed);
  }

  changeAppearanceControl() {
    //manipulate DOM
    document.querySelectorAll(".arrow").forEach(btn => btn.classList.toggle("hide"));
    document.querySelector("#play-again").classList.toggle("hide");
  }

  //check gameover
  showGameover() {
    //draw gameover
    this.score = 0;
    this.speed = 120;
    const gameover = this.drawText("GAMEOVER", 40, "Press Start 2P", "#a00", this.width / 2, this.height / 2 - 20);
    this.drawText("Press Enter to play again!", 24, "Arial", "#ff0", this.width / 2, this.height / 2 + gameover.h - 20);
    clearInterval(this.loop);
    this.changeAppearanceControl();
    this.gameover = true
  }

  update() {
    //render game
    this.render();
    if (this.gameover) return
    //update the snake
    this.snake.update();
    this.snake.checkExited(this);
    this.snake.checkCollideWithObj(this.fruit, this.updateScore.bind(this));
    this.snake.checkDie(this.showGameover.bind(this));
  }
  
  control(key) {
    this.running = true;
    if (key === "ArrowRight" && this.snake.vx === 0) {
      this.snake.setvx(1);
    } else if (key === "ArrowLeft" && this.snake.vx === 0) {
      this.snake.setvx(-1);
    } else if (key === "ArrowDown" && this.snake.vy === 0) {
      this.snake.setvy(1);
    } else if (key === "ArrowUp" && this.snake.vy === 0) {
      this.snake.setvy(-1);
    }
    
    //gameover
    if (this.gameover && (key === "start" || key === "Enter")) {
      this.running = false;
      this.gameover = false;
      this.changeAppearanceControl();
      this.start();
    }
  }
}

export default Game;