
class Snake {
  constructor(x, y, w, h, c){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    
    //vx and vy => velocity x and velocity y
    this.vx = this.vy = 0;
    
    //direction snake
    this.dir = null;
    //die snake
    this.stoping=true
    this.die = false;
    
    //initial snake body
    this.snake = [
      {
        x: this.x,
        y: this.y
      },
    ];
    
  }
  
  setdir(dir){
    this.dir = `dir => ${dir}`;
    if (this.dir){
      this.stoping=false;
    }
  }
  
  //this set attribute zero in vy
  setvx(vx){
    this.vx = vx;
    this.vy = 0;
    this.setdir(vx);
  }
  
  //this set attribute zero in vx
  setvy(vy){
    this.vy = vy;
    this.vx = 0;
    this.setdir(vy);
  }
  
  addPart({x,y}){
    this.snake.push({x,y});
  }
  
  render(ctx){
    //render snake body
    this.snake.forEach(({x, y}) => {
      ctx.fillStyle = this.c;
      ctx.fillRect(x, y, this.w-1, this.h-1);
    });
  }
  
  move(){
    for (let i = this.snake.length-1; i > 0; i--){
      this.snake[i] = this.snake[i-1];
    }
    
    //move the snake
    this.x += (this.vx*this.w);
    this.y += (this.vy*this.h);
    //update first position of the snake
    this.snake[0] = {x: this.x, y: this.y}
  }
  
  checkExited({width, height}){
    if (this.x < 0){
      this.x = (width - this.w);
    } else if (this.x + this.w > width){
      this.x = 0;
    } else if (this.y < 0){
      this.y = (height - this.h);
    } else if (this.y + this.h > height){
      this.y = 0;
    }
  }
  
  checkCollideWithObj({x, y}, action){
    if (this.x === x && this.y === y){
      action();
    }
  }
  
  checkCollideItSelf(){
    const head = this.snake[0];
    this.die = this.snake.find((part, i) => {
      if (i <= 2) return false
      const headString = JSON.stringify(head);
      const partString = JSON.stringify(part);
      return (partString === headString);
    });
  }
  
  checkDie(action){
    if (this.die) action();
  }
  
  update(){
    if (this.die || this.stoping) return;
    this.move();
    this.checkCollideItSelf();
  }
}

export default Snake;