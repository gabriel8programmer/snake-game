
class Game {
  constructor(){
    //constants game
    this.stage = document.querySelector("#stage");
    this.ts = 20; //tile size
    this.cols = 20;
    this.rows = 20;
    this.width;
    this.height;
    this.ctx;
    //snake and fruit
    this.snake = {};
    this.fruit = {};
    //running state
    this.running=false;
    //gameover state
    this.gameover=false;
    //score
    this.score = 0;
    //gameloop
    this.loop = null;
    //speed game
    this.speed = 120;
  }
  
  start(){
    //define width and height Game
    this.stage.width = this.cols * this.ts;
    this.stage.height = this.rows * this.ts;
    this.ctx = this.stage.getContext("2d");
    this.width = this.stage.width;
    this.height = this.stage.height;
    
    //define props of the fruit and snake
    //x -> position x, y -> position y
    //w -> width, h -> height, c -> color
    
    //fruit
    this.fruit.x = Math.floor(Math.random() * this.cols) * this.ts;
    this.fruit.y = Math.floor(Math.random() * this.rows) * this.ts;
    this.fruit.w = this.fruit.h = this.ts;
    this.fruit.c = "#a00";
    
    //snake 
    this.snake.x = this.cols / 2 * this.ts;
    this.snake.y = (this.rows - 4) * this.ts;
    this.snake.w = this.snake.h = this.ts;
    this.snake.c = "#0a0";
    //vx -> velocity x and vy -> velocity y
    this.snake.vx = this.snake.vy = 0;
    this.snake.body = [
      {
        x: this.snake.x,
        y: (this.rows - 3) * this.ts
      },
    ];
    
    //update the screen
    this.loop = setInterval(this.update.bind(this), this.speed);
  }
  
  drawRect(obj){
    const { x, y, c } = obj;
    this.ctx.fillStyle = c;
    this.ctx.fillRect(x, y, this.ts-1, this.ts-1);
  }
  
  drawText(text, size, font, color, x, y){
    //draw text
    this.ctx.font = `${size}px "${font}"`;
    this.ctx.fillStyle = color;
    const textWidth = this.ctx.measureText(text).width;
    const textHeight = parseInt(this.ctx.font);
    this.ctx.fillText(text, x - textWidth/2, y + textHeight/2);
    return {
      w: textWidth,
      h: textHeight
    }
  }
  
  render(){
    //draw screen
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    //draw fruit
    this.drawRect(this.fruit);
    //draw snake
    this.drawRect(this.snake);
    this.snake.body.forEach(({x, y}) => {
      this.drawRect({x, y, c: "#0a0"});
    });
    
    //draw score
    this.drawText(this.score, 28, "Arial", "#fff", this.width-30, 30);
  }
  
  control(key){
    this.running = true;
    if (key === "ArrowRight" && this.snake.vx === 0){
      this.snake.vx = 1;
      this.snake.vy = 0;
    } else if (key === "ArrowLeft" && this.snake.vx === 0){
      this.snake.vx = -1;
      this.snake.vy = 0;
    } else if (key === "ArrowDown"  && this.snake.vy === 0){
      this.snake.vx = 0;
      this.snake.vy = 1;
    } else if (key === "ArrowUp"  && this.snake.vy === 0){
      this.snake.vx = 0;
      this.snake.vy = -1;
    }
    //gameover
    if (this.gameover && (key === "start" || key === "Enter")){
      this.running = false;
      this.gameover = false;
      this.changeApearanceControl();
      this.start();
    }
  }
  
  changeFruit(){
    this.fruit.x = Math.floor(Math.random() * this.cols) * this.ts;
    this.fruit.y = Math.floor(Math.random() * this.rows) * this.ts;
  }
  
  checkSnakeExitedScreen(){
    const {x, y} = this.snake;
    //test position x
    if (x < 0){
      this.snake.x = (this.cols-1) * this.ts;
    } else if (x > this.width - this.ts){
      this.snake.x = 0;
    }
    //test position y
    else if (y < 0){
      this.snake.y = (this.rows-1) * this.ts;
    } else if (y > this.height - this.ts){
      this.snake.y = 0;
    }
  }
  
  checkSnakeAteFruit(){
    const {x, y} = this.snake;
    const {x: fx, y: fy} = this.fruit;
    if (x === fx && y === fy){
      //change x, y of the fruit
      this.changeFruit();
      this.snake.body.push({x, y});
      this.score++;
      //increment velocity game
      this.speed--;
      clearInterval(this.loop);
      this.loop = setInterval(this.update.bind(this), this.speed);
      console.log(this.speed, this.loop);
    }
  }
  
  updateSnakeBody(){
    const {x, y, body} = this.snake;
    for (let i = body.length-1; i > 0; i--){
      this.snake.body[i] = this.snake.body[i-1];
    }
    
    if (this.snake.body.length){
      this.snake.body[0] = {x, y};
    }
  }
  
  checkCollisionSnakeWithItSelf(){
    this.snake.body.forEach(({x, y}, index, body)=>{
      const { x: sx, y: sy} = this.snake;
      if (sx === x && sy === y && index < body.length-1 && index > 0){
        this.gameover = true;
      }
    });
  }
  
  //update snake
  updateSnake(){
    if (!this.running) return;
    this.updateSnakeBody();
    //move snake
    this.snake.x += (this.snake.vx) * this.ts;
    this.snake.y += (this.snake.vy) * this.ts;
    //check if snake ate the fruit
    this.checkSnakeExitedScreen();
    this.checkSnakeAteFruit();
    
    //check collision of the snake with itself
    this.checkCollisionSnakeWithItSelf();
  }
  
  changeApearanceControl(){
    //manipulate DOM
    document.querySelectorAll(".arrow").forEach(btn => btn.classList.toggle("hide"));
    document.querySelector("#play-again").classList.toggle("hide");
  }
  
  //check gameover
  checkGameover(){
    if (this.gameover){
      //draw gameover
      this.score = 0;
      const gameover = this.drawText("GAMEOVER", 40, "Press Start 2P", "#a00", this.width/2, this.height/2 - 20);
      this.drawText("Press Enter to play again!", 24, "Arial", "#ff0", this.width/2, this.height/2 + gameover.h - 20);
      clearInterval(this.loop);
      this.changeApearanceControl();
      return true;
    }
    return false;
  }
  
  update(){
    //gameover
    if (this.checkGameover()){
      return;
    }
    //render game
    this.render();
    //update snake
    this.updateSnake();
  }
}

//instance the game and it start
const game = new Game();
game.start();

document.addEventListener("keyup", e => { game.control(e.key) });
document.querySelector("#controls").addEventListener("click", e => { game.control(e.target.dataset.key) } );